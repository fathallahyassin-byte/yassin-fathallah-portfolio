"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { site } from "@/lib/site";
import HeroCanvas from "./HeroCanvas";
import Mark from "./Mark";

const Chars = ({ text }: { text: string }) => (
  <>
    {[...text].map((c, i) => (
      <span key={i} data-char className="reveal-up inline-block will-change-transform">
        {c === " " ? " " : c}
      </span>
    ))}
  </>
);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(q("[data-fade]"), { opacity: 0, y: 24 });
        gsap.set(q("[data-line]"), { scaleX: 0 });

        // 1 · Loader hands over → type rises, camera settles, details follow.
        const off = onIntroDone(() => {
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(q("[data-char]"), { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.6, stagger: 0.045 }, 0)
            .fromTo(q("[data-camera]"), { scale: 1.14, yPercent: 6 }, { scale: 1, yPercent: 0, duration: 2.6, ease: "power3.out" }, 0)
            .fromTo(q("[data-bg]"), { scale: 1.25 }, { scale: 1, duration: 3, ease: "power3.out" }, 0)
            .to(q("[data-line]"), { scaleX: 1, duration: 1.6, stagger: 0.08 }, 0.5)
            .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.06 }, 0.7);
        });

        // 2 · Scrolling out: the two lines drift apart and leave the frame.
        const st = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        } satisfies ScrollTrigger.Vars;
        gsap.to(q("[data-name-1]"), { xPercent: -18, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-name-2]"), { xPercent: 14, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-content]"), { yPercent: 18, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-fade-out]"), { opacity: 0, ease: "none", scrollTrigger: { ...st, end: "40% top" } });

        return off;
      });

      // 3 · The name leans toward the cursor.
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const name = q("[data-follow]")[0];
        const xTo = gsap.quickTo(name, "x", { duration: 1.4, ease: "power3" });
        const yTo = gsap.quickTo(name, "y", { duration: 1.4, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / innerWidth - 0.5) * -28);
          yTo((e.clientY / innerHeight - 0.5) * -16);
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
      id="top"
      aria-label="Présentation"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink"
    >
      {/* Visual — shader, with a CSS glow as fallback */}
      <div
        data-bg
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 85%, rgb(255 77 23 / 0.35), transparent 70%), #050505",
        }}
      >
        <HeroCanvas />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <div
        data-content
        className="px-gutter relative z-10 flex h-full flex-col justify-between pt-[calc(var(--header-h)+1.25rem)] pb-5 md:pb-7"
      >
        {/* Top meta */}
        <div data-fade-out className="label grid grid-cols-2 gap-4 text-mute md:grid-cols-4">
          <p data-fade>
            <span className="text-paper">(Portfolio)</span>
            <br />
            {site.session} — Épreuve E5
          </p>
          <p data-fade className="hidden md:block">
            <span className="text-paper">(Formation)</span>
            <br />
            {site.formation}
          </p>
          <p data-fade className="hidden md:block">
            <span className="text-paper">(Basé à)</span>
            <br />
            {site.city}, {site.location}
          </p>
          <p data-fade className="text-right">
            <span className="text-paper">(Coordonnées)</span>
            <br />
            {site.coordinates}
          </p>
        </div>

        {/* Name */}
        <div data-camera className="origin-[50%_80%]">
          <div data-follow>
            <p data-fade className="label mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-paper md:mb-6">
              <span className="text-accent">●</span>
              {site.roles.map((r, i) => (
                <span key={r} className="flex items-center gap-3 whitespace-nowrap">
                  {i > 0 && <span className="text-accent">/</span>}
                  {r}
                </span>
              ))}
            </p>
            <h1
              className="display fit-title select-none"
              aria-label={site.name}
              // Width of the longest line in em (≈0.52em per condensed capital + the mark),
              // so any name fills the screen without being cropped.
              style={{ "--fit": Math.max(site.firstName.length, site.lastName.length + 0.5) * 0.52 + 0.1 } as React.CSSProperties}
            >
              <span data-name-1 className="mask-accent flex items-end overflow-hidden pb-[0.02em] -ml-[0.04em]" aria-hidden="true">
                <Chars text={site.firstName} />
                <span className="serif mb-[0.12em] ml-[0.4em] hidden text-[0.16em] leading-none text-mute normal-case lg:inline">
                  <span data-fade className="inline-block">(portfolio — BTS SIO)</span>
                </span>
              </span>
              <span data-name-2 className="mask-accent flex items-end justify-end overflow-hidden pb-[0.02em]" aria-hidden="true">
                <Chars text={site.lastName} />
                <span data-char className="reveal-up inline-block pl-[0.04em] text-accent">
                  <Mark size="0.2em" filled className="-mb-[0.02em] text-accent" />
                </span>
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom meta */}
        <div data-fade-out className="grid grid-cols-12 items-end gap-4">
          <span data-line aria-hidden="true" className="col-span-12 mb-4 h-px origin-left bg-line" />
          <p data-fade className="lede col-span-12 max-w-[26rem] text-paper md:col-span-5">
            {site.description}
          </p>
          <a
            data-fade
            href="#manifesto"
            className="label group col-span-6 flex items-center gap-3 text-paper md:col-span-3 md:col-start-7"
          >
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_var(--ease-io)_infinite] bg-accent motion-reduce:animate-none" />
            </span>
            <span className="roll">
              <span>Défiler pour explorer</span>
              <span aria-hidden="true">Défiler pour explorer</span>
            </span>
          </a>
          <p data-fade className="label col-span-6 flex items-center justify-end gap-2.5 text-paper md:col-span-3">
            <span className="pulse-dot" aria-hidden="true" />
            Ouvert aux opportunités
          </p>
        </div>
      </div>
    </section>
  );
}
