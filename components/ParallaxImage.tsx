"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  /** Reveal immediately (above the fold) instead of on scroll */
  immediate?: boolean;
  cursor?: string;
};

/** Image frame: clip-path + blur→sharp reveal, then scroll parallax. */
export default function ParallaxImage({ src, alt, className = "", sizes = "100vw", preload, immediate, cursor }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const img = root.current!.querySelector("[data-pimg]");
        gsap.fromTo(
          root.current,
          { clipPath: "inset(18% 10% 18% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "expo.inOut",
            delay: immediate ? 0.9 : 0,
            scrollTrigger: immediate ? undefined : { trigger: root.current, start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          img,
          { filter: "blur(16px)" },
          {
            filter: "blur(0px)",
            duration: 1.6,
            ease: "power2.out",
            delay: immediate ? 1.1 : 0.2,
            scrollTrigger: immediate ? undefined : { trigger: root.current, start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.18 },
          {
            yPercent: 8,
            scale: 1.05,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-cursor={cursor} className={`relative overflow-hidden bg-ink-3 ${className}`}>
      <div data-pimg className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>
    </div>
  );
}
