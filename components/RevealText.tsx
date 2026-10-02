"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** lines: masked line rise · chars: masked letter rise · words: word rise */
  by?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start */
  start?: string;
  id?: string;
  style?: CSSProperties;
};

/** Split-text mask reveal that plays when the element enters the viewport. */
export default function RevealText({
  children,
  as: Tag = "div",
  className = "",
  by = "lines",
  delay = 0,
  stagger,
  start = "top 88%",
  id,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, {
          type: by === "lines" ? "lines" : `lines,${by}`,
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit: (self) =>
            gsap.from(self[by], {
              yPercent: 115,
              rotate: by === "lines" ? 2 : 0,
              duration: 1.4,
              ease: "expo.out",
              delay,
              stagger: stagger ?? (by === "chars" ? 0.025 : by === "words" ? 0.04 : 0.09),
              scrollTrigger: { trigger: ref.current, start, once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}
