import { blockTexts } from "@/lib/memoStore";
import type { Memo } from "@/lib/memos";

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

function memoText(memo: Memo) {
  const lines = memo.body.flatMap((block) =>
    block.type === "list" ? block.items.map((i) => `• ${i}`) : blockTexts(block),
  );
  return [memo.title, ...lines].join("\n");
}

// 기기의 공유 창이 있으면 그것을 열고, 없으면 글을 클립보드에 복사한다.
export async function shareMemo(memo: Memo): Promise<ShareResult> {
  const text = memoText(memo);

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: memo.title, text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // 공유 창을 못 열면 복사로 넘어간다
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    // https가 아닌 주소(예: 같은 와이파이의 IP 주소)에서는 클립보드 API를 못 쓰므로 예전 방식으로 복사한다
    return copyWithSelection(text) ? "copied" : "failed";
  }
}

function copyWithSelection(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(area);
  }
}
