import type { Block } from "@/lib/memos";

type Part = { text: string; bold?: boolean };

const clean = (s: string | null) => (s ?? "").replace(/\s+/g, " ").trim();

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// 브라우저의 서식 명령은 문단 안에 목록을 넣는 식으로 중첩된 모양을 만들기도 한다.
// 그래서 블록 요소를 만나면 그때까지 모은 글자를 문단으로 내보내고 계속 내려간다.
const BLOCK_TAGS = new Set(["H2", "H3", "UL", "OL", "P", "DIV"]);

function isBoldElement(el: HTMLElement) {
  if (el.tagName === "B" || el.tagName === "STRONG") return true;
  const weight = Number.parseInt(el.style.fontWeight, 10);
  return el.style.fontWeight === "bold" || weight >= 600;
}

function collectInline(node: Node, bold: boolean, out: Part[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? "").replace(/\s+/g, " ");
    if (text) out.push({ text, bold });
  } else if (node instanceof HTMLElement && node.tagName !== "BR") {
    const childBold = bold || isBoldElement(node);
    node.childNodes.forEach((child) => collectInline(child, childBold, out));
  }
}

// 굵기가 같은 이웃끼리 합치고, 문단 앞뒤 공백을 지운다
function normalizeParts(raw: Part[]): Part[] {
  const merged: Part[] = [];
  for (const part of raw) {
    const last = merged[merged.length - 1];
    if (last && !!last.bold === !!part.bold) last.text += part.text;
    else merged.push({ ...part });
  }
  if (merged.length) {
    merged[0].text = merged[0].text.trimStart();
    merged[merged.length - 1].text = merged[merged.length - 1].text.trimEnd();
  }
  return merged.filter((p) => p.text).map((p) => (p.bold ? p : { text: p.text }));
}

function walk(parent: Node, blocks: Block[]) {
  let inline: Part[] = [];
  const flush = () => {
    const parts = normalizeParts(inline);
    if (parts.length) blocks.push({ type: "paragraph", parts });
    inline = [];
  };

  parent.childNodes.forEach((node) => {
    if (!(node instanceof HTMLElement) || !BLOCK_TAGS.has(node.tagName)) {
      collectInline(node, false, inline);
      return;
    }
    flush();
    if (node.tagName === "H2" || node.tagName === "H3") {
      const text = clean(node.textContent);
      if (text) blocks.push({ type: node.tagName === "H2" ? "heading" : "subheading", text });
    } else if (node.tagName === "UL" || node.tagName === "OL") {
      const items = Array.from(node.querySelectorAll("li"))
        .map((li) => clean(li.textContent))
        .filter(Boolean);
      if (items.length) blocks.push({ type: "list", items });
    } else {
      walk(node, blocks);
    }
  });
  flush();
}

// 편집 영역의 DOM을 저장용 블록으로 바꾼다.
export function readBlocks(root: HTMLElement): Block[] {
  const blocks: Block[] = [];
  walk(root, blocks);
  return blocks;
}

// 저장된 블록을 편집 영역 HTML로 되돌린다. 비어 있으면 빈 문단 하나.
export function blocksToHtml(blocks: Block[]): string {
  if (!blocks.length) return "<p><br></p>";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "list":
          return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
        case "paragraph":
          return `<p>${block.parts
            .map((p) => (p.bold ? `<b>${escapeHtml(p.text)}</b>` : escapeHtml(p.text)))
            .join("")}</p>`;
      }
    })
    .join("");
}
