"use client";

import Link from "next/link";
import { IconNote } from "./icons";
import { labelColorClass, type MemoColor } from "@/lib/labelColor";
import { useLongPress } from "@/lib/useLongPress";

type MemoItemProps = {
  id: string;
  title: string;
  preview: string;
  date: string;
  color: MemoColor;
  // 길게 누르면(오른쪽 클릭 포함) 옵션을 열기 위해 불린다
  onLongPress?: () => void;
};

// Figma Memo/Item. 미리보기는 1줄까지 보이고 넘치면 말줄임. 누르면 메모 상세로 이동한다.
export function MemoItem({ id, title, preview, date, color, onLongPress }: MemoItemProps) {
  const longPress = useLongPress(() => onLongPress?.());

  return (
    <Link
      href={`/memo/${id}`}
      draggable={false}
      {...(onLongPress ? longPress : {})}
      className="flex h-18 items-center gap-(--space-16) px-(--space-20) py-(--space-12) select-none [-webkit-touch-callout:none]"
    >
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${labelColorClass[color]}`}
      >
        <IconNote className="size-[22px]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-(--space-4)">
        <p className="text-title-md text-text-primary">{title}</p>
        <p className="text-body-sm text-text-secondary truncate">{preview}</p>
      </div>
      <p className="text-caption-sm text-text-muted shrink-0">{date}</p>
    </Link>
  );
}
