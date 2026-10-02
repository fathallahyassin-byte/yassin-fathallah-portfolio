import Image from "next/image";
import { indexOf, pad, type Project } from "@/lib/projects";
import TransitionLink from "./TransitionLink";

/** End-of-case-study hand-off: the next project's name, huge, with its image underneath. */
export default function NextProject({ project }: { project: Project }) {
  return (
    <section aria-label="Réalisation suivante" className="mt-[16vh]">
      <TransitionLink
        href={`/work/${project.slug}`}
        transitionLabel={project.name}
        data-cursor="open"
        className="group relative block overflow-hidden border-t border-line"
      >
        <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-[var(--ease-expo)] group-hover:opacity-100 group-focus-visible:opacity-100">
          <Image
            src={project.images.cover}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-ink/50" />
        </div>
        <div className="px-gutter relative py-[14vh]">
          <p className="label mb-6 flex justify-between text-mute">
            <span>Réalisation suivante — {pad(indexOf(project.slug))}</span>
            <span>{project.category}</span>
          </p>
          <p
            className="display fit-title flex items-end justify-between transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:translate-x-[1vw]"
            style={{ "--fit": (project.name.length + 1) * 0.52 } as React.CSSProperties}
          >
            {project.name}
            <span aria-hidden="true" className="text-[0.3em] text-accent transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:-rotate-45">
              →
            </span>
          </p>
        </div>
      </TransitionLink>
    </section>
  );
}
