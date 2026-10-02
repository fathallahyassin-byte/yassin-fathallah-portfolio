/**
 * Contenu global du site — tout le site lit ses informations ici.
 */
export const site = {
  name: "Yassin Fathallah",
  firstName: "Yassin", // première ligne du hero
  lastName: "Fathallah", // deuxième ligne du hero
  initials: "YF",
  role: "Développeur web — BTS SIO SLAM",
  roles: ["Développeur web", "BTS SIO — option SLAM", "Session 2026"],
  formation: "BTS SIO — option SLAM",
  session: "Session 2026",
  location: "Rhône-Alpes",
  city: "Lyon",
  timezone: "Europe/Paris",
  coordinates: "45.7640° N — 4.8357° E",
  description:
    "Étudiant en BTS SIO option SLAM, passionné par le développement web et les systèmes d’information.",
  goal: "Poursuite d’études en école d’ingénieur informatique",
  languages: ["Français", "Anglais", "Espagnol"],
  email: "fathallah.yassin@outlook.fr",
  year: 2026,
  // Adresse publique : fournie par Vercel au build, sinon localhost en local.
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
  socials: [
    { label: "LinkedIn", handle: "/in/yassin-fathallah", href: "https://www.linkedin.com/in/yassin-fathallah-462116266/" },
    { label: "GitHub", handle: "@fathallahyassin-byte", href: "https://github.com/fathallahyassin-byte" },
    { label: "Ancien portfolio", handle: "fathallahyassin.wordpress.com", href: "https://fathallahyassin.wordpress.com/" },
  ],
} as const;

export const nav = [
  { label: "Accueil", href: "/" },
  { label: "Réalisations", href: "/#work" },
  { label: "Parcours", href: "/#about" },
  { label: "Synthèse E5", href: "/#e5" },
  { label: "Contact", href: "/#contact" },
] as const;

export const stats = [
  { value: 2, suffix: "", label: "Stages en entreprise" },
  { value: 7, suffix: "", label: "Réalisations" },
  { value: 6, suffix: "", label: "Compétences E5" },
  { value: 3, suffix: "", label: "Langues parlées" },
] as const;

export const qualities = [
  "Autonomie et prise d’initiative",
  "Capacité d’apprentissage rapide",
  "Travail en équipe et communication",
  "Gestion du temps et des priorités",
  "Curieux et passionné par la technologie",
] as const;

export const timeline = [
  {
    year: "2024",
    title: "Entrée en BTS SIO SLAM",
    text: "Début de la formation à Lyon. Premiers projets : la boutique Sneakers, l’application GSB et le TD Git & GitHub.",
  },
  {
    year: "2025",
    title: "Stage 1 — Nalovea",
    text: "Site vitrine e-commerce et newsletter HTML pour une marque de cosmétiques naturels. Puis passage en deuxième année.",
  },
  {
    year: "2026",
    title: "Stage 2 — RPF Lyon",
    text: "Fiches clients en base de données et page web « Espace client digital ». Épreuve E5, session 2026.",
  },
  {
    year: "Après",
    title: "École d’ingénieur",
    text: "Objectif : poursuivre mes études en école d’ingénieur informatique après le BTS.",
  },
] as const;

export const skills = [
  {
    name: "Développement web",
    tools: ["HTML5 / CSS3", "JavaScript", "PHP", "Email HTML"],
    image: "/images/sneakers.webp",
  },
  {
    name: "Bases de données",
    tools: ["MySQL", "Oracle", "SQL / PL-SQL", "Excel"],
    image: "/images/oracle.webp",
  },
  {
    name: "Design & UX",
    tools: ["Responsive", "Charte graphique", "UX", "Shopify"],
    image: "/images/nalovea.webp",
  },
  {
    name: "Versioning",
    tools: ["Git", "GitHub", "Branches & PR", "Terminal / CLI"],
    image: "/images/git-github.webp",
  },
  {
    name: "Gestion de projet",
    tools: ["Scrum", "Méthode agile", "RGPD", "Travail en équipe"],
    image: "/images/lego4scrum.webp",
  },
] as const;
