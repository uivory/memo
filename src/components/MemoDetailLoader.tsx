"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { DetailScreen } from "./DetailScreen";
import { WriteScreen } from "./WriteScreen";
import { useMemoById } from "@/lib/memoStore";
import type { Memo } from "@/lib/memos";

function MemoNotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-(--space-16) px-(--space-16)">
      <p className="text-title-md text-text-primary">메모를 찾을 수 없어요</p>
      <Link href="/" className="text-label-md text-primary">
        홈으로 가기
      </Link>
    </div>
  );
}

// Supabase에서 메모를 불러온 뒤에 화면을 보여 준다.
function WithMemo({ id, children }: { id: string; children: (memo: Memo) => ReactNode }) {
  const lookup = useMemoById(id);
  if (lookup.status === "loading") return <div className="min-h-dvh" />;
  if (lookup.status === "missing") return <MemoNotFound />;
  return <>{children(lookup.memo)}</>;
}

export function MemoDetailLoader({ id }: { id: string }) {
  return <WithMemo id={id}>{(memo) => <DetailScreen memo={memo} />}</WithMemo>;
}

export function MemoEditLoader({ id }: { id: string }) {
  return <WithMemo id={id}>{(memo) => <WriteScreen editing={memo} />}</WithMemo>;
}
