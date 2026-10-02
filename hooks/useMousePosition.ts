"use client";

import { useEffect } from "react";

export type Mouse = {
  x: number;
  y: number;
  /** normalised -1 → 1 relative to the viewport centre */
  nx: number;
  ny: number;
  vx: number;
  vy: number;
};

// One shared listener for the whole app; consumers read from a mutable object
// inside their own rAF / gsap ticker, so pointer moves never trigger re-renders.
const mouse: Mouse = { x: 0, y: 0, nx: 0, ny: 0, vx: 0, vy: 0 };
let subscribers = 0;

function onMove(e: PointerEvent) {
  mouse.vx = e.clientX - mouse.x;
  mouse.vy = e.clientY - mouse.y;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.ny = (e.clientY / window.innerHeight) * 2 - 1;
}

export function useMousePosition() {
  useEffect(() => {
    if (subscribers++ === 0) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (--subscribers === 0) window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return mouse;
}
