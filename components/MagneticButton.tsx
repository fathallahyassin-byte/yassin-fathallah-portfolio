"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  external?: boolean;
};

/** Link that leans toward the cursor; its label moves further than its body. */
export default function MagneticButton({ href, children, className = "", strength = 0.35, external }: Props) {
  const el = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.current!.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el.current, { x: x * strength, y: y * strength, duration: 1, ease: "power3.out" });
    gsap.to(inner.current, { x: x * strength * 0.5, y: y * strength * 0.5, duration: 1, ease: "power3.out" });
  };
  const onLeave = () => {
    gsap.to([el.current, inner.current], { x: 0, y: 0, duration: 1.4, ease: "elastic.out(1, 0.35)" });
  };

  return (
    <a
      ref={el}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="hover"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full rounded-[inherit] bg-paper transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      />
      <span ref={inner} className="relative z-10 transition-colors duration-500 group-hover:text-ink group-focus-visible:text-ink">
        {children}
      </span>
    </a>
  );
}
