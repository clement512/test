#!/usr/bin/env python3
"""Génère les sites des restaurants du groupe, dans le style du Bistrot des Pêcheurs."""
import html, urllib.parse, pathlib, sys

OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
W = "https://static.wixstatic.com/media/"
e = html.escape

GROUP = [
    ("bistrot-des-pecheurs.html", "Le Bistrot des Pêcheurs"),
    ("epi-de-ble.html", "L'Épi de Blé"),
    ("creperie-des-dames.html", "La Crêperie des Dames"),
    ("bistrot-du-port.html", "Le Bistrot du Port"),
    ("chez-jeannot.html", "Chez Jeannot"),
    ("le-28.html", "Le 28"),
    ("le-saint-georges.html", "Le Saint-Georges"),
]

# ---------------------------------------------------------------- menus
def items(s):
    """'Nom | desc | prix' lines -> tuples"""
    out = []
    for line in s.strip().split("\n"):
        p = [x.strip() for x in line.split("|")]
        if len(p) == 2: p = [p[0], "", p[1]]
        out.append(tuple(p))
    return out

EPI_MENU = [
  ("Formules", "Pour tous les appétits", [
    ("Formule du midi", "1 galette complète + salade verte + 1 crêpe chocolat au beurre salé + ¼ de cidre brut pression", "15,40 €"),
    ("Formule du soir", "1 coupe de cidre rosé + 1 galette au choix + salade verte + 1 crêpe chocolat au beurre salé + ¼ de cidre brut pression", "26,90 €"),
    ("Menu enfant", "1 galette jambon fromage + 1 crêpe bonbons + 1 sirop à l'eau", "9,90 €"),
    ("Formule goûter", "1 crêpe chocolat + ¼ de cidre brut pression ou 1 chocolat chaud", "7,90 €"),
  ]),
  ("Galettes traditionnelles", "100 % blé noir · farine de sarrasin biologique", items("""
Beurre | 3,60 €
Fromage | 6,30 €
Œuf | 6,10 €
Œuf, fromage | 7,90 €
Jambon | 7,60 €
Jambon, œuf | 8,70 €
Jambon, fromage | 8,90 €
Jambon, fromage, tomate, salade | 12,50 €
Complète | jambon, œuf, fromage | 9,90 €
Complète tomate | 11 €
Complète oignons | 11,40 €
Complète champignons | 11,90 €""")),
  ("Galettes spécialités", "Les recettes de la maison", items("""
La Végétarienne | Fromage, tomate, champignons, soubise, salade | 13,50 €
Seguin | Chèvre, miel, noix, salade | 14,20 €
Rennaise | Jambon, chèvre, salade | 14,80 €
Paysanne | Pomme de terre, poitrine fumée, crème fraîche, fromage, salade | 15 €
Méditerranée | Chèvre, tomates persillées, poitrine fumée, salade | 15 €
Provençale | Ratatouille, fromage, chorizo, œuf, salade | 15,50 €
3 Fromages | Chèvre, roquefort, fromage, pomme de terre, poitrine fumée, salade | 15,90 €
L'Épi de Blé | Camembert, jambon, tomate, crème fraîche, fromage, salade | 15,90 €
Campagnarde | Andouille, moutarde à l'ancienne, soubise, salade | 15,90 €
Argoat | Pomme de terre, fromage, andouille, crème fraîche, salade | 15,90 €
La Super Complète | Jambon, œuf, fromage, tomate, champignons, soubise, salade | 16,10 €
Raclette | Fromage à raclette, pomme de terre, crème fraîche, lardons, poitrine fumée, soubise, salade | 16,30 €
Tartiflette | Reblochon, pomme de terre, crème fraîche, lardons, poitrine fumée, soubise, salade | 16,40 €
Fermière | Poulet, fromage, champignons, crème fraîche, salade | 16,50 €
Norvégienne | Saumon fumé, fondue de poireaux, fromage, salade | 18,50 €
L'IØ | Saumon fumé, pomme de terre, crème fraîche, ciboulette, fromage, salade | 18,50 €
Champêtre | Saumon fumé, fondue de poireaux crémée, chèvre, mélange de graines, salade | 18,50 €""")),
  ("Galettes gourmandes", "Champignons, andouille, soubise, chèvre, saumon…", items("""
Champignons | frais cuisinés ail et persil | 9,30 €
Champignons, ciboulette, crème, salade | 13,50 €
Champignons, œuf | 10,40 €
Champignons, jambon | 10,80 €
Champignons, jambon, œuf | 11,40 €
Andouille | de Bretagne fumée | 10,50 €
Andouille, pommes (fruits), salade | 14,50 €
Andouille, champignons, fromage | 14,20 €
Andouille, moutarde à l'ancienne | 11 €
Andouille, œuf, fromage | 13,40 €
Andouille, sauce roquefort, salade | 13,90 €
Ratatouille, œuf, fromage | 11,70 €
Ratatouille, fromage, chorizo | 11,80 €
Soubise | émincé d'oignons cuisiné au vin blanc | 9,30 €
Soubise, fromage | 10,50 €
Soubise, jambon | 10,80 €
Soubise, jambon, fromage | 11,40 €
Poitrine fumée | 10,20 €
Poitrine fumée, œuf | 11,30 €
Poitrine fumée, œuf, fromage | 12,50 €
Poitrine fumée, œuf, fromage, tomate | 14,20 €
Poitrine fumée, œuf, fromage, champignons | 14,20 €
Chèvre, salade | 13,30 €
Chèvre, miel | 12 €
Chèvre, noix, salade | 14 €
Chèvre, ratatouille | 14 €
Chèvre, fondue de poireaux | 15,40 €
Poulet, fromage, soubise | 14,30 €
Fondue de poireaux, fromage, œuf | 14,90 €
Fondue de poireaux, chèvre, jambon | 15 €
Fondue de poireaux, fromage, chorizo | 15,40 €
Camembert, salade | 12,70 €
Camembert, jambon, salade | 14,20 €
Camembert, champignons, salade | 14,20 €
Saumon, crème fraîche, ciboulette, salade | 16 €
Saumon, crème fraîche, ciboulette, champignons, salade | 17,50 €""")),
  ("Salades", "Suppléments : ingrédient simple 2,20 € · poulet 3 € · saumon fumé 5 €", items("""
Saladier mixte | salade verte & tomates persillées | 4 €
Saladier des montagnes | salade, noix, fromage | 5 €
Salade de chèvre chaud | Salade verte, galette de chèvre, tomates, poitrine fumée, miel, champignons frais | 16,70 €
Salade nordique | Salade verte, tomates, champignons, concombre, saumon fumé, crème, ciboulette | 18,60 €
Salade veggie | voir ardoise""")),
  ("Crêpes classiques", "Crêpes sucrées", items("""
Sucre | 3 €
Beurre sucre | 3,60 €
Beurre sucre, 1 boule de glace vanille | 6,60 €
Miel | 5,20 €
Miel, citron pressé | 6,30 €
Citron pressé, sucre | 5,20 €
Marrons | 5,60 €
Confiture : fraise, myrtille, abricot | 5 €
Chocolat au beurre salé | 5,60 €
Chocolat au beurre salé, chantilly | 7,10 €
Chocolat au beurre salé, marron | 6,60 €
Chocolat au beurre salé, amandes grillées | 6 €
Chocolat au beurre salé, coco râpée | 6,70 €
Chocolat au beurre salé, palet breton | 6 €
Banane | 5,10 €
Banane, chocolat au beurre salé | 6,40 €
Banane, chocolat au beurre salé, chantilly | 8 €
Compotée de pommes cuites au beurre | 8,30 €
Compotée de pommes cuites au beurre, chantilly | 9,90 €
Poire | 5,20 €
Poire, chocolat au beurre salé | 6,20 €
Poire, chocolat au beurre salé, palet breton | 6,70 €
Poire, chocolat au beurre salé, chantilly | 7,90 €
Poire, caramel | 6,30 €
Poire, caramel, chantilly | 8 €
Frangipane | 8,30 €""")),
  ("Crêpes spécialités", "Supplément chantilly 2,20 € · boule de glace 3,10 € · flambage 5 €", items("""
L'Épidou | Caramel au beurre salé | 5,70 €
La Bretonne | Pomme, caramel au beurre salé | 9,30 €
La Frangichoc | Frangipane, chocolat au beurre salé | 9,50 €
La Frangicara | Frangipane, caramel au beurre salé | 9,50 €
La Breizh | Caramel au beurre salé, spéculoos, glace vanille | 8,10 €
La Tatin | Pomme, caramel au beurre salé, glace vanille | 10,40 €
La Snickers | Chocolat au beurre salé, caramel au beurre salé, cacahuètes, glace vanille | 10,40 €
La Forêt Noire | Chocolat au beurre salé, griottes, chantilly, glace vanille | 8,90 €
La Belle Hélène | Chocolat au beurre salé, poire, amandes grillées, glace vanille | 8,90 €
La Rochelaise | Frangipane, caramel au beurre salé, amandes effilées, glace vanille | 10,70 €
L'Oléronaise | Caramel, palet breton, glace vanille | 8,90 €
La Cap Malo | Pomme, caramel au beurre salé, palet breton, glace vanille | 10,70 €
La G'M | Chocolat au beurre salé, flambée au Grand Marnier | 9 €
La Griotte | Chocolat au beurre salé, griottes, flambée au Grand Marnier | 10 €
La Normande | Pomme, flambée au Calvados | 10 €
L'Antillaise | Banane, flambée au rhum | 8,40 €
Flambée Calvados | 8 €
Flambée Grand Marnier | 8 €
Flambée Rhum | 8 €""")),
  ("Les cidres", "Val de Rance", items("""
Cidre Val de Rance, bouteille 75 cl | Brut ou doux | 15 €
Cidre brut pression | Pichet 25 cl 4,40 € · 50 cl 8,40 € · 100 cl | 16,50 €
Cidre rosé | La coupe 12 cl 4,20 € · 25 cl 6 € · 50 cl 12 € · bouteille 75 cl | 17 €
Cidre doux | Pichet 25 cl 5 € · pichet 50 cl | 10 €
Cidre bio | Bouteille 75 cl | 18 €""")),
]

DAMES_MENU = [
  ("Breizh Burger", "Burger breton avec blinis de sarrasin", items("""
Denise | Steak haché façon bouchère, camembert, sauce burger maison, soubise, bacon, pomme de terre, salade verte | 18,90 €
Lucienne | Steak haché façon bouchère, raclette, soubise, œuf, sauce burger maison, pomme de terre, salade verte | 18,90 €
Aglaé | Steak haché façon bouchère, chèvre, bacon, soubise, miel, sauce burger maison, pomme de terre, salade verte | 18,90 €""")),
  ("Galettes saucisse", "Saucisse artisanale bretonne roulée dans une galette de sarrasin", items("""
Célestine | Saucisse, soubise, moutarde à l'ancienne, salade verte | 16,70 €
Maria | Saucisse, soubise, emmental, salade verte | 16,90 €""")),
  ("Galettes spéciales", "Recettes de galettes revisitées · 100 % sarrasin, sans gluten", items("""
Pauline | Jambon, œuf, emmental, champignons, soubise, salade verte | 16,10 €
Suzanne | Chèvre, duo de poivrons cuisinés, mélange de graines gourmandes, velours de balsamique, pousses d'épinards frais | 17,40 €
Olivane | Emmental, chèvre, camembert, cerneaux de noix, salade verte | 17,70 €
Augustine | Compotée de pommes maison, andouille fumée, camembert, salade verte | 17,70 €
Jeannine | Emmental, épinards à la crème, saumon fumé, ciboulette, citron, pousses d'épinards frais | 18,70 €
Galette du moment | à l'ardoise, selon la saison""")),
  ("Galettes classiques", "Cuisinées dans la plus pure tradition bretonne · suppléments : salade verte 2,20 € · Saladier des Dames (salade, pickles maison, graines) 5,50 € · 1 ingrédient 2,50 €", items("""
Beurre | 3,60 €
Œuf | 6,10 €
Emmental | 6,50 €
Jambon | 7,60 €
Jambon, emmental | 8,90 €
Complète | jambon, œuf, emmental | 9,90 €
Complète soubise | 11,40 €
Complète champignons | 11,40 €
Complète chèvre | 11,40 €
Andouille | 10,50 €
Andouille, œuf, emmental | 13,40 €
Andouille, moutarde à l'ancienne, soubise | 13,40 €
Andouille, champignons, emmental | 14,20 €
Saumon fumé | 11,80 €
Saumon fumé, crème ciboulette | 13,90 €
Saumon fumé, champignons, crème ciboulette | 15,30 €
Chèvre | 11,10 €
Chèvre, miel crémeux, soubise | 14,50 €
Chèvre, bacon, duo de poivrons cuisinés | 14,60 €
Chèvre, jambon, champignons | 14,60 €
Camembert | 10,50 €
Camembert, compotée de pommes maison, noix | 13,60 €
Camembert, jambon, duo de poivrons cuisinés | 12,50 €
Camembert, miel crémeux, bacon | 12,10 €
Champignons | frais cuisinés en persillade | 9,50 €
Champignons, œuf, emmental | 12,30 €
Champignons, œuf, emmental, soubise | 13,10 €
Champignons, œuf, emmental, bacon | 13,10 €
Soubise | oignons cuisinés au beurre demi-sel et vin blanc | 9,30 €
Soubise, emmental | 10,60 €
Soubise, œuf, emmental | 11,50 €
Soubise, œuf, emmental, bacon | 13,10 €
Duo de poivrons cuisinés, œuf, emmental | 12,30 €
Épinards à la crème, œuf, emmental | 12,30 €""")),
  ("Formules", "", [
    ("Formule du midi", "1 galette complète + 1 salade verte + 1 crêpe chocolat maison au beurre salé + ¼ de cidre pression", "15,90 €"),
    ("Menu enfant", "1 galette jambon emmental + 1 glace bonbons + 1 sirop à l'eau", "10,40 €"),
    ("Formule goûter", "1 crêpe chocolat maison au beurre salé + 1 Fuzetea ou ¼ de cidre pression", "8,90 €"),
  ]),
  ("Crêpes de froment", "100 % bretonnes · toutes nos crêpes se déclinent aussi sur galette de sarrasin sans gluten", items("""
Lucette | Chocolat maison au beurre salé, caramel au beurre salé, amandes effilées grillées, glace artisanale vanille | 10,40 €
Yvette | Caramel au beurre salé, pralin, glace artisanale vanille | 10,30 €
Arlette | Compotée de pommes maison, caramel au beurre salé, glace artisanale vanille | 12,40 €
Paulette | Caramel au beurre salé, éclats de spéculoos, glace artisanale vanille | 11,10 €
Colette | Compotée de pommes maison, caramel au beurre salé, glace artisanale vanille, palet breton émietté, chantilly | 15,60 €
Guillemette | Frangipane, chocolat au beurre salé maison, banane, chantilly | 14,50 €
Chocolat maison au beurre salé | crêpe chouchoute | 5,90 €
Caramel au beurre salé de la Maison Armorine | crêpe chouchoute | 6,30 €
Frangipane maison | crêpe chouchoute | 8,80 €
Compotée de pommes cuisinées au beurre demi-sel | crêpe chouchoute | 8,80 €
Sucre | 3,30 €
Beurre sucre | 3,70 €
Beurre sucre, glace artisanale vanille | 6,90 €
Miel crémeux | 5,50 €
Citron pressé, sucre | 5,50 €
Miel crémeux, citron pressé | 6,70 €
Chocolat au beurre salé maison, coco râpé | 6,80 €
Chocolat au beurre salé maison, amandes effilées grillées | 6,90 €
Chocolat au beurre salé maison, caramel au beurre salé | 7,60 €
Pommes, caramel au beurre salé | 11,10 €
Pommes, chantilly | 11,30 €
Pommes, chocolat au beurre salé maison | 11,90 €
Crème de marron de Corrèze | 5,70 €
Crème de marron, chantilly | 7,90 €
Banane | 5,80 €
Banane, chocolat au beurre salé | 7,90 €
Banane, chocolat au beurre salé, chantilly | 9,90 €
Banane, chocolat au beurre salé, chantilly, glace artisanale vanille | 12,90 €
Frangipane, caramel au beurre salé | 11,10 €
Frangipane, chocolat maison au beurre salé | 10,90 €
Frangipane, chantilly | 11,40 €
Confiture de fraises | 5,80 €
Confiture d'abricot | 5,80 €
Marmelade d'orange amère | 5,80 €""")),
  ("Crêpes flambées", "Douceurs (amandes, pralin, palet breton, coco, spéculoos) 1,90 € · chantilly 2,20 € · glace artisanale 3,10 € · flambage 5 €", items("""
Grand Marnier – Cordon rouge | 8,80 €
Grand Marnier, chocolat maison au beurre salé | 10,90 €
Grand Marnier, confiture d'orange amère | 10,70 €
Calvados – Busnel de Normandie | 8,80 €
Calvados, compotée de pommes maison | 13,40 €
Cognac – l'Isle de Ré | 8,80 €
Cognac, amandes effilées grillées | 9,90 €
Rhum ambré | 8,80 €
Rhum ambré, banane | 10,90 €""")),
  ("Glaces", "Crèmes glacées et sorbets, sélectionnés avec amour · 1 boule 3,10 € · 2 boules 5,80 € · 3 boules 8 €", items("""
Dame O'Brien | 2 boules café, crème de whisky 2 cl, 1 boule vanille, chantilly | 11,10 €
Dame Williams | 2 boules poire, alcool de poire 2 cl | 10,10 €
Dame Anastasia | 2 boules citron vert, vodka 2 cl | 10,10 €
Dame Créole | 1 boule rhum-raisin, 1 boule vanille, rhum 2 cl, chantilly | 11,10 €
Dame Banana | 1 boule fraise, 1 boule chocolat, 1 boule vanille, banane, coulis de chocolat, amandes effilées grillées, chantilly | 11,10 €
Dame Blanche | 2 boules vanille, coulis de chocolat, amandes effilées grillées, chantilly | 10,10 €
Dame des Bois | 2 boules fraise, coulis de fruits rouges, amandes effilées grillées, chantilly | 10,10 €
Dame Bretonne | 2 boules caramel, crème de salidou, pommes, éclats de spéculoos, chantilly | 11,50 €
Dame Liégeoise | 2 boules café, 1 expresso, amandes effilées grillées, chantilly | 11,10 €
Dame Rochelaise | 2 boules vanille, 1 boule caramel, crème de salidou, palet breton émietté, chantilly | 11,10 €
Parfums | Crèmes glacées : vanille, chocolat, caramel au beurre salé, café, rhum-raisin · Sorbets : fraise, citron vert, poire | """)),
  ("Cidres & vins", "Cidrerie Val de Rance", items("""
Cidre brut ou doux | Bouteille 75 cl | 15,80 €
Cidre rosé | Coupe 12 cl 4,20 € · pichet 25 cl 6,50 € · pichet 50 cl 12,50 € · bouteille 75 cl | 18 €
Cidre brut pression | Pichet 25 cl 4,50 € · pichet 50 cl 8,50 € · bouteille 75 cl | 16,80 €
Cidre doux | Pichet 25 cl 5,50 € · pichet 50 cl | 10,50 €
Galipette 0 % 33 cl | 5,50 €
Galipette rosé 33 cl | 7 €
Galipette bio 33 cl | 7,50 €
Cidre bio 75 cl | 19 €
Les p'tits Bonheurs île de Ré | Blanc, rosé ou rouge · 12 cl 4,40 € · 25 cl 8,30 € · 50 cl 16 € · 75 cl | 24 €
Le vin du moment | Blanc, rosé ou rouge · 12 cl 4,70 € · 25 cl 9,10 € · 50 cl 17,30 € · 75 cl | 26 €""")),
  ("Boissons", "Apéritifs, bières, softs, cafés & thés Maison Richard", items("""
Kir breton ou kir vin blanc 12 cl | 4,30 €
Pineau de l'Île de Ré blanc ou rouge 5 cl | 4,70 €
Cinzano blanc ou rouge 5 cl | 5,70 €
Ballantine's 4 cl | 6,90 €
Ricard 2 cl | 3,20 €
Mojito breton · Spritz breton | 9,50 €
Pression Maes Pils | 25 cl 4,40 € · 33 cl 6,10 € · 50 cl | 8,20 €
Hoegaarden blanche · Affligem 33 cl | 5,60 €
Heineken 0 % 33 cl | 5,40 €
Sirop à l'eau 25 cl | 3,10 €
Diabolo 25 cl | 4,70 €
Limonade 25 cl | 4,10 €
Jus de fruits 25 cl | ananas, orange, tomate | 4,20 €
Coca-Cola 33 cl | sans sucre, original & cherry | 4,70 €
Orangina · Schweppes tonic · Fuzetea 25 cl | 4,50 €
Jus de pomme artisanal 25 cl | 100 % non traité, sous le pommier | 5 €
Limonade rochelaise bio 25 cl | 5 €
Evian | 50 cl 5 € · 100 cl | 7 €
Badoit | 33 cl 4 € · 50 cl 5 € · 100 cl | 7 €
Café 4 cl | 2,20 €
Décaféiné 4 cl | 2,40 €
Café noisette 5 cl | 2,80 €
Petit crème 8 cl | 3,50 €
Grand café 8 cl | 4,30 €
Grand crème 10 cl | 5 €
Cappuccino 25 cl | 5,50 €
Café latte · café viennois · café frappé 25 cl | 6 €
Chocolat chaud 25 cl | 5 €
Chocolat viennois 25 cl | 7,70 €
Irish coffee · French coffee | 9,50 €
Thés Maison Richard | Grand Earl Grey, fruits rouges, vanille tonka, chaï des comptoirs, vert sencha, vert au jasmin, vert à la menthe, blanc rose litchi, rooibos épices | 4,90 €
Infusions bio Du Matos | Verveine menthe, Jardin Clos (citronnelle, gingembre, maté, citron), camomille | 5,10 €
Digestifs 4 cl | Rhum ambré, poire, Bailey's, Menthe Pastille, Calvados Busnel, Cognac VS Isle de Ré | 8 €
Cognac XO Isle de Ré 4 cl | 10 €""")),
]

# ---------------------------------------------------------------- restaurants
R = {
 "epi-de-ble.html": dict(
   name="L'Épi de Blé", kind="Crêperie", tagline="Crêperie bretonne depuis 1999",
   accent="#c9a46a", accent2="#8b2c2c", ink="#1f1414",
   logo=W+"5cfd4e_672fbc033be44166a8c693e23de9e656~mv2.png",
   hero=W+"5cfd4e_82f4a0759504469fa825945ef0749c14~mv2.jpg",
   h1="De l'amour <em>dans vos galettes</em>",
   lead="Craquez pour nos galettes 100 % sarrasin, servies à toute heure à deux pas du port de La Rochelle.",
   address="2, rue du Port", city="17000 La Rochelle", phone="05 46 41 26 85",
   hours=[("Tous les jours", "11h00 – 22h00"), ("Service", "toute la journée, 7j/7")],
   service="Repas sur place & à emporter",
   intro_eyebrow="Bienvenue", intro_h="Notre plaisir, <em>vous régaler</em>",
   intro_p=["Service toute la journée, 7 jours sur 7, à deux pas du vieux port.",
            "Depuis 1999, nos galettes sont préparées avec une farine de sarrasin biologique, 100 % blé noir. Et pour finir en douceur : la fameuse Breizh, caramel au beurre salé, éclats de spéculos et glace vanille."],
   badge=("1999", "depuis"),
   feats=[("100 % blé noir", "Farine de sarrasin biologique."), ("Sur place & à emporter", "Repas servis à toute heure, tous les jours.")],
   photos=[W+"5cfd4e_3098b69279d04584bbe103fa00a1475d~mv2.jpg", W+"5cfd4e_9b050d2bb73c4c46b4f774967b68a9eb~mv2.jpg", W+"5cfd4e_ab2f36bf88b34f95b9158df3625b67be~mv2.jpg", W+"5cfd4e_82f4a0759504469fa825945ef0749c14~mv2.jpg"],
   signature=("La fameuse Breizh", "Caramel au beurre salé, éclats de spéculos et glace vanille.", "8,10 €"),
   menu=EPI_MENU, menu_title="La carte <em>de l'Épi de Blé</em>",
   pdf="https://ccb106d4-031a-47b4-8975-84cb173b7f7b.filesusr.com/ugd/5cfd4e_f59f2904d628473a903a8d3418b45f0e.pdf",
   notes="Prix nets, service compris · Modes de règlement : CB (min. 5 €), espèces, ANCV, tickets restaurant · Carte des allergènes auprès de votre serveur · L'abus d'alcool est dangereux pour la santé, à consommer avec modération.",
   quote="Crêperie un jour, crêperie toujours…",
   links=[("Site actuel", "https://creperielarochelle.wixsite.com/epideble")],
   sister="Rennes · La Rochelle · Cap Malo",
 ),
 "creperie-des-dames.html": dict(
   name="La Crêperie des Dames", kind="Crêperie bretonne", tagline="Crêperie bretonne · Cours des Dames",
   accent="#d39a6a", accent2="#a5482a", ink="#21160f",
   logo=W+"5cfd4e_41fa87551b12400284346bdfdd2b436a~mv2.png", logo_round=True,
   hero=W+"5cfd4e_f9096a7804a24103878d623b362f0367~mv2.jpeg",
   h1="Une histoire <em>de traditions</em>",
   lead="Galettes 100 % sarrasin, crêpes de froment et Breizh Burgers, en service continu, 7 jours sur 7, face au port de La Rochelle.",
   address="36, cours des Dames", city="17000 La Rochelle", phone="05 46 52 16 89", email="epidames@gmail.com",
   hours=[("Service", "en continu, 7j/7")],
   service="Service en continu",
   intro_eyebrow="La crêperie des Dames", intro_h="Savez-vous qui sont <em>ces Dames&nbsp;?</em>",
   intro_p=["Ces Dames, ce sont les femmes de marins qui venaient, ensemble, traditionnellement, attendre ici le retour de leurs maris… Parce que nous avons voulu leur rendre hommage, la Crêperie des Dames est avant tout une histoire de traditions.",
            "La tradition de notre métier et le respect de son savoir-faire. La tradition du goût, que nous nous appliquons à mettre dans chaque assiette, en faisant une cuisine généreuse. La tradition du produit, enfin, parce qu'une galette n'est pas une galette sans un savant dosage de sarrasin…",
            "Que vous soyez amateurs de galettes traditionnelles, ou de recettes plus originales qui mettent le sarrasin dans tous ses états, soyez les bienvenus à la Crêperie des Dames."],
   badge=("7j/7", "service continu"),
   feats=[("Farine de blé noir IGP bio", "100 % sarrasin, Moulin de la Charbonnière à Saint-Grégoire (35)."),
          ("Steak haché frais VBF", "Pour nos Breizh Burgers sur blinis de sarrasin."),
          ("Cidre Val de Rance", "Et pur jus de pomme artisanal, Pleudihen-sur-Rance (22)."),
          ("Limonade bio rochelaise", "Produite à La Rochelle (17).")],
   photos=[W+"5cfd4e_1cec1808a1df414a8458c608a0651211~mv2.png", W+"5cfd4e_24c8f4bd9ebd4e60b946660feff5db3e~mv2.png", W+"5cfd4e_288001b3871f42379fa73eb3fecd5f20~mv2.png", W+"5cfd4e_f9096a7804a24103878d623b362f0367~mv2.jpeg"],
   signature=("Le Breizh Burger", "Burger breton sur blinis de sarrasin : Denise, Lucienne ou Aglaé.", "18,90 €"),
   menu=DAMES_MENU, menu_title="Le menu <em>des Dames</em>",
   pdf="https://ea4d32ba-6f8b-4d56-91de-179e59554bec.filesusr.com/ugd/5cfd4e_5e3cd88bf3e141869ba75f9fd4747e4d.pdf",
   notes="Galettes 100 % sarrasin, sans gluten · Carte des allergènes auprès de votre serveur · L'abus d'alcool est dangereux pour la santé, à consommer avec modération.",
   quote="Une galette n'est pas une galette sans un savant dosage de sarrasin…",
   links=[("Site actuel", "https://creperielarochelle.wixsite.com/desdames")],
 ),
 "chez-jeannot.html": dict(
   name="Chez Jeannot", kind="Restaurant", tagline="Cours des Dames · La Rochelle",
   accent="#c7a46c", accent2="#2f5d50", ink="#0f1c18",
   mono="CJ",
   h1="Chez Jeannot, <em>à La Rochelle&nbsp;!</em>",
   lead="Une adresse du cours des Dames, au bord du vieux port, ouverte tous les jours, midi et soir.",
   address="32, cours des Dames", city="17000 La Rochelle",
   hours=[("Tous les jours", "11h – 15h"), ("et le soir", "18h – 22h")],
   intro_eyebrow="Bienvenue", intro_h="Le vieux port, <em>midi et soir</em>",
   intro_p=["Chez Jeannot vous accueille au 32, cours des Dames, sur le vieux port de La Rochelle, tous les jours de 11h à 15h et de 18h à 22h.",
            "Suivez notre actualité, nos nouveautés et nos photos sur notre page Facebook."],
   badge=("7j/7", "midi & soir"),
   feats=[("Ouvert tous les jours", "11h – 15h et 18h – 22h."), ("Cours des Dames", "Face au vieux port de La Rochelle.")],
   links=[("Facebook", "https://www.facebook.com/profile.php?id=61575353619020", "Chez Jeannot sur Facebook")],
   facebook="https://www.facebook.com/profile.php?id=61575353619020",
 ),
 "bistrot-du-port.html": dict(
   name="Le Bistrot du Port", kind="Bistrot", tagline="Rue du Port · La Rochelle",
   accent="#c9a46a", accent2="#8c2f39", ink="#14161f",
   mono="BP",
   h1="Un bistrot <em>à deux pas du port</em>",
   lead="Cuisine française de bistrot, servie dans une ambiance chaleureuse, rue du Port, au cœur de La Rochelle.",
   address="5 bis, rue du Port", city="17000 La Rochelle", phone="05 46 41 39 50",
   hours=[("Horaires", "nous consulter par téléphone")],
   intro_eyebrow="Le bistrot", intro_h="L'esprit bistrot, <em>tout simplement</em>",
   intro_p=["Au 5 bis rue du Port, à quelques pas des quais, le Bistrot du Port propose une cuisine française de bistrot dans un décor qui rappelle les bistrots d'antan.",
            "Pour réserver une table ou connaître nos horaires, appelez-nous au 05 46 41 39 50."],
   badge=("Bistrot", "cuisine française"),
   feats=[("Cuisine de bistrot", "Une cuisine française simple et généreuse."), ("Rue du Port", "Au cœur de La Rochelle, à deux pas des quais.")],
 ),
 "le-28.html": dict(
   name="Le 28", kind="Restaurant", tagline="Quai Duperré · La Rochelle",
   accent="#c9a46a", accent2="#6b5a3a", ink="#111111",
   mono="28",
   h1="Le 28, <em>sur le quai Duperré</em>",
   lead="Une table du vieux port de La Rochelle, sur le quai Duperré, face aux bateaux.",
   address="10 bis, quai Duperré", city="17000 La Rochelle", phone="05 46 29 61 06",
   hours=[("Horaires", "nous consulter par téléphone")],
   intro_eyebrow="Le restaurant", intro_h="Face au <em>vieux port</em>",
   intro_p=["Le 28 vous accueille au 10 bis quai Duperré, sur le vieux port de La Rochelle.",
            "Pour réserver une table ou connaître nos horaires, appelez-nous au 05 46 29 61 06."],
   badge=("Quai", "Duperré"),
   feats=[("Sur le vieux port", "Quai Duperré, au cœur de La Rochelle."), ("Réservation", "Par téléphone au 05 46 29 61 06.")],
 ),
 "le-saint-georges.html": dict(
   name="Le Saint-Georges", kind="Restaurant", tagline="Port de La Flotte · Île de Ré",
   accent="#cfae74", accent2="#2c5a74", ink="#0c1a24",
   mono="SG",
   h1="Sur le port <em>de La Flotte</em>",
   lead="Poissons et fruits de mer face au port de La Flotte, sur l'île de Ré, avec une grande terrasse sur les quais.",
   address="10, quai de Sénac", city="17630 La Flotte · Île de Ré", phone="05 46 09 60 18",
   hours=[("Horaires", "selon la saison, nous consulter")],
   intro_eyebrow="Le restaurant", intro_h="Poissons & fruits de mer <em>sur l'île de Ré</em>",
   intro_p=["Sur le quai de Sénac, face au port de La Flotte, le Saint-Georges vous accueille toute l'année pour une cuisine de la mer.",
            "La carte évolue au fil des saisons et des arrivages, accompagnée d'une carte des vins qui parcourt les différentes régions de France."],
   badge=("Île de Ré", "La Flotte"),
   feats=[("Au fil des saisons", "Une carte qui suit les saisons et les arrivages de produits frais."),
          ("Carte des vins", "Des références de différentes régions viticoles françaises."),
          ("Terrasse sur le port", "Une grande terrasse face aux bateaux."),
          ("Toute l'année", "Le Saint-Georges vous accueille en toutes saisons.")],
 ),
}

# ---------------------------------------------------------------- template
CSS = r"""
:root{--ink:%(ink)s;--ink-3:color-mix(in srgb,%(ink)s 85%%,#fff);--cream:#f6f1e8;--cream-2:#ece4d6;--paper:#fbf8f2;
--gold:%(accent)s;--gold-2:%(accent2)s;--text:#1c2226;--muted:#5d666d;--line:color-mix(in srgb,%(accent)s 40%%,transparent);
--serif:"Cormorant Garamond",Georgia,serif;--sans:"Manrope",system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{font-family:var(--sans);color:var(--text);background:var(--paper);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%%}a{color:inherit;text-decoration:none}
.wrap{width:min(1200px,100%% - 48px);margin:auto}
.eyebrow{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);font-weight:600;display:inline-flex;align-items:center;gap:14px}
.eyebrow::before{content:"";width:34px;height:1px;background:currentColor}
.on-light .eyebrow{color:var(--gold-2)}
h1,h2,h3{font-family:var(--serif);font-weight:500;line-height:1.08}
h2{font-size:clamp(2.3rem,5vw,3.8rem);margin:18px 0 22px}
h2 em,h1 em{font-style:italic;color:var(--gold)}
.on-light h2 em{color:var(--gold-2)}
p.lead{font-size:1.08rem;color:var(--muted);max-width:58ch}
section{padding:clamp(80px,11vw,140px) 0}
.btn{display:inline-flex;align-items:center;gap:12px;padding:16px 30px;font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;border:1px solid var(--gold);transition:.35s;cursor:pointer}
.btn-gold{background:var(--gold);color:var(--ink)}.btn-gold:hover{background:transparent;color:var(--gold)}
.btn-line{color:var(--gold)}.btn-line:hover{background:var(--gold);color:var(--ink)}
.btn-dark{border-color:var(--ink);color:var(--ink)}.btn-dark:hover{background:var(--ink);color:var(--cream)}
.topbar{background:#000;background:color-mix(in srgb,var(--ink) 70%%,#000);color:rgba(246,241,232,.65);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase}
.topbar .wrap{display:flex;justify-content:space-between;gap:20px;padding:10px 0;flex-wrap:wrap}
.topbar nav{display:flex;gap:20px;flex-wrap:wrap}.topbar a:hover{color:var(--gold)}.topbar .cur{color:var(--gold)}
header.main{position:sticky;top:0;z-index:50;transition:.4s}
header.main.scrolled{background:color-mix(in srgb,var(--ink) 94%%,transparent);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--line)}
header.main .wrap{display:flex;align-items:center;justify-content:space-between;height:84px}
.logo{display:flex;align-items:center;gap:14px;color:var(--cream)}
.logo img{height:58px;width:58px;object-fit:contain;background:#fff;border-radius:50%%;padding:3px}
.logo .mk{width:52px;height:52px;border:1px solid var(--gold);border-radius:50%%;display:grid;place-items:center;font-family:var(--serif);font-size:1.3rem;color:var(--gold);font-style:italic}
.logo span{font-family:var(--serif);font-size:1.45rem;line-height:1.05}
.logo small{display:block;font-family:var(--sans);font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-top:4px}
.menu{display:flex;align-items:center;gap:34px}
.menu a{color:var(--cream);font-size:.76rem;letter-spacing:.2em;text-transform:uppercase;font-weight:500;position:relative}
.menu a:not(.btn)::after{content:"";position:absolute;left:0;bottom:-6px;height:1px;width:0;background:var(--gold);transition:.3s}
.menu a:not(.btn):hover::after{width:100%%}.menu .btn{padding:12px 22px}
.burger{display:none;background:none;border:0;width:40px;height:40px;cursor:pointer}
.burger span{display:block;height:1px;background:var(--cream);margin:7px 6px;transition:.3s}
.hero{position:relative;min-height:calc(100vh - 38px);margin-top:-84px;display:flex;align-items:flex-end;color:var(--cream);overflow:hidden;background:var(--ink)}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.08);animation:zoom 14s ease-out forwards}
@keyframes zoom{to{transform:scale(1)}}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--ink) 72%%,transparent) 0%%,color-mix(in srgb,var(--ink) 35%%,transparent) 40%%,color-mix(in srgb,var(--ink) 94%%,transparent) 100%%)}
.hero.typo::after{background:radial-gradient(ellipse at 75%% 30%%,color-mix(in srgb,var(--gold-2) 45%%,transparent),transparent 60%%),linear-gradient(180deg,transparent,var(--ink))}
.hero .mono{position:absolute;right:-2vw;top:8vh;font-family:var(--serif);font-style:italic;font-size:clamp(14rem,38vw,34rem);line-height:.8;color:transparent;-webkit-text-stroke:1px color-mix(in srgb,var(--gold) 45%%,transparent);z-index:1;user-select:none}
.hero .waves{position:absolute;left:0;right:0;bottom:0;z-index:1;opacity:.25}
.hero .wrap{position:relative;z-index:2;padding:200px 0 70px}
.hero h1{font-size:clamp(3rem,8vw,6.6rem);max-width:13ch;margin:22px 0 26px;font-weight:400}
.hero p{max-width:52ch;color:rgba(246,241,232,.82);font-size:1.1rem}
.ctas{display:flex;gap:16px;flex-wrap:wrap;margin-top:38px}
.hero-info{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);margin-top:70px;padding-top:28px;gap:30px}
.hero-info div{font-size:.92rem;color:rgba(246,241,232,.85)}
.hero-info b{display:block;font-weight:600;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.hero-info a:hover{color:var(--gold)}
.intro .grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,7vw,100px);align-items:center}
.stack{position:relative;aspect-ratio:4/5}
.stack img{position:absolute;object-fit:cover;box-shadow:0 30px 60px -20px rgba(0,0,0,.35)}
.stack .a{top:0;left:0;width:78%%;height:82%%}.stack .b{right:0;bottom:0;width:52%%;height:52%%;border:10px solid var(--paper)}
.stack .badge,.plate .badge{position:absolute;left:-14px;bottom:8%%;background:var(--ink);color:var(--cream);padding:22px 26px;font-family:var(--serif);font-size:1.1rem;line-height:1.3;z-index:2}
.stack .badge em,.plate .badge em{color:var(--gold);font-size:2.2rem;display:block}
.plate{position:relative;aspect-ratio:4/5;background:var(--ink);display:grid;place-items:center}
.plate .big{font-family:var(--serif);font-style:italic;font-size:clamp(7rem,16vw,13rem);color:transparent;-webkit-text-stroke:1px var(--gold);line-height:1}
.plate::before{content:"";position:absolute;inset:18px;border:1px solid var(--line)}
.plate .cap{position:absolute;top:44px;left:0;right:0;text-align:center;font-size:.68rem;letter-spacing:.32em;text-transform:uppercase;color:var(--gold)}
.intro p.lead+p.lead{margin-top:16px}
.features{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:40px;padding-top:34px;border-top:1px solid var(--line)}
.features h4{font-family:var(--serif);font-size:1.4rem;font-weight:500;margin-bottom:6px}
.features p{color:var(--muted);font-size:.95rem}
.sig{background:var(--ink);color:var(--cream)}
.sig .grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,7vw,100px);align-items:center}
.sig p.lead{color:rgba(246,241,232,.72)}
.sig .price{font-family:var(--serif);font-size:3.4rem;color:var(--gold);margin-top:18px}
.frame{position:relative;max-width:520px;justify-self:end;width:100%%;aspect-ratio:1}
.frame img{width:100%%;height:100%%;object-fit:cover;position:relative;z-index:1}
.frame::before{content:"";position:absolute;inset:-18px 18px 18px -18px;border:1px solid var(--gold)}
.carte{background:var(--cream)}
.carte .head{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap;margin-bottom:40px}
.tabs{display:flex;gap:0;flex-wrap:wrap;border-bottom:1px solid var(--line);margin-bottom:50px}
.tabs button{background:none;border:0;padding:16px 22px;font-family:var(--sans);font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--muted);cursor:pointer;position:relative}
.tabs button::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--gold-2);transform:scaleX(0);transition:.3s}
.tabs button.on{color:var(--ink)}.tabs button.on::after{transform:none}
.panel{display:none}.panel.on{display:block;animation:fade .5s}
@keyframes fade{from{opacity:0;transform:translateY(10px)}}
.panel .sub{font-family:var(--serif);font-style:italic;font-size:1.2rem;color:var(--muted);margin-bottom:30px}
.dishes{display:grid;grid-template-columns:1fr 1fr;column-gap:60px}
.dish{padding:18px 0;border-bottom:1px solid var(--line);break-inside:avoid}
.dish .row{display:flex;align-items:baseline;gap:12px}
.dish .n{font-family:var(--serif);font-size:1.3rem;font-weight:500}
.dish .dots{flex:1;border-bottom:1px dotted color-mix(in srgb,var(--gold-2) 50%%,transparent);transform:translateY(-5px)}
.dish .p{font-family:var(--serif);font-size:1.25rem;color:var(--gold-2);white-space:nowrap}
.dish .d{color:var(--muted);font-size:.9rem;margin-top:2px}
.formulas{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
.fcard{background:var(--paper);border:1px solid var(--line);padding:40px 30px;text-align:center;position:relative}
.fcard::before{content:"";position:absolute;inset:8px;border:1px solid var(--line);pointer-events:none}
.fcard:nth-child(2){background:var(--ink);color:var(--cream)}
.fcard h3{font-size:1.8rem;margin-bottom:12px}
.fcard p{font-size:.9rem;color:var(--muted)}.fcard:nth-child(2) p{color:rgba(246,241,232,.7)}
.fcard .p{font-family:var(--serif);font-size:2.6rem;color:var(--gold-2);margin-top:16px;line-height:1}
.fcard:nth-child(2) .p{color:var(--gold)}
.notes{margin-top:50px;font-size:.82rem;color:var(--muted);border-top:1px solid var(--line);padding-top:24px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}
.gal{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.gal figure{aspect-ratio:1;overflow:hidden}.gal img{width:100%%;height:100%%;object-fit:cover;transition:transform 1s}
.gal figure:hover img{transform:scale(1.07)}
.quote{background:var(--ink);color:var(--cream);text-align:center;padding:clamp(70px,9vw,110px) 0}
.quote p{font-family:var(--serif);font-style:italic;font-size:clamp(1.9rem,4vw,3rem);max-width:26ch;margin:20px auto 0;line-height:1.2}
.contact .cgrid{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(40px,6vw,80px);align-items:stretch}
.cblocks{margin-top:34px}
.cb{padding:24px 0;border-top:1px solid var(--line);display:grid;grid-template-columns:150px 1fr;gap:20px}
.cb:last-child{border-bottom:1px solid var(--line)}
.cb b{font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold-2);font-weight:600;padding-top:6px}
.cb .v{font-family:var(--serif);font-size:1.4rem;line-height:1.35}
.cb .v small{display:block;font-family:var(--sans);font-size:.88rem;color:var(--muted);margin-top:4px}
.cb a.v:hover{color:var(--gold-2)}
.map{position:relative;min-height:500px;background:var(--cream-2)}
.map iframe{position:absolute;inset:0;width:100%%;height:100%%;border:0;filter:grayscale(.55) sepia(.12)}
.group{background:var(--cream)}
.ggrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin-top:50px}
.ggrid a{background:var(--cream);padding:30px 28px;display:flex;justify-content:space-between;align-items:center;transition:.3s}
.ggrid a:hover{background:var(--ink);color:var(--cream)}
.ggrid a span{font-family:var(--serif);font-size:1.5rem}.ggrid a i{color:var(--gold-2);font-style:normal}
footer{background:color-mix(in srgb,var(--ink) 75%%,#000);color:rgba(246,241,232,.7);padding:80px 0 30px;font-size:.92rem}
.fgrid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:40px}
footer h5{font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:18px}
footer ul{list-style:none;display:grid;gap:9px}footer a:hover{color:var(--gold)}
footer .fn{font-family:var(--serif);font-size:2rem;color:var(--cream);margin-bottom:12px}
.fbottom{margin-top:60px;padding-top:24px;border-top:1px solid color-mix(in srgb,var(--gold) 20%%,transparent);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:.78rem}
.rv{opacity:0;transform:translateY(30px);transition:opacity 1s,transform 1s}.rv.in{opacity:1;transform:none}
.mres{display:none}
@media (max-width:1000px){
 .menu{position:fixed;inset:0;background:var(--ink);flex-direction:column;justify-content:center;gap:30px;transform:translateX(100%%);transition:.5s}
 .menu.open{transform:none}.menu a{font-size:1rem}
 .burger{display:block;position:relative;z-index:60}
 .burger.x span:nth-child(1){transform:translateY(8px) rotate(45deg)}.burger.x span:nth-child(2){opacity:0}.burger.x span:nth-child(3){transform:translateY(-8px) rotate(-45deg)}
 .intro .grid,.sig .grid,.contact .cgrid{grid-template-columns:1fr}
 .frame{justify-self:start}.ggrid{grid-template-columns:1fr 1fr}.gal{grid-template-columns:1fr 1fr}.fgrid{grid-template-columns:1fr 1fr}
}
@media (max-width:680px){
 .wrap{width:calc(100%% - 32px)}.topbar{display:none}
 .hero-info{grid-template-columns:1fr;gap:18px}
 .dishes,.features,.ggrid,.fgrid{grid-template-columns:1fr}
 .cb{grid-template-columns:1fr;gap:4px}.stack .badge,.plate .badge{left:0}
 .tabs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.tabs button{white-space:nowrap;padding:14px 16px}
 .logo span{font-size:1.2rem}
 .mres{display:flex;position:fixed;left:12px;right:12px;bottom:12px;z-index:40;gap:8px}
 .mres a{flex:1;justify-content:center;padding:15px 10px;box-shadow:0 10px 30px rgba(0,0,0,.3)}
 footer{padding-bottom:100px}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}}
"""

WAVES = '<svg class="waves" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90 C240 40 480 140 720 90 S1200 40 1440 90" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0 120 C240 70 480 170 720 120 S1200 70 1440 120" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0 60 C240 10 480 110 720 60 S1200 10 1440 60" fill="none" stroke="currentColor" stroke-width="1"/></svg>'


def tel(p): return "tel:+33" + p.replace(" ", "")[1:]


def dish_html(n, d, p):
    return (f'<div class="dish"><div class="row"><span class="n">{e(n)}</span><span class="dots"></span>'
            f'<span class="p">{e(p)}</span></div>' + (f'<div class="d">{e(d)}</div>' if d else "") + "</div>")


def menu_html(r):
    tabs, panels = [], []
    for i, (title, sub, its) in enumerate(r["menu"]):
        on = " on" if i == 0 else ""
        tabs.append(f'<button class="{on.strip()}" data-t="{i}">{e(title)}</button>')
        if title == "Formules":
            body = '<div class="formulas">' + "".join(
                f'<div class="fcard"><span class="eyebrow" style="justify-content:center">Formule</span><h3>{e(n)}</h3><p>{e(d)}</p><div class="p">{e(p)}</div></div>'
                for n, d, p in its) + "</div>"
        else:
            body = '<div class="dishes">' + "".join(dish_html(*x) for x in its) + "</div>"
        panels.append(f'<div class="panel{on}" data-p="{i}">' + (f'<p class="sub">{e(sub)}</p>' if sub else "") + body + "</div>")
    pdf = f'<a class="btn btn-dark" href="{r["pdf"]}" target="_blank" rel="noopener">Carte complète (PDF) →</a>' if r.get("pdf") else ""
    return f'''
<section class="carte on-light" id="carte">
  <div class="wrap">
    <div class="head rv"><div><span class="eyebrow">La carte</span><h2>{r["menu_title"]}</h2></div>
    <p class="lead">{e(r.get("menu_lead","Galettes de sarrasin, crêpes de froment et cidres de Bretagne."))}</p></div>
    <div class="tabs" role="tablist">{"".join(tabs)}</div>
    {"".join(panels)}
    <div class="notes"><span>{e(r.get("notes",""))}</span>{pdf}</div>
  </div>
</section>'''


def page(fname, r):
    name = r["name"]
    nav_group = "".join(
        f'<a href="{f}"{" class=cur" if f == fname else ""}>{e(n)}</a>' for f, n in GROUP)
    if r.get("logo"):
        logo = f'<img src="{r["logo"]}" alt="{e(name)}"><span>{e(name)}<small>{e(r["kind"])}</small></span>'
    else:
        mono = r.get("mono") or "".join(w[0] for w in name.replace("'", " ").split() if w[0].isupper())[:2]
        logo = f'<span class="mk">{e(mono)}</span><span>{e(name)}<small>{e(r["kind"])}</small></span>'
    phone = r.get("phone")
    if r.get("booking"):
        primary = f'<a href="{r["booking"]}" target="_blank" rel="noopener" class="btn btn-gold">Réserver une table</a>'
    elif phone:
        primary = f'<a href="{tel(phone)}" class="btn btn-gold">Réserver · {phone}</a>'
    else:
        primary = f'<a href="{r["facebook"]}" target="_blank" rel="noopener" class="btn btn-gold">Nous suivre sur Facebook</a>'
    nav_btn = (f'<a href="{r["booking"]}" target="_blank" rel="noopener" class="btn btn-gold">Réserver</a>' if r.get("booking")
               else f'<a href="{tel(phone)}" class="btn btn-gold">Réserver</a>' if phone else "")
    has_menu = bool(r.get("menu"))
    second = '<a href="#carte" class="btn btn-line">Découvrir la carte</a>' if has_menu else '<a href="#contact" class="btn btn-line">Nous trouver</a>'

    if r.get("hero"):
        hero = f'<section class="hero" id="top"><div class="hero-bg" style="background-image:url(\'{r["hero"]}\')"></div>'
    else:
        hero = f'<section class="hero typo" id="top"><div class="mono" aria-hidden="true">{e(r["mono"])}</div><div style="color:var(--gold)">{WAVES}</div>'
    hours_txt = " · ".join(f"{a} {b}" for a, b in r["hours"])
    info3 = (f'<div><b>Téléphone</b><a href="{tel(phone)}">{phone}</a></div>' if phone else
             (f'<div><b>Actualités</b><a href="{r["facebook"]}" target="_blank" rel="noopener">Sur Facebook →</a></div>' if r.get("facebook") else
              f'<div><b>Réservation</b><a href="{r.get("booking","#contact")}" target="_blank" rel="noopener">Réserver en ligne →</a></div>'))
    hero += f'''
  <div class="wrap">
    <span class="eyebrow">{e(r["tagline"])}</span>
    <h1>{r["h1"]}</h1>
    <p>{e(r["lead"])}</p>
    <div class="ctas">{primary}{second}</div>
    <div class="hero-info">
      <div><b>Horaires</b>{e(hours_txt)}</div>
      <div><b>Adresse</b>{e(r["address"])}, {e(r["city"])}</div>
      {info3}
    </div>
  </div>
</section>'''

    if len(r.get("photos", [])) >= 2:
        visual = (f'<div class="stack rv"><img class="a" src="{r["photos"][0]}" alt="{e(name)}"><img class="b" src="{r["photos"][1]}" alt="{e(name)}">'
                  f'<div class="badge"><em>{e(r["badge"][0])}</em>{e(r["badge"][1])}</div></div>')
    else:
        visual = (f'<div class="plate rv"><div class="cap">{e(name)}</div><div class="big">{e(r["mono"])}</div>'
                  f'<div class="badge"><em>{e(r["badge"][0])}</em>{e(r["badge"][1])}</div></div>')
    paras = "".join(f'<p class="lead">{e(p)}</p>' for p in r["intro_p"])
    feats = "".join(f'<div><h4>{e(a)}</h4><p>{e(b)}</p></div>' for a, b in r["feats"])
    intro = f'''
<section class="intro on-light" id="maison">
  <div class="wrap grid">
    {visual}
    <div class="rv">
      <span class="eyebrow">{e(r["intro_eyebrow"])}</span>
      <h2>{r["intro_h"]}</h2>
      {paras}
      <div class="features">{feats}</div>
    </div>
  </div>
</section>'''

    sig = ""
    if r.get("signature"):
        n, d, p = r["signature"]
        sig = f'''
<section class="sig">
  <div class="wrap grid">
    <div class="rv"><span class="eyebrow">Signature</span><h2>{e(n)}</h2><p class="lead">{e(d)}</p><div class="price">{e(p)}</div>
      <div class="ctas"><a href="{'#carte' if r.get('menu') else '#' + (r.get('extra_nav') or [('contact',)])[0][0]}" class="btn btn-line">Voir toute la carte →</a></div></div>
    <div class="frame rv"><img src="{r.get("sig_img") or r["photos"][3]}" alt="{e(n)}"></div>
  </div>
</section>'''

    gal = ""
    if len(r.get("photos", [])) >= 4:
        gal = '<div class="gal">' + "".join(f'<figure><img src="{u}" alt="{e(name)}"></figure>' for u in r["photos"]) + "</div>"

    quote = f'<section class="quote"><div class="wrap rv"><span class="eyebrow">{e(name)}</span><p>{e(r["quote"])}</p></div></section>' if r.get("quote") else ""

    blocks = []
    if phone:
        blocks.append(f'<div class="cb"><b>Téléphone</b><a class="v" href="{tel(phone)}">{phone}<small>Réservations et renseignements</small></a></div>')
    if r.get("email"):
        blocks.append(f'<div class="cb"><b>E-mail</b><a class="v" href="mailto:{r["email"]}">{r["email"]}</a></div>')
    q = urllib.parse.quote(f'{name}, {r["address"]}, {r["city"].split("·")[0].strip()}')
    blocks.append(f'<div class="cb"><b>Adresse</b><div class="v">{e(r["address"])}<br>{e(r["city"])}<small><a href="https://www.google.com/maps/search/?api=1&query={q}" target="_blank" rel="noopener" style="color:var(--gold-2)">Voir sur Google Maps →</a></small></div></div>')
    hrs = "".join(f'{e(a)} · {e(b)}<br>' for a, b in r["hours"])
    blocks.append(f'<div class="cb"><b>Horaires</b><div class="v" style="font-size:1.2rem">{hrs}' + (f'<small>{e(r["service"])}</small>' if r.get("service") else "") + '</div></div>')
    for lk in r.get("links", []):
        lbl, url = lk[0], lk[1]
        txt = lk[2] if len(lk) > 2 else url.split("//")[1].split("?")[0]
        blocks.append(f'<div class="cb"><b>{e(lbl)}</b><a class="v" href="{url}" target="_blank" rel="noopener" style="font-size:1.15rem;word-break:break-all">{e(txt)} →</a></div>')
    contact = f'''
<section class="contact on-light" id="contact">
  <div class="wrap cgrid">
    <div class="rv"><span class="eyebrow">Nous trouver</span><h2>Venez nous <em>rendre visite</em></h2><div class="cblocks">{"".join(blocks)}</div></div>
    <div class="map rv"><iframe title="Plan d'accès" loading="lazy" src="https://maps.google.com/maps?q={q}&z=16&output=embed"></iframe></div>
  </div>
</section>'''

    others = "".join(f'<a href="{f}"><span>{e(n)}</span><i>→</i></a>' for f, n in GROUP if f != fname)
    group = f'''
<section class="group on-light" id="groupe">
  <div class="wrap">
    <div class="rv" style="max-width:720px"><span class="eyebrow">Nos maisons</span><h2>Nous vous accueillons aussi <em>dans nos autres restaurants</em></h2></div>
    <div class="ggrid rv">{others}</div>
  </div>
</section>'''

    menu_link = '<a href="#carte">La carte</a>' if has_menu else ""
    mres = (f'<div class="mres"><a href="{tel(phone)}" class="btn btn-gold">Appeler</a><a href="#contact" class="btn" style="background:var(--ink);color:var(--cream);border-color:var(--ink)">Itinéraire</a></div>' if phone else "")
    flinks = "".join(f'<li><a href="{f}">{e(n)}</a></li>' for f, n in GROUP if f != fname) or "".join(
        f'<li><a href="{lk[1]}" target="_blank" rel="noopener">{e(lk[2] if len(lk) > 2 else lk[0])}</a></li>' for lk in r.get("links", []))
    extra_nav = "".join(f'<a href="#{a}">{e(b)}</a>' for a, b in r.get("extra_nav", []))
    extra = r.get("extra_html", "")
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(name)} — {e(r["tagline"])}</title>
<meta name="description" content="{e(r["lead"])}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>{CSS % r}</style>
</head>
<body>
{f'<div class="topbar"><div class="wrap"><span class="lbl">Nos maisons</span><nav>{nav_group}</nav></div></div>' if GROUP else ""}
<header class="main" id="hdr"><div class="wrap">
  <a href="#top" class="logo">{logo}</a>
  <nav class="menu" id="menu"><a href="#maison">La maison</a>{menu_link}{extra_nav}<a href="#contact">Contact</a>{'<a href="#groupe">Nos maisons</a>' if GROUP else ""}{nav_btn}</nav>
  <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>
{hero}
{intro}
{sig}
{menu_html(r) if has_menu else ""}
{extra}
{gal}
{quote}
{contact}
{group if GROUP else ""}
<footer><div class="wrap">
  <div class="fgrid">
    <div><div class="fn">{e(name)}</div><p>{e(r["lead"])}</p></div>
    <div><h5>Nous trouver</h5><ul><li>{e(r["address"])}</li><li>{e(r["city"])}</li>{f'<li><a href="{tel(phone)}">Tél : {phone}</a></li>' if phone else ""}{f'<li><a href="mailto:{r["email"]}">{r["email"]}</a></li>' if r.get("email") else ""}<li>{e(hours_txt)}</li></ul></div>
    <div><h5>{"Nos autres restaurants" if GROUP else "Liens"}</h5><ul>{flinks}</ul></div>
  </div>
  <div class="fbottom"><span>© {e(name)}{" — une maison du groupe Le Bistrot des Pêcheurs" if GROUP else ""}</span><span>{e(r["tagline"])}</span></div>
</div></footer>
{mres}
<script>
const hdr=document.getElementById('hdr');addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>60),{{passive:true}});
const b=document.getElementById('burger'),m=document.getElementById('menu');
b.onclick=()=>{{m.classList.toggle('open');b.classList.toggle('x')}};
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{{m.classList.remove('open');b.classList.remove('x')}}));
document.querySelectorAll('.tabs button').forEach(t=>t.onclick=()=>{{
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===t));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.dataset.p===t.dataset.t));}});
const io=new IntersectionObserver(es=>es.forEach(x=>{{if(x.isIntersecting){{x.target.classList.add('in');io.unobserve(x.target)}}}}),{{threshold:.1}});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
</script>
</body>
</html>
'''


if __name__ == "__main__":
  for fname, r in R.items():
    (OUT / fname).write_text(page(fname, r), encoding="utf-8")
    print("écrit", fname)
