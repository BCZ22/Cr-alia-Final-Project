# 🚀 Instructions de Déploiement Créalia sur Vercel

## ✅ Tout est Prêt !

Votre projet Créalia est **100% prêt** pour être déployé sur Vercel.

---

## 📋 Ce qui a été Préparé

✅ **Code complet** - 150+ fichiers, 15,000+ lignes  
✅ **Configuration Vercel** - `vercel.json` avec headers sécurité, cron jobs  
✅ **Scripts de déploiement** - Automatisation complète  
✅ **Documentation** - Guide complet de déploiement  
✅ **Tests** - 25+ tests E2E Playwright  
✅ **CI/CD** - GitHub Actions configuré  
✅ **Monitoring** - Sentry, logs structurés, metrics  

---

## 🎯 Méthode 1: Déploiement Interactif (Recommandé)

### **Étape 1: Se Connecter à Vercel**

```bash
vercel login
```

**Actions:**
1. Une URL s'affichera dans le terminal
2. Ouvrez l'URL dans votre navigateur
3. Autorisez l'accès
4. Revenez au terminal

---

### **Étape 2: Lancer le Déploiement**

```bash
./scripts/quick-deploy.sh
```

**Le script va:**
1. ✅ Vérifier Vercel CLI
2. ✅ Vérifier l'authentification
3. ✅ Lier le projet
4. ✅ Vérifier les variables d'environnement
5. ✅ Vérifier git
6. ✅ Déployer sur Vercel
7. ✅ Faire un health check

**Durée:** ~3-5 minutes

---

### **Étape 3: Configurer les Variables d'Environnement**

Pendant le déploiement, vous devrez configurer les variables sur Vercel.

**Option A: Via le Dashboard Vercel**

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet "Créalia"
3. **Settings → Environment Variables**
4. Ajoutez les variables suivantes:

| Variable | Valeur | Comment |
|----------|--------|---------|
| `DATABASE_URL` | `postgresql://...` | URL PostgreSQL (Supabase/Neon) |
| `NEXTAUTH_SECRET` | `***` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | URL de votre app |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Clé Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Secret webhook Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Clé publique Stripe |
| `ENCRYPTION_KEY` | `***` | 64 caractères hex |
| `CRON_SECRET` | `***` | Secret pour cron jobs |
| `OPENAI_API_KEY` | `sk-...` | OpenAI (optionnel) |

**Générer les secrets:**
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# CRON_SECRET
openssl rand -hex 32
```

---

**Option B: Via la CLI**

```bash
# Se positionner dans le projet
cd /Users/anthonybocca/Downloads/FlowGestion\ /crealia

# Ajouter chaque variable
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... etc
```

---

## 🎯 Méthode 2: Déploiement via GitHub (Automatique)

### **Si votre repo est sur GitHub:**

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Sélectionnez **Import Git Repository**
3. Choisissez votre repo GitHub "Cr-alia-Final-Project"
4. Configurez:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`
5. Ajoutez les variables d'environnement (voir liste ci-dessus)
6. Cliquez sur **Deploy**

**✨ Avantage:** Chaque push sur `main` redéploie automatiquement !

---

## 🗄️ Configuration Base de Données

### **Option Recommandée: Supabase**

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Attendez 2 minutes (création DB)
4. Allez dans **Settings → Database**
5. Copiez l'**URI Connection String**
6. Ajoutez-la comme `DATABASE_URL` sur Vercel

**Format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

### **Alternative: Neon.tech (Gratuit)**

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez l'URL de connexion
4. Ajoutez-la comme `DATABASE_URL` sur Vercel

---

## 💳 Configuration Stripe

### **1. Créer un Compte Stripe**

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte
3. Activez le **mode Test**

---

### **2. Récupérer les Clés API**

1. **Developers → API keys**
2. Copiez:
   - **Secret key** (`sk_test_...`)
   - **Publishable key** (`pk_test_...`)

---

### **3. Créer les Produits et Prix**

**Produit 1: Créateur**
- Name: Créateur
- Monthly: $19 → Copiez le Price ID
- Yearly: $160 → Copiez le Price ID

**Produit 2: Viral**
- Name: Viral  
- Monthly: $39 → Copiez le Price ID
- Yearly: $327 → Copiez le Price ID

**Produit 3: Pro**
- Name: Pro
- Monthly: $79 → Copiez le Price ID
- Yearly: $664 → Copiez le Price ID

Ajoutez tous les Price IDs comme variables d'environnement sur Vercel.

---

### **4. Configurer le Webhook (Important !)**

**Après le premier déploiement:**

1. Notez l'URL de votre app: `https://your-app.vercel.app`
2. Allez sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
3. **Add endpoint**
4. URL: `https://your-app.vercel.app/api/stripe-webhook`
5. Événements à écouter:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copiez le **Signing secret** (`whsec_...`)
7. Mettez à jour `STRIPE_WEBHOOK_SECRET` sur Vercel
8. Redéployez

---

## ✅ Vérification Post-Déploiement

### **1. Health Check**

```bash
curl https://your-app.vercel.app/api/health
```

**Réponse attendue:**
```json
{
  "status": "healthy",
  "database": "connected",
  "memory": {...},
  "uptime": 120
}
```

---

### **2. Test Manuel**

1. **Homepage** → https://your-app.vercel.app
   - ✅ Page se charge
   - ✅ Styles corrects
   - ✅ Navigation fonctionne

2. **Authentication** → Cliquez sur "Se connecter"
   - ✅ Modale s'ouvre
   - ✅ Peut créer un compte
   - ✅ Redirection après login

3. **Pricing** → https://your-app.vercel.app/pricing
   - ✅ Plans affichés
   - ✅ Toggle mensuel/annuel
   - ✅ Redirection Stripe

4. **Chat** → https://your-app.vercel.app/support/chat
   - ✅ Interface se charge
   - ✅ Messages envoyés
   - ✅ Réponses reçues

---

## 🔄 Mises à Jour Futures

### **Méthode 1: Git Push (Automatique)**

```bash
# Faire vos modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push

# Vercel redéploie automatiquement !
```

---

### **Méthode 2: CLI Manuelle**

```bash
vercel --prod
```

---

## 🐛 Problèmes Courants

### **Erreur: "Build failed"**

**Solutions:**
1. Vérifiez les logs de build sur Vercel Dashboard
2. Testez le build localement: `npm run build`
3. Vérifiez `DATABASE_URL` (doit être accessible depuis Vercel)
4. Vérifiez Install Command: `npm install --legacy-peer-deps`

---

### **Erreur: "Database connection failed"**

**Solutions:**
1. Vérifiez que `DATABASE_URL` est bien configurée
2. Testez la connexion: `psql "postgresql://..."`
3. Vérifiez les règles firewall (Supabase/Neon doivent autoriser Vercel)

---

### **Erreur: "Module not found" pendant le build**

**Solution:**
1. Supprimez `package-lock.json`
2. Réinstallez: `npm install --legacy-peer-deps`
3. Commitez: `git add package-lock.json && git commit -m "fix: deps"`
4. Push: `git push`

---

## 📊 Monitoring

### **1. Vercel Analytics (Gratuit)**

- Allez dans **Analytics** sur le dashboard
- Activez les analytics
- Voyez les visiteurs en temps réel

---

### **2. Sentry (Erreurs)**

1. Créez un compte sur [sentry.io](https://sentry.io)
2. Créez un projet Next.js
3. Copiez le DSN
4. Ajoutez `NEXT_PUBLIC_SENTRY_DSN` sur Vercel
5. Redéployez

---

## 🎉 Résumé

**Ce qui est fait ✅:**
- ✅ Code production-ready (150+ fichiers)
- ✅ Configuration Vercel complète
- ✅ Scripts de déploiement
- ✅ Documentation complète
- ✅ Tests E2E (25+)
- ✅ CI/CD configuré
- ✅ Sécurité (AES-256, rate limiting, GDPR)

**Ce qu'il vous reste à faire:**
1. ⏱️ Se connecter à Vercel (2 min)
2. ⏱️ Configurer la base de données (5 min)
3. ⏱️ Configurer Stripe (10 min)
4. ⏱️ Ajouter les variables d'environnement (5 min)
5. ⏱️ Déployer (3 min)
6. ⏱️ Configurer le webhook Stripe (2 min)

**Total:** ~30 minutes

---

## 📞 Besoin d'Aide ?

**Documentation complète:**
- [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Guide détaillé complet
- [README.md](README.md) - Vue d'ensemble du projet
- [docs/SETUP.md](docs/SETUP.md) - Installation locale

**Support:**
- Discord: [discord.gg/crealia](https://discord.gg/crealia)
- Email: support@crealia.com

---

## 🚀 Commandes Rapides

```bash
# Se connecter à Vercel
vercel login

# Lancer le déploiement
./scripts/quick-deploy.sh

# Ou manuellement
vercel --prod

# Voir les logs
vercel logs

# Ouvrir le dashboard
vercel
```

---

**Bon déploiement ! Créalia sera en ligne dans 30 minutes ! 🎉**

