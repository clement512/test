import type { Episode } from "./types";

export const EP04: Episode = {
  id: "Ep04Gerrymandering",
  number: "04",
  when: "mars 1812",
  title: "LE MOT QUI A DÉFORMÉ LA DÉMOCRATIE",
  next: "Le jour où l'Islande s'est arrêtée",
  gold: [
    "gerrymandering", "monstre", "massachusetts", "1812", "11", "février", "elbridge", "gerry",
    "essex", "étiré", "tordu", "26", "mars", "boston", "gazette", "créature", "ailée",
    "gerry-mander", "salamandre", "jamais", "tisdale", "gilbert", "stuart", "vice-président",
    "resté", "caricature", "dur", "doux", "manœuvre", "carte", "élection", "tordue",
  ],
  segments: [
    {
      id: "hook",
      chapter: "L'ACCROCHE",
      badge: "LECTURE SMART",
      text: "Vous connaissez peut-être le mot « gerrymandering ». Pourtant, presque personne ne sait qu'il est né d'un monstre dessiné.",
    },
    {
      id: "context",
      chapter: "MASSACHUSETTS, 1812",
      badge: "ÉTABLI",
      text: "Pour comprendre, remontons au Massachusetts, en 1812. Le 11 février, le gouverneur Elbridge Gerry signe une loi qui redessine les circonscriptions du Sénat de l'État.",
      speech: "Pour comprendre, remontons au Massachusetts, en mille-huit-cent-douze. Le onze février, le gouverneur Elbridge Guerry signe une loi qui redessine les circonscriptions du Sénat de l'État.",
    },
    {
      id: "trace",
      chapter: "LE TRACÉ",
      badge: "ÉTABLI",
      text: "Dans le comté d'Essex, le nouveau district est étiré et tordu pour regrouper les électeurs favorables à son camp.",
    },
    {
      id: "gazette",
      chapter: "LE TRACÉ",
      badge: "ÉTABLI",
      text: "Le 26 mars, la Boston Gazette publie une caricature : ce district devient une créature ailée, à la gueule ouverte. Un éditeur propose de l'appeler un « gerry-mander », mélange du nom du gouverneur et de « salamandre ».",
      speech: "Le vingt-six mars, la Boston Gazette publie une caricature : ce district devient une créature ailée, à la gueule ouverte. Un éditeur propose de l'appeler un « guerry-mander », mélange du nom du gouverneur et de « salamandre ».",
    },
    {
      id: "dispute",
      chapter: "ATTRIBUTION DISPUTÉE",
      badge: "DISPUTÉ",
      text: "Le mot se répand dans la presse du pays, puis entre dans la langue. Son inventeur n'a jamais été identifié. Le dessinateur, lui aussi, est discuté : la Bibliothèque du Congrès l'attribue à Elkanah Tisdale, d'autres sources à Gilbert Stuart.",
    },
    {
      id: "vp",
      chapter: "1812",
      badge: "ÉTABLI",
      text: "Quelques mois plus tard, Gerry est élu vice-président des États-Unis. Le mot, lui, est resté.",
      speech: "Quelques mois plus tard, Guerry est élu vice-président des États-Unis. Le mot, lui, est resté.",
    },
    {
      id: "truth",
      chapter: "CE QU'ON CROIT / CE QUI EST VRAI",
      badge: "LECTURE SMART",
      text: "On croit que le mot désigne une salamandre. En réalité, il vient d'une caricature, et son sens a glissé. Au départ, on prononçait le « g » dur, comme dans le nom du gouverneur. Aujourd'hui, c'est le « g » doux : le nom s'efface, la manœuvre reste.",
      speech: "On croit que le mot désigne une salamandre. En réalité, il vient d'une caricature, et son sens a glissé. Au départ, on prononçait le « gué » dur, comme dans le nom du gouverneur. Aujourd'hui, c'est le « gé » doux : le nom s'efface, la manœuvre reste.",
    },
    {
      id: "question",
      chapter: "À VOUS",
      badge: "LECTURE SMART",
      text: "Et la manœuvre existe toujours : dessiner une carte pour gagner une élection. Auriez-vous reconnu une circonscription tordue sur une carte ?",
    },
  ],
};
