// 본문 편집 영역의 블록 서식(제목, 소제목, 목록) 적용.
// 브라우저 기본 명령(formatBlock 등)은 목록 안에서 제목을 누르면 h2 > ul 처럼 중첩을 만들어 서식이 꼬이므로
// 줄 단위로 직접 바꾼다. 편집 영역의 바로 아래에는 p, h2, h3, ul(li)만 두는 것이 약속이다.

export type BlockKind = "p" | "h2" | "h3" | "ul";

type Unit = { el: HTMLElement; kind: BlockKind };

function kindOf(el: Element): BlockKind {
  switch (el.tagName) {
    case "H2":
      return "h2";
    case "H3":
      return "h3";
    case "LI":
    case "UL":
    case "OL":
      return "ul";
    default:
      return "p";
  }
}

const NESTED_BLOCK = "h2,h3,ul,ol,p,div";

// 중첩된 블록(p > ul 등)의 바깥 껍데기를 벗기고, 바로 붙은 글자는 문단으로 감싼다
function normalize(root: HTMLElement) {
  for (let again = true; again; ) {
    again = false;
    for (const el of Array.from(root.querySelectorAll("p,div,h2,h3"))) {
      if (el.querySelector(NESTED_BLOCK)) {
        el.replaceWith(...Array.from(el.childNodes));
        again = true;
        break;
      }
    }
  }

  let run: Node[] = [];
  const flush = () => {
    const hasContent = run.some((n) => n.nodeType !== Node.TEXT_NODE || (n.textContent ?? "").trim());
    if (hasContent) {
      const p = document.createElement("p");
      run[0].parentNode?.insertBefore(p, run[0]);
      p.append(...run);
    } else {
      run.forEach((n) => n.parentNode?.removeChild(n));
    }
    run = [];
  };
  for (const node of Array.from(root.childNodes)) {
    if (node instanceof HTMLElement && /^(P|DIV|H2|H3|UL|OL)$/.test(node.tagName)) flush();
    else run.push(node);
  }
  flush();
}

function convert(el: HTMLElement, tag: string): HTMLElement {
  const next = document.createElement(tag);
  while (el.firstChild) next.append(el.firstChild);
  if (!next.firstChild) next.append(document.createElement("br"));
  return next;
}

function touches(range: Range, el: HTMLElement) {
  if (range.collapsed) return el.contains(range.startContainer);
  const whole = document.createRange();
  whole.selectNodeContents(el);
  return (
    range.compareBoundaryPoints(Range.END_TO_START, whole) < 0 &&
    range.compareBoundaryPoints(Range.START_TO_END, whole) > 0
  );
}

// 커서가 있는 줄(또는 선택한 여러 줄)에 서식을 적용한다.
// 선택한 줄이 모두 이미 그 서식이면 일반 글자로 되돌린다. 이후 입력도 같은 서식으로 이어진다.
export function applyBlock(root: HTMLElement, target: BlockKind) {
  normalize(root);
  if (!root.firstElementChild) root.innerHTML = "<p><br></p>";

  const units: Unit[] = [];
  for (const child of Array.from(root.children) as HTMLElement[]) {
    if (child.tagName === "UL" || child.tagName === "OL") {
      for (const li of Array.from(child.children) as HTMLElement[]) units.push({ el: li, kind: "ul" });
    } else {
      units.push({ el: child, kind: kindOf(child) });
    }
  }
  if (!units.length) return;

  const selection = document.getSelection();
  let range: Range;
  if (selection && selection.rangeCount && root.contains(selection.anchorNode)) {
    range = selection.getRangeAt(0).cloneRange();
  } else {
    // 편집 영역에 커서가 없었다면 맨 끝에서 시작한다
    range = document.createRange();
    range.selectNodeContents(units[units.length - 1].el);
    range.collapse(false);
  }

  let selected = units.filter((u) => touches(range, u.el));
  if (!selected.length) selected = [units[units.length - 1]];

  const next: BlockKind = selected.every((u) => u.kind === target) ? "p" : target;
  selected.forEach((u) => (u.kind = next));

  // Range는 DOM이 바뀌면 같이 움직이므로 바꾸기 전에 끝점을 따로 적어 둔다
  const start = { node: range.startContainer, offset: range.startOffset };
  const end = { node: range.endContainer, offset: range.endOffset };

  // 줄마다 새 요소로 옮겨 담는다. 글자 노드는 그대로 옮기므로 선택 영역이 유지된다.
  const replaced = new Map<Node, Node>();
  const out: HTMLElement[] = [];
  let list: HTMLElement | null = null;
  for (const u of units) {
    if (u.kind === "ul") {
      if (!list) {
        list = document.createElement("ul");
        out.push(list);
      }
      const li = u.el.tagName === "LI" ? u.el : convert(u.el, "li");
      list.append(li);
      replaced.set(u.el, li);
    } else {
      list = null;
      const el = u.el.tagName.toLowerCase() === u.kind ? u.el : convert(u.el, u.kind);
      out.push(el);
      replaced.set(u.el, el);
    }
  }
  root.replaceChildren(...out);

  const place = (node: Node, offset: number): [Node, number] => {
    const mapped = replaced.get(node);
    if (mapped) return [mapped, offset];
    if (root.contains(node)) return [node, offset];
    return [replaced.get(selected[0].el) ?? out[0], 0];
  };
  const [sc, so] = place(start.node, start.offset);
  const [ec, eo] = place(end.node, end.offset);

  root.focus();
  const restored = document.createRange();
  restored.setStart(sc, Math.min(so, sc.nodeType === Node.TEXT_NODE ? (sc.textContent ?? "").length : sc.childNodes.length));
  restored.setEnd(ec, Math.min(eo, ec.nodeType === Node.TEXT_NODE ? (ec.textContent ?? "").length : ec.childNodes.length));
  selection?.removeAllRanges();
  selection?.addRange(restored);
}
