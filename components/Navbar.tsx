"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useLenis } from "./SmoothScroll";
import TransitionLink from "./TransitionLink";
import Menu from "./Menu";
import Mark from "./Mark";
import Clock from "./Clock";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();

  useScrollProgress((p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });

  // Freeze the page behind the menu.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  // Close if the route changes from elsewhere (browser back, etc.).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[86] text-paper mix-blend-difference">
        <div className="px-gutter flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink
            href="/"
            transitionLabel="Home"
            aria-label={`${site.name} — home`}
            className="label flex items-center gap-2.5 text-[0.75rem] font-medium"
            onClick={() => setOpen(false)}
          >
            <Mark size={16} />
            <span className="roll">
              <span>{site.name}</span>
              <span aria-hidden="true">{site.name}</span>
            </span>
          </TransitionLink>

          <p className="label hidden items-center gap-4 md:flex">
            <span>{site.roles[0]}</span>
            <span aria-hidden="true" className="h-px w-6 bg-paper/40" />
            <span>
              {site.city} <Clock />
            </span>
          </p>

          <button
            ref={button}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
            className="label group flex items-center gap-3 py-3 text-[0.75rem] font-medium"
          >
            <span className="roll">
              <span>{open ? "Fermer" : "Menu"}</span>
              <span aria-hidden="true">{open ? "Fermer" : "Menu"}</span>
            </span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-700 ease-[var(--ease-expo)] ${
                  open ? "top-1/2 rotate-45" : "top-[3px] group-hover:scale-x-75"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-700 ease-[var(--ease-expo)] ${
                  open ? "top-1/2 -rotate-45" : "bottom-[3px] origin-right group-hover:scale-x-50"
                }`}
              />
            </span>
          </button>
        </div>
        <span
          ref={bar}
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-paper/60"
          style={{ transform: "scaleX(0)" }}
        />
      </header>

      <Menu
        open={open}
        onClose={() => {
          setOpen(false);
          button.current?.focus();
        }}
      />
    </>
  );
}
