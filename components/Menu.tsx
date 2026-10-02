"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/lib/site";
import { projects, pad } from "@/lib/projects";
import { useTransitionRouter } from "./PageTransition";
import Mark from "./Mark";

type Props = { open: boolean; onClose: () => void };

export default function Menu({ open, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const navigate = useTransitionRouter();
  const [preview, setPreview] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(root.current, { visibility: "visible" })
        .fromTo(
          q("[data-menu-bg]"),
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "expo.inOut", stagger: 0.07 },
        )
        .fromTo(q("[data-menu-link]"), { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.06 }, 0.45)
        .fromTo(q("[data-menu-fade]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.04 }, 0.6)
        .fromTo(q("[data-menu-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.05 }, 0.5);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      t.timeScale(1).play();
      root.current?.querySelector<HTMLElement>("[data-menu-link]")?.focus({ preventScroll: true });
    } else if (t.progress() > 0) {
      t.timeScale(1.6).reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (href: string, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    const samePage = new URL(href, location.href).pathname === location.pathname;
    // Let the menu fold away before scrolling on the same page.
    setTimeout(() => navigate(href, label), samePage ? 650 : 0);
  };

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu du site"
      inert={!open}
      className="fixed inset-0 z-[85]"
      style={{ visibility: "hidden" }}
      data-lenis-prevent
    >
      <div data-menu-bg className="absolute inset-0 bg-accent" />
      <div data-menu-bg className="absolute inset-0 bg-ink-2" />

      <div className="px-gutter relative grid h-full grid-cols-12 gap-x-6 overflow-y-auto pt-[calc(var(--header-h)+4vh)] pb-8">
        <nav aria-label="Navigation principale" className="col-span-12 lg:col-span-7">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} className="relative">
                <span data-menu-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
                <div className="mask-accent overflow-hidden text-[clamp(2.8rem,7.2vw,8rem)]">
                  <a
                    data-menu-link
                    href={item.href}
                    onClick={go(item.href, item.label)}
                    className="group flex items-start gap-4 py-1 md:gap-8"
                  >
                    <span className="label mt-[1.4em] w-8 text-mute transition-colors group-hover:text-accent">{pad(i + 1)}</span>
                    <span className="display text-[clamp(2.8rem,7.2vw,8rem)] transition-[transform,color] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-4 group-hover:text-accent group-focus-visible:text-accent">
                      {item.label}
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <aside className="col-span-12 mt-10 flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <div>
            <p data-menu-fade className="label mb-4 text-mute">
              Réalisations
            </p>
            <ul onMouseLeave={() => setPreview(null)}>
              {projects.map((p, i) => (
                <li key={p.slug} data-menu-fade>
                  <a
                    href={`/work/${p.slug}`}
                    onClick={go(`/work/${p.slug}`, p.name)}
                    onMouseEnter={() => setPreview(i)}
                    onFocus={() => setPreview(i)}
                    data-cursor="open"
                    className="group flex items-baseline justify-between border-b border-line py-2.5"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="label text-mute">{pad(i + 1)}</span>
                      <span className="text-lg font-medium uppercase tracking-tight transition-colors group-hover:text-accent">
                        {p.name}
                      </span>
                    </span>
                    <span className="label text-mute">{p.kind}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div
              data-menu-fade
              aria-hidden="true"
              className="relative mt-6 hidden aspect-[16/10] overflow-hidden bg-ink-3 lg:block"
            >
              {projects.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.images.cover}
                  alt=""
                  fill
                  sizes="30vw"
                  className="object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]"
                  style={{
                    opacity: preview === i ? 1 : 0,
                    transform: preview === i ? "scale(1)" : "scale(1.12)",
                  }}
                />
              ))}
              <span
                className="label absolute inset-0 flex items-center justify-center text-mute transition-opacity duration-500"
                style={{ opacity: preview === null ? 1 : 0 }}
              >
                <Mark size={28} spin />
              </span>
            </div>
          </div>

          <div data-menu-fade className="label grid grid-cols-2 gap-6 text-mute">
            <div>
              <p className="mb-2">Écrire</p>
              <a href={`mailto:${site.email}`} className="draw-line text-paper normal-case">
                {site.email}
              </a>
            </div>
            <ul>
              <li className="mb-2">Ailleurs</li>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="draw-line text-paper">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
