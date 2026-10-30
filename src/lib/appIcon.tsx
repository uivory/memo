import { ImageResponse } from "next/og";

// 홈 화면 아이콘. 색은 디자인 토큰 color/primary, text/on-primary 값을 쓴다.
// 가장자리까지 채워 두어서 마스커블 아이콘으로도 잘리지 않는다.
const PRIMARY = "#3182f6";
const ON_PRIMARY = "#ffffff";

export function renderAppIcon(size: number) {
  const glyph = Math.round(size * 0.5);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: PRIMARY,
        }}
      >
        <svg
          width={glyph}
          height={glyph}
          viewBox="0 0 24 24"
          fill="none"
          stroke={ON_PRIMARY}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
