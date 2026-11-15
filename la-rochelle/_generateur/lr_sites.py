#!/usr/bin/env python3
"""Sites de démonstration pour une sélection de restaurants de La Rochelle."""
import json, pathlib, sys, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import gen
from gen import items

gen.GROUP = []
e = html.escape
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
IM = {k: [u for u, w, h in v] for k, v in json.load(open(pathlib.Path(__file__).parent / "lr/imgs.json")).items()}


def cards(eyebrow, title, lead, cs, dark=False, anchor=""):
    """Section de cartes (réutilise les styles .fcard)."""
    body = "".join(
        f'<div class="fcard"><span class="eyebrow" style="justify-content:center">{e(a)}</span><h3>{e(b)}</h3><p>{e(c)}</p>'
        + (f'<div class="p">{e(d)}</div>' if d else "") + "</div>" for a, b, c, d in cs)
    bg = "background:var(--paper)" if not dark else "background:var(--cream)"
    return f'''
<section class="on-light" id="{anchor}" style="{bg}">
  <div class="wrap">
    <div class="rv" style="max-width:760px;margin-bottom:50px"><span class="eyebrow">{e(eyebrow)}</span><h2>{title}</h2>{f'<p class="lead">{e(lead)}</p>' if lead else ""}</div>
    <div class="formulas rv">{body}</div>
  </div>
</section>'''


def cta(eyebrow, title, lead, url, label):
    return f'''
<section class="quote"><div class="wrap rv"><span class="eyebrow">{e(eyebrow)}</span><p>{title}</p>
<p style="font-family:var(--sans);font-style:normal;font-size:1.02rem;color:rgba(246,241,232,.75);max-width:60ch;margin-top:22px">{e(lead)}</p>
<div class="ctas" style="justify-content:center"><a class="btn btn-line" href="{url}" target="_blank" rel="noopener">{e(label)} →</a></div></div></section>'''


S = {}

# ------------------------------------------------------------------ Le Merluberlu
m = IM["merluberlu"]
S["le-merluberlu.html"] = dict(
  name="Le Merluberlu", kind="Restaurant & bar à tapas", tagline="Vieux-Port · face aux tours",
  accent="#e3b25b", accent2="#1f6f8b", ink="#0b1d26", hero=m[5],
  h1="Deux bordées, <em>un seul port</em>",
  lead="Restaurant de poisson le midi, bar à tapas le soir, sur le Vieux-Port de La Rochelle. Le midi on cuisine la marée, le soir on trinque au comptoir, face aux tours.",
  address="37, quai Valin", city="17000 La Rochelle", phone="05 46 27 97 07", email="contact-lr@merluberlu.com",
  booking="https://www.merluberlularochelle.fr/",
  hours=[("Mardi – samedi", "midi 12h00 – 14h15 · tapas 18h30 – 22h15"), ("Bar", "jusqu'à minuit mar.–mer., 2h jeu.–sam."), ("Fermé", "lundi et dimanche (sauf fériés)")],
  service="Réservation le midi · sans réservation le soir",
  intro_eyebrow="Le Merluberlu", intro_h="On change d'allure <em>quand le soleil passe derrière les tours</em>",
  intro_p=["Le midi, une carte qui change au fil des saisons et des arrivages : poulpe grillé, fish and chips, suggestion de la criée ou huîtres de l'île de Ré. Le soir, des tapas de la mer à partager, des vins bio et nature, des bières pression et des cocktails.",
           "L'équipage : des bons vivants au pied marin, passionnés de cuisine depuis toujours, qui ont à cœur de proposer une cuisine sincère, ancrée dans les saisons, généreuse et toujours arrosée de bons vins."],
  badge=("12h", "– 2h du jeudi au samedi"),
  feats=[("Le midi, poisson", "Mardi – samedi, 12h00 – 14h15, sur réservation."), ("Le soir, tapas", "Mardi – samedi, 18h30 – 22h15, sans réservation."),
         ("En terrasse", "Sur le quai, face aux tours Saint-Nicolas et de la Chaîne."), ("Vins nature", "Muscadet, chenin, gamay… au verre, en pichet ou à la bouteille.")],
  photos=[m[0], m[2], m[3], m[1]], sig_img=m[1],
  signature=("L'incontournable poulpe", "Poulpe grillé, riz sauté thaï et sauce spicy mango.", "23 €"),
  menu_title="La carte <em>du midi</em>", menu_lead="Le chef suit les marées, la carte suit le chef. Prix nets en euros, allergènes sur demande.",
  menu=[
    ("Formules", "", [
      ("Menu Godaille", "Du mardi au vendredi, hors jours fériés · entrée + plat ou plat + dessert", "25 €"),
      ("Menu Godaille complet", "Entrée + plat + dessert + café", "30 €"),
      ("Menu Moussaillon", "Petit fish'n'chips, 1 boule de glace au choix, sirop à l'eau", "12 €")]),
    ("Entrées", "Ça sort de notre cuisine", items("""
Huîtres fines n°3 île de Ré | « La Cabane Océane » · x6 11,50 € · x9 16,50 € · x12 | 22 €
Arancini aux champignons | noisettes et ketchup de courge | 8,50 €
Tartare de maigre | grenade, pistache et citron vert | 9 €
Rillette de hareng fumé | 9 €
Poêlée de seiches et encornets | crémeux au foin et scamorza fumée | 10 €
Accras de poissons, sauce spicy mango | x6 11,50 € · x12 | 18 €
Planche de la Mer | Rillettes, accras x4, terrine du moment, tartare | 29 €""")),
    ("Plats", "Selon la marée", items("""
Poisson du moment | Risotto de perles de blé aux champignons et scamorza fumée | 20 €
Le merlu | Merlu snacké, chou-fleur, cacahuètes et sauce satay | selon arrivage
L'incontournable poulpe | Poulpe grillé, riz sauté thaï et sauce spicy mango | 23 €
Gnocchis à la romaine | champignons, sauce bordelaise | 19 €
Fish and chips | Croustillants de poisson au panko, frites, sauce ranch | 18,50 €
Suggestion de la criée | Selon l'arrivage et l'humeur du chef ! | ardoise""")),
    ("Desserts", "", items("""
Pumpkin pie meringuée | 8,50 €
Banoffee au chocolat blanc | 8,50 €
Glaces ou sorbets | Vanille, cacao intense, pistache, mangue, framboise, citron vert · la boule | 3 €""")),
    ("Tapas du soir", "Mardi – samedi, 18h30 – 22h15 · à partager entre matelots… ou pas", items("""
Huîtres fines n°3 île de Ré | x6 11,50 € · x9 16,50 € · x12 | 22 €
Croustillants de poisson | Frits au panko, sauce ranch | 14 €
Poêlée de seiches et encornets | crémeux au foin et scamorza fumée | 10 €
Accras de poissons, sauce spicy mango | 10,50 € · | 18 €
Poulpe grillé, sauce spicy mango | 12 €
Octo-dog | Pain hot-dog (Pâton), poulpe grillé, compotée d'oignons, sauce spicy mango | ardoise
Arancini aux champignons | 8,50 €
Planche de la mer | Rillettes, tartare, accras x4, terrine du moment | 29 €
Frites, sauce cheddar | 8 €""")),
    ("Au comptoir", "Bières, cocktails et vins bio & nature", items("""
La Débauche | IPA, Angoulême, 6° · 25 cl 4 € · 33 cl 5,50 € · 50 cl | 7,50 €
Double belge | Ambrée, Angoulême, 7° · 25 cl 4,50 € · 33 cl 6 € · 50 cl | 8 €
La Merluche | Blonde lager, belge, 5° | dès 3 €
Mojito · Caïpi · Ginto · Pinoto au pineau | Les incontournables du Merlu | 8 €
Moscow, London ou Mexican mule | 8,50 €
Espresso Martini · Negroni · Paloma · Maï Taï | Les classiques | 9 €
Mocktails | Litchi spritz, Candy Sunset, Virgin Mojito, Mango n°5, Virgin Coffee | carte
Vins bio & nature | Au verre (12,5 cl), en pichet (50 cl) ou à la bouteille | dès 4,50 €""")),
  ],
  notes="Prix nets en euros · Informations allergènes disponibles sur demande · L'abus d'alcool est dangereux pour la santé.",
  quote="Que ce soit pour déjeuner en terrasse sous l'œil de nos fameuses tours ou pour la bière de débauche, nous sommes sur le pont.",
  links=[("Site actuel", "https://www.merluberlularochelle.fr/", "merluberlularochelle.fr"), ("Instagram", "https://www.instagram.com/le_merluberlu_la_rochelle/", "@le_merluberlu_la_rochelle")],
)

# ------------------------------------------------------------------ La Kase
k = IM["lakase"]
S["la-kase.html"] = dict(
  name="La Kase", kind="Bistronomique", tagline="Bistronomique · terrasse · salle climatisée",
  accent="#e0a85e", accent2="#2f6b5a", ink="#10201b", hero=k[1],
  h1="Un voyage <em>des sens</em>",
  lead="Une cuisine créative et vivante, qui met en valeur les produits de la mer et les saveurs exotiques, au cœur du Vieux-Port de La Rochelle.",
  address="13, rue de la Chaîne", city="17000 La Rochelle", phone="05 46 55 73 36", booking="https://www.lakase.fr/",
  hours=[("Fermé", "lundi et mardi"), ("Service", "midi 12h00 – 13h45 · soir dès 19h00")],
  service="Terrasse · privatisation · climatisation",
  intro_eyebrow="Bienvenue à La Kase", intro_h="Deux frères, <em>mille saveurs</em>",
  intro_p=["À la tête de La Kase, deux frères : Sébastien en salle et Patrice en cuisine, chef passé par des maisons prestigieuses. Passionnés de cuisine et de voyage, ils cultivent dans ce lieu cosy et intimiste le plaisir de recevoir autour de plats créatifs.",
           "Les produits du marché sont revisités avec épices et ingrédients du monde (Antilles, Réunion, Asie, Amérique latine…), dans une agréable rue piétonne du Vieux-Port. Et pour les amateurs, un rhum arrangé maison."],
  badge=("100 %", "fait maison"),
  feats=[("Fait maison", "Tous nos plats sont élaborés à partir de produits bruts et frais."), ("Carte végétarienne", "Accras, risotto de saison et desserts végétaux."),
         ("Terrasse & salle climatisée", "Dans une rue piétonne, au cœur du Vieux-Port."), ("Privatisation", "Pour vos événements, sur demande.")],
  photos=[k[0], k[1]],
  menu_title="La carte <em>de La Kase</em>", menu_lead="Tous nos plats sont faits maison, élaborés à partir de produits bruts et frais.",
  menu=[
    ("Formules", "Menu déjeuner, uniquement le midi sur les plats à l'ardoise (hors dimanche et jours fériés)", [
      ("Entrée + plat ou plat + dessert", "Selon l'ardoise du jour", "21,50 €"),
      ("Entrée + plat + dessert", "Selon l'ardoise du jour", "26,90 €")]),
    ("Plats signatures", "", items("""
Magret de canard fumé au foin | Écrasé de pommes de terre à la truffe, sauce vanille des îles | 39,50 €
Croquant et moelleux de bœuf à la noisette | Fumé au foin, romarin et écorce d'agrumes, écrasé de pommes de terre à la truffe et légumes de saison | 35,50 €""")),
    ("Entrées", "", items("""
Foie gras maison | Chutney du moment | 19 €
Houmous du moment et abricot rôti | Coriandre et sésame | 12,50 €
Gravelax de saumon | Salade pickliz | 14,50 €
Accras de morue comme aux Antilles | Sauce chien et piments · les 6 10 € · les 9 14,50 € · les 12 | 18 €
Les incontournables huîtres de l'île de Ré | les 6 12 € · les 12 | 24 €""")),
    ("Plats", "", items("""
Filet de bœuf | Écrasé de pommes de terre à la truffe | 33,50 €
Filet de bar mariné huile d'olive & combava | Risotto crémeux, sauce vanille | 27 €
Souris d'agneau confite aux épices créoles | Purée de patates douces | carte
Poulet crispy | Caramel thaï et riz parfumé | 20,50 €
Pêche du jour | Sauce vierge et légumes de saison | 23,50 €""")),
    ("Végétarien", "Notre carte végétarienne", items("""
Houmous du moment et abricot rôti | Coriandre et sésame | 12,50 €
Accras végétariens comme aux Antilles | les 6 13,50 € · les 9 | 17 €
Risotto aux légumes de saison | Riz au citron vert et tuiles de parmesan au poivre de Sichuan | 18,50 €""")),
    ("Desserts", "", items("""
Sélection 3 fromages de chez Beillevaire | carte
Profiteroles maison | Glace vanille, sauce chocolat, amandes grillées et chantilly maison végétale | 11 €
Mousse au chocolat à la fleur de sel | Chantilly maison végétale et amandes grillées | 8 €
Coupe de glace maison au sirop piment | Glace maison et sirop piment antillais | 9 €
Moelleux au curcuma | avec chantilly végétale maison | carte""")),
  ],
  notes="Demandez-nous conseil pour un accord parfait · Carte des vins : blancs, rouges, rosés, champagnes · L'abus d'alcool est dangereux pour la santé.",
  quote="Une cuisine des voyages, inspirée, aux accents bistronomiques, ponctuée pour les amateurs par un rhum arrangé maison.",
  links=[("Site actuel", "https://www.lakase.fr/", "lakase.fr")],
)

# ------------------------------------------------------------------ L'Indigo
i = IM["indigo"]
S["l-indigo.html"] = dict(
  name="L'Indigo", kind="Brasserie", tagline="Quai du Gabut · face aux bateaux",
  accent="#f0b45a", accent2="#244f8f", ink="#0b1730", hero=i[3],
  h1="L'esprit brasserie <em>prend le large</em>",
  lead="Sur le Quai du Gabut, à quelques mètres des bateaux : une terrasse avec vue sur le port, une ambiance beach bar et une cuisine de brasserie tournée vers l'océan.",
  address="7, quai du Gabut", city="17000 La Rochelle", booking="https://www.lindigo-brasserie.com/",
  hours=[("Tous les jours", "11h30 – 21h30")],
  service="Déjeuner, dîner, pause gourmande",
  intro_eyebrow="Bienvenue à L'Indigo", intro_h="Une escale gourmande <em>entre port et centre-ville</em>",
  intro_p=["Repris en 2023 par Valentin et Julien, L'Indigo séduit par son accueil chaleureux et sa situation privilégiée entre la gare, le centre-ville et le port. Premier établissement visible en arrivant de la gare, c'est l'endroit parfait pour déjeuner, dîner ou profiter d'une glace, d'une crêpe ou d'un verre face aux couchers de soleil rochelais.",
           "En cuisine, Julien élabore une cuisine généreuse à base de produits frais : moules, huîtres locales, poissons du jour, seiches en persillade, mais aussi viandes et tagliatelles au pesto rosso."],
  badge=("7j/7", "11h30 – 21h30"),
  feats=[("Face aux bateaux", "Une grande terrasse avec vue panoramique sur le port."), ("Produits frais", "Moules, huîtres, poissons locaux et suggestions du jour."),
         ("Repas de groupe", "Anniversaires, repas d'entreprise, réunions de famille."), ("À deux pas de la gare", "Entre le centre historique, les tours et l'Aquarium.")],
  photos=[i[0], i[1], i[4], i[2]], sig_img=i[2],
  signature=("La grande assiette dégustation", "9 huîtres, 9 bulots, 9 crevettes, face aux bateaux du Quai du Gabut.", "23,50 €"),
  menu_title="La carte <em>de L'Indigo</em>", menu_lead="Une carte inspirée par l'océan et les produits frais, à savourer face aux bateaux.",
  menu=[
    ("Formules", "", [
      ("Formule du jour", "Entrée + plat ou plat + dessert · onglet de bœuf ou retour de pêche · café ou thé gourmand +1 €", "17,90 €"),
      ("Formule marinière", "Moules au choix + dessert au choix + boisson", "18,90 €"),
      ("Formule L'Indigo", "6 huîtres, 12 bulots ou 9 crevettes + plat + boisson", "23,90 €")]),
    ("Entrées", "", items("""
Soupe de poissons | Emmental râpé, rouille, croûtons | 8,70 €
Croustillants de chèvre chaud | Tranches de magret de canard fumé et miel | 8,80 €
Assiette de jambon Serrano | carte
Saumon gravelax | Crème d'aneth citronnée | 9 €
Tartare de thon | Avocat, mangue | carte
Bruschetta | Burrata, serrano, avocat | carte""")),
    ("Fruits de mer", "", items("""
6 huîtres | 9,50 €
12 huîtres | 17,90 €
12 bulots | 8,90 €
9 crevettes | carte
Petite assiette dégustation | 6 huîtres, 6 bulots, 6 crevettes | 17,50 €
Grande assiette dégustation | 9 huîtres, 9 bulots, 9 crevettes | 23,50 €""")),
    ("Moules", "Base : vin blanc, oignon, thym, laurier · servies avec frites", items("""
Marinière | 12,95 €
Crème | 13,95 €
Curry | 13,95 €
Pineau des Charentes | Base, crème, pineau | 14,95 €
Roquefort | 14,95 €""")),
    ("Côté mer & terre", "", items("""
Retour de pêche | voir ardoise
Encornets en persillade | Pommes de terre grenaille | 16,50 €
Thon mi-cuit au sésame | Tagliatelles, sauce vierge | 17,90 €
Seiches en persillade | Chorizo, tagliatelles au pesto rosso | carte
Onglet de bœuf 180 g | Sauce échalote, frites, salade | 14,90 €
Tartare de bœuf VBF au couteau | Préparé, frites, salade | 17 €
Entrecôte de bœuf 300 g | Sauce roquefort, frites, salade | 18,90 €""")),
    ("Salades & street food", "", items("""
Salade César | Salade, poulet, parmesan, croûtons, œuf, tomate | 15,90 €
Salade de chèvre | Croustillants de chèvre, miel, magret fumé, grenailles | carte
Salade libanaise | Falafels, légumes grillés, sauce yaourt | 15 €
Salade de la mer | Avocat, saumon fumé, crevettes, bulots | carte
Burger de bœuf | Oignons confits, cheddar, bacon fumé, frites, salade | carte
Fish & chips de cabillaud | Sauce tartare, frites, salade | carte
Profiteroles | Sauce chocolat, amandes grillées, chantilly | 7,90 €""")),
  ],
  notes="Menu également disponible en anglais · Crêpes, glaces et boissons l'après-midi.",
  quote="Face aux bateaux, l'esprit brasserie prend le large.",
  links=[("Site actuel", "https://www.lindigo-brasserie.com/", "lindigo-brasserie.com")],
)

# ------------------------------------------------------------------ Bar André
b = IM["barandre"]
S["bar-andre.html"] = dict(
  name="Bar André", kind="Brasserie de la mer · depuis 1947", tagline="Vieux-Port · au pied des deux tours",
  accent="#d6b06a", accent2="#8a2b2b", ink="#14100e", hero=b[4],
  h1="Une institution <em>du Vieux-Port</em>",
  lead="Brasserie de poissons et fruits de mer au pied des deux tours, ouverte tous les jours de 9h à 23h, en continu.",
  address="5, rue Saint-Jean-du-Pérot", city="17000 La Rochelle", phone="05 46 41 28 24",
  hours=[("Tous les jours", "9h00 – 23h00, en continu")],
  service="Terrasse · vente à emporter · groupes",
  intro_eyebrow="Depuis 1947", intro_h="Un lieu <em>chargé d'histoire</em>",
  intro_p=["Véritable institution à La Rochelle, le Bar André a été façonné au fil des décennies par l'histoire de la cité maritime. Les habitants s'y croisent, les fidèles s'y retrouvent, les familles le découvrent et on s'y donne rendez-vous à toute heure.",
           "Le Chef MOF Johan Leclerre sélectionne huîtres de Marennes-Oléron, moules et poissons, rendant hommage à la cuisine de La Rochelle, celle qu'il aime et qui lui rappelle son enfance."],
  badge=("1947", "lieu de convivialité"),
  feats=[("Une écaille moderne", "Huîtres, coquillages et plateaux réalisés sur demande."), ("Poissons entiers", "Saint-Pierre, sole, turbot et suggestions du jour."),
         ("Garnitures gourmandes", "Purée maison style Robuchon, pommes de terre grenailles."), ("Vins de la région", "Des flacons choisis pour la cuisine de la mer.")],
  photos=[b[0], b[2], b[3], b[5]], sig_img=b[5],
  signature=("Le plateau de fruits de mer", "Langoustines, palourdes, bulots, tourteaux, crevettes roses ou grises, bigorneaux, homards bleus… réalisés sur demande au fil de vos dégustations.", "à la carte"),
  extra_nav=[("ecaille", "La carte"), ("groupes", "Groupes")],
  quote="Ce petit troquet devenu brasserie a traversé les décennies sans jamais perdre son ambiance unique.",
  links=[("Site actuel", "https://www.barandre.com/", "barandre.com"), ("Carte (PDF)", "https://www.barandre.com/media/original/carte-menu.pdf", "Carte & menus (PDF)")],
)
S["bar-andre.html"]["extra_html"] = cards(
  "Cartes & menus", "Fruits de mer, poissons <em>et produits de la région</em>",
  "Face à l'ancienne halle aux poissons et aux quais où débarquaient jadis les pêcheurs, une sélection issue des parcs, producteurs et pêcheurs alentours.",
  [("L'écaille", "Huîtres & coquillages", "Huîtres de Marennes-Oléron, palourdes, bulots, bigorneaux, crevettes roses ou grises.", ""),
   ("Les plateaux", "Fruits de mer", "Langoustines, tourteaux, homards bleus : composés sur demande par une équipe expérimentée.", ""),
   ("La mer", "Poissons entiers", "Saint-Pierre, sole, turbot et quelques suggestions du jour.", "")], anchor="ecaille") + \
  '<div class="wrap" style="text-align:center;margin-top:-80px;padding-bottom:100px"><a class="btn btn-dark" href="https://www.barandre.com/media/original/carte-menu.pdf" target="_blank" rel="noopener">Voir la carte complète (PDF) →</a></div>' + \
  cta("Groupes & privatisations", "Privatisez le Bar André pour vos événements", "Des espaces pour se retrouver et des salles dans les étages : repas d'affaires, cocktails, célébrations privées, toute l'année, dans le cadre du Vieux-Port.", "https://www.barandre.com/fr/groupes-privatisations/", "Faire une demande").replace('class="quote"', 'class="quote" id="groupes"')

# ------------------------------------------------------------------ Les Flots
f = IM["lesflots"]
S["les-flots.html"] = dict(
  name="Les Flots", kind="Restaurant gastronomique", tagline="Grégory Coutanceau · au pied de la Tour de la Chaîne",
  accent="#c8a96a", accent2="#1d4e6b", ink="#0a1620", hero=f[1],
  h1="Un océan <em>de saveurs</em>",
  lead="Cuisine gastronomique de la mer du chef Grégory Coutanceau, dans un ancien estaminet du XVIIIᵉ siècle, face au spectacle permanent du Vieux-Port.",
  address="1, rue de la Chaîne", city="17000 La Rochelle", phone="05 46 41 32 51",
  hours=[("Midi", "12h15 – 14h00"), ("Soir", "19h30 – 21h30 (22h vendredi et samedi)")],
  service="Restaurant gastronomique · vue sur le port",
  intro_eyebrow="L'histoire", intro_h="Une histoire <em>commencée en 1945</em>",
  intro_p=["C'est au pied de la Tour de la Chaîne que se trouve cet ancien estaminet du XVIIIᵉ siècle. Protégé par les tours et face au Vieux-Port, le restaurant Les Flots est un endroit incontournable à La Rochelle.",
           "Le 17 décembre 1997, Grégory Coutanceau prend la direction des lieux : c'est sa première affaire, il n'a que 22 ans et des rêves plein la tête. C'est le début de la grande histoire des Flots."],
  badge=("1997", "Grégory Coutanceau"),
  feats=[("Fait maison", "Des plats préparés dans nos cuisines à partir de produits frais."), ("Producteurs", "Huîtres Gillardeau et Papin, langoustines de la Cotinière."),
         ("Viandes françaises", "Toutes nos viandes sont d'origine française."), ("Vue sur le port", "Au pied des tours, face au Vieux-Port.")],
  photos=[f[0], f[2], f[3], f[1]], sig_img=f[0],
  signature=("Le Ris de Veau & Langoustines", "Le plat signature : doré et rôti au poêlon, langoustines juste saisies, champignons des sous-bois et châtaignes confites, émulsion d'une bisque de langoustine.", "76 €"),
  menu_title="La carte <em>des mets</em>", menu_lead="Une cuisine de la mer confectionnée avec des produits de grande qualité, cuisinés avec finesse et originalité.",
  menu=[
    ("Formules", "Nos menus", [
      ("Menu Inspiration", "Midi et soir, excepté vendredi et samedi soir · change chaque semaine", "42 €"),
      ("Menu Découverte", "Entrée – plat ou plat – dessert 57 € · entrée – plat – dessert 72 €", "dès 57 €"),
      ("Aubade gastronomique", "Le grand menu du chef", "119 €")]),
    ("Les entrées", "", items("""
Les noix de coquilles Saint-Jacques | Marinade instantanée au citron et à l'estragon, purée de panais, pamplemousse rose, kalamansi | 28 €
La truite charentaise | Fumée au bois de hêtre, lait d'amande, coulis de cresson au beurre noisette, œufs de truite | 26 €
Le tartare | La Salers et les huîtres de chez Mr Papin, sanguine de mer, salicorne, pommes gaufrettes | 33 €
Le foie gras de Mr Morille | Mariné au vieux Cognac, chutney de coing à la cannelle, tuile de pain d'épices | 41 €
Le caviar « Vintage » et les langoustines de la Cotinière | L'entrée signature du chef : royale d'une chaudrée charentaise | 64 €""")),
    ("L'océan de saveurs", "", items("""
L'assiette d'huîtres des producteurs (9 pièces) | 5 Gillardeau n°2, 4 Papin n°3, beurre d'algues | 40 €
6 huîtres spéciales n°2 Gillardeau | 30 €
6 huîtres spéciales n°3 Papin | 25 €
Le tourteau | Émietté, mayonnaise gingembre et citronnelle, toastinette | 29 €""")),
    ("Les plats", "", items("""
La mer | Dorées à la plancha, tapioca soufflé au citron vert, céleri rave, confit d'échalote au pineau | 46 €
Le turbot sauvage | Rôti au four, palourdes en persillade, crémeux de topinambour à la truffe | 56 €
La sole | Pêchée au petit bateau et cuite meunière, butternut de Vendée, sauce gribiche | 68 €
« À la gloire de mon père » | Civet gourmand de homard aux légumes de saison, ravioli de champignons | 85 €
Le pigeon | Filets rôtis et cuisses confites, maïs, polenta, jus à la sauge | 48 €
Inspiration végétale du moment | 35 €
Le ris de veau & langoustines | Le plat signature | 76 €""")),
    ("Les douceurs", "", items("""
Notre plateau de fromages | Jean-Marie Brancheriau, fromager au marché couvert de La Rochelle | 21 €
La poire et la noix | Financier et crémeux à la noix de la Borderie, sorbet poire | 19 €
La vanille | Biscuit noisette, crème à la vanille de Madagascar, caramel vanillé | 18 €
Le chocolat chaud | Brownie, riz soufflé, sauce chaude au chocolat Oriado 60 % Valrhona | 20 €
Le soufflé | Passion, sauce infusée à la vodka et au citron vert, granité au champagne | carte
Les agrumes | Moelleux aux citrons, crème au yuzu, sorbet pamplemousse rose | carte""")),
  ],
  notes="Toutes nos viandes sont d'origine française · Liste des allergènes disponible sur demande.",
  quote="Protégé par les tours et face au spectacle permanent du Vieux-Port.",
  links=[("Site actuel", "https://les-flots.com/", "les-flots.com")],
)

# ------------------------------------------------------------------ Shalimar
s = IM["shalimar"]
S["shalimar.html"] = dict(
  name="Shalimar", kind="Restaurant indien & pakistanais", tagline="Près du Vieux-Port · depuis 2017",
  accent="#e3a54f", accent2="#a2312b", ink="#1d0f10", hero=s[2],
  h1="Voyage au cœur <em>des saveurs indiennes</em>",
  lead="Cuisine indienne et pakistanaise authentique et raffinée, à quelques pas du Vieux-Port de La Rochelle. Sur place, en terrasse ou à emporter.",
  address="39, rue Saint-Jean-du-Pérot", city="17000 La Rochelle", booking="https://www.shalimar-restaurant-la-rochelle.fr/booking-restopro",
  hours=[("Lun., mar., jeu. – dim.", "12h00 – 14h00 / 19h00 – 22h30"), ("Mercredi", "19h00 – 22h30")],
  service="Sur place, terrasse et à emporter",
  intro_eyebrow="Depuis 2017", intro_h="Une cuisine indienne et pakistanaise <em>à La Rochelle</em>",
  intro_p=["Depuis 2017, le Shalimar satisfait les amateurs de gastronomie indienne avec des plats savoureux et raffinés, dans un cadre unique et chaleureux. Notre cuisine, riche en saveurs et en arômes, est préparée avec le plus grand soin pour respecter l'authenticité de la gastronomie indienne et pakistanaise.",
           "Pour un déjeuner entre collègues ou un dîner en tête-à-tête, notre terrasse vous offre un cadre agréable ; à l'intérieur, le soin apporté à la décoration vous fera voyager."],
  badge=("2017", "depuis"),
  feats=[("Cuisson au tandoor", "Tikka, tandoori et kebabs grillés au four traditionnel."), ("Nans maison", "Fromage, ail, keema, peshawari…"),
         ("À emporter", "Commandez et dégustez nos plats chez vous."), ("Service attentif", "Nous adaptons nos plats à vos préférences.")],
  photos=[s[0], s[1], s[3], s[2]], sig_img=s[1],
  signature=("Le mixed tandoori", "Assortiment de poulet, agneau et poisson grillés au tandoor, pour deux personnes.", "22 €"),
  menu_title="La carte <em>du Shalimar</em>", menu_lead="Une sélection de notre carte · menus et carte complète sur place.",
  menu=[
    ("Légumes & salades", "", items("""
Samosa légumes (2 pièces) | Feuilletés aux légumes et ses épices | 7 €
Samosa viandes (2 pièces) | Feuilletés à l'agneau haché, légumes et épices | 7,50 €
Oignon bhaji | Beignets à la farine de pois chiche aux oignons | 5 €
Pakora aubergines | Beignets à la farine de pois chiche aux aubergines | 6,50 €
Mixed pakora | Cocktail de beignets de légumes | carte
Raïta | Concombres, tomates, mélangés à un yaourt | 6 €""")),
    ("Entrées du tandoor", "", items("""
Mixed tandoori | Poulet, agneau et poisson en grillades (pour 2 personnes) | 22 €
Poulet tikka | Poulet mariné aux épices et au yaourt, grillé au tandoor | 9 €
Poulet tandoori | Poulet mariné dans une sauce et cuit au tandoor | 8,50 €
Agneau tikka | Agneau mariné aux épices et grillé au tandoor | 9,50 €
Seekh kebab | Agneau aux épices, haché et grillé au tandoor | carte
Poisson tandoori | Filets du jour marinés et grillés au tandoor | carte
Gambas tandoori | carte""")),
    ("Nos galettes", "Pains cuits au tandoor", items("""
Nan | Galette nature, farine blanche | 2,50 €
Roti | Galette nature, farine de blé et de sarrasin | 2,50 €
Chili nan | Galette au piment vert | 3 €
Paratha | Galette au beurre, farine de blé et de sarrasin | 3 €
Lassini nan | Galette à l'ail | 3 €
Nan fromage | Galette au fromage, farine blanche | 3,50 €
Masala kulcha | Galette aux légumes | 3,50 €
Keema nan | Pain farci de viande hachée | 3,50 €
Nan peshawari | Galette aux fruits confits | 3,50 €""")),
    ("Boissons", "Bar & cave à vins", items("""
Cocktail maison 17,5 cl | 4,50 €
Kir indien 17,5 cl | 5 €
Cocktail indien sans alcool 17,5 cl | 4 €
Coupe de champagne | 6 €
Nimbu pani 50 cl | Spécialité indienne au citron pressé et sirop de rose | carte
Vin indien cabernet-shiraz | 37,5 cl 15 € · 75 cl | 25 €
Thés | Nature, cardamome, menthe, jasmin | carte
Digestif indien 4 cl | 5,50 €""")),
  ],
  notes="Commande à emporter disponible · Plats adaptables à vos préférences.",
  quote="Un voyage culinaire au-delà des frontières, à deux pas du Vieux-Port.",
  links=[("Site actuel", "https://www.shalimar-restaurant-la-rochelle.fr/", "shalimar-restaurant-la-rochelle.fr")],
)

# ------------------------------------------------------------------ Gaée
g = IM["gaee"]
S["gaee.html"] = dict(
  name="Gaée", kind="Restaurant panoramique", tagline="Bistronomie · brunch · rooftop",
  accent="#d9a86c", accent2="#3f6f63", ink="#10201e", hero=g[4],
  h1="Bien plus <em>qu'un restaurant</em>",
  lead="Une vue panoramique sur le Vieux-Port et l'Océan, une cuisine de saison entre authenticité et créativité, un bar, un café et un rooftop.",
  address="4, quai Louis Prunier", city="17000 La Rochelle", phone="05 46 50 89 05", booking="https://restaurant-gaee.fr/",
  hours=[("Restaurant", "menu du jour et carte de saison"), ("Dimanche", "brunch à volonté")],
  service="Restaurant · brunch · bar · café · privatisation",
  intro_eyebrow="Le concept", intro_h="Des espaces pensés pour vous, <em>à deux pas du Vieux-Port</em>",
  intro_p=["Avec sa vue panoramique sur le Vieux-Port de La Rochelle et l'Océan, Gaée vous invite à découvrir un univers entre authenticité et créativité culinaire. Ici, chaque plat de saison raconte une histoire.",
           "Chaque événement vous embarque dans une ambiance conviviale et festive : DJ sets, soirées thématiques, blind tests, rencontres gourmandes… Gaée, c'est aussi un bar accueillant et un café chaleureux, parfaits pour une pause en journée ou un apéritif en soirée."],
  badge=("Vue", "panoramique"),
  feats=[("Restaurant", "Carte de saison, menu du jour et brunch tous les dimanches."), ("Bar & rooftop", "Cocktails et tapas : votre nouveau QG à La Rochelle."),
         ("Café & détente", "Un espace de travail et de détente : café, cappuccino…"), ("Privatisation", "Un espace réceptif pour vos événements.")],
  photos=[g[3], g[5]],
  extra_nav=[("espaces", "Les espaces"), ("agenda", "Agenda")],
  quote="Gaée, bien plus qu'un restaurant bistronomique : une expérience à part entière.",
  links=[("Site actuel", "https://restaurant-gaee.fr/", "restaurant-gaee.fr")],
)
S["gaee.html"]["extra_html"] = cards(
  "Les espaces", "Un lieu, <em>quatre façons d'en profiter</em>", "",
  [("Restaurant", "Bistronomique", "Un restaurant panoramique avec une carte de saison et un menu du jour.", ""),
   ("Dimanche", "Brunch à volonté", "Tous les dimanches, un brunch généreux face à l'Océan.", ""),
   ("Le soir", "Bar & rooftop", "Cocktails, tapas et rooftop : (re)découvrez votre QG.", ""),
   ("En journée", "Café & coworking", "Un espace de travail et de détente au café du Gaée.", "")], anchor="espaces") + \
  cta("L'agenda · 11 décembre", "Comedy Club : dîner-spectacle avec 6 humoristes",
      "Dîner au restaurant Gaée avec vue panoramique dès 19h, puis 1h30 de stand-up avec la Beunaize Comedy Club. Formule dîner-spectacle 55 €, formule bar-spectacle 26 €.",
      "https://restaurant-gaee.fr/comedy-club-larochelle/", "Réserver ma soirée").replace('class="quote"', 'class="quote" id="agenda"')

# ------------------------------------------------------------------ Christopher Coutanceau
S["christopher-coutanceau.html"] = dict(
  name="Christopher Coutanceau", kind="Restaurant · 3 étoiles Michelin", tagline="Plage de la Concurrence · La Rochelle",
  accent="#cdb27a", accent2="#1f4f6e", ink="#07141d", mono="CC",
  h1="L'Océan, <em>c'est mon jardin</em>",
  lead="Trois adresses, une signature à La Rochelle : le restaurant gastronomique triplement étoilé, la Yole de Chris et l'hôtel La Villa Grand Voile.",
  address="Plage de la Concurrence", city="17000 La Rochelle", phone="05 46 41 48 19", email="contact@coutanceaularochelle.com",
  booking="https://christophercoutanceau.com/fr/",
  hours=[("Mardi et mercredi", "le soir, 19h30 – 21h30"), ("Jeudi – samedi", "12h15 – 13h30 et 19h30 – 21h30"), ("Fermé", "dimanche et lundi")],
  service="Relais & Châteaux · Grandes Tables du Monde",
  intro_eyebrow="Identité culinaire", intro_h="Une déclaration d'amour <em>à l'Océan</em>",
  intro_p=["« L'océan, c'est mon jardin, ma vie ! Il m'a en quelque sorte forgé et fait partie de mon quotidien. À travers ma cuisine, je raconte mon histoire. » Pure, iodée jusqu'aux desserts, délicate, la cuisine écoresponsable de Christopher Coutanceau, cuisinier-pêcheur, est une déclaration d'amour à l'Océan.",
           "Ancrée sur la plage de la Concurrence, la salle signée par l'architecte rochelais Bertrand Pourrier prolonge le paysage : sol bleu marine, murs en cuir sable et pampilles d'aluminium qui simulent le va-et-vient de l'eau. Christopher Coutanceau et Nicolas Brossard, maître de maison, y reçoivent le regard tourné vers l'Océan."],
  badge=("3", "étoiles Michelin"),
  feats=[("Cuisinier-pêcheur", "Une cuisine pure, iodée jusqu'aux desserts."), ("Écoresponsable", "Le respect scrupuleux de la ressource et des saisons."),
         ("Vue sur la baie", "De larges baies vitrées ouvertes sur l'Atlantique."), ("Service voiturier", "À votre disposition pour nos deux restaurants.")],
  extra_nav=[("adresses", "Les 3 adresses")],
  quote="L'Océan est partout, à travers les larges baies vitrées bien entendu, mais aussi dans chaque détail de la table.",
  links=[("Site actuel", "https://christophercoutanceau.com/fr/", "christophercoutanceau.com")],
)
S["christopher-coutanceau.html"]["extra_html"] = cards(
  "Trois adresses", "Une signature, <em>trois maisons</em>",
  "Les trois maisons Christopher Coutanceau sont très proches les unes des autres, à quelques minutes du centre-ville.",
  [("Gastronomie", "Restaurant Christopher Coutanceau", "Table 3 étoiles Michelin sur la plage de la Concurrence. Du mardi au samedi · 05 46 41 48 19.", ""),
   ("Bistrot marin", "La Yole de Chris", "Sur la plage de la Concurrence, terrasse grande ouverte sur l'Océan. Tous les jours, 9h – 23h · 05 46 41 41 88.", ""),
   ("Hôtel", "La Villa Grand Voile", "Un séjour à l'hôtel, ouvert tous les jours · 05 46 44 81 14.", "")], anchor="adresses")

for fname, r in S.items():
    (OUT / fname).write_text(gen.page(fname, r), encoding="utf-8")
    print("écrit", fname)

# ------------------------------------------------------------------ index de la sélection
rows = "".join(f'<a href="{fn}"><span>{e(r["name"])}<small style="display:block;font-family:var(--sans);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:6px">{e(r["kind"])} · {e(r["address"])}</small></span><i>→</i></a>' for fn, r in S.items())
idx = dict(name="Sélection La Rochelle", ink="#0d1b26", accent="#c3a165", accent2="#a8854a")
(OUT / "index.html").write_text(f'''<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Restaurants de La Rochelle — propositions de sites</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
<style>{gen.CSS % idx}</style></head><body>
<section class="hero typo" style="min-height:60vh;margin-top:0"><div class="mono" aria-hidden="true">LR</div><div class="wrap" style="padding:120px 0 60px">
<span class="eyebrow">Propositions de refonte</span><h1>Restaurants <em>de La Rochelle</em></h1>
<p>{len(S)} sites premium réalisés à partir du contenu des sites actuels.</p></div></section>
<section class="group on-light rv in"><div class="wrap"><div class="ggrid">{rows}</div></div></section>
</body></html>''', encoding="utf-8")
print("écrit index.html")
