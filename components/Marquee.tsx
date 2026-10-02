"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";
import Mark from "./Mark";

/**
 * Infinite ticker whose speed, direction and skew follow scroll velocity.
 */
export default function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = track.current!;
        let x = 0;
        let dir = -1;
        let vel = 0;
        const skew = gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3" });
        const onScroll = (e: { velocity: number; direction: number }) => {
          vel = e.velocity;
          if (e.direction) dir = e.direction > 0 ? -1 : 1;
        };
        const unsub = lenis?.on("scroll", onScroll);

        const tick = (_t: number, dt: number) => {
          const half = el.scrollWidth / 2;
          x += dir * (0.06 + Math.min(Math.abs(vel), 80) * 0.02) * dt;
          x = gsap.utils.wrap(-half, 0, x);
          gsap.set(el, { x });
          skew(gsap.utils.clamp(-12, 12, -vel * 0.35));
          vel *= 0.9;
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          unsub?.();
        };
      });
    },
    { scope: root, dependencies: [lenis] },
  );

  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-[0.35em] pr-[0.35em]">
          <span className={i % 2 ? "outline-text" : ""}>{item}</span>
          <Mark size="0.45em" className="text-paper" />
        </span>
      ))}
    </>
  );

  return (
    <div ref={root} aria-hidden="true" className={`overflow-hidden border-y border-line py-[2.5vh] ${className}`}>
      <div ref={track} className="display flex w-max text-[clamp(3rem,9vw,9rem)] whitespace-nowrap will-change-transform">
        {row}
        {row}
      </div>
    </div>
  );
}
