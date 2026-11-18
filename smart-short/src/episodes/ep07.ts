import type { Episode } from "./types";

export const EP07: Episode = {
  id: "Ep07Poubelle",
  number: "07",
  when: "novembre 1883",
  title: "LA POUBELLE PORTE UN NOM",
  next: "Le vote secret n'a pas de date de naissance",
  voiceSpeed: 0.85,
  gold: [
    "millions", "poubelle", "préfet", "paris", "xixe", "siècle", "ordures", "rue", "mauvais",
    "eugène", "poubelle,", "arrêté", "propriétaire", "fermé", "bois", "fer-blanc", "second",
    "quotidienne", "charrettes", "chevaux", "scandale", "presse", "figaro", "moque", "boîtes",
    "surnom", "reste", "courant", "propre", "nom", "quotidien",
  ],
  segments: [
    {
      id: "hook",
      chapter: "L'ACCROCHE",
      badge: "LECTURE SMART",
      text: "Des millions de personnes jettent leurs déchets dans une poubelle chaque jour. Presque personne ne sait qu'elle porte le nom d'un préfet.",
      pauseAfter: 0.7,
    },
    {
      id: "paris",
      chapter: "PARIS, FIN DU XIXe SIÈCLE",
      badge: "ÉTABLI",
      text: "Pour comprendre, il faut remonter à Paris, à la fin du XIXe siècle. Les ordures sont souvent jetées à même la rue, et la ville sent mauvais.",
      speech: "Pour comprendre, il faut remonter à Paris, à la fin du dix-neuvième siècle. Les ordures sont souvent jetées à même la rue, et la ville sent mauvais.",
      pauseAfter: 0.8,
    },
    {
      id: "arrete",
      chapter: "24 NOVEMBRE 1883",
      badge: "ÉTABLI",
      text: "Le préfet de la Seine, Eugène Poubelle, signe un arrêté. Chaque propriétaire doit fournir à ses locataires un récipient fermé, en bois doublé de fer-blanc.",
      pauseAfter: 0.8,
    },
    {
      id: "collecte",
      chapter: "7 MARS 1884",
      badge: "ÉTABLI",
      text: "Un second arrêté impose une collecte quotidienne, par charrettes tirées par des chevaux.",
      pauseAfter: 0.9,
    },
    {
      id: "scandale",
      chapter: "LA PRESSE",
      badge: "ÉTABLI",
      text: "Mais la mesure fait scandale dans une partie de la presse.",
      pauseAfter: 0.7,
    },
    {
      id: "figaro",
      chapter: "MYTHE / PARADOXE",
      badge: "MYTHE ?",
      text: "Un journaliste du Figaro se moque des récipients : il les appelle « boîtes Poubelle ». Le surnom reste.",
      pauseAfter: 0.9,
    },
    {
      id: "today",
      chapter: "AUJOURD'HUI",
      badge: "LECTURE SMART",
      text: "Aujourd'hui, c'est le mot le plus courant pour désigner une poubelle en français. Le préfet voulait une ville propre. Il a surtout donné son nom à un objet du quotidien.",
      pauseAfter: 3.6,
    },
  ],
};
