"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionSheet } from "./ActionSheet";
import { ConfirmDialog } from "./ConfirmDialog";
import type { Memo } from "@/lib/memos";
import { useMemoActions } from "@/lib/useMemoActions";

type MemoActionSheetProps = {
  memo: Memo;
  onClose: () => void;
  // 상세 화면은 공유 버튼이 따로 있어서 선택 창에서는 뺀다
  showShare?: boolean;
  // 삭제를 마친 뒤 할 일 (상세 화면에서는 홈으로 돌아간다)
  onDeleted?: () => void;
};

// 메모 한 건에 대한 선택 창: 수정, 고정, 공유, 삭제(삭제 전에 한 번 더 묻는다)
export function MemoActionSheet({ memo, onClose, showShare = true, onDeleted }: MemoActionSheetProps) {
  const router = useRouter();
  const actions = useMemoActions();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <ConfirmDialog
        title="메모를 삭제할까요?"
        description="삭제한 메모는 되돌릴 수 없어요."
        confirmLabel="삭제하기"
        onCancel={onClose}
        onConfirm={async () => {
          if (await actions.remove(memo)) onDeleted?.();
          onClose();
        }}
      />
    );
  }

  return (
    <ActionSheet
      title={memo.title}
      onClose={onClose}
      options={[
        {
          label: "수정하기",
          onClick: () => {
            onClose();
            router.push(`/memo/${memo.id}/edit`);
          },
        },
        {
          label: memo.pinned ? "고정 해제" : "고정하기",
          onClick: () => {
            void actions.pin(memo);
            onClose();
          },
        },
        ...(showShare
          ? [
              {
                label: "공유하기",
                onClick: () => {
                  onClose();
                  void actions.share(memo);
                },
              },
            ]
          : []),
        { label: "삭제하기", danger: true, onClick: () => setConfirming(true) },
      ]}
    />
  );
}
