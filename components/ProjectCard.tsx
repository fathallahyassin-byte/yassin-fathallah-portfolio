"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { pad, type Project } from "@/lib/projects";
import TransitionLink from "./TransitionLink";

type Props = { project: Project; index: number; className?: string };

/** Archive card: image drifts with the pointer, info and accent wash slide in on hover. */
export default function ProjectCard({ project, index, className = "" }: Props) {
  const media = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(media.current, { x: x * -22, y: y * -22, duration: 1, ease: "power3.out", overwrite: "auto" });
  };
  const onLeave = () => gsap.to(media.current, { x: 0, y: 0, duration: 1.2, ease: "expo.out", overwrite: "auto" });

  return (
    <article className={`shrink-0 ${className}`}>
      <TransitionLink
        href={`/work/${project.slug}`}
        transitionLabel={project.name}
        data-cursor="open"
        draggable={false}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group block"
        aria-label={`Ouvrir : ${project.name}, ${project.category}, ${project.period}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
          <div ref={media} className="absolute -inset-[5%] will-change-transform">
            <Image
              src={project.images.detail1}
              alt={project.alt}
              fill
              sizes="(max-width: 768px) 80vw, 32vw"
              draggable={false}
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-40 transition-opacity duration-700 group-hover:opacity-100"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-accent mix-blend-color [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-1000 ease-[var(--ease-expo)] group-hover:[clip-path:inset(0_0_0%_0)]"
            style={{ opacity: 0.3 }}
          />

          <div className="label absolute inset-x-0 top-0 flex justify-between p-4 text-paper">
            <span>{pad(index + 1)}</span>
            <span>{project.period}</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 overflow-hidden p-4">
            <p className="translate-y-[120%] text-sm text-paper opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              {project.excerpt}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-3">
          <div>
            <h3 className="display text-[clamp(1.8rem,3vw,2.8rem)] leading-[0.9]">
              <span className="roll">
                <span>{project.name}</span>
                <span aria-hidden="true" className="text-accent">
                  {project.name}
                </span>
              </span>
            </h3>
            <p className="label mt-1.5 text-mute">
              {project.category} — {project.tech[0]}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="text-xl transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:text-accent"
          >
            ↗
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
