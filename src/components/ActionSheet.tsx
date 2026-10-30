"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export type SheetOption = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type ActionSheetProps = {
  title: string;
  options: SheetOption[];
  onClose: () => void;
};

// 아래에서 올라오는 선택 창. 바깥을 누르거나 Esc를 누르면 닫힌다.
export function ActionSheet({ title, options, onClose }: ActionSheetProps) {
  const reduce = useReducedMotion();
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-text-primary/40 absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={reduce ? false : { y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-surface-card relative w-full max-w-md rounded-t-xl pt-(--space-8) pb-(--space-34)"
      >
        <p className="text-caption-md text-text-muted truncate px-(--space-24) pt-(--space-12) pb-(--space-8)">
          {title}
        </p>
        {options.map((option, i) => (
          <button
            key={option.label}
            ref={i === 0 ? firstRef : undefined}
            type="button"
            onClick={option.onClick}
            className={`text-title-md flex h-14 w-full items-center px-(--space-24) text-left ${
              option.danger ? "text-label-pink" : "text-text-primary"
            }`}
          >
            {option.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
