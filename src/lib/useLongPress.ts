import { useRef, type MouseEvent, type PointerEvent } from "react";

// 목록 줄을 길게 누르면(터치 0.5초, 마우스 오른쪽 클릭·메뉴 키 포함) onLongPress를 부른다.
// 길게 누르는 동안 손가락이 움직이면(스크롤) 취소하고, 길게 누른 뒤에는 이동 클릭을 막는다.
const HOLD_MS = 500;
const MOVE_LIMIT = 10;

export function useLongPress(onLongPress: () => void) {
  const timer = useRef(0);
  const fired = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const clear = () => {
    window.clearTimeout(timer.current);
    origin.current = null;
  };

  const fire = () => {
    fired.current = true;
    clear();
    onLongPress();
  };

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      fired.current = false;
      origin.current = { x: e.clientX, y: e.clientY };
      timer.current = window.setTimeout(fire, HOLD_MS);
    },
    onPointerMove: (e: PointerEvent) => {
      const o = origin.current;
      if (o && Math.hypot(e.clientX - o.x, e.clientY - o.y) > MOVE_LIMIT) clear();
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    onContextMenu: (e: MouseEvent) => {
      e.preventDefault();
      if (!fired.current) fire();
    },
    onClick: (e: MouseEvent) => {
      if (fired.current) {
        e.preventDefault();
        fired.current = false;
      }
    },
  };
}
