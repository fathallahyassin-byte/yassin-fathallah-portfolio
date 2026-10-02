"use client";

import { useLenis } from "./SmoothScroll";
import { site } from "@/lib/site";
import Clock from "./Clock";
import Mark from "./Mark";

export default function Footer() {
  const lenis = useLenis();
  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-ink pt-12">
      <div className="px-gutter label grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 text-mute md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="mb-2 text-paper">{site.name}</p>
          <p>{site.role}</p>
        </div>
        <div className="md:col-span-3">
          <p className="mb-2 text-paper">
            {site.city}, {site.location}
          </p>
          <p>
            Heure locale <Clock className="text-paper" />
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="mb-2 flex items-center gap-2.5 text-paper">
            <span className="pulse-dot" aria-hidden="true" />
            Ouvert aux opportunités
          </p>
          <p>{site.goal}</p>
        </div>
        <ul className="md:col-span-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="draw-line text-paper">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="col-span-2 flex items-start justify-between md:col-span-1 md:justify-end">
          <button type="button" onClick={toTop} className="group flex items-center gap-2 text-paper" aria-label="Retour en haut">
            <span className="roll">
              <span>Haut</span>
              <span aria-hidden="true">Haut</span>
            </span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </div>

      {/* Oversized signature, cropped by the page edge */}
      <div aria-hidden="true" className="relative mt-16 select-none">
        <p
          className="display px-gutter leading-[0.78] whitespace-nowrap text-ink-3 [-webkit-text-stroke:1px_rgb(242_240_235_/_0.16)]"
          // ≈0.47em per condensed capital: the full name spans the page width.
          style={{ fontSize: `min(24rem, calc((100vw - 2 * var(--gutter)) / ${(site.name.length * 0.47).toFixed(2)}))` }}
        >
          <span>{site.name}</span>
        </p>
        <div className="px-gutter label flex items-center justify-between gap-4 py-4 text-mute md:absolute md:right-0 md:bottom-0 md:left-0">
          <span className="flex items-center gap-2">
            <Mark size={12} className="text-paper" /> ©{site.year} — {site.formation} · {site.session}
          </span>
          <span>Conçu et développé à la main</span>
        </div>
      </div>
    </footer>
  );
}
