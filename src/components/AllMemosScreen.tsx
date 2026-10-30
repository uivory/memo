"use client";

import { useState } from "react";
import { Chip } from "./Chip";
import { IconButton } from "./IconButton";
import { IconChevronLeft } from "./icons";
import { MemoActionSheet } from "./MemoActionSheet";
import { MemoItem } from "./MemoItem";
import { BlurFade } from "./ui/blur-fade";
import { useAllMemos } from "@/lib/memoStore";
import { categories, type Category, type Memo } from "@/lib/memos";

type Filter = "전체" | Category;

// 홈의 "전체 보기"로 오는 화면. Figma에는 없어서 홈·상세와 같은 부품(뒤로가기, 칩, 카드, 메모 줄)으로 만들었다.
export function AllMemosScreen() {
  const [filter, setFilter] = useState<Filter>("전체");
  const [target, setTarget] = useState<Memo | null>(null);
  const memos = useAllMemos();

  if (!memos) return <div className="min-h-dvh" />;

  // 고정한 메모를 먼저 보여 준다
  const visible = memos
    .filter((m) => filter === "전체" || m.category === filter)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-(--space-16) px-(--space-16) pt-(--space-48) pb-(--space-34)">
      <BlurFade>
        <nav className="flex items-center">
          <IconButton label="뒤로가기" href="/">
            <IconChevronLeft className="size-6" />
          </IconButton>
        </nav>
      </BlurFade>

      <BlurFade delay={0.05}>
        <header className="flex flex-col gap-(--space-8) px-(--space-8)">
          <h1 className="text-heading-lg text-text-primary">전체 메모</h1>
          <p className="text-caption-md text-text-muted">{memos.length}개</p>
        </header>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="flex gap-(--space-8) overflow-x-auto px-(--space-4)">
          {(["전체", ...categories] as Filter[]).map((c) => (
            <Chip key={c} label={c} selected={filter === c} onClick={() => setFilter(c)} />
          ))}
        </div>
      </BlurFade>

      <main>
        {visible.length > 0 ? (
          <BlurFade key={filter} delay={0.15}>
            <section className="bg-surface-card overflow-clip rounded-xl py-(--space-8)">
              {visible.map((m) => (
                <MemoItem key={m.id} {...m} onLongPress={() => setTarget(m)} />
              ))}
            </section>
          </BlurFade>
        ) : (
          <p className="text-body-md text-text-muted px-(--space-8)">
            {memos.length === 0 ? "아직 메모가 없어요." : "이 분류의 메모가 없어요."}
          </p>
        )}
      </main>

      {target && <MemoActionSheet memo={target} onClose={() => setTarget(null)} />}
    </div>
  );
}
