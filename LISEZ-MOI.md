# QC Oraux Physique MP* — Site interactif

Site statique (HTML/CSS/JS, sans serveur ni build) regroupant 62 questions
d'oraux de physique MP*, réparties en 10 thèmes, avec schémas animés et thème
clair/sombre conservé entre les pages.

- `index.html` — page d'accueil (les 10 thèmes)
- `assets/` — `style.css`, `site.js` (thème + menus), `anim.js` (animations canvas)
- un dossier par thème (mecanique, thermo, diffusion, electromagnetisme, ondes,
  electronique, optique-geo, optique-ond, physique-stat, quantique), chacun avec
  son `index.html` (sommaire) et ses pages de questions.
- `.nojekyll` — fichier vide nécessaire à GitHub Pages (ne pas supprimer).

---

## Le mettre en ligne avec GitHub Pages — pas à pas

GitHub Pages héberge gratuitement un site web statique directement depuis un
dépôt GitHub. Une fois en ligne, tu auras une URL fixe accessible depuis
n'importe quel appareil (iPhone, iMac, etc.).

### 1. Créer un dépôt
1. Va sur https://github.com et connecte-toi.
2. Clique sur le bouton **New** (ou le « + » en haut à droite → **New repository**).
3. Donne-lui un nom, par exemple `qc-physique-mp`.
4. Visibilité : **Public** est le plus simple (Pages fonctionne aussi en privé,
   mais seulement avec un compte payant). Laisse les cases « Add a README » etc.
   décochées.
5. Clique **Create repository**.

### 2. Envoyer les fichiers du site
Le plus simple sans ligne de commande :
1. Sur la page du dépôt vide, clique sur le lien **uploading an existing file**
   (ou onglet **Add file → Upload files**).
2. **Décompresse d'abord ce zip sur ton ordinateur**, puis glisse-dépose
   **tout le contenu** du dossier (le fichier `index.html`, le dossier `assets`,
   les 10 dossiers de thèmes, et le fichier `.nojekyll`).
   ⚠️ Important : envoie le *contenu* du dossier, pas le dossier qui le contient —
   le fichier `index.html` doit se retrouver à la racine du dépôt.
3. En bas, clique **Commit changes**.

> Astuce : si le fichier `.nojekyll` n'apparaît pas au glisser-déposer (les
> fichiers commençant par un point sont parfois cachés), ce n'est pas bloquant
> ici — le site n'utilise pas de dossiers commençant par `_`.

### 3. Activer GitHub Pages
1. Dans le dépôt, va dans **Settings** (onglet en haut).
2. Menu de gauche → **Pages**.
3. Section **Build and deployment** → **Source** : choisis **Deploy from a branch**.
4. **Branch** : sélectionne `main` et le dossier `/ (root)`, puis **Save**.
5. Attends ~1 minute. Recharge la page : GitHub affiche
   **« Your site is live at … »** avec l'URL.

### 4. Ton URL
Elle ressemble à :
```
https://TON-NOM-UTILISATEUR.github.io/qc-physique-mp/
```
Ouvre-la sur ton téléphone, ajoute-la à l'écran d'accueil — elle marchera
partout, sans serveur local.

### Mettre à jour le site plus tard
Réutilise **Add file → Upload files** pour remplacer les fichiers modifiés, puis
**Commit**. GitHub Pages se reconstruit automatiquement en une minute environ.

---

## Variante : tester sans GitHub
Comme c'est un site multi-pages, un double-clic sur `index.html` peut mal
fonctionner. Pour le tester en local, lance un petit serveur depuis le dossier :
```
python3 -m http.server 8000
```
puis ouvre http://localhost:8000 dans ton navigateur.
