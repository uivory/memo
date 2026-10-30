"use client";

import { motion, useReducedMotion } from "motion/react";
import { labelColorName, labelDotClass, type MemoColor } from "@/lib/labelColor";

type LabelDotProps = {
  color: MemoColor;
  selected?: boolean;
  onClick?: () => void;
};

// Figma Label/Dot. 고른 색은 바깥에 파란 테두리(2px)가 생긴다.
export function LabelDot({ color, selected = false, onClick }: LabelDotProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileTap={reduce ? undefined : { scale: 0.88 }}
      animate={reduce ? undefined : { scale: selected ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      type="button"
      onClick={onClick}
      aria-label={labelColorName[color]}
      aria-pressed={selected}
      className={`transition-colors duration-200 flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      <span className={`size-[22px] rounded-full ${labelDotClass[color]}`} />
    </motion.button>
  );
}
