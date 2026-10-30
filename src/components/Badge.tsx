import { labelColorClass, type MemoColor } from "@/lib/labelColor";

// Figma Badge. 색은 메모의 색 라벨을 따른다.
export function Badge({ label, color }: { label: string; color: MemoColor }) {
  return (
    <span
      className={`text-caption-sm flex h-[26px] items-center rounded-full px-(--space-8) ${labelColorClass[color]}`}
    >
      {label}
    </span>
  );
}
