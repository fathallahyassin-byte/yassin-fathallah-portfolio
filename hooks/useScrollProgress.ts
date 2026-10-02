"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScroll";

/**
 * Calls `onProgress(0 → 1)` with the page scroll progress, without re-rendering.
 */
export function useScrollProgress(onProgress: (p: number) => void) {
  const lenis = useLenis();
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      cb.current(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    read();
    if (lenis) return lenis.on("scroll", read);
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, [lenis]);
}
