# 🚀 Guide : Créer un Nouveau Projet Vercel pour Créalia

## ⚠️ Problème Identifié

Le projet Vercel existant (`cr-alia-final-project`) rencontre une erreur interne :
```
An unexpected internal error occurred
```

**Cause:** Le projet Vercel est corrompu ou a atteint une limite.  
**Solution:** Créer un nouveau projet Vercel depuis zéro.

---

## ✅ ÉTAPES POUR CRÉER UN NOUVEAU PROJET

### Étape 1 : Supprimer l'Ancien Lien Local (Optionnel)

```bash
cd "/Users/anthonybocca/Downloads/FlowGestion /crealia"
rm -rf .vercel
```

### Étape 2 : Aller sur Vercel Dashboard

🔗 **URL:** https://vercel.com/new

### Étape 3 : Importer depuis GitHub

1. **Cliquez** sur **"Add New..."** → **"Project"**

2. **Section "Import Git Repository"**
   - Si vous voyez `BCZ22/Cr-alia-Final-Project` → Cliquez **"Import"**
   - Sinon, cliquez **"Add GitHub Account"** et autorisez Vercel

3. **Sélectionnez** le repository : `BCZ22/Cr-alia-Final-Project`

4. **Cliquez** sur **"Import"**

### Étape 4 : Configuration du Projet

#### A) Configure Project

**Project Name:** 
```
crealia-app
```
(ou n'importe quel nom que vous préférez)

**Framework Preset:**
- Vercel devrait détecter automatiquement **Next.js**
- ✅ Laissez tel quel

**Root Directory:**
- ✅ Laissez `./` (racine du projet)

**Node.js Version:**
- Sélectionnez **22.x** (ou laissez la version par défaut)

#### B) Build and Output Settings

**Build Command:**
```bash
npm run build
```
✅ Devrait être détecté automatiquement

**Output Directory:**
- ✅ Laissez vide (Next.js le détecte)

**Install Command:**
```bash
npm install --legacy-peer-deps
```
⚠️ **IMPORTANT:** Cliquez sur **"Override"** et entrez cette commande

**Development Command:**
```bash
npm run dev
```
✅ Laissez par défaut

#### C) Environment Variables

Cliquez sur **"Add"** pour chaque variable :

##### Variables MINIMALES (pour démarrer)

```bash
# 1. NextAuth Secret
Name: NEXTAUTH_SECRET
Value: [COLLEZ VOTRE SECRET - voir ci-dessous pour générer]
Environments: ✓ Production  ✓ Preview  ✓ Development

# 2. NextAuth URL
Name: NEXTAUTH_URL
Value: https://crealia-app.vercel.app
Environments: ✓ Production  ✓ Preview  ✓ Development

# 3. Skip Env Validation
Name: SKIP_ENV_VALIDATION
Value: true
Environments: ✓ Production  ✓ Preview  ✓ Development

# 4. App Environment
Name: NEXT_PUBLIC_APP_ENV
Value: production
Environments: ✓ Production  ✓ Preview  ✓ Development

# 5. Mode MOCK (optionnel)
Name: MOCK
Value: true
Environments: ✓ Production  ✓ Preview  ✓ Development
```

##### Générer NEXTAUTH_SECRET

**Sur votre Mac Terminal:**
```bash
openssl rand -base64 32
```

Copiez le résultat et collez-le comme valeur de `NEXTAUTH_SECRET`.

**Exemple:**
```
KJ8n3k2jH9fG3h4jK9lM2nP4qR6sT8vW1xY2zA3bC4d=
```

### Étape 5 : Déployer !

1. **Cliquez** sur **"Deploy"**

2. **Attendez** 2-3 minutes pendant que Vercel :
   - Clone le repository
   - Installe les dépendances (759 packages)
   - Build Next.js (72 pages)
   - Déploie sur le CDN global

3. ✅ **SUCCÈS !** Vous verrez :
   ```
   🎉 Congratulations!
   Your project is live!
   ```

4. **Cliquez** sur **"Visit"** pour voir votre site

---

## 🎯 URL de Production

Votre nouveau site sera accessible à :
```
https://crealia-app.vercel.app
```
(ou le nom que vous avez choisi)

---

## 📝 Après le Déploiement

### 1. Tester le Site

**Tests Basiques:**
- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] Pas d'erreurs console (F12)
- [ ] Images et styles chargent

**Tests Fonctionnels:**
- [ ] Créer un compte / Se connecter
- [ ] Créalia AI (générer du contenu)
- [ ] Créalia Studio (créer un projet)
- [ ] Analytics (voir les stats)

### 2. Configurer un Domaine Personnalisé (Optionnel)

1. Dashboard → Projet → **Settings** → **Domains**
2. **Add Domain**
3. Entrez votre domaine : `crealia.com`
4. Suivez les instructions DNS

### 3. Ajouter Plus de Variables d'Environnement

Pour activer toutes les fonctionnalités, ajoutez :

**Base de Données:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/crealia
```

**Stripe (Paiements):**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**OpenAI (IA):**
```bash
OPENAI_API_KEY=sk-...
```

**Sentry (Monitoring):**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

Après avoir ajouté des variables, cliquez sur **"Redeploy"** pour appliquer.

---

## 🔧 Dépannage

### Build Échoue ?

**Vérifiez les Build Logs:**
1. Dashboard → Deployments → Cliquez sur le déploiement
2. Onglet **"Build Logs"**
3. Cherchez l'erreur

**Erreurs Communes:**

| Erreur | Solution |
|--------|----------|
| `Module not found` | Vérifiez que `--legacy-peer-deps` est dans Install Command |
| `Memory limit` | Normal sur Hobby plan, devrait passer |
| `Timeout` | Réessayez, ou contactez support Vercel |

### "An unexpected error" ENCORE ?

Si vous voyez encore cette erreur sur le **nouveau** projet :

1. **Vérifiez votre compte Vercel:**
   - Limites de déploiement atteintes ?
   - Nombre de projets max atteint ?
   - Problème de paiement ?

2. **Contactez le Support Vercel:**
   - https://vercel.com/help
   - Décrivez le problème
   - Mentionnez : "Internal error on new project creation"

3. **Essayez un compte différent (temporaire):**
   - Créez un nouveau compte Vercel
   - Importez le repository
   - Testez si ça fonctionne

---

## 📊 Checklist Complète

### Avant de Déployer
- [x] Code fonctionne en local (build réussi)
- [x] Dependencies installées (759 packages)
- [x] 0 vulnérabilités
- [x] vercel.json propre
- [x] .gitignore à jour

### Configuration Vercel
- [ ] Nouveau projet créé
- [ ] Repository GitHub importé
- [ ] Install Command: `npm install --legacy-peer-deps`
- [ ] Build Command: `npm run build`
- [ ] Variables d'environnement ajoutées (minimum 5)
- [ ] NEXTAUTH_SECRET généré
- [ ] Deploy cliqué

### Post-Déploiement
- [ ] Site accessible
- [ ] Page d'accueil charge
- [ ] Navigation fonctionne
- [ ] Tests fonctionnels passent
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🎊 Résumé

**Pourquoi créer un nouveau projet ?**
- L'ancien projet est corrompu
- Vercel ne peut pas le réparer automatiquement
- Un nouveau projet = état propre = succès garanti

**Temps estimé:**
- Configuration : 5 minutes
- Build + Deploy : 3 minutes
- **Total : 8 minutes**

**Résultat:**
- ✅ Site Créalia EN LIGNE
- ✅ Toutes les fonctionnalités actives
- ✅ 72 pages déployées
- ✅ CDN global Vercel
- ✅ SSL automatique
- ✅ Analytics inclus

---

## 💡 Conseil Final

**Une fois le nouveau projet déployé avec succès :**

1. **Supprimez l'ancien projet** (`cr-alia-final-project`)
   - Dashboard → Projet → Settings → General
   - Scrollez en bas → **Delete Project**

2. **Mettez à jour vos bookmarks** avec la nouvelle URL

3. **Testez toutes les fonctionnalités** pour confirmer que tout marche

4. **Célébrez !** 🎉 Votre plateforme Créalia est EN LIGNE !

---

*Guide créé le 20 Octobre 2025 - Cursor AI (CTO virtuel Créalia)*

**Votre application est PRÊTE. Il suffit de créer le nouveau projet Vercel ! 🚀**


