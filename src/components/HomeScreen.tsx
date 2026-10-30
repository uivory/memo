"use client";

import { useState } from "react";
import { ButtonPrimary } from "./ButtonPrimary";
import { CardHeader } from "./CardHeader";
import { Chip } from "./Chip";
import { MemoActionSheet } from "./MemoActionSheet";
import { MemoItem } from "./MemoItem";
import { BlurFade } from "./ui/blur-fade";
import { todayLabel, useAllMemos } from "@/lib/memoStore";
import { categories, type Category, type Memo } from "@/lib/memos";

type Filter = "전체" | Category;

// 홈의 "최근 메모" 카드에는 이만큼만 보이고, 나머지는 전체 보기에서 본다
const RECENT_LIMIT = 5;

// Figma Mobile/Home
export function HomeScreen() {
  const [filter, setFilter] = useState<Filter>("전체");
  const [target, setTarget] = useState<Memo | null>(null);
  const memos = useAllMemos();

  // 브라우저 저장소를 읽기 전에는 비워 둔다
  if (!memos) return <div className="min-h-dvh" />;

  const visible = memos.filter((m) => filter === "전체" || m.category === filter);
  const pinned = visible.filter((m) => m.pinned);
  const recent = visible.filter((m) => !m.pinned).slice(0, RECENT_LIMIT);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-(--space-16) pt-(--space-64)">
      <main className="flex flex-1 flex-col gap-(--space-16)">
        <BlurFade>
          <header className="flex flex-col gap-(--space-8) px-(--space-8)">
            <p className="text-caption-md text-text-muted">{todayLabel()}</p>
            <h1 className="text-heading-xl text-text-primary">
              오늘까지 메모를
              <br />
              <span className="text-primary">{memos.length}개</span> 남겼어요
            </h1>
          </header>
        </BlurFade>

        <BlurFade delay={0.05}>
          <div className="flex gap-(--space-8) overflow-x-auto px-(--space-4)">
            {(["전체", ...categories] as Filter[]).map((c) => (
              <Chip key={c} label={c} selected={filter === c} onClick={() => setFilter(c)} />
            ))}
          </div>
        </BlurFade>

        {/* 분류를 바꾸면 key가 달라져 목록이 다시 떠오른다 */}
        {pinned.length > 0 && (
          <BlurFade key={`pinned-${filter}`} delay={0.1}>
            <section className="bg-surface-card overflow-clip rounded-xl py-(--space-8)">
              <CardHeader title="고정한 메모" pin />
              {pinned.map((m, i) => (
                <BlurFade key={m.id} delay={0.15 + Math.min(i, 8) * 0.04} offset={4}>
                  <MemoItem {...m} onLongPress={() => setTarget(m)} />
                </BlurFade>
              ))}
            </section>
          </BlurFade>
        )}

        {recent.length > 0 && (
          <BlurFade key={`recent-${filter}`} delay={0.15}>
            <section className="bg-surface-card overflow-clip rounded-xl py-(--space-8)">
              <CardHeader title="최근 메모" actionHref="/memos" />
              {recent.map((m, i) => (
                <BlurFade key={m.id} delay={0.2 + Math.min(i, 8) * 0.04} offset={4}>
                  <MemoItem {...m} onLongPress={() => setTarget(m)} />
                </BlurFade>
              ))}
            </section>
          </BlurFade>
        )}

        {visible.length === 0 && (
          <p className="text-body-md text-text-muted px-(--space-8)">
            {memos.length === 0 ? "아직 메모가 없어요. 첫 메모를 써 보세요." : "이 분류의 메모가 없어요."}
          </p>
        )}
      </main>

      <div className="bg-surface-page sticky bottom-0 pt-(--space-16) pb-(--space-34)">
        <ButtonPrimary label="새 메모 쓰기" icon href="/write" />
      </div>

      {target && <MemoActionSheet memo={target} onClose={() => setTarget(null)} />}
    </div>
  );
}
