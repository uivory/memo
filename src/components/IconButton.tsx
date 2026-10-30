import Link from "next/link";
import type { ReactNode } from "react";

type IconButtonProps = {
  label: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  // 켜고 끄는 버튼(고정 등)일 때 현재 상태
  pressed?: boolean;
  // 아이콘은 글자색을 따른다. 색을 바꾸려면 text-* 를 넘긴다.
  color?: string;
};

// Figma Button/Icon. 40×40 누르는 영역 가운데에 아이콘을 둔다. href가 있으면 이동, 없으면 버튼.
export function IconButton({
  label,
  children,
  href,
  onClick,
  pressed,
  color = "text-text-primary",
}: IconButtonProps) {
  const classes = `${color} flex size-10 items-center justify-center rounded-sm`;
  return href ? (
    <Link href={href} aria-label={label} className={classes}>
      {children}
    </Link>
  ) : (
    <button type="button" aria-label={label} aria-pressed={pressed} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
