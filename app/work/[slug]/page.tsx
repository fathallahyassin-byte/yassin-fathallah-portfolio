import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { competences, getNextProject, getProject, indexOf, pad, projects, type Mission } from "@/lib/projects";
import ParallaxImage from "@/components/ParallaxImage";
import RevealText from "@/components/RevealText";
import SectionLabel from "@/components/SectionLabel";
import NextProject from "@/components/NextProject";
import Footer from "@/components/Footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.excerpt,
    openGraph: { images: [project.images.cover] },
  };
}

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h3 className="label mb-3 text-accent">{title}</h3>
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3 border-b border-line pb-2 text-paper">
          <span aria-hidden="true" className="text-mute">
            →
          </span>
          {t}
        </li>
      ))}
    </ul>
  </div>
);

function MissionBlock({ mission, index }: { mission: Mission; index: number }) {
  return (
    <section
      aria-labelledby={`m-${mission.code}`}
      className="px-gutter grid grid-cols-12 gap-x-6 gap-y-10 border-t border-line py-[12vh]"
    >
      <div className="col-span-12 md:col-span-3">
        <SectionLabel index={pad(index)}>Mission</SectionLabel>
        <p className="display mt-6 text-[clamp(4rem,9vw,9rem)] leading-[0.8] text-accent">{mission.code}</p>
      </div>
      <div className="col-span-12 md:col-span-9">
        <p className="label mb-3 text-mute">{mission.subtitle}</p>
        <RevealText
          as="h2"
          id={`m-${mission.code}`}
          className="mb-8 text-[clamp(1.9rem,1.2rem+2.6vw,4rem)] leading-[1.02] font-medium tracking-[-0.03em]"
        >
          {mission.title}
        </RevealText>
        <RevealText as="p" className="lede mb-12 max-w-[46ch] text-mute">
          {mission.text}
        </RevealText>

        {mission.challenge && (
          <div className="mb-12 grid gap-px bg-line md:grid-cols-2">
            <div className="bg-ink p-5">
              <h3 className="label mb-3 text-mute">Difficulté rencontrée</h3>
              <p className="text-paper">{mission.challenge.problem}</p>
            </div>
            <div className="bg-ink p-5">
              <h3 className="label mb-3 text-accent">Solution apportée</h3>
              <p className="text-paper">{mission.challenge.solution}</p>
            </div>
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-2">
          <List title={mission.tasksTitle} items={mission.tasks} />
          <List title={mission.toolsTitle} items={mission.tools} />
        </div>

        <div className="mt-10">
          <h3 className="label mb-3 text-mute">Compétences E5 mobilisées</h3>
          <ul className="flex flex-wrap gap-2">
            {mission.skills.map((s) => (
              <li key={s} className="border border-line px-3 py-1.5 text-sm text-paper">
                <span aria-hidden="true" className="mr-2 text-accent">
                  ✔
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(slug);
  const n = pad(indexOf(slug));

  const meta = [
    { k: "Contexte", v: project.context },
    { k: "Période", v: project.period },
    { k: "Rôle", v: project.role },
    { k: "Technologies", v: project.tech.join(" / ") },
  ];

  return (
    <article>
      {/* Titre */}
      <header className="px-gutter pt-[calc(var(--header-h)+10vh)] pb-[6vh]">
        <p className="label mb-6 flex flex-wrap items-center gap-3 text-mute">
          <span className="text-paper">{project.kind}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line" />
          {n} / {pad(projects.length)} — {project.category}
        </p>
        <RevealText
          as="h1"
          by="chars"
          className="display fit-title -ml-[0.04em]"
          start="top 100%"
          delay={0.2}
          style={{ "--fit": project.name.length * 0.52 + 0.1 } as React.CSSProperties}
        >
          {project.name}
        </RevealText>
        <dl className="mt-[6vh] grid grid-cols-2 gap-6 border-t border-line pt-5 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="label mb-1.5 text-mute">{m.k}</dt>
              <dd className="text-paper">{m.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <ParallaxImage
        src={project.images.cover}
        alt={project.alt}
        preload
        immediate
        className="mx-[var(--gutter)] h-[60svh] md:h-[86svh]"
      />

      {/* Présentation */}
      <section className="px-gutter grid grid-cols-12 gap-x-6 gap-y-12 py-[16vh]">
        <SectionLabel index="01" className="col-span-12 md:col-span-3">
          {project.kind === "Stage" ? "L’entreprise" : "Le projet"}
        </SectionLabel>
        <RevealText
          as="p"
          className="col-span-12 text-[clamp(1.6rem,1rem+2.4vw,3.6rem)] leading-[1.08] tracking-[-0.03em] md:col-span-9"
        >
          {project.excerpt}
        </RevealText>
        <div className="col-span-12 grid gap-10 md:col-span-9 md:col-start-4 md:grid-cols-2">
          <RevealText as="p" className="text-mute">
            {project.intro}
          </RevealText>
          <div>
            <h2 className="label mb-3 text-mute">Compétences E5</h2>
            <ul className="grid grid-cols-6 gap-px bg-line" aria-label="Compétences E5 mobilisées">
              {competences.map((c) => {
                const on = project.competences.includes(c.code);
                return (
                  <li
                    key={c.code}
                    title={c.label}
                    className={`flex flex-col items-center gap-2 py-3 ${on ? "bg-ink-3" : "bg-ink"}`}
                  >
                    <span className={`display text-xl ${on ? "text-accent" : "text-mute/40"}`}>{c.code}</span>
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${on ? "bg-accent" : "bg-line"}`}
                    />
                    <span className="sr-only">{on ? `${c.label} : mobilisée` : `${c.label} : non mobilisée`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Missions */}
      {project.missions.map((m, i) => (
        <MissionBlock key={m.code} mission={m} index={i + 2} />
      ))}

      {/* Bilan + visuels */}
      <section aria-label="Bilan" className="px-gutter grid grid-cols-12 gap-x-6 gap-y-[8vh] border-t border-line pt-[12vh]">
        <ParallaxImage
          src={project.images.detail1}
          alt={`${project.name} — visuel de détail`}
          sizes="(max-width: 768px) 100vw, 45vw"
          className="col-span-12 aspect-[4/5] md:col-span-6 lg:col-span-5"
        />
        <div className="col-span-12 flex flex-col justify-end gap-10 md:col-span-5 md:col-start-8">
          <h2 className="display display-m">
            <span className="serif text-accent">Bilan</span>
          </h2>
          {project.learned.length > 0 ? (
            project.learned.map((l) => <List key={l.title} title={l.title} items={l.items} />)
          ) : (
            <List
              title="Compétences E5 travaillées"
              items={competences.filter((c) => project.competences.includes(c.code)).map((c) => `${c.code} — ${c.label}`)}
            />
          )}
        </div>
        <ParallaxImage
          src={project.images.detail2}
          alt={`${project.name} — vue large`}
          className="col-span-12 aspect-[16/9]"
        />
      </section>

      <NextProject project={next} />
      <Footer />
    </article>
  );
}
