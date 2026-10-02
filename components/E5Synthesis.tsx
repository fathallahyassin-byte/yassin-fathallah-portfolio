"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { competences, projects } from "@/lib/projects";
import SectionLabel from "./SectionLabel";
import RevealText from "./RevealText";
import TransitionLink from "./TransitionLink";

/**
 * Tableau de synthèse E5 : chaque réalisation croisée avec les 6 compétences
 * du référentiel. Les points se posent un à un à l’arrivée dans la section.
 */
export default function E5Synthesis() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const trigger = { trigger: q("table")[0], start: "top 80%", once: true };
        gsap.from(q("tbody tr"), { opacity: 0, y: 24, duration: 1, stagger: 0.06, scrollTrigger: trigger });
        gsap.from(q("[data-dot]"), {
          scale: 0,
          duration: 0.8,
          ease: "back.out(2.5)",
          stagger: 0.025,
          delay: 0.3,
          scrollTrigger: trigger,
        });
        gsap.from(q("[data-legend]"), {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          scrollTrigger: { trigger: q("[data-legend]")[0], start: "top 90%", once: true },
        });
      });
    },
    { scope: root },
  );

  const totals = competences.map((c) => projects.filter((p) => p.competences.includes(c.code)).length);

  return (
    <section ref={root} id="e5" aria-labelledby="e5-title" className="px-gutter relative bg-ink-2 py-[16vh]">
      <SectionLabel index="05" className="mb-10">
        Synthèse E5
      </SectionLabel>

      <div className="mb-[8vh] grid grid-cols-12 items-end gap-6">
        <h2 id="e5-title" className="display display-l col-span-12 lg:col-span-8">
          <RevealText as="span" by="chars" className="block">
            Tableau de
          </RevealText>
          <span className="serif block text-accent">synthèse</span>
        </h2>
        <p className="col-span-12 max-w-[34ch] text-mute lg:col-span-4">
          Les six compétences du référentiel E5 du BTS SIO, et les stages et projets dans lesquels je les
          ai mobilisées.
        </p>
      </div>

      <ol className="mb-12 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {competences.map((c) => (
          <li key={c.code} data-legend className="flex gap-4 border-t border-line pt-3">
            <span className="display text-3xl leading-none text-accent">{c.code}</span>
            <span className="text-sm text-paper">{c.label}</span>
          </li>
        ))}
      </ol>

      <div
        className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:thin]"
        data-lenis-prevent-horizontal
        tabIndex={0}
        role="region"
        aria-label="Tableau de synthèse des compétences E5 (défilable horizontalement)"
      >
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">
            Compétences E5 mobilisées par réalisation. Un point indique une compétence mobilisée.
          </caption>
          <thead>
            <tr className="label border-b border-paper/40 text-mute">
              <th scope="col" className="py-3 pr-4 font-normal">Réalisation</th>
              <th scope="col" className="py-3 pr-4 font-normal">Type</th>
              <th scope="col" className="py-3 pr-4 font-normal">Période</th>
              {competences.map((c) => (
                <th key={c.code} scope="col" className="w-16 py-3 text-center font-normal" title={c.label}>
                  <span className="text-paper">{c.code}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.slug} className="group border-b border-line transition-colors hover:bg-ink-3">
                <th scope="row" className="py-4 pr-4 font-normal">
                  <TransitionLink
                    href={`/work/${p.slug}`}
                    transitionLabel={p.name}
                    data-cursor="open"
                    className="display text-[clamp(1.4rem,2.2vw,2.2rem)] leading-none transition-colors group-hover:text-accent"
                  >
                    {p.name}
                  </TransitionLink>
                </th>
                <td className="label py-4 pr-4 text-mute">{p.kind}</td>
                <td className="label py-4 pr-4 text-mute">{p.period}</td>
                {competences.map((c) => {
                  const on = p.competences.includes(c.code);
                  return (
                    <td key={c.code} className="py-4 text-center">
                      {on ? (
                        <>
                          <span
                            data-dot
                            aria-hidden="true"
                            className="inline-block h-3 w-3 rounded-full bg-accent shadow-[0_0_18px_rgb(255_77_23_/_0.6)]"
                          />
                          <span className="sr-only">{c.code} mobilisée</span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden="true" className="inline-block h-px w-3 bg-line" />
                          <span className="sr-only">{c.code} non mobilisée</span>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="label text-mute">
              <td colSpan={3} className="py-4 pr-4">
                Total des réalisations
              </td>
              {totals.map((t, i) => (
                <td key={competences[i].code} className="py-4 text-center text-paper">
                  {t}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
