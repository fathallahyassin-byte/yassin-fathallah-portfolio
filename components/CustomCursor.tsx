"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

type State = "default" | "hover" | "view" | "open" | "drag" | "hide";

const LABELS: Partial<Record<State, string>> = {
  view: "Voir",
  open: "Ouvrir",
  drag: "← Glisser →",
};

/**
 * Dot + lagging ring. Elements opt in with `data-cursor="view|open|drag|hover|hide"`;
 * links and buttons get the hover state automatically. Off on touch devices.
 */
export default function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const refresh = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });

    let state: State | null = null;
    let visible = false;
    let last = { x: -1, y: -1 };

    const apply = (next: State) => {
      if (next === state) return;
      state = next;
      const big = next === "view" || next === "open" || next === "drag";
      if (big && label.current) label.current.textContent = LABELS[next] ?? "";
      gsap.to(disc.current, {
        scale: big ? 1 : next === "hover" ? 0.6 : next === "hide" ? 0 : 0.36,
        backgroundColor: big ? "var(--color-accent)" : "rgba(242,240,235,0)",
        borderColor: big ? "rgba(255,77,23,1)" : "rgba(242,240,235,0.55)",
        duration: 0.6,
        ease: "expo.out",
      });
      gsap.to(label.current, { opacity: big ? 1 : 0, scale: big ? 1 : 0.6, duration: 0.4 });
      gsap.to(dot.current, { scale: big || next === "hide" ? 0 : 1, duration: 0.3 });
    };

    const resolve = (target: EventTarget | null): State => {
      if (!(target instanceof Element)) return "default";
      const tagged = target.closest<HTMLElement>("[data-cursor]");
      if (tagged) return (tagged.dataset.cursor as State) || "hover";
      if (target.closest("input, textarea, select")) return "hide";
      if (target.closest("a, button, [role='button'], label")) return "hover";
      return "default";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      last = { x: e.clientX, y: e.clientY };
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: PointerEvent) => apply(resolve(e.target));
    // After a route change the element under the pointer is new but no pointerover fires.
    refresh.current = () => apply(resolve(document.elementFromPoint(last.x, last.y)));
    const onLeave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring.current, { scale: 0.85, duration: 0.3 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    apply("default");

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  useEffect(() => {
    const id = setTimeout(() => refresh.current(), 1200);
    return () => clearTimeout(id);
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110]">
      <div ref={ring} className="absolute left-0 top-0 opacity-0">
        <div
          ref={disc}
          className="absolute -left-12 -top-12 flex h-24 w-24 items-center justify-center rounded-full border"
          style={{ transform: "scale(0.36)", borderColor: "rgba(242,240,235,0.55)" }}
        >
          <span ref={label} className="label font-semibold whitespace-nowrap text-ink opacity-0" />
        </div>
      </div>
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-paper opacity-0 mix-blend-difference"
      />
    </div>
  );
}
