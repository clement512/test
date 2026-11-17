import type { Episode } from "./types";

export const EP06: Episode = {
  id: "Ep06Napoleon",
  number: "06",
  when: "mai 1821",
  title: "L'EMPEREUR QUI N'ÉTAIT PAS PETIT",
  gold: [
    "napoléon", "minuscule", "jamais", "sainte-hélène", "1821", "britannique", "antommarchi",
    "autopsie", "5", "pieds", "2", "pouces", "françaises", "plus", "long", "2,7", "2,54",
    "1,68", "1,70", "moyenne", "chapeau", "petit", "caporal", "affection", "caricature",
    "légende", "wellington", "1,73", "propagande", "complexe", "agressivité", "conversion", "chiffres",
  ],
  segments: [
    {
      id: "hook",
      chapter: "L'ACCROCHE",
      badge: "MYTHE ?",
      text: "Dans l'imaginaire collectif, Napoléon Bonaparte est un homme minuscule. Ses contemporains, eux, ne l'ont jamais décrit ainsi.",
    },
    {
      id: "island",
      chapter: "SAINTE-HÉLÈNE, 1821",
      badge: "ÉTABLI",
      text: "Pour comprendre, il faut remonter à l'île de Sainte-Hélène, en 1821. Napoléon meurt sur cette île de l'Atlantique Sud, sous contrôle britannique. Son médecin, François Antommarchi, pratique l'autopsie et note sa taille : 5 pieds, 2 pouces.",
      speech: "Pour comprendre, il faut remonter à l'île de Sainte-Hélène, en mille-huit-cent-vingt-et-un. Napoléon meurt sur cette île de l'Atlantique Sud, sous contrôle britannique. Son médecin, François Antommarchi, pratique l'autopsie et note sa taille : cinq pieds, deux pouces.",
    },
    {
      id: "units",
      chapter: "UNITÉS",
      badge: "ÉTABLI",
      text: "Le chiffre est en unités françaises. Or le pouce français est plus long que le pouce anglais : environ 2,7 centimètres, contre 2,54.",
      speech: "Le chiffre est en unités françaises. Or le pouce français est plus long que le pouce anglais : environ deux-virgule-sept centimètres, contre deux-virgule-cinquante-quatre.",
    },
    {
      id: "convert",
      chapter: "LA CONVERSION",
      badge: "ÉTABLI",
      text: "Converti, le chiffre donne environ 1,68 à 1,70 mètre. Pour un homme de son époque, c'est une taille moyenne, voire légèrement au-dessus.",
      speech: "Converti, le chiffre donne environ un-mètre-soixante-huit à un-mètre soixante-dix. Pour un homme de son époque, c'est une taille moyenne, voire légèrement au-dessus.",
    },
    {
      id: "propaganda",
      chapter: "PROPAGANDE",
      badge: "RAPPORTÉ",
      text: "Pendant les guerres, les caricaturistes britanniques dessinent un homme minuscule, perdu sous un énorme chapeau. Ses soldats l'appellent affectueusement « le petit caporal » : un surnom d'affection, pas une description. La caricature, elle, fait le reste.",
    },
    {
      id: "wellington",
      chapter: "1,68 M",
      badge: "ÉTABLI",
      text: "Un chiffre mal converti, des caricatures, et une légende était née. Même son adversaire de Waterloo, Wellington, ne mesurait que 1,73 mètre : à peine plus grand.",
      speech: "Un chiffre mal converti, des caricatures, et une légende était née. Même son adversaire de Waterloo, Wellington, ne mesurait que un-mètre soixante-treize : à peine plus grand.",
    },
    {
      id: "truth",
      chapter: "CE QU'ON CROIT / CE QUI EST VRAI",
      badge: "LECTURE SMART",
      text: "On croit que Napoléon était petit. Les sources disent qu'il était dans la moyenne. La taille a été effacée par la propagande.",
    },
    {
      id: "complex",
      chapter: "LE COMPLEXE",
      badge: "LECTURE SMART",
      text: "Aujourd'hui, le « complexe de Napoléon » désigne les hommes petits qui compenseraient par l'agressivité. Une étiquette née d'une erreur de conversion. Et vous, à quel point faites-vous confiance aux chiffres d'époque ?",
    },
  ],
};
