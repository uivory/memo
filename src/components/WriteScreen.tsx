"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonPrimary } from "./ButtonPrimary";
import { Chip } from "./Chip";
import { EditorToolbar, type Format } from "./EditorToolbar";
import { IconButton } from "./IconButton";
import { IconChevronLeft } from "./icons";
import { LabelDot } from "./LabelDot";
import { BlurFade } from "./ui/blur-fade";
import { blocksToHtml, readBlocks } from "@/lib/editorBlocks";
import { applyBlock, type BlockKind } from "@/lib/editorCommands";
import { memoColors, type MemoColor } from "@/lib/labelColor";
import { clearDraft, loadDraft, saveDraft, saveMemo, updateMemo } from "@/lib/memoStore";
import { categories, categoryColor, type Category, type Memo } from "@/lib/memos";

const initialFormat: Format = { bold: false, block: "p" };

// Figma 완성 예시/Write. editing을 주면 그 메모를 고치는 화면이 된다(임시 저장 없이, 저장하면 상세로 돌아간다).
export function WriteScreen({ editing }: { editing?: Memo }) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<Category>(editing?.category ?? "업무");
  const [color, setColor] = useState<MemoColor>(editing?.color ?? "blue");
  const [empty, setEmpty] = useState(!editing);
  const [format, setFormat] = useState<Format>(initialFormat);
  const [version, setVersion] = useState(0); // 내용이 바뀔 때마다 올라간다
  const [draftSaved, setDraftSaved] = useState(false);
  const [message, setMessage] = useState("");

  const touched = useRef(false); // 사용자가 한 번이라도 고쳤는지
  const saving = useRef(false); // 저장 요청이 오가는 동안 한 번 더 눌러도 두 번 저장하지 않는다
  const finished = useRef(false); // 저장을 마쳐서 임시 저장을 멈춰야 하는지

  const touch = () => {
    touched.current = true;
    setVersion((v) => v + 1);
  };

  // 처음 열 때: 고치는 중이면 그 메모를, 새로 쓰는 중이면 임시 저장해 둔 글(있다면)을 채운다
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    document.execCommand("defaultParagraphSeparator", false, "p");

    if (editing) {
      editor.innerHTML = blocksToHtml(editing.body);
      setEmpty(readBlocks(editor).length === 0);
      return;
    }

    // 브라우저 저장소는 마운트 뒤에만 읽을 수 있다
    const draft = loadDraft();
    editor.innerHTML = blocksToHtml(draft?.body ?? []);
    if (draft) {
      setTitle(draft.title);
      setCategory(draft.category);
      setColor(draft.color);
      setEmpty(readBlocks(editor).length === 0);
    }
    // 고치는 메모는 처음 한 번만 채운다. 이후 저장소가 바뀌어도 쓰던 글을 덮어쓰지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 고친 뒤 잠깐 멈추면 임시 저장한다 ("자동 저장됨"). 새로 쓸 때만 한다.
  useEffect(() => {
    if (editing || !touched.current) return;
    const id = window.setTimeout(() => {
      const editor = editorRef.current;
      if (!editor || finished.current) return;
      saveDraft({ title, category, color, body: readBlocks(editor) });
      setDraftSaved(true);
    }, 400);
    return () => window.clearTimeout(id);
  }, [version, title, category, color, editing]);

  // 커서가 있는 글자의 서식을 서식 막대에 보여 준다
  useEffect(() => {
    const onSelectionChange = () => {
      const editor = editorRef.current;
      const selection = document.getSelection();
      if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) return;

      let block: Format["block"] = "p";
      for (let n: Node | null = selection.anchorNode; n && n !== editor; n = n.parentNode) {
        if (!(n instanceof HTMLElement)) continue;
        if (n.tagName === "H2") block = "h2";
        else if (n.tagName === "H3") block = "h3";
        else if (n.tagName === "LI") block = "ul";
        if (block !== "p") break;
      }
      // 제목은 글자가 원래 굵어서 굵게 상태로 치지 않는다
      const bold = block === "h2" || block === "h3" ? false : document.queryCommandState("bold");
      setFormat((prev) => (prev.bold === bold && prev.block === block ? prev : { bold, block }));
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setEmpty(readBlocks(editorRef.current!).length === 0);
    touch();
  };

  // 제목, 소제목, 목록: 커서가 있는 줄(또는 선택한 줄)에 적용하고, 이어서 쓰는 글도 같은 서식이 된다.
  // 같은 서식을 한 번 더 누르면 일반 글자로 돌아간다.
  const setBlock = (kind: BlockKind) => {
    const editor = editorRef.current;
    if (!editor) return;
    applyBlock(editor, kind);
    setEmpty(readBlocks(editor).length === 0);
    touch();
  };

  // 제목 글자는 이미 굵어서 굵게 버튼은 본문 글자에만 쓴다
  const toggleBold = () => {
    if (format.block === "h2" || format.block === "h3") return;
    exec("bold");
  };

  const onSave = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setMessage("제목을 입력해 주세요.");
      titleRef.current?.focus();
      return;
    }

    const body = readBlocks(editorRef.current!);
    if (saving.current) return;
    saving.current = true;
    const saved = editing
      ? await updateMemo(editing.id, { title: cleanTitle, category, color, body })
      : await saveMemo({ title: cleanTitle, category, color, body });
    saving.current = false;
    if (!saved) {
      setMessage("저장하지 못했어요. 인터넷 연결을 확인해 주세요.");
      return;
    }

    finished.current = true;
    if (editing) {
      router.replace(`/memo/${editing.id}`);
    } else {
      clearDraft();
      router.replace("/");
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-(--space-16) px-(--space-16) pt-(--space-48)">
      <BlurFade>
        <nav className="flex items-center justify-between">
          <IconButton label="뒤로가기" href={editing ? `/memo/${editing.id}` : "/"}>
            <IconChevronLeft className="size-6" />
          </IconButton>
          {draftSaved && <p className="text-caption-sm text-text-muted">자동 저장됨</p>}
        </nav>
      </BlurFade>

      <BlurFade className="flex flex-1 flex-col" delay={0.08} offset={12}>
      <main className="flex flex-1 flex-col gap-(--space-12)">
        {/* Figma Input/Field */}
        <label className="bg-surface-card flex flex-col gap-(--space-4) rounded-lg px-(--space-20) py-(--space-16) focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setMessage("");
              touch();
            }}
            placeholder="제목을 입력하세요"
            className="text-title-md text-text-primary placeholder:text-text-muted w-full bg-transparent outline-none"
          />
        </label>

        <div className="flex flex-col gap-(--space-12) px-(--space-8) py-(--space-4)">
          <div className="flex items-center gap-(--space-8)">
            <span className="text-caption-sm text-text-muted">분류</span>
            {categories.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={category === c}
                onClick={() => {
                  setCategory(c);
                  setColor(categoryColor[c]);
                  touch();
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-(--space-8)">
            <span className="text-caption-sm text-text-muted">색</span>
            {memoColors.map((c) => (
              <LabelDot
                key={c}
                color={c}
                selected={color === c}
                onClick={() => {
                  setColor(c);
                  touch();
                }}
              />
            ))}
          </div>
        </div>

        {/* Figma Editor */}
        <div className="bg-surface-card focus-within:border-primary overflow-clip rounded-lg border-2 border-transparent">
          <EditorToolbar
            format={format}
            onBold={toggleBold}
            onHeading={() => setBlock("h2")}
            onSubheading={() => setBlock("h3")}
            onList={() => setBlock("ul")}
          />
          <hr className="bg-border-default h-px border-0" />
          <div className="relative px-(--space-20) py-(--space-16)">
            {empty && (
              <p className="text-body-md text-text-muted pointer-events-none absolute top-(--space-16) left-(--space-20)">
                내용을 입력하세요
              </p>
            )}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="본문"
              className="memo-editor min-h-40"
              onInput={() => {
                setEmpty(readBlocks(editorRef.current!).length === 0);
                setMessage("");
                touch();
              }}
              // 다른 곳의 서식이 딸려 오지 않도록 글자만 붙여 넣는다
              onPaste={(e) => {
                e.preventDefault();
                document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
              }}
            />
          </div>
        </div>
      </main>
      </BlurFade>

      <div className="bg-surface-page sticky bottom-0 flex flex-col gap-(--space-8) pt-(--space-8) pb-(--space-34)">
        {message && (
          <p role="alert" className="text-caption-sm text-label-pink px-(--space-8)">
            {message}
          </p>
        )}
        <ButtonPrimary label="저장하기" onClick={onSave} />
      </div>
    </div>
  );
}
