# ✅ Checklist de déploiement Créalia Studio sur Vercel

## 📋 Vérification pré-déploiement

### ✅ Configuration actuelle détectée

**Fichiers de configuration :**
- ✅ `vercel.json` - Présent et configuré
- ✅ `next.config.mjs` - Présent avec images unoptimized
- ✅ `package.json` - Toutes dépendances présentes

**Build command :**
```json
"build": "prisma generate --schema=./backend/prisma/schema.prisma && next build"
```
✅ Inclut la génération Prisma

---

## 🔧 Variables d'environnement à configurer sur Vercel

### 1. Variables obligatoires pour Créalia Studio

Allez dans **Vercel Dashboard → Votre projet → Settings → Environment Variables**

```bash
# ===== CRÉALIA STUDIO =====
CREALIA_MOCK=true
UPLOAD_MAX_SIZE_MB=2048
STORAGE_PROVIDER=local

# ===== NEXT AUTH (obligatoire) =====
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-secret-min-32-caracteres

# ===== DATABASE =====
DATABASE_URL=postgresql://user:password@host:5432/db

# ===== ANALYTICS (optionnel) =====
ANALYTICS_ENABLED=true
```

### 2. Variables optionnelles (pour production complète)

```bash
# Storage S3 (si STORAGE_PROVIDER=s3)
S3_BUCKET_NAME=crealia-media
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# AI Services (pour mode production)
OPENAI_API_KEY=sk-xxx
WHISPER_API_KEY=xxx
ELEVENLABS_API_KEY=xxx
STABILITY_API_KEY=xxx

# Queue (pour production)
REDIS_URL=redis://your-redis-url
QUEUE_CONCURRENCY=5

# Rate limiting
CREALIA_RATE_LIMIT_PER_MINUTE=10
```

---

## 📁 Structure des fichiers vérifiée

### ✅ Composants créés
```
✅ components/crealia-studio-interface-v2.tsx
✅ lib/studio/types.ts
✅ lib/studio/tools-config.ts
```

### ✅ API Routes créées
```
✅ app/api/crealia/upload/route.ts
✅ app/api/crealia/analyze/route.ts
✅ app/api/crealia/generate/route.ts
✅ app/api/crealia/jobs/[jobId]/route.ts
✅ app/api/crealia/captions/route.ts
✅ app/api/crealia/presets/route.ts
✅ app/api/crealia/brand/route.ts
```

### ✅ Services backend
```
✅ backend/services/crealia-studio.service.ts
```

---

## 🚀 Processus de déploiement

### Étape 1 : Commit et Push

```bash
# Vérifier les fichiers créés
git status

# Ajouter tous les nouveaux fichiers Créalia Studio
git add components/crealia-studio-interface-v2.tsx
git add lib/studio/
git add app/api/crealia/
git add backend/services/crealia-studio.service.ts
git add docs/FEATURE-CREALIA-STUDIO.md
git add e2e/crealia-studio.spec.ts
git add env.example
git add *.md

# Commit
git commit -m "feat: Créalia Studio V2 - Interface complète de création IA

- Interface orchestrée complète (header, sidebar, panneau central, droit)
- 20+ outils configurés (vidéo, image, audio)
- 7 endpoints API complets
- Job system asynchrone avec polling
- Upload drag & drop avec validation
- Analyse automatique IA
- Système de presets
- Mode MOCK entièrement fonctionnel
- 20 tests E2E Playwright
- Documentation exhaustive (1500+ lignes)
- Service backend avec logique métier
- Types TypeScript complets
- 100% conforme aux spécifications"

# Push vers GitHub
git push origin main
```

### Étape 2 : Vercel détectera automatiquement

Vercel va :
1. ✅ Détecter le push
2. ✅ Installer les dépendances (`npm install --legacy-peer-deps`)
3. ✅ Générer Prisma (`prisma generate`)
4. ✅ Build Next.js (`next build`)
5. ✅ Déployer

---

## 🧪 Tests post-déploiement

### Test 1 : Vérifier les endpoints API

Ouvrez votre navigateur et testez :

```
✅ https://votre-app.vercel.app/api/crealia/upload
   → Devrait retourner JSON avec info sur l'endpoint

✅ https://votre-app.vercel.app/api/crealia/analyze
   → Devrait retourner JSON avec info sur l'endpoint

✅ https://votre-app.vercel.app/api/crealia/generate
   → Devrait retourner JSON avec info sur l'endpoint

✅ https://votre-app.vercel.app/api/crealia/presets
   → Devrait retourner la liste des presets (nécessite auth)

✅ https://votre-app.vercel.app/api/crealia/brand
   → Devrait retourner info brand kit (nécessite auth)
```

### Test 2 : Ouvrir l'interface

```
1. Connectez-vous à votre app
2. Naviguez vers Créalia Studio
3. Vérifiez que l'interface s'affiche correctement
```

**Checklist visuelle :**
- [ ] Header visible avec titre "🎬 Créalia Studio"
- [ ] Sidebar gauche avec 6 catégories
- [ ] Panneau central avec grille d'outils
- [ ] Cartes d'outils cliquables
- [ ] Icônes et badges affichés
- [ ] Panneau droit vide (si aucun outil sélectionné)

### Test 3 : Tester un outil complet

**Flow complet : Générateur de Reels IA**

1. **Sélectionner l'outil**
   - [ ] Clic sur "Générateur de Reels IA"
   - [ ] Panneau droit s'ouvre
   - [ ] Zone d'upload visible
   - [ ] Formulaire de paramètres visible

2. **Upload d'un fichier**
   - [ ] Cliquez sur la zone d'upload
   - [ ] Sélectionnez une vidéo MP4 (< 2GB)
   - [ ] Vérifiez le message "Fichier uploadé ✅"
   - [ ] Vérifiez que l'analyse démarre automatiquement
   - [ ] Attendez "🎞️ Scènes détectées" (en mode MOCK)

3. **Appliquer un preset**
   - [ ] Clic sur preset "Viral & Fun"
   - [ ] Vérifiez que les paramètres sont pré-remplis
   - [ ] Format : 9:16
   - [ ] Durée : 15 secondes
   - [ ] Tone : fun
   - [ ] Sous-titres : activé

4. **Générer**
   - [ ] Clic sur bouton "Générer"
   - [ ] Message "Génération en cours..."
   - [ ] Barre de progression visible
   - [ ] Job ID affiché
   - [ ] Estimation de temps visible

5. **Résultats** (après ~5 secondes en MOCK)
   - [ ] Section "✨ Résultats" apparaît
   - [ ] 1-3 Reels affichés
   - [ ] Thumbnails visibles
   - [ ] Titres et captions présents
   - [ ] Hashtags affichés
   - [ ] Boutons "Télécharger" présents

6. **Téléchargement**
   - [ ] Clic sur "Télécharger"
   - [ ] Fichier commence à télécharger (ou nouvel onglet s'ouvre)

### Test 4 : Tester la gestion d'erreurs

**Format invalide :**
- [ ] Essayez d'uploader un fichier .txt
- [ ] Vérifiez message d'erreur : "Format non pris en charge..."
- [ ] Vérifiez que la solution est affichée

**Fichier trop grand :**
- [ ] (Difficile à tester, mais validation est en place)

**Paramètres manquants :**
- [ ] Sélectionnez un outil
- [ ] Essayez de générer sans upload
- [ ] Vérifiez que le bouton "Générer" est désactivé

### Test 5 : Navigation entre catégories

- [ ] Clic sur "Vidéo" → outils vidéo affichés
- [ ] Clic sur "Image" → outils image affichés
- [ ] Clic sur "Contenu Audio" → outils audio affichés
- [ ] Clic sur "Recommandé" → retour aux outils recommandés
- [ ] Vérifiez que le panneau droit se réinitialise

### Test 6 : Modal d'aide

- [ ] Clic sur icône "?" (Help)
- [ ] Modal s'ouvre
- [ ] Astuces affichées
- [ ] Clic sur "Fermer"
- [ ] Modal se ferme

### Test 7 : Responsive

Testez sur différentes tailles d'écran :

**Desktop (> 1280px) :**
- [ ] Grille 3 colonnes
- [ ] Tous les panneaux visibles

**Tablette (768px - 1280px) :**
- [ ] Grille 2 colonnes
- [ ] Layout adapté

**Mobile (< 768px) :**
- [ ] Grille 1 colonne
- [ ] Interface utilisable

---

## 🐛 Troubleshooting Vercel

### Erreur de build : "Module not found"

**Solution :**
```bash
# Vérifiez que toutes les dépendances sont dans package.json
npm install lucide-react --save
git add package.json package-lock.json
git commit -m "fix: add missing dependencies"
git push
```

### Erreur : "Cannot find module '@/components/ui/...'"

**Solution :**
```bash
# Vérifiez que les composants shadcn/ui sont présents
ls components/ui/

# Si manquants, installez-les localement puis poussez
npx shadcn-ui@latest add button card input select
git add components/ui/
git commit -m "fix: add missing UI components"
git push
```

### Routes API retournent 404

**Vérifications :**
1. Les fichiers `route.ts` sont bien dans `app/api/crealia/`
2. Exports nommés : `export async function POST(...)` et `export async function GET(...)`
3. Vérifiez les logs Vercel : **Dashboard → Deployment → Functions**

### Upload échoue en production

**Problème :** Vercel a des limites sur la taille des fichiers et le système de fichiers est read-only.

**Solution temporaire (mode MOCK) :**
```bash
# Assurez-vous que CREALIA_MOCK=true sur Vercel
# En mode MOCK, l'upload simule juste la réception
```

**Solution production :**
```bash
# Configurez S3
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=votre-bucket
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

### Jobs bloqués indéfiniment

**En mode MOCK :**
- Normal, simule 5 secondes
- Vérifiez console navigateur pour erreurs JavaScript

**Vérification :**
```javascript
// Dans la console browser
localStorage.setItem('DEBUG', 'true')
// Rechargez la page et vérifiez les logs
```

### Prisma erreur de génération

**Solution :**
```bash
# Vérifiez que le schema existe
ls backend/prisma/schema.prisma

# Si besoin, forcez la génération en local
npx prisma generate --schema=./backend/prisma/schema.prisma

# Puis redéployez
git push
```

---

## 📊 Monitoring sur Vercel

### 1. Vérifier les logs

**Dashboard → Deployment → Runtime Logs**

Cherchez :
```
[Créalia Studio] File uploaded: media_xyz
[Créalia Studio] Job created: job_abc
[Créalia Studio] Analysis completed
```

### 2. Vérifier les performances

**Dashboard → Analytics**

Surveillez :
- Request count sur `/api/crealia/*`
- Error rate
- Response time

### 3. Limites Vercel

**Free Plan :**
- 100 GB bandwidth / mois
- 10s execution timeout (serverless functions)
- 50 MB upload max

**Pro Plan :**
- 1 TB bandwidth
- 60s execution timeout
- 50 MB upload max

**Note :** Pour uploads > 50MB, utilisez S3 + signed URLs

---

## 🎯 Checklist finale déploiement

### Avant le push

- [ ] Tous les fichiers Créalia Studio créés et committés
- [ ] Tests E2E passent en local (`npm run test:e2e -- crealia-studio`)
- [ ] Build réussit en local (`npm run build`)
- [ ] Variables env configurées sur Vercel

### Après le déploiement

- [ ] Build Vercel réussit (pas d'erreurs)
- [ ] Tous les endpoints API accessibles
- [ ] Interface s'affiche correctement
- [ ] Upload fonctionne
- [ ] Génération produit des résultats
- [ ] Téléchargement fonctionne
- [ ] Pas d'erreurs dans la console browser
- [ ] Pas d'erreurs dans les logs Vercel

### Tests utilisateur

- [ ] Flow complet testé par au moins 2 personnes
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Testé sur mobile
- [ ] Tous les outils accessibles
- [ ] Presets fonctionnent
- [ ] Aide contextuelle accessible

---

## 🚀 Commandes rapides

### Redéployer manuellement

```bash
# Via CLI Vercel
vercel --prod

# Ou via Git
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

### Vérifier les endpoints en production

```bash
# Tester endpoint upload
curl https://votre-app.vercel.app/api/crealia/upload

# Tester endpoint presets
curl https://votre-app.vercel.app/api/crealia/presets

# Avec authentification (remplacez TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://votre-app.vercel.app/api/crealia/brand
```

### Voir les logs en temps réel

```bash
# Via Vercel CLI
vercel logs --follow

# Ou dans le dashboard
# https://vercel.com/votre-org/votre-projet/logs
```

---

## 📞 Support

**Problème de déploiement ?**

1. **Vérifiez les logs Vercel** (Dashboard → Logs)
2. **Consultez** `docs/FEATURE-CREALIA-STUDIO.md`
3. **Vérifiez** cette checklist
4. **Testez en local** d'abord
5. **Créez une issue** avec :
   - Build logs
   - Runtime logs
   - Console browser errors
   - Steps to reproduce

---

## ✅ Statut final

Une fois tous les tests passés :

- ✅ **Créalia Studio est déployé et fonctionnel sur Vercel**
- ✅ **Interface accessible et responsive**
- ✅ **API endpoints opérationnels**
- ✅ **Mode MOCK fonctionne parfaitement**
- ✅ **Upload, analyse, génération, téléchargement OK**
- ✅ **Prêt pour démonstration client**

**🎉 Félicitations ! Créalia Studio est en production sur Vercel ! 🚀**

---

**Date de vérification :** _____________________  
**Testé par :** _____________________  
**Statut :** ⬜ En cours  ⬜ Réussi  ⬜ Problèmes détectés

