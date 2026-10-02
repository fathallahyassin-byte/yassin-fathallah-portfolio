/**
 * Réalisations : stages et projets de formation (BTS SIO SLAM).
 * Les visuels sont dans /public/images/{slug}.webp, {slug}-detail-1.webp (4:5)
 * et {slug}-detail-2.webp (16:9) — remplacez-les par vos captures d’écran.
 */

/** Les 6 compétences du référentiel E5. */
export const competences = [
  { code: "C1", label: "Gérer le patrimoine informatique" },
  { code: "C2", label: "Répondre aux incidents et aux demandes d’assistance" },
  { code: "C3", label: "Développer la présence en ligne de l’organisation" },
  { code: "C4", label: "Travailler en mode projet" },
  { code: "C5", label: "Mettre à disposition un service informatique" },
  { code: "C6", label: "Organiser son développement professionnel" },
] as const;

export type CompetenceCode = (typeof competences)[number]["code"];

export type Mission = {
  code: string;
  title: string;
  subtitle: string;
  text: string;
  tasksTitle: string;
  tasks: string[];
  toolsTitle: string;
  tools: string[];
  /** Compétences E5 mobilisées, telles que formulées dans le référentiel */
  skills: string[];
  challenge?: { problem: string; solution: string };
};

export type Project = {
  slug: string;
  name: string;
  kind: "Stage" | "Projet";
  category: string;
  period: string;
  context: string;
  role: string;
  tech: string[];
  excerpt: string;
  intro: string;
  missions: Mission[];
  learned: { title: string; items: string[] }[];
  competences: CompetenceCode[];
  featured: boolean;
  images: { cover: string; detail1: string; detail2: string };
  alt: string;
};

const img = (slug: string) => ({
  cover: `/images/${slug}.webp`,
  detail1: `/images/${slug}-detail-1.webp`,
  detail2: `/images/${slug}-detail-2.webp`,
});

export const projects: Project[] = [
  {
    slug: "nalovea",
    name: "Nalovea",
    kind: "Stage",
    category: "Stage 1 — E-commerce",
    period: "1re année",
    context: "Cosmétique naturelle · E-commerce",
    role: "Stagiaire développeur web",
    tech: ["HTML5 / CSS3", "Email HTML", "Shopify", "GitHub"],
    excerpt:
      "Une page d’accueil e-commerce et une newsletter client pour une marque française de cosmétiques naturels.",
    intro:
      "Nalovea est une entreprise française spécialisée dans la vente en ligne de cosmétiques naturels : masque anti-points noirs, patchs anti-acné, sérum réducteur de pores, savon à l’Aloé Vera. Elle mise sur la fidélisation client grâce à une communication digitale régulière.",
    missions: [
      {
        code: "T1",
        title: "Site vitrine e-commerce",
        subtitle: "Développement front-end HTML / CSS",
        text: "J’ai participé au développement de la présence en ligne de Nalovea. L’objectif : une page d’accueil e-commerce attrayante et fonctionnelle qui met en avant les produits phares de la marque.",
        tasksTitle: "Missions réalisées",
        tasks: [
          "Création d’une page d’accueil responsive en HTML5 et CSS3",
          "Mise en avant des best-sellers avec prix et descriptions",
          "Intégration d’une section promotions avec codes de réduction",
          "Respect de la charte graphique de la marque",
          "Versioning du code source via GitHub",
        ],
        toolsTitle: "Technologies",
        tools: ["HTML5 / CSS3", "Design responsive", "GitHub", "Shopify"],
        skills: [
          "Développer la présence en ligne de l’organisation",
          "Référencer les services en ligne",
          "Participer à l’évolution d’un site web",
          "Travailler en mode projet",
        ],
      },
      {
        code: "T2",
        title: "Newsletter clients fidélisés",
        subtitle: "Email HTML responsive — promos & nouveautés",
        text: "Nalovea voulait communiquer régulièrement avec sa clientèle fidélisée. J’ai conçu et développé un template d’email HTML professionnel, compatible avec les principaux clients mail du marché.",
        tasksTitle: "Missions réalisées",
        tasks: [
          "Template HTML/CSS compatible Gmail, Outlook et Apple Mail",
          "Section offres promotionnelles avec code promo (-30 %)",
          "Présentation des nouveaux produits de la gamme",
          "Section conseils routine beauté",
          "Respect du RGPD (désabonnement, mentions légales)",
        ],
        toolsTitle: "Contenu & technique",
        tools: ["Email HTML", "CSS inline", "Code promo abonnés", "Offres flash"],
        skills: [
          "Développer la présence en ligne de l’organisation",
          "Valoriser l’image de l’organisation sur les médias numériques",
          "Organiser son développement professionnel",
        ],
      },
    ],
    learned: [
      {
        title: "Compétences acquises",
        items: [
          "Développer une interface web e-commerce fonctionnelle",
          "Concevoir des emails HTML compatibles multi-clients",
          "Versionner mon code avec GitHub",
          "M’autoformer via des ressources en ligne (Grafikart)",
          "Respecter les contraintes juridiques du RGPD",
        ],
      },
      {
        title: "Points forts",
        items: [
          "Travail autonome dans un contexte professionnel réel",
          "Livraison de productions directement utilisables",
          "Montée en compétences en développement front-end",
          "Compréhension des enjeux de la communication digitale",
        ],
      },
    ],
    competences: ["C3", "C4", "C6"],
    featured: true,
    images: img("nalovea"),
    alt: "Visuel abstrait : une sphère claire et douce, éclairée comme une photo produit",
  },
  {
    slug: "rpf-lyon",
    name: "RPF Lyon",
    kind: "Stage",
    category: "Stage 2 — BTP & rénovation",
    period: "2e année",
    context: "Rénovation du Patrimoine Français · Lyon (69)",
    role: "Stagiaire développeur web & données",
    tech: ["Base de données", "Excel", "HTML5 / CSS3", "RGPD"],
    excerpt:
      "Digitalisation des fiches clients et création d’une page web pour un nouveau service, sans accès au CMS de l’entreprise.",
    intro:
      "Rénovation du Patrimoine Français (RPF) est une entreprise lyonnaise spécialisée dans la rénovation énergétique : ravalement de façades, charpente, toiture, menuiseries, isolation thermique et maçonnerie. Implantée à Lyon depuis plus de 15 ans, elle accompagne particuliers et professionnels.",
    missions: [
      {
        code: "T1",
        title: "Gestion des fiches clients",
        subtitle: "Saisie et intégration en base de données",
        text: "RPF gère un portefeuille de clients particuliers et professionnels dans la région lyonnaise. Pour digitaliser cette gestion, j’ai saisi, mis à jour et organisé les fiches clients dans leur base de données interne.",
        tasksTitle: "Missions réalisées",
        tasks: [
          "Recensement et saisie des informations clients",
          "Mise à jour des fiches existantes et contrôle qualité",
          "Organisation par secteur géographique et type de prestation",
          "Vérification de la conformité RGPD des données",
          "Export et génération de rapports clients (Excel)",
        ],
        toolsTitle: "Outils",
        tools: ["Base de données", "Microsoft Excel", "Interface de gestion RPF", "Contrôle qualité"],
        skills: [
          "Gérer le patrimoine informatique",
          "Recenser et identifier les ressources numériques",
          "Vérifier les niveaux d’habilitation",
          "Respecter les règles d’utilisation des ressources (RGPD)",
          "Organiser son développement professionnel",
        ],
      },
      {
        code: "T2",
        title: "Page « Espace client digital »",
        subtitle: "Page web autonome HTML / CSS",
        text: "RPF lançait un service en ligne permettant aux clients de suivre l’avancement de leur chantier. J’ai créé une page web dédiée, intégrable au site de l’entreprise.",
        tasksTitle: "Contenu de la page",
        tasks: [
          "Présentation du nouveau service « Espace client digital »",
          "Description des 6 fonctionnalités principales",
          "Fonctionnement expliqué en 3 étapes",
          "Maquette d’une fiche client type",
          "Formulaire de contact et footer mentions légales",
        ],
        toolsTitle: "Technologies",
        tools: ["HTML5 / CSS3 from scratch", "Design responsive", "Charte graphique RPF", "Page autonome intégrable"],
        skills: [
          "Développer la présence en ligne de l’organisation",
          "Participer à l’évolution d’un site web",
          "Mettre à disposition un service informatique",
          "Déployer un service",
          "Travailler en mode projet",
        ],
        challenge: {
          problem:
            "Je n’avais pas accès au thème WordPress du site principal : impossible de modifier les templates existants du CMS.",
          solution:
            "J’ai développé une page autonome en HTML5 et CSS3, indépendante du CMS, intégrable dans n’importe quel environnement web et fidèle à l’identité visuelle de RPF.",
        },
      },
    ],
    learned: [
      {
        title: "Compétences acquises",
        items: [
          "Gérer des données clients en base de données",
          "Travailler avec des contraintes d’accès aux outils",
          "Créer une solution technique sans ressources CMS",
          "Respecter les normes RGPD",
        ],
      },
      {
        title: "Difficultés surmontées",
        items: [
          "Pas d’accès au CMS de l’entreprise",
          "Adaptation à un secteur non informatique",
          "Volume important de fiches clients à traiter",
          "Communication avec les équipes terrain",
        ],
      },
    ],
    competences: ["C1", "C3", "C4", "C5", "C6"],
    featured: true,
    images: img("rpf-lyon"),
    alt: "Visuel abstrait : un bâtiment monolithique au crépuscule, horizon orange",
  },
  {
    slug: "gsb",
    name: "GSB",
    kind: "Projet",
    category: "Application de gestion des frais",
    period: "1re → 2e année",
    context: "Galaxy Swiss Bourdin · entreprise fictive",
    role: "Développeur full-stack",
    tech: ["PHP", "MySQL", "HTML / CSS", "JavaScript"],
    excerpt:
      "Une application de gestion des frais de déplacement : saisie par les visiteurs médicaux, validation par les comptables.",
    intro:
      "Projet fil rouge du BTS SIO : une application de gestion des frais de déplacement pour l’entreprise fictive Galaxy Swiss Bourdin (GSB). Commencé en première année, approfondi en deuxième année.",
    missions: [
      {
        code: "P1",
        title: "Partie 1 — Gestion des frais",
        subtitle: "1re année",
        text: "Créer un outil permettant aux visiteurs médicaux de saisir leurs notes de frais, et aux comptables de les valider.",
        tasksTitle: "Fonctionnalités",
        tasks: [
          "Saisie des notes de frais par les visiteurs",
          "Validation par le service comptable",
          "Gestion des utilisateurs et des rôles",
          "Base de données relationnelle",
        ],
        toolsTitle: "Technologies",
        tools: ["PHP", "MySQL", "HTML / CSS"],
        skills: [
          "Gérer le patrimoine informatique",
          "Mettre à disposition un service informatique",
          "Travailler en mode projet",
        ],
      },
      {
        code: "P2",
        title: "Partie 2 — Fonctionnalités avancées",
        subtitle: "2e année",
        text: "Poursuite du développement : nouvelles fonctionnalités, amélioration des modules existants, avec l’accent sur la gestion avancée et le reporting.",
        tasksTitle: "Nouvelles fonctionnalités",
        tasks: [
          "Amélioration de l’interface utilisateur",
          "Génération de rapports avancés",
          "Optimisation des requêtes en base de données",
          "Sécurisation des accès et des données",
        ],
        toolsTitle: "Technologies",
        tools: ["PHP", "MySQL", "HTML / CSS", "JavaScript"],
        skills: [
          "Gérer le patrimoine informatique",
          "Mettre à disposition un service informatique",
          "Travailler en mode projet",
          "Organiser son développement professionnel",
        ],
      },
    ],
    learned: [
      {
        title: "Ce que le projet m’a apporté",
        items: [
          "Concevoir une base de données relationnelle",
          "Gérer des rôles et des droits d’accès",
          "Faire évoluer une application existante",
          "Optimiser et sécuriser des requêtes",
        ],
      },
    ],
    competences: ["C1", "C4", "C5", "C6"],
    featured: true,
    images: img("gsb"),
    alt: "Visuel abstrait : un réseau de points reliés autour d’un noyau orange, comme des données liées",
  },
  {
    slug: "sneakers",
    name: "Sneakers",
    kind: "Projet",
    category: "Application e-commerce",
    period: "1re année",
    context: "Projet de formation",
    role: "Développeur front-end",
    tech: ["HTML5 / CSS3", "JavaScript", "Responsive"],
    excerpt:
      "Une boutique en ligne de sneakers : catalogue produits, panier et gestion des commandes.",
    intro:
      "Développement d’une application web de vente de sneakers en ligne : un site e-commerce fonctionnel avec catalogue, panier et gestion des commandes.",
    missions: [
      {
        code: "P1",
        title: "Boutique en ligne",
        subtitle: "Développement web — 1re année",
        text: "Concevoir le parcours d’achat complet, de la fiche produit jusqu’à la commande, sur mobile comme sur desktop.",
        tasksTitle: "Fonctionnalités",
        tasks: [
          "Catalogue produits avec fiches détaillées",
          "Système de panier d’achat",
          "Gestion des commandes",
          "Interface responsive mobile et desktop",
        ],
        toolsTitle: "Technologies",
        tools: ["HTML5 / CSS3", "JavaScript", "Design responsive"],
        skills: [
          "Développer la présence en ligne",
          "Travailler en mode projet",
          "Mettre à disposition un service informatique",
        ],
      },
    ],
    learned: [],
    competences: ["C3", "C4", "C5"],
    featured: false,
    images: img("sneakers"),
    alt: "Visuel abstrait : des lignes de contour fluides, l’une soulignée en orange",
  },
  {
    slug: "oracle",
    name: "Oracle",
    kind: "Projet",
    category: "TD Oracle Database",
    period: "2e année",
    context: "TD de formation",
    role: "Base de données",
    tech: ["Oracle Database", "SQL", "PL/SQL", "SQL Developer"],
    excerpt:
      "Prise en main d’Oracle Database : création de tables, contraintes, relations et requêtes SQL.",
    intro:
      "Découverte d’Oracle Database, l’un des SGBD relationnels les plus utilisés en entreprise : création de bases, manipulation de tables et écriture de requêtes SQL.",
    missions: [
      {
        code: "P1",
        title: "TD Oracle Database",
        subtitle: "Base de données — 2e année",
        text: "Pratiquer la création et l’interrogation d’une base de données sous environnement Oracle.",
        tasksTitle: "Ce que j’ai appris",
        tasks: [
          "Prise en main de l’interface Oracle",
          "Création et gestion de tables",
          "Requêtes SQL : SELECT, INSERT, UPDATE, DELETE",
          "Contraintes et relations entre tables",
          "Manipulation et interrogation de données",
        ],
        toolsTitle: "Technologies",
        tools: ["Oracle Database", "SQL", "PL/SQL", "Oracle SQL Developer"],
        skills: [
          "Gérer le patrimoine informatique",
          "Recenser et identifier les ressources numériques",
          "Organiser son développement professionnel",
        ],
      },
    ],
    learned: [],
    competences: ["C1", "C6"],
    featured: false,
    images: img("oracle"),
    alt: "Visuel abstrait : un disque noir entouré d’un anneau lumineux",
  },
  {
    slug: "git-github",
    name: "Git & GitHub",
    kind: "Projet",
    category: "TD versioning",
    period: "1re année",
    context: "TD de formation",
    role: "Versioning",
    tech: ["Git", "GitHub", "Terminal / CLI"],
    excerpt:
      "Les bases de la gestion de versions : dépôts, branches, commits et pull requests.",
    intro:
      "Apprentissage du versioning de code avec Git et GitHub : création de dépôts, branches, commits et pull requests, puis collaboration en équipe.",
    missions: [
      {
        code: "P1",
        title: "TD Git & GitHub",
        subtitle: "Versioning de code — 1re année",
        text: "Comprendre et maîtriser les bases de la gestion de versions, en solo puis en équipe.",
        tasksTitle: "Ce que j’ai appris",
        tasks: [
          "Créer et gérer un dépôt GitHub",
          "Travailler avec des branches",
          "Effectuer des commits et des pull requests",
          "Collaborer sur un projet en équipe",
        ],
        toolsTitle: "Outils",
        tools: ["Git", "GitHub", "Terminal / CLI"],
        skills: ["Gérer le patrimoine informatique", "Organiser son développement professionnel"],
      },
    ],
    learned: [],
    competences: ["C1", "C6"],
    featured: false,
    images: img("git-github"),
    alt: "Visuel abstrait : un graphe de branches Git, une branche orange fusionnée dans la principale",
  },
  {
    slug: "lego4scrum",
    name: "Lego4Scrum",
    kind: "Projet",
    category: "Atelier méthode agile",
    period: "2e année",
    context: "Atelier de formation",
    role: "Gestion de projet",
    tech: ["Scrum", "Agile", "Gestion itérative"],
    excerpt:
      "La méthode Scrum apprise avec des briques Lego : sprints, rôles et gestion de projet itérative.",
    intro:
      "Simulation de la méthode agile Scrum à travers un atelier ludique en briques Lego, pour comprendre concrètement les sprints et les rôles d’une équipe agile.",
    missions: [
      {
        code: "P1",
        title: "Atelier Lego4Scrum",
        subtitle: "Méthode agile — 2e année",
        text: "Construire un produit en Lego par sprints successifs, en tenant chacun des rôles Scrum : Scrum Master, Product Owner, équipe de développement.",
        tasksTitle: "Ce que j’ai appris",
        tasks: [
          "Fonctionnement de la méthode Scrum",
          "Organisation en sprints itératifs",
          "Rôles dans une équipe agile",
          "Travail en équipe et communication",
        ],
        toolsTitle: "Méthodes",
        tools: ["Scrum", "Méthode agile", "Gestion de projet itérative"],
        skills: [
          "Travailler en mode projet",
          "Analyser les objectifs d’un projet",
          "Organiser son développement professionnel",
        ],
      },
    ],
    learned: [],
    competences: ["C4", "C6"],
    featured: false,
    images: img("lego4scrum"),
    alt: "Visuel abstrait : une plaque de briques vue de dessus, quelques briques orange",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const archiveProjects = projects.filter((p) => !p.featured);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const indexOf = (slug: string) => projects.findIndex((p) => p.slug === slug) + 1;
