# 🚀 Guide de Déploiement Vercel - Créalia

## ✅ État Actuel

**✓** Projet lié à Vercel : `crealia`  
**✓** Repository GitHub connecté : `BCZ22/Cr-alia-Final-Project`  
**✓** Configuration optimisée pour plan Hobby  
**✓** Push automatique déclenche les déploiements  

**⚠️** Dernier déploiement en erreur - Configuration requise dans le dashboard

---

## 📋 Étapes Immédiates

### 1. Accéder au Dashboard Vercel

🔗 **URL**: https://vercel.com/anthbcz-9354s-projects/crealia

### 2. Voir les Logs du Dernier Déploiement

1. Cliquez sur le déploiement en erreur (le plus récent)
2. Allez dans l'onglet **"Build Logs"**
3. Identifiez l'erreur spécifique

**Erreurs Probables:**
- ❌ Variables d'environnement manquantes
- ❌ Erreur de build TypeScript/Next.js
- ❌ Dépendances manquantes
- ❌ Limites du plan Hobby dépassées

---

## 🔧 Configuration des Variables d'Environnement

### Accéder aux Settings

1. Dashboard Vercel → Projet **"crealia"**
2. **Settings** (en haut) → **Environment Variables** (menu gauche)

### Variables ESSENTIELLES à Configurer

#### 1. **Base de Données** (Si utilisée)
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```
**💡 Note:** Pour le dev, vous pouvez utiliser SQLite ou mode MOCK

#### 2. **NextAuth (Authentication)**
```bash
NEXTAUTH_SECRET=votre-secret-aleatoire-minimum-32-caracteres
NEXTAUTH_URL=https://votre-domaine-vercel.vercel.app
```

**Générer NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### 3. **Mode MOCK (Pour tester sans API externes)**
```bash
MOCK=true
SKIP_ENV_VALIDATION=true
```

#### 4. **Stripe (Optionnel - Paiements)**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 5. **OpenAI (Optionnel - IA)**
```bash
OPENAI_API_KEY=sk-...
```

#### 6. **Sentry (Optionnel - Monitoring)**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

#### 7. **Autres Variables**
```bash
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
```

---

## 🎯 Configuration Minimale pour Démarrer

**Pour faire un premier déploiement réussi, configurez AU MINIMUM:**

```bash
# Dans Vercel Dashboard > Settings > Environment Variables

# 1. NextAuth (OBLIGATOIRE)
NEXTAUTH_SECRET=votre-secret-32-caracteres-minimum-ici
NEXTAUTH_URL=https://crealia-anthbcz-9354s-projects.vercel.app

# 2. Mode Build
SKIP_ENV_VALIDATION=true
NEXT_PUBLIC_APP_ENV=production

# 3. Mode MOCK (pour tester sans services externes)
MOCK=true
```

**Important:** Après avoir ajouté les variables, cliquez sur **"Deploy"** pour relancer.

---

## 🔄 Relancer un Déploiement

### Option 1: Depuis le Dashboard (Recommandé)
1. Allez sur https://vercel.com/anthbcz-9354s-projects/crealia
2. Cliquez sur **"Redeploy"** sur le dernier déploiement
3. Confirmez

### Option 2: Via Git Push
```bash
# Faire un commit vide pour déclencher le déploiement
git commit --allow-empty -m "chore: trigger Vercel redeploy"
git push origin main
```

### Option 3: Via CLI
```bash
vercel --prod --yes
```

---

## 🐛 Problèmes Courants et Solutions

### Erreur: "Dynamic server usage"
**Cause:** Routes API utilisent `headers` ou `searchParams` au build
**Solution:** Normal pour Next.js App Router - ignorez si le site fonctionne

### Erreur: "Module not found"
**Cause:** Dépendance manquante
**Solution:**
```bash
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "fix: update dependencies"
git push
```

### Erreur: "Prisma Client not generated"
**Cause:** Build command incorrect
**Solution:** Vérifiez que `vercel.json` contient:
```json
{
  "buildCommand": "npm run build"
}
```

Et que `package.json` contient:
```json
{
  "scripts": {
    "build": "prisma generate --schema=./backend/prisma/schema.prisma && next build"
  }
}
```

### Erreur: "Memory limit exceeded"
**Cause:** Plan Hobby limite à 1024 MB
**Solution:** Déjà appliquée dans `vercel.json` - Si persiste, simplifiez le build

### Erreur: "Environment variable not set"
**Cause:** Variable d'environnement manquante
**Solution:** Ajoutez-la dans Settings > Environment Variables

---

## 📊 Vérifier le Statut du Déploiement

### Via Dashboard Web
🔗 https://vercel.com/anthbcz-9354s-projects/crealia/deployments

### Via CLI
```bash
cd "/Users/anthonybocca/Downloads/FlowGestion /crealia"
vercel ls
```

### Voir les Logs d'un Déploiement
1. Dashboard → Déploiement → **Build Logs**
2. Dashboard → Déploiement → **Function Logs** (après déploiement réussi)

---

## ✅ Checklist Post-Déploiement

Une fois le déploiement **READY** (✓):

### Tests Basiques
- [ ] Accéder à l'URL de production
- [ ] Page d'accueil se charge correctement
- [ ] Navigation fonctionne
- [ ] Pas d'erreurs dans la console navigateur

### Tests Fonctionnels
- [ ] Créer un compte (si auth activé)
- [ ] Tester Créalia AI (génération)
- [ ] Tester Créalia Studio (CRUD projets)
- [ ] Tester upload de fichiers
- [ ] Vérifier le responsive (mobile/tablet)

### Monitoring
- [ ] Configurer Sentry pour les erreurs
- [ ] Vérifier les métriques Vercel Analytics
- [ ] Configurer les alertes Vercel

---

## 🎨 Domaine Personnalisé (Optionnel)

### Ajouter un Domaine
1. Settings → **Domains**
2. Cliquez **"Add Domain"**
3. Entrez votre domaine
4. Suivez les instructions DNS

### Domaines Vercel par Défaut
- Production: `https://crealia-anthbcz-9354s-projects.vercel.app`
- Chaque commit: `https://crealia-[hash].vercel.app`

---

## 📚 Documentation Vercel

- **Dashboard**: https://vercel.com/dashboard
- **Docs Next.js**: https://nextjs.org/docs/deployment
- **Docs Vercel**: https://vercel.com/docs
- **Hobby Plan Limits**: https://vercel.com/docs/limits/overview#hobby-plan

---

## 🔐 Sécurité

### Variables Sensibles
✅ **Toujours** ajouter dans Vercel Dashboard (jamais dans le code)
✅ Utiliser des valeurs différentes pour Development/Preview/Production
✅ Régénérer les secrets régulièrement

### Headers de Sécurité
✅ Déjà configurés dans `vercel.json`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

---

## 📞 Support

### En Cas de Problème Persistant

1. **Vérifier les logs**: Dashboard > Build Logs
2. **Simplifier**: Commenter les features non-essentielles
3. **Mode MOCK**: Activer `MOCK=true` pour tester sans APIs externes
4. **Documentation**: Consulter les docs Vercel
5. **Community**: https://github.com/vercel/vercel/discussions

---

## 🎯 Prochaines Étapes

### Immédiat
1. ✅ Configurer variables d'environnement minimales
2. ✅ Relancer le déploiement
3. ✅ Vérifier que le build réussit
4. ✅ Tester la page d'accueil

### Court Terme
- [ ] Configurer toutes les variables pour fonctionnalités complètes
- [ ] Ajouter un domaine personnalisé
- [ ] Configurer Sentry pour monitoring
- [ ] Optimiser les performances

### Long Terme
- [ ] Envisager upgrade vers plan Pro (si besoin)
- [ ] Configurer CI/CD avec tests automatiques
- [ ] Mettre en place des preview deployments pour PRs
- [ ] Optimiser les fonctions serverless

---

## 📝 Commandes Utiles

```bash
# Voir les projets Vercel
vercel ls

# Voir les déploiements du projet actuel
vercel ls --cwd .

# Déployer en production
vercel --prod --yes

# Voir les logs (dans dashboard)
# https://vercel.com/anthbcz-9354s-projects/crealia

# Lier un nouveau projet
vercel link

# Voir l'utilisateur connecté
vercel whoami

# Se déconnecter
vercel logout

# Se reconnecter
vercel login
```

---

## ✨ Résumé

**État Actuel:**
- ✅ Projet connecté à Vercel
- ✅ GitHub integration active
- ✅ Configuration Hobby plan compatible
- ⚠️ Variables d'environnement à configurer

**Action Requise:**
1. Aller sur https://vercel.com/anthbcz-9354s-projects/crealia
2. Settings > Environment Variables
3. Ajouter au minimum:
   - `NEXTAUTH_SECRET` (généré avec openssl)
   - `NEXTAUTH_URL` (votre URL Vercel)
   - `SKIP_ENV_VALIDATION=true`
   - `MOCK=true`
4. Cliquer "Redeploy"

**Le déploiement devrait alors réussir ! 🚀**

---

*Guide créé le 20 Octobre 2025 - Cursor AI (CTO virtuel Créalia)*


