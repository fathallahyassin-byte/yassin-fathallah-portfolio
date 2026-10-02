"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { site } from "@/lib/site";
import MagneticButton from "./MagneticButton";
import SectionLabel from "./SectionLabel";
import Mark from "./Mark";

const LINES = [
  { text: "Créons", indent: "" },
  { text: "quelque", indent: "md:pl-[14%]", serif: true },
  { text: "chose de", indent: "md:pl-[4%]" },
  { text: "grand", indent: "md:pl-[30%]", mark: true },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q("[data-big]"), {
          yPercent: 110,
          rotate: 3,
          duration: 1.5,
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-big-wrap]")[0], start: "top 75%", once: true },
        });
        gsap.fromTo(
          q("[data-big-wrap]"),
          { scale: 0.92 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-big-wrap]")[0], start: "top bottom", end: "bottom 70%", scrub: true },
          },
        );
        gsap.from(q("[data-link-line]"), {
          scaleX: 0,
          duration: 1.4,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-links]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // Clipboard can be blocked; fall back to opening the mail client.
      window.location.href = `mailto:${site.email}`;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink pt-[16vh] pb-[10vh]">
      <div className="px-gutter">
        <SectionLabel index="06" className="mb-10">
          Contact
        </SectionLabel>

        <h2 id="contact-title" data-big-wrap className="display origin-bottom-left text-[clamp(4rem,17vw,19rem)] leading-[0.8]">
          {LINES.map((l) => (
            <span key={l.text} className={`mask-accent block overflow-hidden pb-[0.04em] ${l.indent}`}>
              <span data-big className="flex items-end">
                {l.serif ? <span className="serif pr-[0.05em] text-accent">{l.text}</span> : l.text}
                {l.mark && <Mark size="0.22em" filled className="mb-[0.05em] ml-[0.04em] text-accent" />}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-[8vh] grid grid-cols-12 items-center gap-y-12 gap-x-6">
          <p className="lede col-span-12 max-w-[30ch] text-mute md:col-span-5">
            Un stage, une alternance, un projet ou simplement une question ? Écrivez-moi, je réponds{" "}
            <span className="text-paper">rapidement</span>.
          </p>
          <div className="col-span-12 flex md:col-span-3 md:col-start-6 md:justify-center">
            <MagneticButton
              href={`mailto:${site.email}?subject=Contact%20depuis%20le%20portfolio`}
              className="h-36 w-36 rounded-full bg-accent text-ink md:h-44 md:w-44"
            >
              <span className="label block text-center text-[0.75rem] font-semibold">
                Me<br />contacter →
              </span>
            </MagneticButton>
          </div>
        </div>

        <ul data-links className="mt-[10vh]">
          <li className="relative">
            <span data-link-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
            <button
              type="button"
              onClick={copy}
              className="group grid w-full grid-cols-12 items-center gap-4 py-6 text-left"
              aria-label={`Copier l’adresse email ${site.email}`}
            >
              <span className="label col-span-3 text-mute md:col-span-2">Email</span>
              <span className="col-span-9 overflow-hidden text-[clamp(1.3rem,3.6vw,3.4rem)] font-medium tracking-[-0.03em] md:col-span-7">
                <span className="roll">
                  <span className={copied ? "text-accent" : ""}>{copied ? "Copié !" : site.email}</span>
                  <span aria-hidden="true" className="text-accent">
                    {copied ? "Copié !" : "Cliquer pour copier"}
                  </span>
                </span>
              </span>
              <span className="label col-span-12 text-right text-mute md:col-span-3">
                {copied ? <span className="text-accent">● Copié</span> : <span className="group-hover:text-paper">Copier ⧉</span>}
              </span>
            </button>
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Adresse email copiée" : ""}
            </span>
          </li>
          {site.socials.map((s) => (
            <li key={s.label} className="relative">
              <span data-link-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-12 items-center gap-4 py-6"
              >
                <span className="label col-span-3 text-mute md:col-span-2">{s.label}</span>
                <span className="col-span-9 text-[clamp(1.3rem,3.6vw,3.4rem)] font-medium tracking-[-0.03em] transition-[transform,color] duration-700 ease-[var(--ease-expo)] break-words group-hover:translate-x-3 group-hover:text-accent md:col-span-7">
                  {s.handle}
                </span>
                <span className="label col-span-12 flex justify-end text-mute md:col-span-3">
                  <span className="inline-block transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:text-paper">
                    ↗
                  </span>
                  <span className="sr-only"> (ouvre un nouvel onglet)</span>
                </span>
              </a>
            </li>
          ))}
          <li aria-hidden="true" className="h-px bg-line" />
        </ul>
      </div>
    </section>
  );
}
