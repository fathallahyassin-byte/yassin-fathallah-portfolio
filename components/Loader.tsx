"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { site } from "@/lib/site";
import Mark from "./Mark";

/**
 * 000 → 100 counter, then the black panel lifts. Short by design (~1.6s,
 * ~0.7s on repeat visits) and never waits on more than fonts.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        markIntroDone();
        setGone(true);
        return;
      }

      let seen = false;
      try {
        seen = sessionStorage.getItem("intro-seen") === "1";
        sessionStorage.setItem("intro-seen", "1");
      } catch {}

      // The intro is the opening shot: always start it from the top.
      history.scrollRestoration = "manual";
      if (!location.hash) window.scrollTo(0, 0);
      document.documentElement.style.overflow = "hidden";
      const digits = el.querySelector<HTMLElement>("[data-count]")!;
      const bar = el.querySelector<HTMLElement>("[data-bar]")!;
      const counter = { v: 0 };
      const fonts = document.fonts?.ready ?? Promise.resolve();

      const exit = () =>
        gsap
          .timeline({
            onComplete: () => {
              document.documentElement.style.overflow = "";
              setGone(true);
            },
          })
          .to(el.querySelectorAll("[data-out]"), { yPercent: -110, duration: 0.7, ease: "expo.in", stagger: 0.04 })
          .add(markIntroDone, "-=0.15")
          .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "<");

      const tl = gsap
        .timeline()
        .from(el.querySelectorAll("[data-in]"), { yPercent: 110, duration: 0.9, stagger: 0.05 })
        .to(
          counter,
          {
            v: 100,
            duration: seen ? 0.6 : 1.5,
            ease: "power3.inOut",
            onUpdate: () => {
              digits.textContent = String(Math.round(counter.v)).padStart(3, "0");
              bar.style.transform = `scaleX(${counter.v / 100})`;
            },
          },
          0.1,
        );

      // Exit once the count is done and fonts are in (capped, never blocks).
      Promise.all([
        new Promise<void>((r) => tl.eventCallback("onComplete", () => r())),
        Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]),
      ]).then(exit);

      return () => {
        document.documentElement.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Chargement"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-gutter text-paper motion-reduce:hidden"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="label flex justify-between text-mute">
        <span className="overflow-hidden">
          <span data-in data-out className="block">
            {site.name} — Portfolio ©{site.year}
          </span>
        </span>
        <span className="overflow-hidden">
          <span data-in data-out className="block">
            {site.city}, {site.location}
          </span>
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="overflow-hidden">
          <span data-in data-out className="block text-paper">
            <Mark size={56} spin />
          </span>
        </span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <p className="label max-w-[16rem] overflow-hidden text-mute">
          <span data-in data-out className="block">
            Portfolio BTS SIO <br /> chargement en cours
          </span>
        </p>
        <div className="overflow-hidden">
          <span data-in data-out className="display display-l block tabular-nums leading-[0.85]">
            <span data-count>000</span>
            <span className="text-accent">%</span>
          </span>
        </div>
      </div>
      <span
        data-bar
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
