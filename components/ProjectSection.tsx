"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad, projects, type Project } from "@/lib/projects";
import TransitionLink from "./TransitionLink";
import RevealText from "./RevealText";

type Props = { project: Project; index: number; variant?: "full" | "offset" };

/**
 * Near full-screen feature. The frame opens from an inset clip-path while the
 * image settles from 1.25 → 1, then drifts in parallax.
 */
export default function ProjectSection({ project, index, variant = "full" }: Props) {
  const root = useRef<HTMLElement>(null);
  const n = pad(index + 1);
  const total = pad(projects.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const frame = root.current!.querySelector("[data-frame]");
        const img = root.current!.querySelector("[data-img]");
        gsap.fromTo(
          frame,
          { clipPath: "inset(14% 12% 14% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top 95%", end: "top 25%", scrub: 0.5 },
          },
        );
        gsap.fromTo(
          img,
          { scale: 1.3, yPercent: -6 },
          {
            scale: 1,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from(root.current!.querySelectorAll("[data-meta]"), {
          opacity: 0,
          y: 24,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current!.querySelector("[data-meta-row]"), start: "top 92%", once: true },
        });
      });
    },
    { scope: root },
  );

  const offset = variant === "offset";

  return (
    <article ref={root} className="px-gutter relative py-[7vh] md:py-[10vh]" aria-labelledby={`p-${project.slug}`}>
      <div className={offset ? "md:ml-[22%]" : ""}>
        <TransitionLink
          href={`/work/${project.slug}`}
          transitionLabel={project.name}
          data-cursor="view"
          className="group relative block"
          aria-label={`Voir la réalisation : ${project.name}`}
        >
          <div
            data-frame
            className={`relative overflow-hidden bg-ink-3 ${offset ? "h-[62svh] md:h-[74svh]" : "h-[62svh] md:h-[86svh]"}`}
          >
            <div data-img className="absolute inset-0 will-change-transform">
              <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-[1.05]">
                <Image src={project.images.cover} alt={project.alt} fill sizes="100vw" className="object-cover" />
              </div>
            </div>

            {/* Overlay: darkens the base for type, accent wash on hover */}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-accent mix-blend-color [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-1000 ease-[var(--ease-expo)] group-hover:[clip-path:inset(0_0_0_0)]"
              style={{ opacity: 0.35 }}
            />

            <div className="label absolute inset-x-0 top-0 flex justify-between p-4 text-paper md:p-6">
              <span>
                {n} <span className="text-mute">/ {total}</span>
              </span>
              <span className="text-right">
                {project.category}
                <br />
                <span className="text-mute">{project.period}</span>
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-4 md:p-6">
              <h3 id={`p-${project.slug}`} className="display display-l text-paper">
                <span className="block transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:-translate-y-[0.06em] group-hover:translate-x-[0.04em]">
                  {project.name}
                </span>
              </h3>
              <span className="label mb-[0.6em] hidden items-center gap-3 text-paper md:flex">
                <span className="roll">
                  <span>Voir le détail</span>
                  <span aria-hidden="true">Voir le détail</span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 transition-[background-color,border-color,transform] duration-700 group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </TransitionLink>

        <div data-meta-row className="mt-5 grid grid-cols-12 gap-4 md:mt-6">
          <p data-meta className="label col-span-12 text-mute md:col-span-3">
            <span className="text-accent">↳</span> {project.role}
          </p>
          <RevealText as="p" className="col-span-12 max-w-[42ch] text-paper md:col-span-5 md:col-start-5 md:row-start-1" start="top 95%">
            {project.excerpt}
          </RevealText>
          <ul data-meta className="label col-span-12 flex flex-wrap gap-x-3 text-mute md:col-span-3 md:col-start-10 md:row-start-1 md:justify-end">
            {project.tech.map((t, i) => (
              <li key={t}>
                {i > 0 && <span className="mr-3 text-line">/</span>}
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
