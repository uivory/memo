"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type BlurFadeProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: string;
};

// Magic UI Blur Fade (https://magicui.design/r/blur-fade.json)에서 가져와 줄였다.
// 모션 줄이기 설정이면 애니메이션 없이 그대로 보여 준다. 기본은 아래에서 위로 떠오른다.
export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "up",
  blur = "6px",
}: BlurFadeProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const from = direction === "right" || direction === "down" ? -offset : offset;
  const variants: Variants = {
    hidden: { [axis]: from, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: "blur(0px)" },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
