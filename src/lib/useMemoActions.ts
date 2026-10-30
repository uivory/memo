"use client";

import { useToast } from "@/components/Toast";
import { deleteMemo, togglePin } from "@/lib/memoStore";
import type { Memo } from "@/lib/memos";
import { shareMemo } from "@/lib/shareMemo";

// 고정, 공유, 삭제를 하고 결과를 안내 문구로 알려 준다. 목록의 선택 창과 상세 화면이 함께 쓴다.
export function useMemoActions() {
  const toast = useToast();

  return {
    async pin(memo: Memo) {
      if (!(await togglePin(memo.id))) return toast("저장하지 못했어요");
      toast(memo.pinned ? "고정을 해제했어요" : "메모를 고정했어요");
    },

    async share(memo: Memo) {
      const result = await shareMemo(memo);
      if (result === "copied") toast("메모를 복사했어요");
      else if (result === "failed") toast("공유하지 못했어요");
    },

    async remove(memo: Memo) {
      const ok = await deleteMemo(memo.id);
      toast(ok ? "메모를 삭제했어요" : "삭제하지 못했어요");
      return ok;
    },
  };
}
