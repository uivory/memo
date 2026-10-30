import type { Block } from "@/lib/memos";

// Figma Memo/ListItem. 앞에 점이 붙고 글이 길면 다음 줄로 이어진다.
function MemoListItem({ text }: { text: string }) {
  return (
    <li className="text-body-md text-text-secondary flex gap-(--space-8)">
      <span aria-hidden="true">•</span>
      <span className="min-w-0 flex-1">{text}</span>
    </li>
  );
}

export function MemoBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-(--space-12)">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="text-title-lg text-text-primary">
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={i} className="text-title-md text-text-primary">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="text-body-md text-text-secondary">
                {block.parts.map((part, j) =>
                  part.bold ? (
                    <strong key={j} className="text-text-primary font-bold">
                      {part.text}
                    </strong>
                  ) : (
                    <span key={j}>{part.text}</span>
                  ),
                )}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="flex flex-col gap-(--space-4)">
                {block.items.map((item, j) => (
                  <MemoListItem key={j} text={item} />
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
