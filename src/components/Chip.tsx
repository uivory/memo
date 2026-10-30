"use client";

import { motion, useReducedMotion } from "motion/react";

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

// Figma Chip. 고른 칩은 State=Selected.
export function Chip({ label, selected = false, onClick }: ChipProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileTap={reduce ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-label-md transition-colors duration-200 flex h-9 shrink-0 items-center rounded-full px-(--space-16) whitespace-nowrap ${
        selected ? "bg-primary text-text-on-primary" : "bg-surface-card text-text-secondary"
      }`}
    >
      {label}
    </motion.button>
  );
}
