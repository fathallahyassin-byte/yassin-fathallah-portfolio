import { archiveProjects, featuredProjects, projects, pad } from "@/lib/projects";
import ProjectSection from "./ProjectSection";
import ProjectCard from "./ProjectCard";
import DragStrip from "./DragStrip";
import RevealText from "./RevealText";
import SectionLabel from "./SectionLabel";
import TransitionLink from "./TransitionLink";

export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-ink pt-[14vh] pb-[12vh]">
      <header className="px-gutter mb-[6vh] grid grid-cols-12 items-end gap-6">
        <SectionLabel index="02" className="col-span-12 mb-6">
          Réalisations
        </SectionLabel>
        <h2 id="work-title" className="display display-l col-span-12 lg:col-span-9">
          <RevealText as="span" by="chars" className="block">
            Stages &amp;
          </RevealText>
          <span className="flex items-start gap-[0.1em]">
            <RevealText as="span" by="chars" delay={0.1} className="block">
              projets
            </RevealText>
            <span className="label mt-[0.6em] text-accent">({pad(projects.length)})</span>
          </span>
        </h2>
        <p className="col-span-12 max-w-[32ch] text-mute lg:col-span-3">
          Deux stages en entreprise et cinq projets de formation, menés de la première à la deuxième
          année de BTS SIO SLAM.
        </p>
      </header>

      {featuredProjects.map((p, i) => (
        <ProjectSection key={p.slug} project={p} index={i} variant={i % 2 ? "offset" : "full"} />
      ))}

      <div className="mt-[10vh]">
        <div className="px-gutter mb-8 flex items-end justify-between gap-6">
          <h3 className="display display-m">
            Projets de <span className="serif text-accent">formation</span>
          </h3>
          <p className="label hidden text-mute md:block">
            Glisser ou faire défiler <span className="text-paper">←→</span>
          </p>
        </div>
        <DragStrip label="Projets de formation">
          {archiveProjects.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={projects.indexOf(p)}
              className="w-[78vw] snap-start sm:w-[46vw] lg:w-[29vw]"
            />
          ))}
          <article className="flex w-[78vw] shrink-0 snap-start flex-col justify-between border border-line p-5 sm:w-[46vw] lg:w-[29vw]">
            <p className="label text-mute">{pad(projects.length + 1)} — La suite</p>
            <p className="display text-[clamp(2.4rem,4.4vw,4.6rem)]">
              Licence pro en <span className="serif text-accent">alternance</span>.
            </p>
            <TransitionLink
              href="/#contact"
              className="label group flex items-center justify-between border-t border-line pt-3 text-paper"
            >
              <span className="draw-line">Proposer une alternance</span>
              <span aria-hidden="true" className="transition-transform duration-700 group-hover:translate-x-1.5">
                →
              </span>
            </TransitionLink>
          </article>
        </DragStrip>
      </div>
    </section>
  );
}
