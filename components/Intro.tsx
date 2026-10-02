"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import SectionLabel from "./SectionLabel";
import Mark from "./Mark";

/** Manifesto — one huge sentence that comes into focus word by word as you scroll. */
export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: MOTION_OK, desktop: "(min-width: 1024px)" },
        (ctx) => {
          const { motion, desktop } = ctx.conditions!;
          if (!motion) return;
          const split = SplitText.create(text.current, {
            type: "words",
            // Words are inline-blocks: without this they inherit the paragraph’s text-indent and overlap.
            wordsClass: "indent-0 will-change-[opacity,filter,transform]",
          });
          gsap.fromTo(
            split.words,
            { opacity: 0.1, yPercent: 35, filter: desktop ? "blur(10px)" : "none" },
            {
              opacity: 1,
              yPercent: 0,
              filter: "blur(0px)",
              ease: "none",
              stagger: 0.06,
              scrollTrigger: { trigger: text.current, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
            },
          );
          gsap.to("[data-spin]", {
            rotate: 360,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          });
          gsap.from("[data-intro-fade]", {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-intro-fade]", start: "top 90%", once: true },
          });
          return () => split.revert();
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="manifesto" aria-label="Manifeste" className="px-gutter relative bg-ink py-[18vh] md:py-[24vh]">
      <SectionLabel index="01" className="mb-12 md:mb-20">
        Manifeste
      </SectionLabel>

      <p
        ref={text}
        className="max-w-[18ch] text-[clamp(2.3rem,6.4vw,7.5rem)] leading-[0.98] font-medium tracking-[-0.035em] [text-indent:12%] md:max-w-[19ch]"
      >
        Je transforme des <span className="serif text-accent">besoins</span> en sites et applications{" "}
        <span className="serif">utiles</span> — là où le code, les données et le design avancent{" "}
        <span className="serif text-accent">ensemble.</span>
      </p>

      <div className="mt-20 grid grid-cols-12 gap-6 md:mt-32">
        <div data-intro-fade className="col-span-12 text-paper md:col-span-3">
          <span data-spin className="inline-block">
            <Mark size={88} />
          </span>
        </div>
        <p data-intro-fade className="col-span-12 max-w-[34ch] text-mute md:col-span-4 md:col-start-5">
          Étudiant en <span className="text-paper">BTS SIO option SLAM</span>, je me forme au
          développement web, à la gestion des systèmes d’information et à la communication digitale —
          en projet comme en entreprise.
        </p>
        <p data-intro-fade className="col-span-12 max-w-[34ch] text-mute md:col-span-4">
          Deux stages, deux secteurs très différents : la cosmétique en ligne chez Nalovea, la
          rénovation du bâtiment chez RPF Lyon. Prochaine étape :{" "}
          <span className="text-paper">l’école d’ingénieur informatique</span>.
        </p>
      </div>
    </section>
  );
}
