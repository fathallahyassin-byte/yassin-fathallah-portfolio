# Portfolio — Yassin Fathallah · BTS SIO SLAM

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Remplacer le contenu

| Quoi | Où |
| --- | --- |
| Nom, formation, ville, email, réseaux | `lib/site.ts` (valeurs `PLACEHOLDER`) |
| Stats, qualités, parcours, compétences | `lib/site.ts` |
| Stages & projets, missions, compétences E5 | `lib/projects.ts` |
| Images | `public/images/{slug}.webp`, `{slug}-detail-1.webp` (4:5), `{slug}-detail-2.webp` (16:9) |

Les visuels actuels sont générés par `node scripts/generate-visuals.mjs`. Pour mettre vos
propres images, gardez simplement les mêmes noms de fichiers (WebP ~2400px de large) ;
Next.js sert automatiquement des variantes AVIF/WebP redimensionnées.

## Direction artistique

- **Couleurs** : noir `#050505 / #0A0A0A / #111111`, papier `#F2F0EB`, signal `#FF4D17`
  (tokens dans `app/globals.css`).
- **Typo** : Archivo condensé (display), Instrument Serif italique (accents éditoriaux),
  JetBrains Mono (labels).
- **Signature** : l’anneau + satellite (`components/Mark.tsx`) — loader, nav, labels de
  section, point final du nom, footer, favicon.
- **Courbes** : `expo.out` / `expo.inOut` partout.

## Architecture

```
app/                 layout (providers), page d’accueil, /work/[slug], 404
components/
  SmoothScroll       Lenis ↔ GSAP ticker, contexte useLenis
  PageTransition     rideau entre les routes + TransitionLink
  Loader             compteur 000→100, puis lève le rideau (lib/intro.ts)
  CustomCursor       data-cursor="view|open|drag|hover|hide", désactivé au tactile
  Navbar / Menu      nav fixe + menu plein écran avec preview projets
  Hero / HeroCanvas  nom géant + shader WebGL (sans Three.js)
  Intro / Marquee    manifeste mot-à-mot au scroll, bandeau sensible à la vélocité
  Work               ProjectSection (plein écran) + ProjectCard dans DragStrip
  About / Skills     « en bref », compteurs, timeline horizontale épinglée, compétences
  E5Synthesis        tableau de synthèse réalisations × compétences C1–C6
  Contact / Footer   CTA magnétique, copie de l’email, disponibilité
  RevealText / ParallaxImage / MagneticButton / SectionLabel / Clock / NextProject
hooks/               useMediaQuery, useMousePosition, useScrollProgress, useLenis
```

## Accessibilité & performance

- `prefers-reduced-motion` : pas de loader, pas de Lenis, pas de reveals ; shader figé.
- Curseur custom et effets de survol uniquement sur pointeur fin.
- Shader rendu à 50 % (35 % sur mobile, moins d’octaves), en pause hors écran.
- Animations sur `transform`, `opacity` et `clip-path` ; aucun re-render React au scroll.
- Lien d’évitement, focus visibles, menu en `dialog` (Échap pour fermer), régions `aria-live`.
