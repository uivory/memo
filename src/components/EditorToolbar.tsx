type ButtonFormatProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

// Figma Button/Format. 커서가 있는 글자의 서식은 State=Active로 보인다.
function ButtonFormat({ label, active = false, onClick }: ButtonFormatProps) {
  return (
    <button
      type="button"
      // 눌러도 편집 영역의 선택이 풀리지 않게 한다
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-pressed={active}
      className={`text-label-md flex h-9 items-center justify-center rounded-sm px-(--space-12) ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

export type Format = { bold: boolean; block: "p" | "h2" | "h3" | "ul" };

type EditorToolbarProps = {
  format: Format;
  onBold: () => void;
  onHeading: () => void;
  onSubheading: () => void;
  onList: () => void;
};

// Figma Editor/Toolbar. 굵게(B), 제목(대제목), 소제목, 목록.
export function EditorToolbar({ format, onBold, onHeading, onSubheading, onList }: EditorToolbarProps) {
  return (
    <div className="flex h-13 items-center gap-(--space-4) px-(--space-12)">
      <ButtonFormat label="B" active={format.bold} onClick={onBold} />
      <ButtonFormat label="제목" active={format.block === "h2"} onClick={onHeading} />
      <ButtonFormat label="소제목" active={format.block === "h3"} onClick={onSubheading} />
      <ButtonFormat label="목록" active={format.block === "ul"} onClick={onList} />
    </div>
  );
}
