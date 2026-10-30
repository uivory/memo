import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { IconPlus } from "./icons";

type ButtonPrimaryProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon?: boolean;
  // 있으면 버튼 대신 이 주소로 이동하는 링크가 된다
  href?: string;
};

// Figma Button/Primary. 화면마다 하나만 두고 아래쪽에 가로로 꽉 차게 둔다.
export function ButtonPrimary({
  label,
  icon = false,
  href,
  className = "",
  ...props
}: ButtonPrimaryProps) {
  const classes = `bg-primary text-text-on-primary text-button-md flex h-14 w-full items-center justify-center gap-(--space-8) rounded-md px-(--space-24) ${className}`;
  const content = (
    <>
      {icon && <IconPlus className="size-5 shrink-0" />}
      {label}
    </>
  );

  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
