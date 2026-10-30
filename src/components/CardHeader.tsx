import Link from "next/link";
import { IconChevronRight, IconPin } from "./icons";

type CardHeaderProps = {
  title: string;
  pin?: boolean;
  // 있으면 오른쪽에 "전체 보기"가 붙고, 이 주소로 이동한다
  actionHref?: string;
};

// Figma Card/Header. pin을 켜면 고정 표시, action을 켜면 오른쪽에 전체 보기.
export function CardHeader({ title, pin = false, actionHref }: CardHeaderProps) {
  return (
    <div className="flex h-10 items-center gap-(--space-4) pt-(--space-12) pr-(--space-16) pb-(--space-4) pl-(--space-20)">
      {pin && <IconPin className="text-primary size-4 shrink-0" />}
      <h2 className="text-label-md text-text-primary min-w-0 flex-1">{title}</h2>
      {actionHref && (
        <Link
          href={actionHref}
          className="text-caption-md text-text-muted flex shrink-0 items-center gap-(--space-4)"
        >
          전체 보기
          <IconChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
