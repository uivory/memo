"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// 되돌릴 수 없는 일을 하기 전에 한 번 더 묻는 창. 기본으로 "취소"에 포커스가 있다.
export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const reduce = useReducedMotion();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-(--space-24)">
      <div className="bg-text-primary/40 absolute inset-0" onClick={onCancel} aria-hidden="true" />
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        initial={reduce ? false : { scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-surface-card relative flex w-full max-w-sm flex-col gap-(--space-8) rounded-xl p-(--space-24)"
      >
        <h2 id="confirm-title" className="text-title-lg text-text-primary">
          {title}
        </h2>
        <p id="confirm-description" className="text-body-md text-text-secondary">
          {description}
        </p>
        <div className="flex gap-(--space-8) pt-(--space-16)">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="bg-surface-page text-text-secondary text-button-md h-14 flex-1 rounded-md"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-label-pink text-text-on-primary text-button-md h-14 flex-1 rounded-md"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
