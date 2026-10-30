export type MemoColor = "blue" | "green" | "orange" | "pink";

export const memoColors: MemoColor[] = ["blue", "green", "orange", "pink"];

// 메모의 색 라벨 → 배경과 글자색. 아이콘은 글자색을 따르므로 같은 text-* 로 색이 정해진다.
export const labelColorClass: Record<MemoColor, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

// 색 고르기 점(Label/Dot)의 채운 색
export const labelDotClass: Record<MemoColor, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};

export const labelColorName: Record<MemoColor, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};
