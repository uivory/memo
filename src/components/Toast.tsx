"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const ToastContext = createContext<(message: string) => void>(() => {});

// 어느 화면에서든 useToast()로 잠깐 뜨는 안내 문구를 보여 준다.
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef(0);

  const show = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-32 z-50 flex justify-center px-(--space-16)"
      >
        <AnimatePresence mode="wait">
          {toast && (
            <motion.p
              key={toast.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-text-primary text-surface-card text-label-md rounded-full px-(--space-20) py-(--space-12)"
            >
              {toast.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
