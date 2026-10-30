"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "./Badge";
import { ButtonPrimary } from "./ButtonPrimary";
import { IconButton } from "./IconButton";
import { IconChevronLeft, IconMore, IconPin, IconShare } from "./icons";
import { MemoActionSheet } from "./MemoActionSheet";
import { MemoBody } from "./MemoBody";
import { BlurFade } from "./ui/blur-fade";
import type { Memo } from "@/lib/memos";
import { useMemoActions } from "@/lib/useMemoActions";

// Figma Mobile/Detail
export function DetailScreen({ memo }: { memo: Memo }) {
  const router = useRouter();
  const actions = useMemoActions();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-(--space-16) px-(--space-16) pt-(--space-48)">
      <BlurFade>
        <nav className="flex items-center justify-between">
          <IconButton label="뒤로가기" href="/">
            <IconChevronLeft className="size-6" />
          </IconButton>
          <div className="flex">
            <IconButton
              label={memo.pinned ? "고정 해제" : "고정"}
              pressed={memo.pinned}
              color={memo.pinned ? "text-primary" : undefined}
              onClick={() => void actions.pin(memo)}
            >
              <IconPin className="size-6" />
            </IconButton>
            <IconButton label="공유" onClick={() => void actions.share(memo)}>
              <IconShare className="size-6" />
            </IconButton>
            <IconButton label="더보기" onClick={() => setMenuOpen(true)}>
              <IconMore className="size-6" />
            </IconButton>
          </div>
        </nav>
      </BlurFade>

      <BlurFade className="flex flex-1 flex-col" delay={0.08} offset={12}>
        <main className="bg-surface-card flex flex-1 flex-col gap-(--space-12) rounded-xl px-(--space-20) py-(--space-24)">
          <div className="flex items-center gap-(--space-8)">
            <Badge label={memo.category} color={memo.color} />
            <p className="text-caption-sm text-text-muted">{memo.createdAt}</p>
          </div>
          <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
          <hr className="bg-border-default h-px border-0" />
          <MemoBody blocks={memo.body} />
          <p className="text-caption-sm text-text-muted">{memo.footer}</p>
        </main>
      </BlurFade>

      <div className="bg-surface-page sticky bottom-0 pb-(--space-34)">
        <ButtonPrimary label="수정하기" href={`/memo/${memo.id}/edit`} />
      </div>

      {menuOpen && (
        <MemoActionSheet
          memo={memo}
          showShare={false}
          onClose={() => setMenuOpen(false)}
          onDeleted={() => router.replace("/")}
        />
      )}
    </div>
  );
}
