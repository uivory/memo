import type { SVGProps } from "react";

// Figma Icon/* 선 아이콘. 색은 따로 정하지 않고 글자색(currentColor)을 따른다.
// 크기는 쓰는 곳에서 size-* 로 맞춘다.
function Icon({ viewBox, children, ...props }: SVGProps<SVGSVGElement> & { viewBox: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 20 20" strokeWidth={1.66667} {...props}>
      <path d="M10 4.16667V10M10 10V15.8333M10 10H4.16667M10 10H15.8333" />
    </Icon>
  );
}

export function IconNote(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 22 22" strokeWidth={1.83333} {...props}>
      <path d="M6.41667 3.66667H12.8333L16.5 7.33333V18.3333H6.41667V3.66667Z" />
      <path d="M12.8333 3.66667V7.33333H16.5M9.16667 11H13.75M9.16667 14.6667H13.75" />
    </Icon>
  );
}

export function IconPin(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 16 16" strokeWidth={1.33333} {...props}>
      <path d="M6 2.33333H10L9.4 5.8L11.3333 8H4.66667L6.6 5.8L6 2.33333Z" />
      <path d="M8 8V13.3333" />
    </Icon>
  );
}

export function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 24 24" strokeWidth={2} {...props}>
      <path d="M15 18L9 12L15 6" />
    </Icon>
  );
}

export function IconShare(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 24 24" strokeWidth={2} {...props}>
      <path d="M12 4V15M16 8L12 4L8 8M5 14V18C5 18.5304 5.21071 19.0391 5.58579 19.4142C5.96086 19.7893 6.46957 20 7 20H17C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18V14" />
    </Icon>
  );
}

// 점 세 개는 선이 아니라 채운 모양이다.
export function IconMore(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <circle cx="5.5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18.5" cy="12" r="1.6" />
    </Icon>
  );
}

export function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 16 16" strokeWidth={1.33333} {...props}>
      <path d="M6 4L10 8L6 12" />
    </Icon>
  );
}
