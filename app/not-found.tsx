import TransitionLink from "@/components/TransitionLink";
import Mark from "@/components/Mark";

export default function NotFound() {
  return (
    <section className="px-gutter flex min-h-[100svh] flex-col justify-between pt-[calc(var(--header-h)+2rem)] pb-8">
      <p className="label flex items-center gap-3 text-mute">
        <Mark size={12} className="text-paper" /> Erreur 404 — Page introuvable
      </p>
      <h1 className="display display-xl">
        4<span className="serif text-accent">0</span>4
      </h1>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="lede max-w-[28ch] text-mute">
          Cette page n’existe pas ou a été déplacée. Les réalisations, elles, sont toujours là.
        </p>
        <TransitionLink href="/" transitionLabel="Accueil" className="label group flex items-center gap-3 text-paper">
          <span className="draw-line">Retour à l’accueil</span>
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
