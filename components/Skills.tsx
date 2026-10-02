"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { skills } from "@/lib/site";
import { pad } from "@/lib/projects";
import SectionLabel from "./SectionLabel";

/**
 * Capabilities as giant type. Rows drift sideways with scroll; on hover the
 * word fills with the accent, its letters ripple, and an image trails the
 * cursor, tilting with its velocity.
 */
export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        q("[data-row]").forEach((row, i) => {
          gsap.fromTo(
            row.querySelector("[data-drift]"),
            { xPercent: i % 2 ? -6 : 6 },
            {
              xPercent: i % 2 ? 4 : -4,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
        gsap.from(q("[data-row-line]"), {
          scaleX: 0,
          duration: 1.6,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-rows]")[0], start: "top 80%", once: true },
        });
      });

      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = follower.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" });
        const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3" });
        let last = 0;
        const onMove = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          rTo(gsap.utils.clamp(-14, 14, (e.clientX - last) * 0.6));
          last = e.clientX;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="skills"
      aria-labelledby="skills-title"
      className="relative overflow-hidden bg-ink py-[16vh]"
      onPointerLeave={() => setActive(null)}
    >
      <div className="px-gutter mb-[8vh] grid grid-cols-12 items-end gap-6">
        <SectionLabel index="04" className="col-span-12 md:col-span-6">
          Compétences
        </SectionLabel>
        <h2 id="skills-title" className="col-span-12 max-w-[30ch] text-mute md:col-span-4 md:col-start-9">
          Cinq domaines travaillés en formation et en stage, du code front-end jusqu’à la gestion de
          projet agile.
        </h2>
      </div>

      <ul data-rows>
        {skills.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.name} data-row className="relative">
              <span data-row-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <div
                tabIndex={0}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(on ? null : i)}
                data-cursor="hover"
                aria-label={`${s.name}: ${s.tools.join(", ")}`}
                className="px-gutter grid cursor-default grid-cols-12 items-center gap-4 py-[1.4vh] outline-none focus-visible:bg-ink-3"
              >
                <span className="label col-span-1 text-mute">{pad(i + 1)}</span>

                <div data-drift className="col-span-11 md:col-span-8" aria-hidden="true">
                  <div className="display relative text-[clamp(2.2rem,7vw,8rem)] whitespace-nowrap">
                    <span className="block">
                      {[...s.name].map((c, j) => (
                        <span
                          key={j}
                          className="inline-block transition-[transform,color] duration-700 ease-[var(--ease-expo)]"
                          style={{
                            transform: on ? `translateY(${j % 2 ? -6 : 6}%) skewX(-6deg)` : "none",
                            transitionDelay: `${j * 18}ms`,
                            color: on ? "var(--color-accent)" : active === null ? "var(--color-paper)" : "rgb(242 240 235 / 0.18)",
                          }}
                        >
                          {c === " " ? " " : c}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <ul
                  className="label col-span-11 col-start-2 flex flex-wrap gap-x-4 gap-y-1 text-mute transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] md:col-span-3 md:col-start-10 md:flex-col md:items-end"
                  style={{
                    opacity: on || active === null ? 1 : 0.3,
                    transform: on ? "translateX(-8px)" : "none",
                  }}
                >
                  {s.tools.map((t) => (
                    <li key={t} className={on ? "text-paper" : ""}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Cursor-trailing image (desktop only) */}
      <div
        ref={follower}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <div
          className="relative -mt-[9vw] -ml-[7vw] aspect-[4/5] w-[14vw] overflow-hidden transition-[clip-path] duration-700 ease-[var(--ease-expo)]"
          style={{ clipPath: active === null ? "inset(50% 50% 50% 50%)" : "inset(0% 0% 0% 0%)" }}
        >
          {skills.map((s, i) => (
            <Image
              key={s.name}
              src={s.image}
              alt=""
              fill
              sizes="14vw"
              className="object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]"
              style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.25)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
