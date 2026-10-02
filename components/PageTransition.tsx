"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";
import Mark from "./Mark";

type Navigate = (href: string, label?: string) => void;
const TransitionContext = createContext<Navigate>(() => {});
export const useTransitionRouter = () => useContext(TransitionContext);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Curtain transition between routes: two panels wipe up, the route changes
 * underneath, then they wipe away. Same-page hash links just scroll.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const firstPath = useRef(pathname);

  const scrollToHash = useCallback(
    (hash: string, immediate = false) => {
      const el = hash ? document.querySelector<HTMLElement>(hash) : null;
      const target = el ?? 0;
      if (lenis) lenis.scrollTo(target, { immediate, duration: 1.8, force: true });
      else if (el) el.scrollIntoView({ behavior: immediate || reduced() ? "auto" : "smooth" });
      else window.scrollTo({ top: 0, behavior: immediate || reduced() ? "auto" : "smooth" });
    },
    [lenis],
  );

  const navigate = useCallback<Navigate>(
    (href, text) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) history.replaceState(null, "", url.hash);
        scrollToHash(url.hash);
        return;
      }
      if (busy.current) return;
      pendingHash.current = url.hash || null;

      if (reduced() || !curtain.current) {
        router.push(url.pathname + url.hash);
        return;
      }

      busy.current = true;
      if (label.current) label.current.textContent = text ?? "";
      const panels = curtain.current.querySelectorAll<HTMLElement>("[data-panel]");
      lenis?.stop();
      gsap
        .timeline({
          defaults: { ease: "expo.inOut", duration: 0.9 },
          onComplete: () => router.push(url.pathname, { scroll: false }),
        })
        .set(curtain.current, { visibility: "visible" })
        .fromTo(panels, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", stagger: 0.08 })
        .fromTo(
          curtain.current.querySelectorAll("[data-curtain-text]"),
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "expo.out" },
          "-=0.35",
        );
    },
    [lenis, router, scrollToHash],
  );

  // Route changed underneath the curtain → reset scroll, then reveal.
  useEffect(() => {
    if (pathname === firstPath.current && !busy.current) return;
    firstPath.current = pathname;
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.start();

    const hash = pendingHash.current;
    pendingHash.current = null;

    const finish = () => {
      ScrollTrigger.refresh();
      // Lenis caches the previous page's height; re-measure before jumping.
      lenis?.resize();
      if (hash) scrollToHash(hash, true);
    };

    if (!busy.current || !curtain.current) {
      requestAnimationFrame(finish);
      return;
    }

    const panels = [...curtain.current.querySelectorAll<HTMLElement>("[data-panel]")].reverse();
    const tl = gsap
      .timeline({
        delay: 0.15,
        defaults: { ease: "expo.inOut", duration: 1 },
        onStart: finish,
        onComplete: () => {
          busy.current = false;
          gsap.set(curtain.current, { visibility: "hidden" });
        },
      })
      .to(curtain.current.querySelectorAll("[data-curtain-text]"), {
        yPercent: -100,
        duration: 0.5,
        ease: "expo.in",
      })
      .to(panels, { clipPath: "inset(0 0 100% 0)", stagger: 0.08 }, "-=0.1");
    return () => {
      tl.kill();
    };
  }, [pathname, lenis, scrollToHash]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95]"
        style={{ visibility: "hidden" }}
      >
        <div data-panel className="absolute inset-0 bg-accent" style={{ clipPath: "inset(100% 0 0 0)" }} />
        <div
          data-panel
          className="absolute inset-0 flex items-center justify-center bg-ink-3"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <div className="overflow-hidden">
            <div data-curtain-text className="display display-m flex items-center gap-[0.15em] text-paper">
              <Mark size="0.6em" spin />
              <span ref={label} />
            </div>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
