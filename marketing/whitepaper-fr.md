# LIVRE BLANC — Verawall

# Arrêter la fraude avant que l'argent ne parte
## L'intelligence comportementale pour la banque mobile en Afrique

*Pourquoi les prises de contrôle par échange de SIM, les virements sous influence et la fraude des agents déjouent les contrôles à base de règles — et à quoi ressemble une défense native à la session.*

---

> **Notes de mise en page (designer) :** rouge Verawall `#D71A28` sur couverture sombre ; titres en Barlow condensé ; blocs `[CITATION]` en barres d'accroche rouges ; blocs `[SCHÉMA]` spécifiés en fin de fichier. Pied de page : © Verawall 2026 · verawall.com

---

## Sommaire

1. Synthèse
2. Pourquoi la fraude l'emporte sur les rails mobiles
3. L'approche Verawall : analyser la session, pas seulement la transaction
4. Cas d'usage : neutraliser une prise de contrôle par échange de SIM, de bout en bout
5. Du dossier de fraude au dossier LBC : la doctrine des deux dossiers
6. L'impact métier
7. Un parcours d'adoption concret

---

## Avant-propos

La fraude dans la finance numérique africaine n'est pas un cas particulier de la fraude mondiale. Elle a sa propre forme : le numéro de téléphone *est* le compte, l'argent entre et sort par des réseaux d'agents humains, et les rails instantanés rendent chaque erreur irréversible en quelques secondes. Les défenses importées des manuels de fraude à la carte n'ont jamais été conçues pour cela.

Verawall, si. Nous construisons de l'intelligence comportementale pour la façon dont l'argent circule réellement ici — sur des terminaux Android d'entrée de gamme, via les rails de mobile money, en français et en anglais, sous des régulateurs qui attendent de plus en plus que le dossier de fraude et le dossier de blanchiment soient reliés.

Ce document explique où les défenses à base de règles cèdent, à quoi ressemble une défense native à la session, et comment une seule plateforme peut mener une institution du premier geste suspect sur un écran jusqu'à un dossier de blanchiment prêt pour le régulateur — automatiquement.

---

## 1. Synthèse

La fraude numérique visant les banques, fintechs et opérateurs de mobile money africains se professionnalise plus vite que les défenses déployées contre elle. L'enquête 2024 de la GSMA, menée dans 34 pays, le chiffre : l'opérateur moyen perd **1,06 million de dollars par an** à cause de la fraude au mobile money, et **84 % des prestataires estiment qu'elle continue d'augmenter.** Trois réalités structurelles creusent l'écart :

- **L'identité réside dans la SIM.** Là où le numéro de téléphone est à la fois le compte et le canal de récupération, un échange de SIM est un passe-partout — cité comme un schéma répandu par **79 % des prestataires** (GSMA, 2024).
- **L'argent part instantanément et sans retour.** Les transferts de portefeuille à portefeuille et les virements instantanés se règlent en quelques secondes ; le temps qu'une règle se déclenche sur le lot de la veille, les fonds ont franchi deux relais de mules et sont sortis par un agent de retrait. Et une fois partis, **78 % des cas ne donnent lieu à quasiment aucune récupération** (GSMA, 2024).
- **La victime autorise souvent la fraude elle-même.** Les virements sous influence — un escroc au téléphone qui guide le client pas à pas — paraissent légitimes à tout système qui n'examine que la transaction. Les schémas d'ingénierie sociale sont cités par **88 % des prestataires** (GSMA, 2024).

Les moteurs à base de règles examinent les transactions. Or dans chacun de ces scénarios, l'indice n'est pas dans la transaction — il est dans la **session** : la cadence de frappe inhabituelle après un changement de SIM, l'appel actif pendant la saisie d'un virement, l'application de partage d'écran qui recopie l'affichage, la position GPS falsifiée ou physiquement impossible. Pourtant, **seuls 10 % des prestataires utilisent l'IA ou l'apprentissage automatique** dans la gestion de la fraude, et **96 % des fraudes sont détectées par une réclamation client** — une fois l'argent parti (GSMA, 2024).

La plateforme d'intelligence comportementale de Verawall, c'est précisément ce 10 % manquant. Elle analyse la session en temps réel, décide **AUTORISER / RENFORCER / SUSPENDRE** avant que l'argent ne bouge — et non après une réclamation client — offre aux analystes une console conçue pour des équipes réduites, et, fait unique, traite la fraude confirmée comme le *début* de l'histoire de conformité, en ouvrant automatiquement le dossier de blanchiment et en traçant les fonds dès que l'analyste confirme la fraude.

---

## 2. Pourquoi la fraude l'emporte sur les rails mobiles

### La SIM est le périmètre — et il est poreux

Dans les marchés mobile-first, la prise de contrôle de compte commence rarement par un logiciel malveillant. Elle commence au comptoir d'un opérateur, par un remplacement de SIM obtenu par ingénierie sociale. Une fois le numéro capté, l'attaquant possède le canal OTP, le parcours de récupération et, dans bien des produits, l'identifiant de connexion lui-même. Pour une règle transactionnelle, l'attaquant *est* le client.

`[CITATION] Un échange de SIM déjoue tout contrôle qui fait confiance au numéro de téléphone. La seule chose qu'il ne peut pas imiter, c'est le comportement du client.`

### Les virements sous influence sont légitimes par construction

Le mode d'escroquerie dominant de la région est humain : un appel — souvent en français, souvent sur WhatsApp — d'un « conseiller bancaire », d'un « support mobile money », d'un « conseiller en placement ». Le client se connecte depuis son propre appareil, depuis son lieu habituel, et envoie l'argent lui-même. La fraude au virement autorisé (APP) est invisible pour les contrôles qui demandent *« cette transaction est-elle inhabituelle ? »* au lieu de *« ce client est-il manipulé en ce moment ? »*.

### Les réseaux d'agents ajoutent une surface de fraude que les banques ne modélisent pas

Les réseaux d'agents de dépôt/retrait sont à la fois la force et l'angle mort de la région. Les grilles de commission invitent à la manipulation — dépôts fractionnés en rafales de transactions sous le seuil, montants quasi identiques, une seule contrepartie. C'est un pur motif de grand livre, endémique, et presque jamais couvert par les outils de fraude importés. La GSMA classe la fraude à la commission (arbitrage) **premier schéma de fraude des agents, à 84 %** — et la plupart des fraudes ne sont pas le fait d'un acteur isolé : **94 % des cas impliquent une collusion entre parties internes et externes** (GSMA, 2024).

### La fraude par accès distant et par appareil arrive vite

Les escroqueries au « support » par partage d'écran, les logiciels de superposition (overlay) et la saisie scriptée — matures sur d'autres marchés — migrent vers la finance mobile-first. Des fermes d'appareils au GPS falsifié récoltent les primes d'inscription à grande échelle. Les défenses qui ne regardent jamais l'appareil ni le flux de saisie ne peuvent rien voir de tout cela.

### La faille de conformité : un seul dossier là où il en faudrait deux

Lorsque les produits de la fraude circulent, une seconde obligation commence : le déplacement des fonds volés est du **blanchiment**, et les cadres alignés sur le GAFI attendent une enquête LBC et, au-delà des seuils, une déclaration de soupçon (DS). En pratique, la plupart des institutions clôturent le dossier de fraude et n'ouvrent jamais le dossier LBC — les deux équipes travaillent sur des systèmes différents, sans passerelle. Les réseaux criminels lisent un dossier de fraude clos aux fonds non tracés comme un corridor resté ouvert.

---

## 3. L'approche Verawall : analyser la session, pas seulement la transaction

La plateforme de Verawall repose sur un principe : **au moment où la transaction existe, l'essentiel des preuves existe déjà.** La plateforme recueille ces preuves passivement, les analyse en temps réel et agit avant le règlement.

### Pilier 1 — Une capture comportementale là où sont réellement vos clients

Un SDK léger pour Android — pensé pour les terminaux d'entrée de gamme qui dominent la région — et un SDK web prêt à l'emploi capturent des signaux comportementaux respectueux de la vie privée :

- **Dynamique de saisie :** cadence de frappe, gestes tactiles et de souris — durée et géométrie uniquement, jamais le contenu. L'historique propre à chaque client sert de référence.
- **Contexte de session :** télémétrie de changement de SIM, intégrité de l'appareil (root, hooking, émulateurs), détection de navigateur headless sur le web.
- **Indicateurs de manipulation :** appel vocal actif pendant un virement ; outil de partage d'écran ou de contrôle à distance ; touches masquées par une superposition ; saisie robotique et scriptée.
- **Intégrité de la localisation :** position grossière, uniquement en geohash, avec un indicateur de GPS falsifié — de sorte qu'usurper son « domicile » déclenche l'alerte au lieu de l'éteindre — plus la détection de déplacement impossible.

La confidentialité est structurelle : les identifiants sont hachés avant de quitter l'appareil, la localisation ne sort jamais en coordonnées brutes, et le *contenu* des frappes n'est jamais capturé. `[Encadré : conforme au RGPD ; conçu pour l'examen BCEAO / des autorités nationales de protection des données]`

### Pilier 2 — La détection au grand livre pour les fraudes qui vivent dans les comptes

Certaines typologies n'apparaissent jamais dans une session. La plateforme ingère le flux de transactions et exécute des détecteurs pour les schémas de mules (entrée-sortie rapide, dispersion, réactivation de compte dormant) et la **fraude à la commission des agents** — le motif de dépôts fractionnés en rafale — nativement, et non en complément.

### Pilier 3 — Une décision en temps réel à laquelle votre système peut se fier

Un seul appel d'API au moment du risque renvoie **AUTORISER / RENFORCER / SUSPENDRE**, avec un score de 0 à 100 et des motifs nommés et lisibles. Les décisions sont idempotentes — un appel rejoué ne peut jamais créer de dossier en double — et chaque décision est explicable à un analyste, un auditeur ou un régulateur : *« +35 appel actif pendant le virement, +25 montant très supérieur au profil appris, +25 nouvel appareil ».* Le canal d'action renvoie les décisions de l'analyste dans votre cœur bancaire — bloquer le paiement, terminer la session, couper la session mobile sur l'appareil — via des webhooks signés et livrés « au moins une fois ».

### Pilier 4 — Une console conçue pour une équipe de cinq personnes

File d'alertes classée par risque, revue d'alerte sur un seul écran avec chronologie et rejeu de la session, gestion des dossiers, et analyse de liens — le graphe « suivre l'argent » qui suit les fonds à travers la couche de mules et relie les comptes partageant un même appareil. Contrôle d'accès par rôle, MFA et intégration par invitation sont natifs. Les sujets apparaissent sous des pseudonymes stables — les analystes traitent les dossiers sans jamais voir d'identifiant client brut.

`[SCHÉMA 1 : le pipeline de la session à la décision — voir spécification en fin de fichier]`

---

## 4. Cas d'usage : neutraliser une prise de contrôle par échange de SIM, de bout en bout

**La menace.** Un attaquant obtient par ingénierie sociale le remplacement de la SIM d'un client au solde moyen, reçoit l'OTP et se connecte depuis un nouvel appareil. Tout ce que vérifie le système de connexion — numéro, OTP, mot de passe — est conforme.

**Étape 1 — La session trahit l'attaquant.** Dès le premier écran, la plateforme compare : cadence de frappe contre le profil appris du client (*écart*), appareil contre les installations connues (*première apparition*), état de la SIM (*changée depuis la dernière session*). Si l'attaquant falsifie le GPS vers le quartier de la victime, l'indicateur de localisation falsifiée se déclenche — l'esquive elle-même devient preuve.

**Étape 2 — Le virement est suspendu avant règlement.** L'attaquant saisit un virement proche du plafond du compte vers un nouveau bénéficiaire. L'appel de score renvoie **SUSPENDRE** — l'empilement des signaux le place bien au-dessus du seuil — et le paiement est mis en attente de revue. Sur des rails instantanés, c'est le seul instant qui compte : *avant* le règlement.

**Étape 3 — L'analyste voit toute l'histoire d'un coup.** Une alerte : la chronologie (changement de SIM → nouvel appareil → frappe étrangère → virement au plafond vers un nouveau bénéficiaire), chaque signal avec son poids et sa preuve. Un clic termine la session sur l'appareil et bloque le paiement via le canal d'action.

**Étape 4 — Le réseau, pas seulement le dossier.** Le graphe d'analyse de liens part du sujet : si quoi que ce soit s'était réglé, les flux sortants remontent jusqu'à la couche de mules ; la vue « appareil partagé » expose les comptes frères pilotés depuis le même terminal. La fraude cesse d'être un incident pour devenir une carte.

`[CITATION] La transaction semblait parfaite. La session, jamais.`

**Cas d'usage secondaires** *(une page chacun, même format Menace / Détection / Résultat) :*
- **Le virement sous influence :** détection d'appel actif + schémas d'hésitation et de correction + premier virement à un bénéficiaire pour un montant très supérieur au profil → RENFORCER ou SUSPENDRE *pendant que l'escroc est encore en ligne*.
- **La fraude à la commission des agents :** le détecteur au grand livre signale la rafale sous le seuil, aux montants quasi identiques vers une seule contrepartie ; l'alerte arrive avec la rafale visualisée — une fuite de revenus qu'aucun outil importé ne couvre.

---

## 5. Du dossier de fraude au dossier LBC : la doctrine des deux dossiers

Toute fraude qui capte des fonds constitue deux événements de conformité : la fraude, et le blanchiment de ce qui a été déplacé. La plupart des institutions traitent le premier et n'ouvrent jamais le second — non par négligence, mais parce qu'aucun système ne fait le pont.

Verawall comble structurellement cette faille. Lorsqu'un analyste clôture une alerte comme **fraude confirmée**, la plateforme vérifie si des fonds ont effectivement bougé après la compromission. Si oui, elle **ouvre automatiquement un dossier LBC lié** — pré-rempli avec les flux sortants tracés, rattaché au dossier de fraude, une seule fois par alerte — et le relie au graphe des flux. Si rien n'a bougé, aucun dossier ne s'ouvre : le tri est intégré, le volume de dossiers reste maîtrisé.

Les questions suivantes de l'analyste sont déjà posées : qui est la couche de mules, le total atteint-il le seuil de déclaration, quels autres comptes touchent aux mêmes contreparties ou appareils.

`[CITATION] Quand votre institution clôture un dossier de fraude par échange de SIM, une enquête LBC sur les flux de fonds s'ouvre-t-elle jamais ? Avec Verawall, elle s'ouvre d'elle-même — l'argent étant déjà tracé.`

---

## 6. L'impact métier

- **Les pertes s'arrêtent avant règlement.** La SUSPENSION intervient avant règlement ; sur des rails instantanés, c'est la différence entre une perte évitée et une passation en perte. Le renforcement gère la zone grise sans friction généralisée.
- **De petites équipes font un travail de fond.** Files classées, revue sur un écran avec la preuve attachée, et actions en un clic : une poignée d'analystes couvre ce qui exigeait un service entier. L'alerte dit *pourquoi* en langage clair — pas d'archéologie de modèle.
- **La posture de conformité s'améliore par défaut.** Le dossier LBC existe, la trace des flux existe, la piste d'audit existe — parce que le système les a créés. La préparation de la DS part d'un dossier déjà rempli, pas d'une page blanche.
- **Les clients gardent leur confiance.** Les clients sont la partie **la plus sévèrement touchée** par la fraude au mobile money (GSMA, 2024). Sur des marchés où la confiance dans la finance numérique se construit encore, l'écart entre « la banque l'a arrêté » et « la banque m'a remboursé plus tard » se mesure en fidélité — d'autant que la récupération, à l'échelle du secteur, n'a que rarement lieu.
- **Une seule plateforme, deux surfaces.** Sessions Android et web, typologies comportementales et de grand livre, fraude et LBC — un modèle de données, une console, une intégration.

`[Encadré optionnel : périmètre honnête — les références comportementales nécessitent une fenêtre d'apprentissage ; les seuils des détecteurs sont ajustés par institution lors de l'intégration ; les signaux au niveau de l'appareil sont les plus forts sur Android, plateforme dominante de la région.]`

---

## 7. Un parcours d'adoption concret

1. **Semaine 1 — Intégrer passivement.** Ajoutez le SDK à l'application (aucun changement de permission, aucun impact UX) et dupliquez le flux de transactions. La plateforme observe et construit les références. Rien ne change côté client.
2. **Semaines 2 à 4 — Scoring en observation.** Votre système appelle l'API de score mais n'applique rien. Vous regardez la console se remplir de ce que la plateforme *aurait* suspendu, et les seuils sont ajustés à votre portefeuille, vos montants, vos clients.
3. **Semaine 5 et au-delà — Appliquer progressivement.** Activez d'abord le RENFORCER pour la zone grise, puis le SUSPENDRE pour la tranche la plus élevée. Le coupe-circuit et le canal de blocage de paiement passent en production sous contrôle de l'analyste.
4. **En continu — Étendre la couverture.** Ajoutez le SDK web là où vous avez un canal web, activez la passerelle LBC pour votre équipe conformité, et allumez l'analyse de liens à mesure que votre historique de grand livre s'étoffe.

L'intégration est volontairement légère : un SDK, un flux, un appel d'API au moment du risque. Un déploiement en partenariat pilote atteint le scoring en observation en un mois.

---

**Verawall — L'intelligence comportementale au service de la prévention de la fraude**
*Conçu pour la finance mobile-first. © Verawall 2026 · verawall.com · contact@verawall.com*

---

## Annexe : spécifications des schémas pour le design

**SCHÉMA 1 — Pipeline de la session à la décision (section 3).** Flux horizontal, cinq étapes : `Session client (app / web)` → `Capture comportementale passive` → `Moteur de scoring temps réel (références apprises + signaux de typologie)` → `Décision : AUTORISER / RENFORCER / SUSPENDRE` → `Console analyste + canal d'action (bloquer · terminer · dossier LBC)`. Accents rouge Verawall sur l'étape de décision ; style linéaire gris cohérent avec les illustrations d'états vides de la console.

**SCHÉMA 2 — Cycle de vie de la fraude, régionalisé (optionnel, section 2).** Cycle circulaire en cinq étapes : `1. Prise du numéro (échange de SIM / ingénierie sociale)` → `2. Entrée dans le compte (paraît légitime)` → `3. Extraction (virement instantané)` → `4. Couche de mules (sauts de portefeuille)` → `5. Retrait (réseau d'agents)` — avec les points d'intervention Verawall marqués aux étapes 2, 3 et 4.

**SCHÉMA 3 — Doctrine des deux dossiers (section 5).** Carte de gauche `DOSSIER DE FRAUDE — alerte, preuves de session, décision` ; flèche libellée `des fonds ont-ils bougé ?` ; carte de droite `DOSSIER LBC — ouvert automatiquement, trace des flux, préparation de la DS` ; en dessous, un petit graphe de flux à trois nœuds (sujet → mule → retrait).
