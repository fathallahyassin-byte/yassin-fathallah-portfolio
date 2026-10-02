"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { qualities, site, stats, timeline } from "@/lib/site";
import RevealText from "./RevealText";
import SectionLabel from "./SectionLabel";
import Mark from "./Mark";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Portrait: clip reveal + slow parallax
        gsap.fromTo(
          q("[data-portrait]"),
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: q("[data-portrait]")[0], start: "top 80%", once: true },
          },
        );
        gsap.fromTo(
          q("[data-portrait-img]"),
          { yPercent: -10, scale: 1.2 },
          {
            yPercent: 10,
            scale: 1.05,
            ease: "none",
            scrollTrigger: { trigger: q("[data-portrait]")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        // Stats: lines draw, numbers count up
        gsap.from(q("[data-stat-line]"), {
          scaleX: 0,
          duration: 1.4,
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-stats]")[0], start: "top 85%", once: true },
        });
        q("[data-count]").forEach((el, i) => {
          const end = Number(el.dataset.count);
          const o = { v: 0 };
          el.textContent = "0";
          gsap.to(o, {
            v: end,
            duration: 2,
            delay: i * 0.1,
            ease: "power3.out",
            onUpdate: () => (el.textContent = String(Math.round(o.v))),
            scrollTrigger: { trigger: q("[data-stats]")[0], start: "top 85%", once: true },
          });
        });
      });

      // Timeline: pinned horizontal travel on large screens.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const track = q("[data-track]")[0];
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-timeline]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          q("[data-track-progress]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-timeline]")[0],
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
        q("[data-year]").forEach((el) => {
          gsap.from(el, {
            yPercent: 60,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: "left 95%",
              end: "left 55%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative bg-ink-2">
      <div className="px-gutter pt-[16vh] pb-[12vh]">
        <SectionLabel index="03" className="mb-10">
          Parcours
        </SectionLabel>

        <h2 id="about-title" className="display display-xl mb-[8vh] flex flex-wrap items-baseline gap-x-[0.15em]">
          <RevealText as="span" by="chars" className="block">
            Qui
          </RevealText>
          <span className="serif text-[0.42em] text-accent">suis-je ?</span>
        </h2>

        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <figure className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-4">
            <div data-portrait className="relative aspect-[4/5] overflow-hidden bg-ink-3">
              <div data-portrait-img className="absolute inset-0">
                <Image
                  src="/images/portrait.webp"
                  alt={`Portrait de ${site.name}`}
                  fill
                  sizes="(max-width: 768px) 70vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="label mt-3 flex justify-between text-mute">
              <span>Portrait — à remplacer</span>
              <span>{site.city}, {site.location}</span>
            </figcaption>
          </figure>

          <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
            <RevealText as="p" className="lede mb-8 text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] leading-[1.15] tracking-[-0.02em]">
              Je m’appelle {site.name}, étudiant en BTS SIO option SLAM à {site.city}, passionné par le{" "}
              <span className="serif text-accent">développement web</span> et les{" "}
              <span className="serif text-accent">systèmes d’information</span>.
            </RevealText>
            <div className="grid gap-6 text-mute sm:grid-cols-2">
              <RevealText as="p" delay={0.1}>
                Ma formation m’a permis de développer des compétences solides en développement web, en
                gestion des systèmes d’information et en communication digitale.
              </RevealText>
              <RevealText as="p" delay={0.2}>
                Après mon BTS, je souhaite poursuivre mes études en école d’ingénieur informatique pour
                aller plus loin dans la conception d’applications.
              </RevealText>
            </div>

            <div className="mt-12 grid gap-8 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <h3 className="label mb-3 text-accent">Qualités personnelles</h3>
                <ul className="space-y-1.5 text-paper">
                  {qualities.map((q) => (
                    <li key={q} className="flex gap-3">
                      <span aria-hidden="true" className="text-mute">→</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="label mb-3 text-accent">Langues</h3>
                <ul className="space-y-1.5 text-paper">
                  {site.languages.map((l) => (
                    <li key={l} className="flex gap-3">
                      <span aria-hidden="true" className="text-mute">→</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <dl data-stats className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span data-stat-line aria-hidden="true" className="order-0 mb-4 block h-px origin-left bg-paper/40" />
                  <dt className="label order-2 text-mute">{s.label}</dt>
                  <dd className="display order-1 text-[clamp(3rem,5.5vw,5.5rem)] leading-none">
                    <span data-count={s.value}>{s.value}</span>
                    <span className="text-accent">{s.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div data-timeline className="relative overflow-hidden border-t border-line lg:h-[100svh]">
        <div className="px-gutter label flex items-center justify-between pt-8 text-mute lg:absolute lg:inset-x-0 lg:top-[calc(var(--header-h)+1rem)] lg:pt-0">
          <span className="flex items-center gap-3">
            <Mark size={12} className="text-paper" /> Parcours — {timeline[0].year} → aujourd’hui
          </span>
          <span className="hidden lg:inline">Continuer à défiler →</span>
        </div>

        <ol
          data-track
          className="px-gutter flex flex-col gap-14 py-14 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:py-0"
        >
          {timeline.map((t, i) => (
            <li key={t.year} className="relative lg:w-[42vw] lg:pr-[6vw]">
              <span
                data-year
                className={`display block text-[clamp(5rem,15vw,15rem)] leading-[0.8] ${
                  i === timeline.length - 1 ? "text-accent" : "outline-text"
                }`}
              >
                {t.year}
              </span>
              <div className="mt-6 flex max-w-[30rem] gap-4 border-t border-line pt-4">
                <span className="label text-mute">0{i + 1}</span>
                <div>
                  <h3 className="mb-2 text-xl font-medium tracking-tight">{t.title}</h3>
                  <p className="text-mute">{t.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="px-gutter absolute inset-x-0 bottom-8 hidden lg:block">
          <div className="relative h-px bg-line">
            <span data-track-progress className="absolute inset-0 origin-left bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
