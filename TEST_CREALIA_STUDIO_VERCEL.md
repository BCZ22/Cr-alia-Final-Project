# 🧪 Script de test rapide - Créalia Studio sur Vercel

## ⚡ Test en 5 minutes

### 1️⃣ Vérification des variables d'environnement

**Dans Vercel Dashboard → Settings → Environment Variables**

Vérifiez que ces variables sont configurées :

```
✅ CREALIA_MOCK=true
✅ NEXTAUTH_URL=https://votre-app.vercel.app
✅ NEXTAUTH_SECRET=(votre secret)
✅ DATABASE_URL=(votre DB)
```

---

### 2️⃣ Test des endpoints API (sans auth)

Ouvrez ces URLs dans votre navigateur :

**Test 1 - Upload endpoint info**
```
https://votre-app.vercel.app/api/crealia/upload
```
✅ **Attendu :** JSON avec description de l'endpoint
```json
{
  "endpoint": "POST /api/crealia/upload",
  "description": "Upload media files...",
  ...
}
```

**Test 2 - Analyze endpoint info**
```
https://votre-app.vercel.app/api/crealia/analyze
```
✅ **Attendu :** JSON avec description + mockMode = true

**Test 3 - Generate endpoint info**
```
https://votre-app.vercel.app/api/crealia/generate
```
✅ **Attendu :** JSON avec description

**Test 4 - Presets (nécessite auth)**
```
https://votre-app.vercel.app/api/crealia/presets
```
⚠️ **Attendu :** Error 401 Unauthorized (normal sans auth)
OU
✅ **Si connecté :** Liste des presets

---

### 3️⃣ Test de l'interface (connecté)

#### A. Ouvrir Créalia Studio

1. Connectez-vous à votre app
2. Naviguez vers Créalia Studio (bouton ou lien)
3. **Vérifiez :**

```
✅ Interface s'affiche (pas d'écran blanc)
✅ Header : "🎬 Créalia Studio"
✅ Sidebar : Recommandé, Vidéo, Image, Audio visible
✅ Grille d'outils : cartes visibles
✅ Pas d'erreurs dans la console (F12)
```

#### B. Sélectionner un outil

1. Cliquez sur **"Générateur de Reels IA"**
2. **Vérifiez :**

```
✅ Panneau droit s'ouvre
✅ Titre de l'outil affiché
✅ Zone "📤 Média source" visible
✅ Zone "⚙️ Paramètres" visible
✅ Section "⚡ Exemples rapides (presets)" visible
✅ Bouton "Générer" visible (désactivé pour l'instant)
```

#### C. Tester l'upload

1. **Préparez un fichier test :**
   - Vidéo MP4 (< 100MB pour test rapide)
   - Ou image JPG/PNG

2. **Upload :**
   - Cliquez sur la zone d'upload
   - Sélectionnez votre fichier
   - **OU** Drag & drop le fichier

3. **Vérifiez :**

```
✅ Loader "Upload en cours..." apparaît
✅ Message "Fichier uploadé ✅" après quelques secondes
✅ Format et taille affichés
✅ SI VIDÉO : Message "J'analyse maintenant la vidéo..." apparaît
✅ SI VIDÉO EN MOCK : Section "🎞️ Scènes détectées" apparaît
```

#### D. Appliquer un preset

1. Cliquez sur **"Viral & Fun"**
2. **Vérifiez :**

```
✅ Formulaire se pré-remplit
✅ Format : 9:16
✅ Durée : 15
✅ Tone : fun
✅ Sous-titres : activé (toggle)
```

#### E. Générer du contenu

1. Cliquez sur **"Générer"**
2. **Vérifiez :**

```
✅ Bouton change en "Génération en cours..."
✅ Icône de chargement (spinner)
✅ Job ID affiché (ex: job_abc123)
✅ Estimation de temps affichée (~120s)
```

3. **Attendez ~5 secondes (mode MOCK)**
4. **Vérifiez :**

```
✅ Section "✨ Résultats" apparaît
✅ 1 à 3 Reels affichés
✅ Thumbnails visibles (images placeholder)
✅ Titre présent (ex: "Incroyable transformation ! 🔥")
✅ Caption présent
✅ Hashtags présents (#crealia, #reels, etc.)
✅ Bouton "Télécharger" présent
```

#### F. Télécharger

1. Cliquez sur **"Télécharger"**
2. **Vérifiez :**

```
✅ Nouvel onglet s'ouvre avec l'URL du fichier
   OU
✅ Téléchargement démarre
```

---

### 4️⃣ Tests additionnels rapides

#### Test erreur format invalide

1. Essayez d'uploader un fichier `.txt` ou `.doc`
2. **Vérifiez :**

```
✅ Message d'erreur apparaît
✅ "Format non pris en charge..."
✅ Solution affichée
```

#### Test navigation catégories

1. Cliquez sur **"Vidéo"**
   ```
   ✅ Description change : "Créez des vidéos IA professionnelles"
   ✅ Outils vidéo affichés
   ```

2. Cliquez sur **"Image"**
   ```
   ✅ Description change : "Générez des images IA créatives"
   ✅ Outils image affichés
   ```

3. Cliquez sur **"Contenu Audio"**
   ```
   ✅ Outils audio affichés
   ```

#### Test modal aide

1. Cliquez sur icône **"?"**
2. **Vérifiez :**

```
✅ Modal s'ouvre
✅ Titre : "Aide rapide"
✅ Astuces affichées
✅ Bouton "Fermer" présent
```

3. Cliquez sur **"Fermer"**
4. **Vérifiez :**

```
✅ Modal se ferme
```

#### Test fermeture

1. Cliquez sur **"✕"** (bouton fermer)
2. **Vérifiez :**

```
✅ Interface se ferme
✅ Retour à la page précédente
```

---

## 🐛 Problèmes fréquents et solutions

### Interface ne s'affiche pas (écran blanc)

**Vérifications :**
1. Console browser (F12) → onglet Console
2. Cherchez erreurs JavaScript
3. Solutions possibles :
   - Composants UI manquants → Vérifiez `components/ui/`
   - Imports invalides → Vérifiez les chemins `@/`
   - Variables env manquantes → Ajoutez `CREALIA_MOCK=true`

**Action immédiate :**
```bash
# En local, testez d'abord
npm run dev
# Ouvrez http://localhost:3000
# Si ça marche en local mais pas sur Vercel → Problème de build ou env
```

### Endpoints retournent 404

**Vérifications :**
1. URL exacte : `https://votre-app.vercel.app/api/crealia/upload` (pas de `s` à crealia)
2. Dashboard Vercel → Functions → Vérifiez que les functions sont déployées
3. Vérifiez structure :
   ```
   app/api/crealia/upload/route.ts
   app/api/crealia/analyze/route.ts
   etc.
   ```

### Upload échoue

**Cause probable :** Vercel filesystem read-only

**Solutions :**
1. **Mode MOCK :** Vérifiez `CREALIA_MOCK=true` sur Vercel
2. **Production :** Configurez S3
   ```
   STORAGE_PROVIDER=s3
   S3_BUCKET_NAME=xxx
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   ```

### Jobs bloqués sur "queued"

**En mode MOCK :**
- Normal, simule 5 secondes de processing
- Si > 10 secondes → Problème

**Vérifications :**
1. Console browser → Network tab
2. Vérifiez appels à `/api/crealia/jobs/[id]` toutes les 2 secondes
3. Vérifiez réponses (200 OK ?)

**Solution :**
```javascript
// Dans console browser
fetch('https://votre-app.vercel.app/api/crealia/jobs/job_test')
  .then(r => r.json())
  .then(console.log)
// Vérifiez la réponse
```

### Erreurs de build sur Vercel

**Étapes de debug :**
1. Dashboard Vercel → Deployment → Build Logs
2. Cherchez l'erreur exacte
3. Solutions communes :
   - Dépendance manquante → `npm install [package]`
   - Erreur TypeScript → Vérifiez types
   - Prisma erreur → Vérifiez schema existe

---

## ✅ Checklist finale

### Fonctionnel minimum

```
✅ Interface s'ouvre
✅ Outils visibles
✅ Outil sélectionnable
✅ Upload fonctionne
✅ Génération retourne des résultats
✅ Pas d'erreurs critiques console
```

### Fonctionnel complet

```
✅ Tous les endpoints API accessibles
✅ Upload + analyse + génération fonctionnent
✅ Presets appliquent les paramètres
✅ Résultats avec captions/hashtags
✅ Téléchargement fonctionne
✅ Navigation catégories OK
✅ Modal aide s'ouvre/ferme
✅ Gestion d'erreurs affiche messages
✅ Responsive (mobile OK)
✅ Pas d'erreurs dans logs Vercel
```

---

## 📊 Résultat du test

**Date :** _____________________  
**Testé sur :** ⬜ Production ⬜ Preview  
**URL testée :** _____________________

### Statut global

⬜ **✅ TOUT FONCTIONNE** - Prêt pour démo/utilisation  
⬜ **⚠️ FONCTIONNEL PARTIEL** - Quelques ajustements nécessaires  
⬜ **❌ PROBLÈMES CRITIQUES** - Nécessite corrections

### Notes
```
_________________________________________________________
_________________________________________________________
_________________________________________________________
```

---

## 🚀 Commande de test automatisé

Pour tester les endpoints rapidement :

```bash
# Créez un script test-endpoints.sh
#!/bin/bash

URL="https://votre-app.vercel.app"

echo "Testing Créalia Studio endpoints..."

echo "\n1. Upload endpoint:"
curl -s "$URL/api/crealia/upload" | jq .endpoint

echo "\n2. Analyze endpoint:"
curl -s "$URL/api/crealia/analyze" | jq .endpoint

echo "\n3. Generate endpoint:"
curl -s "$URL/api/crealia/generate" | jq .endpoint

echo "\n4. Presets endpoint:"
curl -s "$URL/api/crealia/presets" | jq .success

echo "\nAll tests complete!"
```

**Utilisation :**
```bash
chmod +x test-endpoints.sh
./test-endpoints.sh
```

---

**🎉 Si tous les tests passent : Créalia Studio est 100% opérationnel sur Vercel !**

