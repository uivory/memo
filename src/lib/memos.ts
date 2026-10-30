import type { MemoColor } from "@/lib/labelColor";

export type Category = "업무" | "개인" | "아이디어";

export type Block =
  | { type: "heading" | "subheading"; text: string }
  | { type: "paragraph"; parts: { text: string; bold?: boolean }[] }
  | { type: "list"; items: string[] };

// 화면에 보이는 메모 한 건 (저장된 값에서 memoStore가 만들어 준다)
export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  color: MemoColor;
  category: Category;
  pinned: boolean;
  createdAt: string;
  footer: string;
  body: Block[];
};

export const categories: Category[] = ["업무", "개인", "아이디어"];

// 작성 화면에서 분류를 고르면 색이 이 값으로 바뀐다. 색은 이어서 직접 바꿀 수 있다.
export const categoryColor: Record<Category, MemoColor> = {
  업무: "blue",
  개인: "green",
  아이디어: "orange",
};
