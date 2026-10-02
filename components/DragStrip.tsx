"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Horizontal strip: native swipe on touch, click-and-drag with inertia on
 * desktop, and a progress line. Clicks are swallowed after a real drag.
 */
export default function DragStrip({ children, label }: { children: ReactNode; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = scroller.current!;
    let down = false;
    let moved = 0;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let velocity = 0;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? el.scrollLeft / max : 0})`;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = 0;
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      velocity = 0;
      gsap.killTweensOf(el);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      velocity = e.clientX - lastX;
      lastX = e.clientX;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      gsap.to(el, { scrollLeft: el.scrollLeft - velocity * 18, duration: 1.2, ease: "expo.out" });
    };
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div>
      <div
        ref={scroller}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-cursor="drag"
        data-lenis-prevent-horizontal
        className="px-gutter flex snap-x snap-mandatory gap-[3vw] overflow-x-auto pb-8 select-none [scrollbar-width:none] md:snap-none [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="px-gutter">
        <div className="relative h-px bg-line">
          <span ref={progress} className="absolute inset-0 origin-left bg-paper" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
