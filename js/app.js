/**
 * app.js — SavoirPlus · JS vanilla ES6+ · Bootstrap 5.3.3 local
 *
 * Sections :
 *   1a. DONNÉES      — exercices[] : 9 exercices (contenu pédagogique)
 *   1b. DONNÉES      — QUIZ_DATA{} : questions MCQ/trous par id
 *   2.  UTILITAIRES  — helpers badge, illustrations
 *   3.  CARDS        — afficherExercices(), grille Bootstrap dynamique
 *   4.  MODALS       — genererModals(), genererQuizHTML()
 *   5.  FILTRES      — initFiltres(), data-matiere
 *   6.  CONTACT      — initFormulaire(), validation blur + submit
 *   7.  INIT         — DOMContentLoaded, point d'entrée unique
 *   8.  GAMIFICATION — XP, niveaux, achievements, TDB, mascotte
 *   9.  QUIZ ENGINE  — chronoMap, MCQ, trous, toast bonus 17s
 */


// ============================================================
// 1a. DONNÉES — Catalogue des exercices
//
// Structure : tableau d'objets littéraux.
// Chaque objet décrit un exercice avec ses métadonnées (id, titre, matière,
// niveau, description courte pour la card) et son énoncé long (affiché dans
// le collapse de la modal).
//
// Convention ids : 1-3 = Maths, 4-6 = Français, 7-9 = Sciences.
// Ce découpage par tranche de 3 est exploité dans mettreAJourTableauDeBord()
// pour calculer les stats par matière sans tableau supplémentaire.
// ============================================================
const exercices = [
  {
    id: 1,
    titre: "Résous l'équation",
    matiere: "Maths",
    niveau: "3e secondaire",
    description: "M. PASLÉCOLE a 17 secondes pour corriger x copies. Aide-le avant que son café ne refroidisse.",
    enonce_court: "M. PASLÉCOLE a 17 secondes pour corriger x copies. Il en a déjà corrigé 7. L'équation : 3x + 7 = 22.",
    timer: 60,
    enonce: `SITUATION CRITIQUE — Ministère FWB, 8h03

M. James PASLÉCOLE vient de recevoir une circulaire de 47 pages.
Il dispose de 17 secondes de temps libre cette semaine.
Aide-le à résoudre ces équations AVANT que son café refroidisse.

1. 3x + 7 = 22
   (x = le nombre de copies qu'il peut corriger en une pause pipi)

2. 5x − 4 = 2x + 11
   (x = le nombre de réformes prévues avant Noël)

3. −2x + 9 = 3
   (x = le nombre de collègues encore motivés en juin)

4. 4(x − 2) = 12
   (x = le nombre de fois où Mme LOGE a relu la même circulaire)

5. x/3 + 5 = 8
   (x = le nombre de tasses de café nécessaires pour survivre au conseil de classe)

Méthode : rassemble les x d'un côté, les constantes de l'autre — comme une réforme équitable.
Vérifie ta solution. Contrairement aux décrets, les maths ont une réponse.

Réponses : x = 5 / 5 / 3 / 5 / 9
Note : si tu obtiens x = 0 collègues motivés, c'est normal. C'est juin.`
  },
  {
    id: 2,
    titre: "Jouer avec les pourcentages",
    matiere: "Maths",
    niveau: "4e secondaire",
    description: "La ministre Gla a réduit le budget. Mme LOGE doit calculer ce qu'il reste. Spoiler : pas grand-chose.",
    enonce_court: "La ministre Gla veut réduire le budget de l'éducation de 30 %. Le budget actuel est de 85 €.",
    timer: 60,
    enonce: `BULLETIN OFFICIEL FWB — Réductions en cascade

Suite au décret-programme 2 (voté un mercredi, appliqué le jeudi),
voici les situations budgétaires de l'établissement LOGE-PASLÉCOLE.

1. Le budget photocopies était de 850 €.
   La ministre Gla le réduit de 30 %.
   Combien reste-t-il pour imprimer les 47 circulaires du mois ?

2. M. PASLÉCOLE gagnait 2 400 €/mois.
   Après "revalorisation" du métier (communiqué de presse, sans effet sur le salaire),
   il reçoit +7,5 %. Quel est son nouveau salaire ?

3. Le nombre d'élèves par classe est passé de 25 à 30.
   Quel est le pourcentage d'augmentation du bruit ambiant ?

4. Mme LOGE commande 149 € de matériel HTVA.
   TVA belge : 21 %. Quel est le prix TTC ?
   (La réponse sera refusée par la comptabilité pour "formulaire incorrect".)

Formules :
• Réduction : V × (1 − t/100)
• Augmentation : V × (1 + t/100)
• Taux de variation : (nouveau − ancien) / ancien × 100

Réponses : 595 € / 2 580 € / +20 % / 180,29 €`
  },
  {
    id: 3,
    titre: "La moyenne pondérée",
    matiere: "Maths",
    niveau: "4e secondaire",
    description: "M. PASLÉCOLE doit calculer la moyenne. Son café refroidit. Le conseil commence dans 3 minutes.",
    enonce_court: "M. PASLÉCOLE calcule sa moyenne. Maths (coeff 4) : 12/20 — Français (coeff 3) : 15/20 — Sciences (coeff 2) : 10/20.",
    timer: 60,
    enonce: `CONSEIL DE CLASSE — Rue des cancres n°8, Wavre
Ordre du jour : 47 points. Durée prévue : 3h. Café disponible : non.

Résultats à calculer :

Matière              | Note /20 | Coefficient
---------------------|----------|------------
Mathématiques        |    14    |     4
Français             |    11    |     3
Histoire des réformes|    16    |     2
Sciences             |    13    |     3
Éducation physique   |    18    |     1

Questions :
1. Calcule la moyenne simple (sans coefficient).
   M. PASLÉCOLE en a besoin pour remplir les formulaires A, B et C
   — qui demandent tous des calculs différents.

2. Calcule la moyenne pondérée.
   C'est celle qui compte vraiment. Comme les coefficients dans la vie.

3. L'élève visait 13/20. En Maths (coeff 4), il obtient 12.
   Que doit-il avoir dans les autres matières ?
   (M. PASLÉCOLE attend la réponse avant que la prochaine réforme
   ne change les coefficients.)

Formule : Moyenne pondérée = Σ(note × coeff) / Σ(coeff)
Réponses : 14,4 / 13,15 / Question 3 ouverte — comme les réformes.`,
    enonce_html: `
<p class="fw-semibold mb-1">CONSEIL DE CLASSE — Rue des cancres n°8, Wavre</p>
<p class="text-muted small mb-3">Ordre du jour : 47 points. Durée prévue : 3h. Café disponible : non.</p>
<p class="mb-2">Résultats à calculer :</p>
<div class="table-responsive">
  <table class="table table-bordered table-sm align-middle mb-3">
    <thead class="table-light">
      <tr><th>Matière</th><th class="text-center">Note /20</th><th class="text-center">Coeff.</th></tr>
    </thead>
    <tbody>
      <tr><td>Mathématiques</td><td class="text-center fw-semibold">14</td><td class="text-center">4</td></tr>
      <tr><td>Français</td><td class="text-center fw-semibold">11</td><td class="text-center">3</td></tr>
      <tr><td>Histoire des réformes</td><td class="text-center fw-semibold">16</td><td class="text-center">2</td></tr>
      <tr><td>Sciences</td><td class="text-center fw-semibold">13</td><td class="text-center">3</td></tr>
      <tr><td>Éducation physique</td><td class="text-center fw-semibold">18</td><td class="text-center">1</td></tr>
    </tbody>
  </table>
</div>
<p class="fw-semibold mb-2">Questions :</p>
<ol class="mb-3">
  <li class="mb-2">Calcule la <strong>moyenne simple</strong> (sans coefficient).<br>
    <span class="text-muted small">M. PASLÉCOLE en a besoin pour remplir les formulaires A, B et C — qui demandent tous des calculs différents.</span></li>
  <li class="mb-2">Calcule la <strong>moyenne pondérée</strong>.<br>
    <span class="text-muted small">C'est celle qui compte vraiment. Comme les coefficients dans la vie.</span></li>
  <li>L'élève visait 13/20. En Maths (coeff 4), il obtient 12.<br>
    Que doit-il avoir dans les autres matières ?<br>
    <span class="text-muted small">(M. PASLÉCOLE attend la réponse avant que la prochaine réforme ne change les coefficients.)</span></li>
</ol>
<p class="mb-1"><strong>Formule :</strong> Moyenne pondérée = Σ(note × coeff) / Σ(coeff)</p>
<p class="text-muted small mb-0">Réponses : 14,4 / 13,15 / Question 3 ouverte — comme les réformes.</p>`
  },
  {
    id: 4,
    titre: "Reconnaître les figures de style",
    matiere: "Français",
    niveau: "4e secondaire",
    description: "La ministre Gla a fait un discours. Mme LOGE l'a écouté. Identifie les figures de style — et les contre-vérités.",
    enonce_court: "La ministre Gla a fait un discours. Extrait : « Le vent rugit comme une circulaire ministérielle. »",
    timer: 60,
    enonce: `DISCOURS OFFICIEL FWB — Conférence de presse
Transcription partielle. Authentiquement fictive.

Pour chaque phrase, nomme la figure de style ET justifie brièvement.

1. « Cette réforme est un souffle de fraîcheur pour l'enseignement. »
   (prononcé en juin, pendant la canicule)

2. « Les enseignants sont le cœur battant de notre société. »
   (budget des enseignants non mentionné dans le communiqué)

3. « Mme LOGE avait une patience d'ange face aux circulaires. »

4. « La salle des profs était un volcan en éruption ce mardi-là. »

5. « J'ai une montagne de copies à corriger. »
   (M. PASLÉCOLE, 8h02, lundi matin)

6. « Cette circulaire est courte et claire. »
   (47 pages, police 10, marges 1cm)

7. « Le conseil de classe : long comme un jour sans réforme. »

8. « La ministre Gla habitait peut-être à Tigny,
    mais ses décrets, eux, habitaient partout. »

Figures disponibles :
métaphore, comparaison, hyperbole, personnification,
antiphrase (ironie), oxymore, antithèse, métonymie.

Conseil de M. PASLÉCOLE :
"Lisez entre les lignes. Utile pour les figures de style ET les circulaires."`
  },
  {
    id: 5,
    titre: "Les accords qui piègent",
    matiere: "Français",
    niveau: "3e secondaire",
    description: "Mme LOGE a rédigé un email à la direction. En vitesse. Ça se voit. Corrige ses fautes d'accord.",
    enonce_court: "Mme LOGE a rédigé un email en vitesse : « Les réformes que j'ai rencontré cette année m'ont épuisée. »",
    timer: 60,
    enonce: `EMAIL INTERNE — De : l.loge@cancres8.be
Objet : URGENT (encore)

Mme LOGE a envoyé cet email entre deux réunions et un café froid.
Chaque phrase contient une (ou plusieurs) erreur(s) d'accord.
Récris-la correctement et explique la règle.

1. « Les circulaires que j'ai reçus ce matin sont incompréhensibles. »

2. « Mes collègues se sont parlés pendant 17 secondes —
    c'est tout ce qu'on avait. »

3. « Les résultats qu'il a obtenus sont excellents. »
   ← CORRECTE. Piège tendu par M. PASLÉCOLE.

4. « Des élèves épuisés et démotivé attendaient dans le couloir. »

5. « La direction s'est lavés les mains de cette décision. »

6. « Les réformes que la ministre a lancé sont nombreuses. »

Pour chaque correction, indique :
• La règle en jeu (accord avec avoir / être / pronominal)
• Le déclencheur de l'accord
• Note si M. PASLÉCOLE aurait fait la même faute (probablement oui)`
  },
  {
    id: 6,
    titre: "Les temps du récit",
    matiere: "Français",
    niveau: "5e secondaire",
    description: "Le jour où la circulaire est arrivée. Un récit historique. Conjugue les verbes du drame.",
    enonce_court: "Le jour où la circulaire est arrivée, Mme LOGE buvait son café quand elle lut la nouvelle.",
    timer: 60,
    enonce: `RÉCIT HISTORIQUE — Rue des cancres n°8, un mardi ordinaire

Conjugue les verbes aux temps du récit appropriés
(passé simple, imparfait, plus-que-parfait).

« Ce matin-là, la salle des profs [être] ___ silencieuse.
M. PASLÉCOLE [boire] ___ son café quand Mme LOGE [entrer] ___ en courant.
Elle [tenir] ___ une circulaire de 47 pages que la ministre Gla
[envoyer] ___ la veille à 23h58.
PASLÉCOLE [poser] ___ sa tasse, [soupirer] ___,
et [commencer] ___ à lire.
Son café [refroidir] ___ définitivement. »

Questions de réflexion :
1. Pourquoi l'imparfait pour "être" et "boire" ?
   (Comme les réformes, l'imparfait décrit un état qui dure.)

2. Quel est le rôle du plus-que-parfait pour "envoyer" ?
   (La circulaire existait AVANT — comme toujours.)

3. Réécris le dernier paragraphe au présent de narration.
   (Pour revivre le traumatisme en temps réel.)

Règle clé :
Passé simple = action ponctuelle (décret voté un mercredi)
Imparfait = état de fond (fatigue des profs)
Plus-que-parfait = antériorité (la réforme précédente)`
  },
  {
    id: 7,
    titre: "La cellule de A à Z",
    matiere: "Sciences",
    niveau: "3e secondaire",
    description: "Mme LOGE compare l'école à une cellule vivante. M. PASLÉCOLE n'est pas sûr que ce soit un compliment.",
    enonce_court: "Mme LOGE compare l'école à une cellule vivante. Le proviseur = noyau. Les élèves = mitochondries.",
    timer: 60,
    enonce: `ANALOGIE SCIENTIFIQUE — L'école vue comme une cellule

Mme LOGE a eu une révélation pendant une réunion pédagogique :
"L'école fonctionne exactement comme une cellule vivante."
M. PASLÉCOLE a levé un sourcil. Démontre si elle a raison.

Partie 1 — Associe organite + fonction + équivalent école :

Organite             | Fonction cellule        | Équivalent école ?
---------------------|-------------------------|-------------------
A. Noyau             | Contient l'ADN          | ???
B. Mitochondrie      | Produit l'énergie (ATP) | ???
C. Ribosome          | Synthèse des protéines  | ???
D. Membrane          | Régule les échanges     | ???
E. Appareil de Golgi | Emballe/transporte      | ???
F. Vacuole           | Stocke les déchets      | ???

(Réponses possibles : direction, profs, élèves,
secrétariat, salle des profs, archives)

Partie 2 — Questions :
1. Cite 2 différences entre cellule animale et végétale.
2. Pourquoi les cellules musculaires ont-elles plus de mitochondries ?
   (Et les profs de gym en auraient besoin de plus en juin ?)
3. Si on retire le noyau d'une cellule, que se passe-t-il ?
   (Et si on retire la direction ? Débat ouvert.)

Partie 3 — Schéma :
Réalise un schéma d'une cellule animale avec 5 organites légendés.
Bonus : renomme-les avec les équivalents de l'école de Mme LOGE.`
  },
  {
    id: 8,
    titre: "Lis le tableau périodique",
    matiere: "Sciences",
    niveau: "4e secondaire",
    description: "M. PASLÉCOLE jure que le tableau périodique est plus stable que le programme scolaire. Vérifie.",
    enonce_court: "M. PASLÉCOLE jure que le tableau périodique n'a pas changé depuis Mendeleïev. Prouve-le avec l'Oxygène (O).",
    timer: 60,
    enonce: `STABILITÉ COMPARÉE — Tableau périodique vs Programme FWB

M. PASLÉCOLE a déclaré en conseil de classe :
"Le tableau périodique n'a pas changé depuis Mendeleïev.
Le programme scolaire, lui, change probablement mardi prochain."

Prouve qu'il a raison sur le tableau périodique.

Partie 1 — Complète pour chaque élément :

Symbole | Nom | N° atomique | Masse | Protons | Électrons | Famille
--------|-----|-------------|-------|---------|-----------|--------
Na      |     |             |       |         |           |
O       |     |             |       |         |           |
Fe      |     |             |       |         |           |
He      |     |             |       |         |           |
Cl      |     |             |       |         |           |

Partie 2 — Questions :
1. Qu'est-ce qu'une période ? Une famille ?
   (Moins complexe qu'une période de réforme scolaire.)

2. Pourquoi les gaz nobles sont-ils peu réactifs ?
   (M. PASLÉCOLE pense que certains collègues ont les mêmes propriétés.)

3. L'oxygène a le numéro atomique 8.
   Combien de couches ? Électrons externes ?
   (Moins que le nombre de formulaires à remplir.)

4. Pourquoi Na et K ont-ils des propriétés similaires ?

Défi de M. PASLÉCOLE :
"Cite les 10 premiers éléments de mémoire.
Si tu y arrives, tu es plus fiable qu'une circulaire FWB."
Astuce : H He Li Be B C N O F Ne`,
    enonce_html: `
<p class="fw-semibold mb-1">STABILITÉ COMPARÉE — Tableau périodique vs Programme FWB</p>
<p class="mb-3">M. PASLÉCOLE a déclaré en conseil de classe :<br>
<em>«&nbsp;Le tableau périodique n'a pas changé depuis Mendeleïev. Le programme scolaire, lui, change probablement mardi prochain.&nbsp;»</em></p>
<p class="mb-2">Prouve qu'il a raison sur le tableau périodique.</p>
<p class="fw-semibold mb-2">Partie 1 — Complète pour chaque élément :</p>
<div class="table-responsive">
  <table class="table table-bordered table-sm align-middle mb-3">
    <thead class="table-light">
      <tr><th>Symbole</th><th>Nom</th><th>N° atomique</th><th>Masse</th><th>Protons</th><th>Électrons</th><th>Famille</th></tr>
    </thead>
    <tbody>
      <tr><td class="fw-semibold">Na</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td class="fw-semibold">O</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td class="fw-semibold">Fe</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td class="fw-semibold">He</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td class="fw-semibold">Cl</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    </tbody>
  </table>
</div>
<p class="fw-semibold mb-2">Partie 2 — Questions :</p>
<ol class="mb-3">
  <li class="mb-2">Qu'est-ce qu'une <strong>période</strong> ? Une <strong>famille</strong> ?<br>
    <span class="text-muted small">(Moins complexe qu'une période de réforme scolaire.)</span></li>
  <li class="mb-2">Pourquoi les gaz nobles sont-ils peu réactifs ?<br>
    <span class="text-muted small">(M. PASLÉCOLE pense que certains collègues ont les mêmes propriétés.)</span></li>
  <li class="mb-2">L'oxygène a le numéro atomique 8. Combien de couches ? Électrons externes ?<br>
    <span class="text-muted small">(Moins que le nombre de formulaires à remplir.)</span></li>
  <li>Pourquoi Na et K ont-ils des propriétés similaires ?</li>
</ol>
<p class="fw-semibold mb-1">Défi de M. PASLÉCOLE :</p>
<p class="mb-1"><em>«&nbsp;Cite les 10 premiers éléments de mémoire. Si tu y arrives, tu es plus fiable qu'une circulaire FWB.&nbsp;»</em></p>
<p class="text-muted small mb-0"><strong>Astuce :</strong> H He Li Be B C N O F Ne</p>`
  },
  {
    id: 9,
    titre: "Les états de la matière",
    matiere: "Sciences",
    niveau: "3e secondaire",
    description: "Le café de Mme LOGE a traversé plusieurs états depuis ce matin. La science explique pourquoi c'est une tragédie.",
    enonce_court: "Le café de Mme LOGE a traversé plusieurs états depuis ce matin. La science explique pourquoi c'est une tragédie.",
    timer: 60,
    enonce: `ÉTUDE DE CAS — Le café de Mme LOGE, Rue des cancres n°8

08h00 : café préparé à 95°C. Mme LOGE s'apprête à le boire.
08h01 : première circulaire reçue.
08h17 : fin de lecture. Café à température ambiante.
10h45 : café oublié. Il fait −2°C dehors.

Partie 1 — Nomme les changements d'état :
1. Solide → Liquide : ___ (le café surgelé du frigo)
2. Liquide → Gaz : ___   (vapeur à 95°C)
3. Gaz → Liquide : ___   (condensation sur la fenêtre)
4. Liquide → Solide : __ (café dehors en hiver)
5. Solide → Gaz direct : ___ (la patience de M. PASLÉCOLE)
6. Gaz → Solide direct : __ (les espoirs de réforme cohérente)

Partie 2 — Questions :
1. Comment les molécules sont-elles disposées dans un solide ? Un gaz ?
   (Solide = conseil de classe structuré. Gaz = réunion sans ordre du jour.)

2. Pourquoi la glace flotte-t-elle sur l'eau ?
   (Contrairement aux bonnes idées pédagogiques, qui coulent directement.)

3. L'eau bout à 100°C. À quelle température bout M. PASLÉCOLE
   après la 4e circulaire du jour ?

Partie 3 — Application :
Le café de Mme LOGE part de 95°C et refroidit jusqu'à −2°C dehors.
Décris toutes les étapes physiques avec les températures clés.

Bonus : Qu'est-ce que le plasma ?
M. PASLÉCOLE pense être dans cet état après une journée de conseils.
A-t-il raison scientifiquement ?`
  }
];


// ============================================================
// 1b. DONNÉES QUIZ — Questions interactives par exercice
//
// Séparé du catalogue exercices[] pour deux raisons :
//   1. Séparation des préoccupations : le contenu pédagogique (énoncé long)
//      ne dépend pas du format d'interaction.
//   2. Accès O(1) par id : QUIZ_DATA[exo.id] plutôt qu'un find() sur le tableau.
//
// Type unique : 'mcq' — choix multiples (9 exercices, Maths + Français + Sciences)
//   question  : string — affiché dans la zone quiz
//   choix[]   : string[] — 4 options
//   reponse   : number  — index (0-based) de la bonne réponse dans choix[]
//   explication : string — affiché dans la zone feedback après validation
// ============================================================
const QUIZ_DATA = {

  // --- Maths : MCQ (réponse fermée, validation binaire immédiate) ---

  1: {
    type: 'mcq',
    question: '3x + 7 = 22 → x = ?',
    choix: ['x = 3', 'x = 5', 'x = 7', 'x = 15'],
    reponse: 1,          // index 0-based de la bonne réponse dans choix[]
    explication: '3x = 22 − 7 = 15, donc x = 15 ÷ 3 = 5 ✓'
  },
  2: {
    type: 'mcq',
    question: '85 € réduit de 30 % → prix final ?',
    choix: ['55,50 €', '59,50 €', '62,00 €', '25,50 €'],
    reponse: 1,
    explication: '85 × (1 − 0,30) = 85 × 0,70 = 59,50 € ✓'
  },
  3: {
    type: 'mcq',
    question: 'Formule de la moyenne pondérée ?',
    choix: ['Σnotes / n', 'Σ(note × coeff) / Σcoeff', 'Σcoeff / Σnotes', 'note × n / coeff'],
    reponse: 1,
    explication: 'On divise Σ(note × coeff) par Σcoeff. Les matières lourdes comptent plus ✓'
  },

  // --- Français : MCQ (même paradigme que Maths/Sciences — validation binaire immédiate) ---

  4: {
    type: 'mcq',
    question: 'Le vent rugit comme une circulaire ministérielle. Quelle figure de style ?',
    choix: ['Métaphore', 'Comparaison', 'Hyperbole', 'Anaphore'],
    reponse: 1,
    explication: 'La comparaison utilise un outil comparatif (comme, tel que...). Ici : «comme une circulaire».'
  },
  5: {
    type: 'mcq',
    question: 'Les réformes que j\'ai rencontr___ cette année. Comment accorder ?',
    choix: ['rencontré', 'rencontrée', 'rencontrés', 'rencontrées'],
    reponse: 3,
    explication: '«Rencontré» s\'accorde avec le COD «réformes» placé avant — féminin pluriel.'
  },
  6: {
    type: 'mcq',
    question: 'Le jour où la circulaire arriva, Mme LOGE ___ son café. Quel temps pour l\'action en cours ?',
    choix: ['Passé simple', 'Imparfait', 'Plus-que-parfait', 'Présent'],
    reponse: 1,
    explication: 'L\'imparfait exprime une action en cours (buvait), le passé simple une action ponctuelle (arriva).'
  },

  // --- Sciences : MCQ (même paradigme que Maths — réponse fermée défendable à l'oral) ---
  // Note : les flashcards ont été supprimées (Session 3) — auto-évaluation non défendable
  // à l'oral car l'élève déclare lui-même s'il "savait". MCQ = validation objective.

  7: {
    type: 'mcq',
    question: 'Quel organite produit l\'énergie (ATP) dans la cellule ?',
    choix: ['Le noyau', 'La mitochondrie', 'Le ribosome', 'L\'appareil de Golgi'],
    reponse: 1,
    explication: 'La mitochondrie = centrale énergétique. Les cellules musculaires en ont des milliers ✓'
  },
  8: {
    type: 'mcq',
    question: 'Quel est le numéro atomique de l\'oxygène (O) ?',
    choix: ['6', '7', '8', '16'],
    reponse: 2,
    explication: 'Z = 8 → 8 protons dans le noyau. L\'oxygène est le 8e élément du tableau périodique ✓'
  },
  9: {
    type: 'mcq',
    question: 'Liquide → Solide : quel changement d\'état ?',
    choix: ['Fusion', 'Vaporisation', 'Solidification', 'Condensation'],
    reponse: 2,
    explication: 'Solidification = liquide → solide. La fusion c\'est l\'inverse (solide → liquide) ✓'
  }
};


// ============================================================
// 2. FONCTIONS UTILITAIRES
// ============================================================

/**
 * Retourne la classe CSS du badge coloré selon la matière.
 * Utilise un objet comme map de lookup — plus lisible et O(1) qu'un switch/case.
 * Fallback 'badge-secondary' si une matière inconnue est passée.
 *
 * @param {string} matiere — "Maths" | "Français" | "Sciences"
 * @returns {string} — classe CSS (ex. "badge-maths")
 */
function getBadgeClass(matiere) {
  const classes = {
    'Maths':    'badge-maths',
    'Français': 'badge-francais',
    'Sciences': 'badge-sciences'
  };
  return classes[matiere] || 'badge-secondary';
}

/**
 * Retourne la clé CSS normalisée pour une matière (maths / francais / sciences).
 * Utilisée pour composer les classes stripe, badge, btn et pill.
 *
 * @param {string} matiere — "Maths" | "Français" | "Sciences"
 * @returns {string} — clé CSS normalisée
 */
function getMatiereCleCSS(matiere) {
  const map = { 'Maths': 'maths', 'Français': 'francais', 'Sciences': 'sciences' };
  return map[matiere] || 'maths';
}

/**
 * Map illustration card → chemin fichier image.
 * Générées avec Adobe Firefly (Session 4) — M. PASLÉCOLE / Mme LOGE / café de Mme LOGE.
 * Si le fichier est absent, l'onerror sur l'<img> masque le .polaroid-frame entier.
 * Séparé de illustrationModalMap pour permettre des variantes futures (crop différent).
 */
const illustrationMap = {
  'Maths':    'img/illus-maths.webp',
  'Français': 'img/illus-francais.webp',
  'Sciences': 'img/illus-sciences.webp'
};

/**
 * Map illustration modal header → chemin fichier image.
 * Actuellement identique à illustrationMap (même fichiers).
 * Conservé séparé : la modal pourrait utiliser un crop différent ou une variante
 * sans nécessiter de refactoring de afficherExercices().
 */
const illustrationModalMap = {
  'Maths':    'img/illus-maths.webp',
  'Français': 'img/illus-francais.webp',
  'Sciences': 'img/illus-sciences.webp'
};


// ============================================================
// 3. FONCTION — Génération des cards Bootstrap
//
// Vide le conteneur puis recrée tout le HTML des cards depuis exercices[].
// Appelé à l'init (liste complète) et implicitement à chaque filtre
// (les filtres agissent sur le DOM via d-none, pas en rappelant cette fonction).
//
// Design : on crée un <div> par createElement() et on set innerHTML pour le contenu
// intérieur — les données viennent uniquement du tableau JS interne (pas d'input
// utilisateur), donc innerHTML est safe ici.
//
// Animation : animationDelay échelonné (65ms × index) — chaque card entre
// avec un décalage visuel sans JavaScript d'animation. Le CSS @keyframes card-in
// gère le fade+translateY. will-change: transform est déclaré en CSS pour le GPU.
// ============================================================

/**
 * Injecte les cards d'exercices dans #liste-exercices.
 * @param {Array} liste — tableau filtré ou complet des exercices à afficher
 */
function afficherExercices(liste) {
  const conteneur = document.getElementById('liste-exercices');

  // Vidage préalable — évite les doublons si la fonction est rappelée
  // (actuellement non, mais défense en profondeur)
  conteneur.innerHTML = '';

  liste.forEach((exo, index) => {
    const classBadge = getBadgeClass(exo.matiere);
    const matiereKey = getMatiereCleCSS(exo.matiere);

    // Colonne Bootstrap responsive : 1 col mobile / 2 tablette / 3 desktop
    const col = document.createElement('div');
    col.classList.add('col-md-6', 'col-lg-4', 'col-card');

    // data-matiere stocké sur la col pour que le filtre puisse cibler sans
    // traverser le DOM intérieur — querySelector('.col-card').dataset.matiere
    col.dataset.matiere = exo.matiere;

    // Délai d'animation en cascade — 65ms entre chaque card (9 × 65 = 585ms max)
    // index fourni directement par forEach — évite indexOf() en O(n) à chaque itération
    col.style.animationDelay = `${index * 65}ms`;

    const illustSrc = illustrationMap[exo.matiere] || '';

    col.innerHTML = `
      <div class="card card-exercice h-100">

        <!-- Bande de couleur matière en haut de la card -->
        <div class="card-stripe stripe-${matiereKey}"></div>

        <!-- Cadre Polaroid : padding bas plus large que les côtés (photo développée) -->
        <!-- onerror : si le PNG est absent, on cache toute la frame — pas seulement l'img -->
        <div class="polaroid-frame">
          <img
            src="${illustSrc}"
            alt="Illustration ${exo.matiere}"
            class="card-illustration"
            onerror="this.closest('.polaroid-frame').style.display='none'">
        </div>

        <div class="card-body">
          <!-- Badges matière + niveau en flex wrap — résiste aux longs niveaux -->
          <div class="d-flex gap-2 mb-2 flex-wrap">
            <span class="badge ${classBadge}">${exo.matiere}</span>
            <span class="badge badge-niveau">${exo.niveau}</span>
          </div>

          <h3 class="card-title">${exo.titre}</h3>
          <p class="card-text">${exo.description}</p>

          <!-- data-bs-target lie directement la card au bon modal via l'id dynamique -->
          <!-- aria-label reprend le titre pour les lecteurs d'écran -->
          <button
            class="btn btn-sm btn-${matiereKey}"
            data-bs-toggle="modal"
            data-bs-target="#modal-${exo.id}"
            aria-label="Commencer l'exercice : ${exo.titre}">
            Commencer →
          </button>
        </div>

      </div>
    `;

    conteneur.appendChild(col);
  });
}


// ============================================================
// 4. FONCTION — Génération des modals Bootstrap
//
// Crée une modal par exercice via createElement + innerHTML.
// La modal est ajoutée au #modals-container (hors <main>) — bonne pratique
// Bootstrap : les modals en dehors des sections évitent les conflits de z-index
// et d'overflow:hidden sur les parents.
//
// Lifecycle événements Bootstrap :
//   'shown.bs.modal'  → déclenche le chrono + câble les interactions quiz
//   'hidden.bs.modal' → arrête le chrono + marque l'exercice comme vu
//
// Structure de chaque modal (Session 6 — énoncé collapse supprimé) :
//   modal-header    : illustration glassmorphism + badge matière + titre + timer-pill + btn fermer
//   modal-body      : bande timer-explain + énoncé court visible + quiz + feedback-zone
//   modal-footer    : bouton Fermer
// ============================================================

/**
 * Génère et injecte les 9 modals Bootstrap dans #modals-container.
 * Nouvelle UX (Session 6) : timer-pill dans le header + bande timer-explain +
 * énoncé court visible directement + feedback-zone animée.
 * Le collapse "énoncé complet" et le bloc mascotte timer ont été supprimés.
 */
function genererModals() {
  const conteneurModals = document.getElementById('modals-container');

  exercices.forEach(exo => {
    const classBadge = getBadgeClass(exo.matiere);
    const matiereKey = getMatiereCleCSS(exo.matiere);
    const quiz = QUIZ_DATA[exo.id];
    const hasTimer = exo.timer !== null && exo.timer !== undefined;

    // Création de l'élément modal — les attributs ARIA sont obligatoires :
    //   tabindex="-1" : reçoit le focus au show (sans apparaître dans la tabulation)
    //   aria-labelledby : lie la modal à son titre pour les screen readers
    //   aria-hidden="true" : initial, Bootstrap le retire au show()
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = `modal-${exo.id}`;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', `modal-titre-${exo.id}`);
    modal.setAttribute('aria-hidden', 'true');

    // Le HTML du quiz est généré séparément — séparation de responsabilité
    const quizHTML = genererQuizHTML(exo.id, quiz);

    // Timer-pill HTML — uniquement pour les MCQ (exo.timer !== null)
    const timerPillHTML = hasTimer
      ? `<div class="timer-pill" id="timer-pill-${exo.id}" aria-live="polite" aria-label="Temps restant">
           <span id="timer-val-${exo.id}">${exo.timer}</span>s
         </div>`
      : '';

    // Bande timer-explain — uniquement pour les MCQ
    const timerExplainHTML = hasTimer
      ? `<div class="timer-explain timer-explain-${matiereKey}" id="timer-explain-${exo.id}">
           ⏱ Tu as <strong><span id="timer-val-expl-${exo.id}">${exo.timer}</span>s</strong>
           — réponds avant que La Circulaire ne prenne feu.
         </div>`
      : '';

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <!-- Fond illustration flou (glassmorphism sélectif) -->
            <div class="modal-header-bg" style="background-image:url('${illustrationModalMap[exo.matiere] || ''}')"></div>

            <div>
              <div class="d-flex gap-2 mb-1 flex-wrap align-items-center">
                <span class="badge ${classBadge}">${exo.matiere}</span>
                <span class="badge badge-niveau">${exo.niveau}</span>
                ${timerPillHTML}
              </div>
              <!-- id utilisé par aria-labelledby sur la modal parente -->
              <h2 class="modal-title" id="modal-titre-${exo.id}">${exo.titre}</h2>
            </div>

            <!-- ms-auto pousse le btn-close à droite dans le flex header -->
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>

          <div class="modal-body">

            ${timerExplainHTML}

            <!-- ÉNONCÉ COURT — visible directement, sans collapse -->
            <p class="enonce-court">${exo.enonce_court || ''}</p>

            <!-- ZONE QUIZ — HTML injecté par genererQuizHTML() selon le type -->
            <div id="quiz-zone-${exo.id}">
              ${quizHTML}
            </div>

            <!-- FEEDBACK — animé (bounce-in si correct, shake si wrong) -->
            <div class="feedback-zone d-none" id="feedback-${exo.id}" role="alert" aria-live="polite"></div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>

        </div>
      </div>
    `;

    conteneurModals.appendChild(modal);

    // Événement Bootstrap 'shown.bs.modal' : fired APRÈS la fin de la transition CSS
    // (pas 'show.bs.modal' qui fire avant) — garantit que le DOM est visible et mesurable
    modal.addEventListener('shown.bs.modal', () => {
      demarrerChrono(exo.id, exo.timer);
      initInteractionsQuiz(exo, quiz);
    });

    // Événement 'hidden.bs.modal' : fired APRÈS que la modal a disparu
    // Arrêt propre du setInterval — évite la fuite mémoire
    modal.addEventListener('hidden.bs.modal', () => {
      arreterChrono(exo.id);
      marquerFait(exo.id);   // idempotent grâce au early-return dans marquerFait()
    });
  });
}

/**
 * Génère le HTML du bloc quiz interactif selon le type de l'exercice.
 * Appelé une seule fois par modal (à la création) — le câblage JS des listeners
 * est fait séparément dans initInteractionsQuiz() pour séparer structure et comportement.
 *
 * @param {number} exoId — identifiant de l'exercice
 * @param {Object} quiz  — objet QUIZ_DATA[id] (peut être undefined si pas de quiz)
 * @returns {string}     — fragment HTML à injecter dans quiz-zone-${exoId}
 */
function genererQuizHTML(exoId, quiz) {
  // Exercice sans quiz défini → zone vide (ne devrait pas arriver avec les 9 exercices)
  if (!quiz) return '';

  if (quiz.type === 'mcq') {
    // Grille Bootstrap 2×2 — col-6 sur mobile et desktop, g-2 gouttière serrée
    const cols = quiz.choix.map((c, i) =>
      `<div class="col-6"><button class="quiz-btn w-100" data-index="${i}" id="quiz-btn-${exoId}-${i}">${c}</button></div>`
    ).join('');
    return `
      <p class="fw-semibold mb-3" style="font-size:0.95rem">${quiz.question}</p>
      <div class="row g-2" id="quiz-mcq-${exoId}">${cols}</div>
    `;
  }

  return '';
}


// ============================================================
// 5. LOGIQUE — Filtres par matière
//
// Stratégie : les cards restent dans le DOM — on les affiche/masque via d-none.
// Avantage vs recréer : pas de reflow lourd, les animations entrance
// ne se redéclenchent pas, les états Bootstrap (modal ouverte…) sont préservés.
//
// Le filtre lit data-matiere sur la .col-card (défini dans afficherExercices).
// Cibler la col plutôt que la card intérieure évite une traversée DOM supplémentaire.
// ============================================================

/**
 * Câble les boutons filtre (#filtres-container .btn-filtre) sur les cards.
 * La classe 'actif' est gérée visuellement par CSS (fond indigo sur .btn-filtre.actif).
 */
function initFiltres() {
  const boutonsFiltre = document.querySelectorAll('.btn-filtre');

  boutonsFiltre.forEach(bouton => {
    bouton.addEventListener('click', () => {
      const matiereCible = bouton.dataset.filtre;

      // Retrait de 'actif' sur tous puis ajout sur le bouton cliqué
      boutonsFiltre.forEach(b => b.classList.remove('actif'));
      bouton.classList.add('actif');

      // Affichage/masquage des cols via d-none
      // 'Tous' = pas de filtre — on affiche tout
      const toutesLesCards = document.querySelectorAll('#liste-exercices .col-card');
      toutesLesCards.forEach(card => {
        if (matiereCible === 'Tous' || card.dataset.matiere === matiereCible) {
          card.classList.remove('d-none');
        } else {
          card.classList.add('d-none');
        }
      });
    });
  });
}


// ============================================================
// 6. LOGIQUE — Formulaire Contact + Validation + Toast
//
// Stratégie de validation en deux temps :
//   1. Sur 'blur' (quand l'utilisateur quitte un champ) — feedback immédiat,
//      sans attendre le submit. Moins frustrant qu'une erreur groupée au submit.
//   2. Sur 'submit' — validation complète + preventDefault + toast si tout OK.
//      Le form a novalidate dans le HTML pour désactiver la bulle native du navigateur
//      et contrôler entièrement l'UX des messages d'erreur.
//
// Aucun alert() — les erreurs s'affichent via .feedback-error.visible (CSS toggle).
// Aucun prompt() — les données ne sont pas envoyées à un serveur (mock pédagogique).
// ============================================================

/**
 * Valide un champ et bascule l'état d'erreur dans le DOM.
 * Modifie la classe 'champ-error' sur le champ et 'visible' sur le message d'erreur.
 *
 * @param {HTMLElement} champ     — l'input ou textarea à valider
 * @param {string}      errorId   — id du div .feedback-error associé
 * @param {boolean}     estValide — résultat du test de validation (caller's responsibility)
 * @returns {boolean}             — repassage de estValide pour l'agrégation dans submit
 */
function validerChamp(champ, errorId, estValide) {
  const messageErreur = document.getElementById(errorId);

  if (estValide) {
    champ.classList.remove('champ-error');
    messageErreur.classList.remove('visible');
  } else {
    champ.classList.add('champ-error');
    messageErreur.classList.add('visible');
  }

  return estValide;
}

/**
 * Valide le format d'une adresse email avec une regex conservative.
 * Regex intentionnellement simple : on vérifie la structure générale, pas RFC 5321 complète.
 * Un vrai backend validerait de toute façon — ici c'est du feedback UX.
 *
 * @param {string} email — valeur brute du champ
 * @returns {boolean}
 */
function estEmailValide(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email.trim());
}

/**
 * Initialise la validation et la soumission du formulaire Contact.
 * Validation blur sur chaque champ + validation complète au submit.
 * Si valide → Toast Bootstrap auto-dismiss 4s + reset du formulaire.
 */
function initFormulaire() {
  const form    = document.getElementById('form-contact');
  const prenom  = document.getElementById('input-nom');
  const email   = document.getElementById('input-email');
  const message = document.getElementById('input-message');
  const rgpd    = document.getElementById('rgpd-consent');

  // Validation progressive sur blur — l'utilisateur voit l'erreur au fur et à mesure
  // sans se faire agresser par un batch d'erreurs dès le premier submit

  prenom.addEventListener('blur', () => {
    validerChamp(prenom, 'error-nom', prenom.value.trim() !== '');
  });

  email.addEventListener('blur', () => {
    validerChamp(email, 'error-email', estEmailValide(email.value));
  });

  message.addEventListener('blur', () => {
    // Minimum 10 caractères — évite les "ok" ou "." vides de sens
    validerChamp(message, 'error-message', message.value.trim().length >= 10);
  });

  form.addEventListener('submit', (evenement) => {
    // Bloque le rechargement natif du navigateur — indispensable avec novalidate
    evenement.preventDefault();

    // Validation synchrone de tous les champs — chaque appel met aussi à jour le DOM
    // On stocke les résultats AVANT le test && pour que tous les champs soient validés
    // (évite le court-circuit de && qui laisserait les champs 2 et 3 sans feedback)
    const prenomValide  = validerChamp(prenom, 'error-nom', prenom.value.trim() !== '');
    const emailValide   = validerChamp(email, 'error-email', estEmailValide(email.value));
    const messageValide = validerChamp(message, 'error-message', message.value.trim().length >= 10);
    const rgpdValide    = rgpd.checked;

    // Feedback visuel RGPD — outline rouge si non coché au submit
    rgpd.style.outline = rgpdValide ? '' : '2px solid #DC2626';
    rgpd.style.outlineOffset = '2px';
    // Effacer l'outline dès que l'utilisateur coche
    rgpd.addEventListener('change', () => { rgpd.style.outline = ''; }, { once: true });

    if (prenomValide && emailValide && messageValide && rgpdValide) {
      declencherToast();
      form.reset();
      // Nettoyage des classes d'erreur résiduelles après reset (reset() vide les valeurs
      // mais ne touche pas aux classes CSS ajoutées par JS)
      [prenom, email, message].forEach(champ => champ.classList.remove('champ-error'));
      rgpd.style.outline = '';
    }
  });
}

/**
 * Instancie et affiche le Toast Bootstrap de confirmation du formulaire Contact.
 * delay: 4000ms — auto-dismiss sans action utilisateur.
 * Bootstrap Toast prend un nouvel objet à chaque déclenchement (pas de réutilisation).
 */
function declencherToast() {
  const elementToast = document.getElementById('toast-contact');
  const toast = new bootstrap.Toast(elementToast, { delay: 4000 });
  toast.show();
}


// ============================================================
// 7a. NAVIGATION — Lien actif au scroll + dropdown filtre
//
// initNavActif() : IntersectionObserver sur chaque <section id>.
//   rootMargin '0px 0px -70% 0px' : une section devient "active" dès que
//   son bord supérieur entre dans les 30% hauts du viewport.
//   On retire .active de tous les liens puis on l'ajoute au lien correspondant.
//   Pour #exercices, le dropdown-toggle est ciblé (pas un sous-item).
//
// initDropdownNav() : clics sur [data-filtre-nav] dans le menu déroulant.
//   1. Ferme le collapse navbar mobile s'il est ouvert.
//   2. Scroll smooth vers #exercices.
//   3. Simule un clic sur le .btn-filtre correspondant (réutilise initFiltres).
// ============================================================

/**
 * Active le lien de navigation correspondant à la section visible.
 * Utilise IntersectionObserver — zéro scrollListener, performant.
 */
function initNavActif() {
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Retirer .active sur tous les liens nav
      document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
      // Cibler le lien (ou le dropdown-toggle) dont le href correspond à la section
      const lien = document.querySelector(`.navbar-nav a[href="#${entry.target.id}"]`);
      if (lien) lien.classList.add('active');
    });
  }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/**
 * Gère les clics sur les items du dropdown Exercices.
 * Scroll vers la section + déclenche le filtre correspondant.
 */
function initDropdownNav() {
  document.querySelectorAll('[data-filtre-nav]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Fermer le navbar collapse mobile s'il est ouvert
      const collapseEl = document.getElementById('navMenu');
      if (collapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
      }

      // Scroll vers la section exercices
      document.getElementById('exercices').scrollIntoView({ behavior: 'smooth' });

      // Déclencher le filtre — réutilise la logique de initFiltres()
      const btn = document.querySelector(`.btn-filtre[data-filtre="${item.dataset.filtreNav}"]`);
      if (btn) btn.click();
    });
  });
}


// ============================================================
// 7. INIT — Point d'entrée unique au chargement du DOM
//
// Fix aria-hidden Bootstrap 5 — blur le bouton actif avant que la modal pose aria-hidden.
// Sans ça, Chrome avertit "Blocked aria-hidden on focused element" à chaque fermeture de modal.
document.addEventListener('hide.bs.modal', () => {
  if (document.activeElement) document.activeElement.blur();
});


// DOMContentLoaded garantit que le HTML est parsé avant toute manipulation
// (à l'opposé de window.load qui attend aussi les images et scripts externes).
// Toutes les fonctions d'initialisation s'enchaînent ici dans l'ordre de dépendance :
//   afficherExercices → génère les cards (DOM requis par genererModals)
//   genererModals     → crée les modals (DOM requis par les listeners d'exercices)
//   initFiltres       → câble les boutons filtre (DOM cards requis)
//   initFormulaire    → câble le formulaire Contact (DOM form requis)
//   genererAchievements → crée les badges achievement vides dans le TDB
//   mettreAJourTableauDeBord(undefined) → restaure l'état depuis localStorage au load
//   mettreAJourMascotte → synchronise la mascotte avec la progression sauvegardée
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  afficherExercices(exercices);
  genererModals();
  initFiltres();
  initDropdownNav();
  initNavActif();
  initFormulaire();
  genererAchievements();

  // Pré-peupler matiereToastDone pour éviter les toasts au rechargement de page :
  // si une matière était déjà complétée, on la marque comme déjà notifiée.
  const progInit = getProgression();
  ['maths', 'francais', 'sciences'].forEach((key, i) => {
    const ids = [1, 2, 3].map(n => n + i * 3);
    if (ids.every(id => progInit.has(id))) matiereToastDone.add(key);
  });

  mettreAJourProgression(true);               // widget hero — isInit=true (pas de toasts)
  mettreAJourTableauDeBord(undefined);        // TDB XP — pas de toast level-up au load
  mettreAJourMascotte(progInit.size);
});


// ============================================================
// 8. GAMIFICATION — XP, Niveaux, Achievements, Tableau de bord, Mascotte
//
// Deux clés localStorage :
//   CLE_PROGRESSION : JSON.stringify([...Set]) — Set d'IDs d'exercices vus
//                     Sérialisé en tableau car JSON.stringify(Set) → {} (Set n'est pas itérable par JSON)
//   CLE_QUIZ        : JSON.stringify({id: correct}) — résultats de première tentative
//                     On ne stocke que la 1ère réponse — pas d'écrasement sur la 2e ouverture
//
// safeStorage() wrapping : localStorage peut lever une exception dans :
//   - Navigation privée Safari (quota 0)
//   - Quota dépassé (5 Mo typique)
//   - Iframe cross-origin sécurisé
// Le wrapper return null silencieusement — l'app fonctionne sans persistence.
// ============================================================

const CLE_PROGRESSION = 'savoirplus_progression';
const CLE_QUIZ        = 'savoirplus_quiz';

/**
 * Wrapper sécurisé autour de localStorage.
 * Appelle fn() dans un try/catch — retourne null si localStorage est inaccessible.
 * Usage : safeStorage(() => localStorage.getItem('key'))
 *         safeStorage(() => localStorage.setItem('key', val))
 *
 * @param {Function} fn — callback encapsulant l'opération localStorage
 * @returns {*} — résultat de fn() ou null en cas d'exception
 */
function safeStorage(fn) {
  try { return fn(); } catch(e) { return null; }
}

/**
 * Lit et désérialise la progression depuis localStorage.
 * Le tableau JSON est converti en Set pour les opérations has() et add() en O(1).
 * Retourne un Set vide si aucune donnée sauvegardée.
 *
 * @returns {Set<number>} — IDs des exercices déjà ouverts
 */
function getProgression() {
  const donneesBrutes = safeStorage(() => localStorage.getItem(CLE_PROGRESSION));
  return donneesBrutes ? new Set(JSON.parse(donneesBrutes)) : new Set();
}

/**
 * Lit et désérialise les résultats quiz depuis localStorage.
 * Format : { [exoId]: boolean } — true si bonne réponse, false si mauvaise.
 *
 * @returns {Object} — map id → résultat (objet vide si pas de données)
 */
function getQuizAnswers() {
  const donneesBrutes = safeStorage(() => localStorage.getItem(CLE_QUIZ));
  return donneesBrutes ? JSON.parse(donneesBrutes) : {};
}

/**
 * Enregistre le résultat d'une réponse quiz en localStorage.
 * Early return si une réponse existe déjà pour cet exercice — on ne réécrit jamais
 * la première réponse (politique "première tentative seulement" pour le calcul XP).
 *
 * @param {number}  exoId   — identifiant de l'exercice
 * @param {boolean} correct — true si bonne réponse
 */
function enregistrerReponse(exoId, correct) {
  const answers = getQuizAnswers();
  if (answers[exoId] === undefined) {
    answers[exoId] = correct;
    safeStorage(() => localStorage.setItem(CLE_QUIZ, JSON.stringify(answers)));
  }
}

/**
 * Marque un exercice comme vu et met à jour l'affichage.
 * Early return si déjà vu — idempotent, évite une écriture localStorage inutile
 * à chaque fermeture de modal (l'événement hidden.bs.modal fire à chaque fois).
 *
 * @param {number} id — identifiant de l'exercice à marquer
 */
function marquerFait(id) {
  const progression = getProgression();
  if (progression.has(id)) return; // déjà marqué — aucune écriture

  const ancienXP = getXP(); // capturé avant l'ajout pour la détection de level-up

  progression.add(id);
  // Sérialisation : [...progression] convertit le Set en tableau itérable pour JSON
  safeStorage(() => localStorage.setItem(CLE_PROGRESSION, JSON.stringify([...progression])));

  mettreAJourTableauDeBord(ancienXP); // ancienXP permet de détecter le changement de niveau
  mettreAJourMascotte(progression.size);
  mettreAJourProgression(false);      // met à jour le widget hero progression
}


// ---- Calcul XP ----

/**
 * Calcule les XP gagnés pour un exercice selon son niveau de difficulté.
 * Barème : 50 XP (3e) / 75 XP (4e) / 100 XP (5e).
 * Réponse incorrecte = 25% du barème — récompense la tentative, pas juste la réussite.
 * Argument oral : "on encourage l'essai même raté — comme en vrai."
 *
 * @param {Object}  exo     — objet exercice (propriété niveau utilisée)
 * @param {boolean} correct — true si bonne réponse
 * @returns {number}        — XP à attribuer
 */
function calculerXP(exo, correct) {
  const base = { '3e secondaire': 50, '4e secondaire': 75, '5e secondaire': 100 };
  const pts  = base[exo.niveau] || 50;
  return correct ? pts : Math.round(pts * 0.25);
}

/**
 * Calcule le total XP depuis localStorage en agrégeant tous les exercices vus.
 * Pour les exercices vus sans quiz répondu (localStorage vide ou migration) :
 * on suppose correct=true (bénéfice du doute).
 *
 * @returns {number} — total XP accumulé
 */
function getXP() {
  const progression = getProgression();
  const answers     = getQuizAnswers();
  let total = 0;
  exercices.forEach(exo => {
    if (progression.has(exo.id)) {
      const correct = answers[exo.id] !== undefined ? answers[exo.id] : true;
      total += calculerXP(exo, correct);
    }
  });
  return total;
}


// ---- Système de niveaux XP ----

/**
 * Table des niveaux XP — 5 paliers avec label tonal et emoji.
 * Traversée linéaire dans getNiveauXP() — array intentionnel (pas un objet)
 * pour conserver l'ordre de comparaison min ascendant.
 * Labels dans l'esprit SavoirPlus : autodérision, pas de motivation creuse.
 */
const NIVEAUX_XP = [
  { min: 0,   label: 'Élève en sursis',         emoji: '😬' },
  { min: 100, label: 'Semi-motivé',              emoji: '🥱' },
  { min: 250, label: 'Presque concerné',         emoji: '🤔' },
  { min: 450, label: 'Sérieusement inquiétant',  emoji: '📚' },
  { min: 650, label: '60 % assuré',              emoji: '🎉' }
];

/**
 * Retourne le niveau XP correspondant à un total de points.
 * Pattern : accumulateur qui se réassigne à chaque palier franchi.
 * Plus lisible qu'une boucle with break car on teste chaque entrée exactement une fois.
 *
 * @param {number} xp — total XP
 * @returns {Object}  — objet niveau { min, label, emoji }
 */
function getNiveauXP(xp) {
  let niveau = NIVEAUX_XP[0]; // fallback : palier 0 (toujours vrai à xp=0)
  for (const n of NIVEAUX_XP) {
    if (xp >= n.min) niveau = n; // on remplace tant qu'on est au-dessus du seuil
  }
  return niveau;
}


// ---- Achievements ----

/**
 * Définition des 5 achievements.
 * condition est une fonction pure — reçoit (progression Set, answers Object)
 * et retourne boolean. Séparation de la logique de déverrouillage du rendu.
 * Permet de tester les conditions sans toucher au DOM.
 */
const ACHIEVEMENTS = [
  {
    id: 'premier',
    label: 'Premier pas',
    desc: 'Ouvre ton 1er exercice',
    icon: '🚀',
    condition: (p) => p.size >= 1
  },
  {
    id: 'maths',
    label: 'Matheux suspect',
    desc: 'Complète les 3 maths',
    icon: '🔢',
    condition: (p) => [1, 2, 3].every(id => p.has(id)) // every() = toutes les IDs Maths vues
  },
  {
    id: 'francais',
    label: 'Grammairien douteux',
    desc: 'Complète les 3 français',
    icon: '✍️',
    condition: (p) => [4, 5, 6].every(id => p.has(id))
  },
  {
    id: 'sciences',
    label: 'Biologiste en herbe',
    desc: 'Complète les 3 sciences',
    icon: '🔬',
    condition: (p) => [7, 8, 9].every(id => p.has(id))
  },
  {
    id: 'parfait',
    label: '9/9 — Circulaire RIP',
    desc: 'Termine tout',
    icon: '🏆',
    condition: (p) => p.size >= 9
  }
];

/**
 * Génère les badges achievement dans #tdb-achievements.
 * Appelé une seule fois à l'init — crée tous les badges en état 'locked'.
 * mettreAJourAchievements() les passe ensuite en 'unlocked' selon la progression.
 */
function genererAchievements() {
  const container = document.getElementById('tdb-achievements');
  if (!container) return;

  container.innerHTML = ACHIEVEMENTS.map(a =>
    `<div class="tdb-achievement-badge locked" id="ach-${a.id}" title="${a.desc}">
      <span class="ach-icon">${a.icon}</span>
      <span class="ach-label">${a.label}</span>
    </div>`
  ).join('');
}

/**
 * Met à jour l'état visuel de chaque achievement selon la progression actuelle.
 * Transition locked → unlocking (animation CSS) → unlocked (état final stable).
 * setTimeout(800ms) correspond à la durée de @keyframes ach-pop en CSS.
 * Guard : si déjà unlocked, on remet directement unlocked (rechargement de page).
 */
function mettreAJourAchievements() {
  const progression = getProgression();
  const answers     = getQuizAnswers();

  ACHIEVEMENTS.forEach(a => {
    const el = document.getElementById(`ach-${a.id}`);
    if (!el) return;

    const unlocked = a.condition(progression, answers);

    if (unlocked && el.classList.contains('locked')) {
      // Première déverrouillage dans cette session — animation ach-pop
      el.classList.remove('locked');
      el.classList.add('unlocking');
      setTimeout(() => el.classList.replace('unlocking', 'unlocked'), 800);
    } else if (unlocked) {
      // Achievement déjà déverrouillé (rechargement page) — pas d'animation
      el.classList.remove('locked');
      el.classList.add('unlocked');
    }
  });
}


// ---- Tableau de bord XP ----

/**
 * Met à jour tous les éléments DOM du tableau de bord XP.
 * Appelé à l'init (ancienXP=undefined) et après chaque marquerFait().
 *
 * Calcul du pourcentage barre XP :
 *   - xpMax = seuil du prochain niveau (ou seuil actuel + 200 si niveau max)
 *   - pct = ((xp − seuil_actuel) / (xp_max − seuil_actuel)) × 100
 *   - Math.min(100, ...) : plafonne à 100% (ne devrait pas arriver mais sécurité)
 *
 * Détection level-up : compare ancienNiveau.min ≠ niveauActuel.min
 *   (les objets niveau ne sont pas les mêmes références, donc on compare min)
 *
 * Révélation du TDB : retiré de d-none dès qu'au moins 1 exercice est fait
 *   — masqué avant le premier exercice pour ne pas encombrer le hero vide.
 *
 * @param {number|undefined} ancienXP — XP avant la dernière action (undefined = pas de détection level-up)
 */
function mettreAJourTableauDeBord(ancienXP) {
  const progression    = getProgression();
  const count          = progression.size;
  const total          = exercices.length;
  const xp             = getXP();
  const niveau         = getNiveauXP(xp);
  const prochainNiveau = NIVEAUX_XP.find(n => n.min > xp); // undefined si niveau max

  // --- Mise à jour DOM ---

  const elXP = document.getElementById('tdb-xp');
  if (elXP) elXP.textContent = `${xp} XP`;

  const elNiveau = document.getElementById('tdb-niveau');
  if (elNiveau) elNiveau.textContent = `${niveau.emoji} ${niveau.label}`;

  const elBar = document.getElementById('tdb-xp-bar');
  let pct = 0;
  if (elBar) {
    const xpMax = prochainNiveau ? prochainNiveau.min : niveau.min + 200;
    pct = count >= total
      ? 100
      : Math.min(100, Math.round(((xp - niveau.min) / (xpMax - niveau.min)) * 100));
    elBar.style.width = `${pct}%`;
    // aria-valuenow sur le parent role="progressbar" — requis pour l'accessibilité
    elBar.parentElement.setAttribute('aria-valuenow', pct);
  }

  const elCount = document.getElementById('tdb-count');
  if (elCount) elCount.textContent = `${count} / ${total} exercices`;

  // Stats par matière — Maths (1,2,3) / Français (4,5,6) / Sciences (7,8,9)
  // Calcul : pour la matière i, les IDs sont [1,2,3] + i*3 = [1+3i, 2+3i, 3+3i]
  ['maths', 'francais', 'sciences'].forEach((mat, i) => {
    const ids  = [1, 2, 3].map(n => n + i * 3);
    const done = ids.filter(id => progression.has(id)).length;
    const el   = document.getElementById(`tdb-mat-${mat}`);
    if (el) el.textContent = `${done}/3`;
  });

  mettreAJourAchievements();

  // Toast level-up uniquement si ancienXP est défini (pas au chargement initial)
  // et si le niveau a effectivement changé
  if (ancienXP !== undefined) {
    const ancienNiveau = getNiveauXP(ancienXP);
    if (ancienNiveau.min !== niveau.min) {
      // Level-up : anime la barre à 100% (niveau complété) puis reset pour le nouveau niveau.
      // Sans ce délai, la barre passe de 0% à 0% — animation invisible.
      if (elBar) {
        elBar.style.width = '100%';
        setTimeout(() => { elBar.style.width = `${pct}%`; }, 950);
      }
      declencherToastLevelUp(niveau);
    }
  }

  // Révéler le tableau de bord dès le premier exercice fait
  const tdb = document.getElementById('tableau-de-bord');
  if (tdb && count > 0) tdb.classList.remove('d-none');
}


// ---- Toast level-up ----

/**
 * Affiche le toast de passage de niveau (palette violette festive).
 * Injecte le label du nouveau niveau dans le corps du toast avant de l'afficher.
 *
 * @param {Object} niveau — objet niveau { min, label, emoji }
 */
function declencherToastLevelUp(niveau) {
  const el    = document.getElementById('toast-levelup');
  const corps = document.getElementById('toast-levelup-body');
  if (!el) return;
  if (corps) corps.textContent = `${niveau.emoji} Tu es maintenant : ${niveau.label}`;
  new bootstrap.Toast(el, { delay: 4000 }).show();
}


// ---- Progression hero (widget nouveau — Session 6) ----

/**
 * Set des matières déjà complétées dans la SESSION en cours.
 * Pré-peuplé au chargement depuis localStorage pour ne pas re-déclencher
 * les toasts "matière terminée" à chaque rechargement de page.
 */
const matiereToastDone = new Set();

/**
 * Met à jour le widget #progression-wrap dans le hero.
 * Lit l'état depuis localStorage — source unique de vérité.
 * Révèle le widget (display:block + classe visible) dès le premier exercice fait.
 *
 * Déclenche afficherToastMatiere() quand une matière est complétée pour la 1ère fois
 * dans la session (guard via matiereToastDone).
 *
 * @param {boolean} [isInit=false] — true au chargement initial (supprime les toasts matière)
 */
function mettreAJourProgression(isInit = false) {
  const progression = getProgression();
  const total       = exercices.length; // 9
  const done        = progression.size;
  const pct         = done === 0 ? 0 : Math.round((done / total) * 100);
  const xp          = getXP();

  // --- Toast matière — affiché une seule fois par matière terminée par session ---
  const labelsMatiere = { maths: 'Maths', francais: 'Français', sciences: 'Sciences' };
  ['maths', 'francais', 'sciences'].forEach((key, i) => {
    const ids     = [1, 2, 3].map(n => n + i * 3); // ex. Maths : [1,2,3], Français : [4,5,6]
    const matDone = ids.filter(id => progression.has(id)).length;
    if (!isInit && matDone === 3 && !matiereToastDone.has(key)) {
      matiereToastDone.add(key);
      afficherToastMatiere(labelsMatiere[key]);
    }
  });

}

/**
 * Affiche le toast de félicitations quand une matière entière est complétée.
 * Injecte un message personnalisé selon la matière avant le show().
 *
 * @param {string} label — "Maths" | "Français" | "Sciences"
 */
function afficherToastMatiere(label) {
  const el  = document.getElementById('toast-matiere');
  const msg = document.getElementById('toast-matiere-msg');
  if (!el) return;
  const blagues = {
    'Maths':    'Matheux certifié. M. PASLÉCOLE est impressionné.',
    'Français': 'Grammairien confirmé. Mme LOGE note la progression.',
    'Sciences': 'Scientifique en herbe. La Circulaire approuve.'
  };
  if (msg) msg.textContent = blagues[label] || 'Matière terminée — tu maîtrises ça.';
  new bootstrap.Toast(el, { delay: 4500 }).show();
}

// ---- Mascotte hero — évolution visuelle 0 → 5 ----

/**
 * Met à jour la speech bubble et le data-niveau de la mascotte chip.
 *
 * data-niveau sur #mascotte-widget (= .mascotte-chip) permet au CSS de cibler
 * chaque palier via [data-niveau="N"] sans aucune manipulation de classList JS.
 * Les effets visuels (box-shadow, filter, animations) sont entièrement en CSS.
 *
 * Paliers narratifs : La Circulaire traverse les 5 étapes du deuil à l'envers.
 *   0 → Panique | 1 → Suspicion | 2 → Déni | 3 → Marchandage | 4 → Acceptation | 5 → Métamorphose
 *
 * \u00a0 = espace insécable — évite le retour à la ligne sur "Aide !" et "7/9 ..."
 *
 * @param {number} count — nombre d'exercices vus (= progression.size)
 */
function mettreAJourMascotte(count) {
  const widget   = document.getElementById('mascotte-widget');
  const bulle    = document.getElementById('mascotte-bulle');
  const bulleSub = document.getElementById('mascotte-bulle-sub');
  if (!widget || !bulle) return;

  // Calcul du palier selon les tranches : 0 | 1-2 | 3-4 | 5-6 | 7-8 | 9
  const palier = count === 0 ? 0
    : count <= 2 ? 1
    : count <= 4 ? 2
    : count <= 6 ? 3
    : count <= 8 ? 4
    : 5;

  const bulles = [
    ['Aide\u00a0! Un élève qui révise\u00a0?!', ''],
    ['Ok, une fois, ça arrive...', ''],
    ['Deux exercices... C\'est suspect.', ''],
    ['Mi-chemin. Je transpire.', ''],
    ['7/9\u00a0... La Circulaire s\'incline.', ''],
    ['RÉUSSI.', 'Je suis devenue une Fiche de Cours.']
  ];

  widget.dataset.niveau  = palier;
  bulle.textContent      = bulles[palier][0];
  if (bulleSub) bulleSub.textContent = bulles[palier][1];
}


// ============================================================
// 9. QUIZ ENGINE — Timer 17 s + interactions MCQ / Trous
//
// Architecture :
//   chronoMap{}  : registre des timers actifs { exoId → { interval, secondes } }
//                  Keyed par exoId — N modals peuvent exister dans le DOM
//                  mais une seule est visible à la fois. Nettoyage propre via
//                  arreterChrono() sans risque de fuite.
//
//   quizWired Set : IDs déjà câblés — anti-empilement de listeners.
//                  Bootstrap 'shown.bs.modal' fire à chaque ouverture, mais
//                  initInteractionsQuiz() ne doit câbler qu'une fois.
//                  Sans ce guard : addEventListener s'additionne → N handlers
//                  sur le même bouton après N ouvertures.
//
//
// Timer :
//   DUREE = 17 s — private joke sur les délais administratifs IFOSUP.
//   setInterval 1s → décrémente secondes → appliquerEtat() met à jour :
//     - elNum  : countdown textContent + classe couleur
//     - elFill : width% de la barre
//     - elMasc : classes CSS états de chaleur
//     - swapMotion2() : src image si Motion2 disponible
//   À 0s : clearInterval + suppression de chronoMap[exoId]
// ============================================================

const chronoMap = {}; // { exoId: { interval, secondes } } — un timer par exercice
const quizWired = new Set(); // IDs déjà câblés — évite l'empilement de listeners


/**
 * Démarre le timer pour un exercice donné.
 * Sans opération si duree est null/undefined (exercices trous — pas de timer).
 *
 * Met à jour deux éléments synchronisés :
 *   timer-pill-{exoId}     : badge dans le header (états warm/hot/critique)
 *   timer-val-{exoId}      : valeur dans le pill
 *   timer-val-expl-{exoId} : valeur dans la bande timer-explain
 *
 * La seconde restante est stockée dans chronoMap[exoId].secondes pour que
 * signalerResultat() puisse calculer le bonus rapidité après arreterChrono().
 *
 * @param {number} exoId — identifiant de l'exercice
 * @param {number|null} duree — durée en secondes (null = pas de timer)
 */
function demarrerChrono(exoId, duree) {
  if (!duree) return; // null, 0, undefined → pas de timer (exercices trous)
  if (chronoMap[exoId]) arreterChrono(exoId); // nettoyage si déjà actif

  // On stocke l'entry d'abord pour que le setInterval puisse y écrire .secondes
  const entry = { interval: null, secondes: duree };
  chronoMap[exoId] = entry;

  // Références DOM capturées une fois — évite N getElementById par tick
  const pill    = document.getElementById(`timer-pill-${exoId}`);
  const val     = document.getElementById(`timer-val-${exoId}`);
  const valExpl = document.getElementById(`timer-val-expl-${exoId}`);

  /**
   * Applique l'état visuel du pill selon les secondes restantes.
   * Seuils : ≤10 critique | ≤25 hot | ≤40 warm | >40 aucun (vert par défaut CSS)
   */
  function updatePill() {
    if (val)     val.textContent     = entry.secondes > 0 ? entry.secondes : '🔥';
    if (valExpl) valExpl.textContent = entry.secondes > 0 ? entry.secondes : '0';
    if (pill) {
      pill.classList.remove('warm', 'hot', 'critique');
      if      (entry.secondes <= 10) pill.classList.add('critique');
      else if (entry.secondes <= 25) pill.classList.add('hot');
      else if (entry.secondes <= 40) pill.classList.add('warm');
    }
  }

  updatePill(); // état initial immédiat

  entry.interval = setInterval(() => {
    entry.secondes--;
    updatePill();
    if (entry.secondes <= 0) {
      clearInterval(entry.interval);
      // Ne pas supprimer chronoMap[exoId] ici — signalerResultat() en a besoin
      // pour lire secondes = 0 (réponse après expiration)
    }
  }, 1000);
}

/**
 * Arrête le timer d'un exercice et libère l'entrée dans chronoMap.
 * Appelé sur 'hidden.bs.modal' et par demarrerChrono() avant redémarrage.
 * Sans-opération si aucun timer actif pour cet ID.
 *
 * @param {number} exoId — identifiant de l'exercice
 */
function arreterChrono(exoId) {
  if (chronoMap[exoId]) {
    clearInterval(chronoMap[exoId].interval);
    delete chronoMap[exoId];
  }
}


/**
 * Calcule le bonus XP affiché dans la modal après une réponse MCQ.
 * 200 XP si répondu en ≤ 17s (tempsRestant ≥ 43 sur 60s) — récompense la rapidité.
 * 100 XP sinon — récompense la bonne réponse sans presser.
 * 0 XP si mauvaise réponse.
 *
 * @param {boolean} correct       — true si bonne réponse
 * @param {number}  tempsRestant  — secondes restantes au moment de la réponse
 * @returns {number} — XP bonus affiché (séparé du calculerXP() pour le TDB)
 */
function calculerXPBonus(correct, tempsRestant) {
  if (!correct) return 0;
  return tempsRestant >= 43 ? 200 : 100;
}

/**
 * Affiche le feedback animé dans la .feedback-zone de la modal.
 * Classe CSS bounce-in (correct) ou shake-feedback (wrong) — animations keyframes CSS.
 * Reflow forcé (void offsetWidth) pour que l'animation se rejoue si la modal
 * est rouverte après une première réponse.
 *
 * @param {boolean} correct       — true si bonne réponse
 * @param {number}  tempsRestant  — secondes restantes (pour le message bonus)
 * @param {number}  xp            — XP calculé (affiché dans le feedback)
 * @param {number}  exoId         — id de l'exercice
 * @param {string}  [explication] — explication pédagogique optionnelle (données internes)
 */
function afficherFeedback(correct, tempsRestant, xp, exoId, explication) {
  const zone = document.getElementById(`feedback-${exoId}`);
  if (!zone) return;

  // Reset pour relancer l'animation si la modal est rouverte
  zone.classList.remove('d-none', 'feedback-correct', 'feedback-wrong');
  void zone.offsetWidth; // reflow — force le navigateur à recalculer avant réajout

  const resultMsg = correct
    ? `✓ Bonne réponse ! +${xp} XP`
    : `✗ Pas tout à fait. +${xp} XP — retente à la prochaine session.`;

  // innerHTML safe : explication vient de QUIZ_DATA (données internes, pas utilisateur)
  zone.innerHTML = `<strong>${resultMsg}</strong>${explication
    ? `<br><span class="small mt-1 d-block">${explication}</span>` : ''}`;

  zone.classList.add(correct ? 'feedback-correct' : 'feedback-wrong');
}


// ---- Câblage des interactions quiz ----

/**
 * Câble les event listeners du quiz pour un exercice.
 * Guard quizWired.has(exo.id) → retour immédiat si déjà câblé.
 * Sans ce guard, chaque réouverture de modal accumulerait un nouveau listener
 * sur le même bouton → N appels à signalerResultat() au prochain clic.
 *
 * signalerResultat() (closure interne) :
 *   - Enregistre la réponse en localStorage (première tentative seulement)
 *   - Arrête le chrono
 *   - Applique l'état mascotte OK/KO
 *   - Déclenche le toast quiz avec XP calculé
 *
 * Format MCQ :
 *   - Listener sur chaque .quiz-btn
 *   - Guard zone.dataset.repondu évite le double-clic
 *   - Révèle la bonne réponse même si mauvaise réponse sélectionnée
 *   - Désactive tous les boutons (disabled) après réponse
 *
 * Format Trous :
 *   - Listener sur le bouton Valider
 *   - Guard btn.dataset.repondu évite la re-validation
 *   - Comparaison toLowerCase().trim() — insensible à la casse et aux espaces
 *   - reponses[] = tableau de variantes acceptées (includes)
 *   - tousCorrects = true seulement si TOUS les trous sont corrects
 *
 * @param {Object} exo  — objet exercice complet
 * @param {Object} quiz — objet QUIZ_DATA[exo.id]
 */
function initInteractionsQuiz(exo, quiz) {
  if (!quiz) return;
  if (quizWired.has(exo.id)) return; // anti-empilement
  quizWired.add(exo.id);

  /**
   * Finalise le quiz : enregistre, arrête le timer, affiche le feedback, toast.
   * tempsRestant capturé AVANT arreterChrono() qui supprime l'entrée chronoMap.
   * @param {boolean} correct     — true si bonne réponse
   * @param {string}  explication — explication pédagogique à afficher dans le feedback
   */
  function signalerResultat(correct, explication) {
    // Capture du temps restant avant arrêt (arreterChrono() supprime l'entrée)
    const entry = chronoMap[exo.id];
    const tempsRestant = entry ? entry.secondes : 0;

    enregistrerReponse(exo.id, correct);
    arreterChrono(exo.id);

    const xp = calculerXPBonus(correct, tempsRestant);
    afficherFeedback(correct, tempsRestant, xp, exo.id, explication);

    // Bonus vitesse (≤17s) → toast immersif centré. Sinon → toast Bootstrap classique.
    if (correct && tempsRestant >= 43) {
      afficherToastBonus17s();
    } else {
      declencherToastQuiz(exo.titre, xp, correct);
    }
  }

  // --- Câblage MCQ ---
  if (quiz.type === 'mcq') {
    const zone = document.getElementById(`quiz-mcq-${exo.id}`);
    if (!zone) return;

    zone.querySelectorAll('.quiz-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (zone.dataset.repondu) return; // déjà répondu — ignore les clics suivants
        zone.dataset.repondu = '1';

        const correct = (i === quiz.reponse);
        btn.classList.add(correct ? 'correct' : 'wrong');

        // Révélation de la bonne réponse et désactivation de tous les boutons
        zone.querySelectorAll('.quiz-btn').forEach((b, j) => {
          b.disabled = true;
          if (j === quiz.reponse) b.classList.add('correct'); // surligne la bonne réponse
        });

        signalerResultat(correct, quiz.explication);
      });
    });

  }
}


// ---- Toast bonus 17s — notification immersive centrée ----

/**
 * Affiche un overlay + card centrée amber pour les réponses bonus (≤ 17s).
 * Pas un Bootstrap toast — div créé et supprimé dynamiquement du DOM.
 * L'overlay semi-transparent (z-index 9998) bloque l'interaction pendant 3s.
 * La card (z-index 9999) entre avec @keyframes toast-bonus-in défini en CSS.
 *
 * Cycle de vie :
 *   1. createElement + append au body → @keyframes toast-bonus-in démarre automatiquement
 *   2. setTimeout 4500ms → fermer() → fade out opacity 0 en 600ms
 *   3. setTimeout 600ms → overlay.remove() + card.remove()
 */
function afficherToastBonus17s() {
  // Frames MOTION2 — Cool → En feu
  const MOTION2_FRAMES = [
    'img/motion2/cool.webp',
    'img/motion2/tiede.webp',
    'img/motion2/chaud.webp',
    'img/motion2/critique.webp',
    'img/motion2/enfeu.webp'
  ];
  // Durée d'affichage par frame — s'accélère vers la fin (effet embrasement)
  const FRAME_DURATIONS = [1100, 900, 650, 400, 0];
  // Durée de la transition opacity entre frames — aussi plus rapide vers la fin
  const FADE_DURATIONS  = [200,  160,  120,  80,  0];

  const overlay = document.createElement('div');
  overlay.className = 'toast-bonus-overlay';

  const card = document.createElement('div');
  card.className = 'toast-bonus-card';
  card.setAttribute('role', 'status');
  card.setAttribute('aria-live', 'polite');

  // Halo blanc flou centré — intègre l'image sur le fond de la card
  const halo = document.createElement('div');
  halo.style.cssText = 'position:relative;width:120px;height:120px;margin:0 auto 16px';

  const haloGlow = document.createElement('div');
  haloGlow.style.cssText = [
    'position:absolute',
    'inset:-40px',
    'background:radial-gradient(ellipse at center,rgba(255,255,255,1) 22%,rgba(255,255,255,0.85) 42%,rgba(255,255,255,0.3) 65%,transparent 82%)',
    'border-radius:50%',
    'filter:blur(10px)',
    'z-index:0'
  ].join(';');

  // Deux images superposées — crossfade sans trou (A visible, B en attente, puis inversion)
  const IMG_STYLE = 'position:absolute;top:0;left:0;width:120px;height:120px;object-fit:contain;z-index:1;transition:opacity 250ms ease';
  const imgA = document.createElement('img');
  imgA.style.cssText = IMG_STYLE;
  imgA.style.opacity = '1';
  imgA.src = MOTION2_FRAMES[0];
  imgA.alt = 'La Circulaire en feu — bonus vitesse';

  const imgB = document.createElement('img');
  imgB.style.cssText = IMG_STYLE;
  imgB.style.opacity = '0';
  imgB.alt = 'La Circulaire en feu — bonus vitesse';

  halo.appendChild(haloGlow);
  halo.appendChild(imgA);
  halo.appendChild(imgB);
  card.appendChild(halo);
  card.insertAdjacentHTML('beforeend', `
    <p class="toast-bonus-title">⚡ Tu viens de sauver les 17 secondes de M.&nbsp;PASLÉCOLE&nbsp;!</p>
    <p class="toast-bonus-sub">+200 XP — Bonus vitesse</p>
  `);

  // Bouton fermeture manuel
  const btnClose = document.createElement('button');
  btnClose.setAttribute('aria-label', 'Fermer');
  btnClose.style.cssText = 'position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.2rem;line-height:1;color:#6B7280;cursor:pointer;padding:4px';
  btnClose.innerHTML = '&times;';
  card.appendChild(btnClose);

  document.body.appendChild(overlay);
  document.body.appendChild(card);

  // Animation crossfade accélérée — A et B s'alternent, jamais de trou visible
  let currentFrame = 0;
  let activeImg = imgA;   // image actuellement visible
  let stagingImg = imgB;  // image en attente (opacity:0)
  let animTimeout;
  let autoCloseTimeout;

  function fermer() {
    clearTimeout(animTimeout);
    clearTimeout(autoCloseTimeout);
    overlay.style.transition = 'opacity 0.6s ease';
    card.style.transition    = 'opacity 0.6s ease';
    overlay.style.opacity    = '0';
    card.style.opacity       = '0';
    setTimeout(() => { overlay.remove(); card.remove(); }, 600);
  }

  btnClose.addEventListener('click', fermer);
  overlay.addEventListener('click', fermer);

  function advanceFrame() {
    currentFrame++;
    if (currentFrame >= MOTION2_FRAMES.length) return;

    const fadeDur = FADE_DURATIONS[currentFrame];

    // Précharger le prochain frame sur l'image en attente
    stagingImg.src = MOTION2_FRAMES[currentFrame];
    stagingImg.style.transition = `opacity ${fadeDur}ms ease`;
    activeImg.style.transition  = `opacity ${fadeDur}ms ease`;

    // Crossfade simultané : staging monte, active descend
    stagingImg.style.opacity = '1';
    activeImg.style.opacity  = '0';

    // Inverser les rôles pour le prochain tour
    [activeImg, stagingImg] = [stagingImg, activeImg];

    if (currentFrame < MOTION2_FRAMES.length - 1) {
      animTimeout = setTimeout(advanceFrame, FRAME_DURATIONS[currentFrame]);
    }
  }

  animTimeout = setTimeout(advanceFrame, FRAME_DURATIONS[0]);

  // Affichage 4500ms → fade out overlay + card en 600ms → suppression DOM
  autoCloseTimeout = setTimeout(() => {
    fermer();
  }, 4500);
}


// ---- Toast résultat quiz ----

/**
 * Affiche le toast de résultat après une réponse quiz.
 * Message aléatoire parmi 3 variantes — évite la répétition sur 9 exercices.
 * Le titre affiche le nom de l'exercice + résultat + XP gagné.
 *
 * @param {string}  titreExo — titre de l'exercice (pour le toast-header)
 * @param {number}  xp       — XP gagné (calculé avant l'appel)
 * @param {boolean} correct  — détermine la liste de messages à piocher
 */
function declencherToastQuiz(titreExo, xp, correct) {
  const el    = document.getElementById('toast-exercice');
  const titre = document.getElementById('toast-exercice-titre');
  const corps = document.getElementById('toast-exercice-body');
  if (!el) return;

  const messages = correct
    ? [
        'Bonne réponse ! La Circulaire applaudit.',
        'Correct ! Tu es suspects d\'avoir révisé.',
        'Bien joué. Le conseil de classe note.'
      ]
    : [
        'Raté. Mais t\'as tenté — c\'est quelque chose.',
        'Faux. La Circulaire compatit.',
        'Non. Relis la leçon (et pas en diagonale).'
      ];

  if (titre) titre.textContent = `${titreExo} — ${correct ? '✓' : '✗'} +${xp} XP`;
  if (corps) corps.textContent = messages[Math.floor(Math.random() * messages.length)];

  // Couleur header selon résultat
  const header = el.querySelector('.toast-header');
  if (header) {
    header.classList.remove('toast-exercice-header--correct', 'toast-exercice-header--incorrect');
    header.classList.add(correct ? 'toast-exercice-header--correct' : 'toast-exercice-header--incorrect');
  }

  new bootstrap.Toast(el, { delay: 3500 }).show();
}
