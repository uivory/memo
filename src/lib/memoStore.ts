import { useMemo, useSyncExternalStore } from "react";
import type { MemoColor } from "@/lib/labelColor";
import { type Block, type Category, type Memo } from "@/lib/memos";
import { supabase } from "@/lib/supabase";

// 메모는 Supabase의 public.memos 표에 저장한다. 임시 저장(초안)만 이 기기의 localStorage에 둔다.
const DRAFT_KEY = "memo.draft.v1";

export type StoredMemo = {
  id: string;
  title: string;
  category: Category;
  color: MemoColor;
  body: Block[];
  createdAtMs: number;
  updatedAtMs: number;
  pinned: boolean;
};

export type NewMemo = Pick<StoredMemo, "title" | "category" | "color" | "body">;

export type Draft = {
  title: string;
  category: Category;
  color: MemoColor;
  body: Block[];
};

type Row = {
  id: string;
  title: string;
  body: Block[];
  category: Category;
  color: MemoColor;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

function fromRow(r: Row): StoredMemo {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    color: r.color,
    body: r.body,
    pinned: r.pinned,
    createdAtMs: new Date(r.created_at).getTime(),
    updatedAtMs: new Date(r.updated_at).getTime(),
  };
}

// ---- Supabase 읽기·쓰기 ----

// 불러오기 전에는 null. useSyncExternalStore가 같은 값이면 같은 배열을 받도록 모듈에 하나만 둔다.
let memos: StoredMemo[] | null = null;
let loading = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function setMemos(next: StoredMemo[]) {
  memos = next;
  emit();
}

async function load() {
  if (loading) return;
  loading = true;
  const { data, error } = await supabase.from("memos").select("*");
  loading = false;
  if (error) {
    console.error("메모를 불러오지 못했어요", error.message);
    return; // 다음에 화면을 다시 볼 때 한 번 더 시도한다
  }
  setMemos((data as Row[]).map(fromRow));
}

// 다른 기기에서 바꾼 메모는 이 창으로 돌아올 때 다시 불러와 맞춘다
function refreshOnVisible() {
  if (document.visibilityState === "visible") void load();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (listeners.size === 1) document.addEventListener("visibilitychange", refreshOnVisible);
  void load();
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) document.removeEventListener("visibilitychange", refreshOnVisible);
  };
}

// 저장에 실패하면 false.
export async function saveMemo(memo: NewMemo): Promise<boolean> {
  const { data, error } = await supabase.from("memos").insert(memo).select().single();
  if (error) return false;
  setMemos([fromRow(data as Row), ...(memos ?? [])]);
  return true;
}

export async function updateMemo(
  id: string,
  patch: Partial<Pick<StoredMemo, "title" | "category" | "color" | "body" | "pinned">>,
  { touchUpdatedAt = true }: { touchUpdatedAt?: boolean } = {},
): Promise<boolean> {
  const { data, error } = await supabase
    .from("memos")
    .update({ ...patch, ...(touchUpdatedAt ? { updated_at: new Date().toISOString() } : {}) })
    .eq("id", id)
    .select()
    .single();
  if (error) return false;
  const row = fromRow(data as Row);
  setMemos((memos ?? []).map((m) => (m.id === id ? row : m)));
  return true;
}

// 고정은 내용을 고친 것이 아니라서 "수정한 시각"은 바꾸지 않는다
export async function togglePin(id: string): Promise<boolean> {
  const current = memos?.find((m) => m.id === id);
  if (!current) return false;
  return updateMemo(id, { pinned: !current.pinned }, { touchUpdatedAt: false });
}

export async function deleteMemo(id: string): Promise<boolean> {
  const { error } = await supabase.from("memos").delete().eq("id", id);
  if (error) return false;
  setMemos((memos ?? []).filter((m) => m.id !== id));
  return true;
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // 임시 저장은 실패해도 작성은 계속할 수 있다
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // 무시
  }
}

// null은 아직 Supabase에서 불러오기 전(서버 렌더링 중 포함)이라는 뜻이다.
export function useStoredMemos(): StoredMemo[] | null {
  return useSyncExternalStore(
    subscribe,
    () => memos,
    () => null,
  );
}

// ---- 화면에 보일 모양으로 바꾸기 ----

const pad = (n: number) => String(n).padStart(2, "0");

function timeLabel(d: Date) {
  const h = d.getHours();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${pad(d.getMinutes())}`;
}

function dayLabel(ms: number) {
  const d = new Date(ms);
  const now = new Date();
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diff = Math.round((today - day) / 86_400_000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function todayLabel() {
  const now = new Date();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${weekday}요일`;
}

export function blockTexts(block: Block): string[] {
  switch (block.type) {
    case "list":
      return block.items;
    case "paragraph":
      return [block.parts.map((p) => p.text).join("")];
    default:
      return [block.text];
  }
}

function toMemo(s: StoredMemo): Memo {
  const texts = s.body.flatMap(blockTexts);
  // 미리보기는 제목 줄보다 본문(문단·목록)의 첫 글을 우선한다
  const bodyTexts = s.body.filter((b) => b.type === "paragraph" || b.type === "list").flatMap(blockTexts);
  const created = new Date(s.createdAtMs);
  const editedMs = s.updatedAtMs;
  const edited = new Date(editedMs);
  const chars = texts.join("").replace(/\s/g, "").length;
  return {
    id: s.id,
    title: s.title,
    preview: [...bodyTexts, ...texts].find((t) => t.trim())?.trim() ?? "내용이 없어요",
    date: dayLabel(editedMs),
    color: s.color,
    category: s.category,
    pinned: !!s.pinned,
    createdAt: `${created.getMonth() + 1}월 ${created.getDate()}일 ${timeLabel(created)}`,
    footer: `${chars}자 · ${dayLabel(editedMs)} ${timeLabel(edited)} 수정`,
    body: s.body,
  };
}

// 최근에 만들거나 고친 순서의 전체 목록. 불러오기 전에는 null.
export function useAllMemos(): Memo[] | null {
  const stored = useStoredMemos();
  return useMemo(() => {
    if (!stored) return null;
    return [...stored]
      .sort((a, b) => b.updatedAtMs - a.updatedAtMs)
      .map(toMemo);
  }, [stored]);
}

export type MemoLookup =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "found"; memo: Memo };

export function useMemoById(id: string): MemoLookup {
  const stored = useStoredMemos();
  return useMemo<MemoLookup>(() => {
    if (!stored) return { status: "loading" };
    const mine = stored.find((m) => m.id === id);
    return mine ? { status: "found", memo: toMemo(mine) } : { status: "missing" };
  }, [stored, id]);
}
