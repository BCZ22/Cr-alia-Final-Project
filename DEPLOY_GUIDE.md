# 🚀 Guide de Déploiement Vercel - Créalia

Ce guide vous accompagne pour déployer Créalia sur Vercel en production.

---

## 📋 Prérequis

✅ **Node.js** 18+ installé  
✅ **npm** 9+ installé  
✅ **Vercel CLI** installé (`npm i -g vercel`)  
✅ **Compte Vercel** créé  
✅ **Base de données PostgreSQL** prête (Supabase/Neon/Railway)  
✅ **Compte Stripe** configuré  
✅ **Clé OpenAI** (optionnel)  

---

## 🔑 Étape 1: Connexion à Vercel

```bash
# Se connecter à Vercel
vercel login
# Suivre le lien dans le terminal et autoriser
```

---

## 🔗 Étape 2: Lier le Projet

```bash
# Lier le projet Vercel
vercel link

# Répondre aux questions:
# ? Set up "~/Downloads/FlowGestion /crealia"? [Y/n] Y
# ? Which scope should contain your project? Your-Team
# ? Link to existing project? [Y/n] Y  (si le projet existe déjà)
# ? What's the name of your existing project? crealia
```

---

## 🌍 Étape 3: Configurer les Variables d'Environnement

### **Option A: Via Vercel CLI (Recommandé)**

```bash
# Database
vercel env add DATABASE_URL production
# Entrer: postgresql://user:password@host:5432/database

# NextAuth
vercel env add NEXTAUTH_SECRET production
# Entrer: (générer avec: openssl rand -base64 32)

vercel env add NEXTAUTH_URL production
# Entrer: https://your-domain.vercel.app

# Stripe
vercel env add STRIPE_SECRET_KEY production
# Entrer: sk_live_... (ou sk_test_... pour test)

vercel env add STRIPE_WEBHOOK_SECRET production
# Entrer: whsec_...

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Entrer: pk_live_... (ou pk_test_...)

# Stripe Price IDs
vercel env add STRIPE_PRICE_CREATOR_MONTHLY production
# Entrer: price_...

vercel env add STRIPE_PRICE_CREATOR_YEARLY production
# Entrer: price_...

vercel env add STRIPE_PRICE_VIRAL_MONTHLY production
# Entrer: price_...

vercel env add STRIPE_PRICE_VIRAL_YEARLY production
# Entrer: price_...

vercel env add STRIPE_PRICE_PRO_MONTHLY production
# Entrer: price_...

vercel env add STRIPE_PRICE_PRO_YEARLY production
# Entrer: price_...

# Security
vercel env add ENCRYPTION_KEY production
# Entrer: (générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

vercel env add CRON_SECRET production
# Entrer: (générer avec: openssl rand -hex 32)

# OpenAI (Optionnel)
vercel env add OPENAI_API_KEY production
# Entrer: sk-... (ou laisser vide pour mode MOCK)

# Sentry (Optionnel)
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Entrer: https://...@sentry.io/...

# App Environment
vercel env add NEXT_PUBLIC_APP_ENV production
# Entrer: production
```

---

### **Option B: Via Dashboard Vercel**

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings → Environment Variables**
4. Ajoutez toutes les variables listées ci-dessus

---

## 🗄️ Étape 4: Préparer la Base de Données

### **Option 1: Supabase (Recommandé)**

```bash
# 1. Créer un projet sur supabase.com
# 2. Copier l'URL de connexion (Settings → Database → Connection string → URI)
# 3. L'ajouter comme DATABASE_URL
```

### **Option 2: Neon**

```bash
# 1. Créer un projet sur neon.tech
# 2. Copier l'URL de connexion
# 3. L'ajouter comme DATABASE_URL
```

### **Option 3: Railway**

```bash
# 1. Créer un projet PostgreSQL sur railway.app
# 2. Copier l'URL de connexion
# 3. L'ajouter comme DATABASE_URL
```

---

## 🏗️ Étape 5: Configurer Stripe Webhook en Production

1. Allez sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur **Add endpoint**
3. URL: `https://your-domain.vercel.app/api/stripe-webhook`
4. Sélectionnez les événements:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez le **Signing secret** (commence par `whsec_`)
6. Ajoutez-le comme `STRIPE_WEBHOOK_SECRET` sur Vercel

---

## 🚀 Étape 6: Déployer en Production

### **Déploiement Simple**

```bash
# Déployer sur Vercel
vercel --prod

# Ou utiliser le script automatisé
./scripts/deploy.sh production
```

**Sortie attendue:**
```
🔍 Inspect: https://vercel.com/your-team/crealia/...
✅ Production: https://crealia.vercel.app [1m 45s]
```

---

### **Déploiement avec le Script**

```bash
# Rendre le script exécutable
chmod +x scripts/deploy.sh

# Déployer
./scripts/deploy.sh production
```

**Le script va:**
1. ✅ Vérifier les dépendances
2. ✅ Vérifier l'environnement
3. ✅ Exécuter les tests
4. ✅ Builder l'application
5. ✅ Déployer sur Vercel
6. ✅ Faire un health check
7. ✅ Générer un rapport

---

## ✅ Étape 7: Vérification Post-Déploiement

### **1. Health Check**

```bash
curl https://your-domain.vercel.app/api/health
```

**Réponse attendue:**
```json
{
  "status": "healthy",
  "database": "connected",
  "memory": { "used": 256, "total": 1024, "percentage": 25 },
  "uptime": 120
}
```

---

### **2. Tester l'Authentification**

1. Allez sur https://your-domain.vercel.app
2. Cliquez sur "Se connecter"
3. Créez un compte
4. Vérifiez que vous êtes redirigé vers le dashboard

---

### **3. Tester Stripe**

1. Allez sur https://your-domain.vercel.app/pricing
2. Cliquez sur "Commencer"
3. Utilisez une carte de test: `4242 4242 4242 4242`
4. Vérifiez la redirection vers la page de succès

---

### **4. Tester le Chat AI**

1. Allez sur https://your-domain.vercel.app/support/chat
2. Envoyez un message
3. Vérifiez la réponse (mock ou OpenAI selon config)

---

## 🔄 Étape 8: Configurer les Cron Jobs

Les cron jobs sont automatiquement configurés via `vercel.json`:

**Cleanup (quotidien):**
- Path: `/api/cron/cleanup`
- Schedule: `0 0 * * *` (minuit tous les jours)

**Metrics (5 minutes):**
- Path: `/api/cron/metrics`
- Schedule: `*/5 * * * *` (toutes les 5 minutes)

**Vérification:**
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/cleanup
```

---

## 🌐 Étape 9: Configurer le Domaine Personnalisé

### **Via Dashboard Vercel**

1. Allez dans **Settings → Domains**
2. Ajoutez votre domaine (ex: `crealia.com`)
3. Suivez les instructions DNS
4. Attendez la propagation (~10 minutes)
5. Mettez à jour `NEXTAUTH_URL` avec le nouveau domaine

---

## 📊 Étape 10: Monitoring & Analytics

### **1. Vercel Analytics (Inclus)**

Activez dans **Settings → Analytics**

### **2. Sentry (Recommandé)**

```bash
# Créer un projet sur sentry.io
# Copier le DSN
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Entrer: https://...@sentry.io/...

# Redéployer
vercel --prod
```

---

## 🐛 Dépannage

### **Erreur: "Database connection failed"**

**Solution:**
```bash
# Vérifier l'URL de la base de données
vercel env ls

# Tester la connexion
psql "postgresql://user:password@host:5432/database"
```

---

### **Erreur: "Prisma Client not generated"**

**Solution:**
Vercel build automatique le fait, mais si nécessaire:
```bash
# Build settings sur Vercel:
Build Command: npm run build
Output Directory: .next
Install Command: npm install --legacy-peer-deps
```

---

### **Erreur: "NEXTAUTH_URL mismatch"**

**Solution:**
```bash
# Mettre à jour avec le bon domaine
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Entrer: https://your-actual-domain.vercel.app

# Redéployer
vercel --prod
```

---

### **Erreur: "Stripe webhook signature failed"**

**Solution:**
1. Vérifier que l'URL webhook sur Stripe est correcte
2. Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
3. Retester le webhook depuis Stripe Dashboard

---

### **Erreur de Build: "Module not found"**

**Solution:**
```bash
# Nettoyer et réinstaller localement
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Commit et push
git add package-lock.json
git commit -m "fix: update lock file"
git push

# Vercel redéploiera automatiquement
```

---

## 📝 Checklist Finale

- [ ] Vercel CLI installé et connecté
- [ ] Projet lié à Vercel
- [ ] Toutes les variables d'environnement configurées
- [ ] Base de données PostgreSQL prête et accessible
- [ ] Stripe webhook configuré en production
- [ ] Déploiement réussi
- [ ] Health check OK
- [ ] Authentication fonctionne
- [ ] Paiements Stripe fonctionnent
- [ ] Chat AI fonctionne
- [ ] Cron jobs configurés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring activé (Sentry)

---

## 🎉 Félicitations !

Votre application Créalia est maintenant déployée en production sur Vercel ! 🚀

**URLs Importantes:**
- 🌐 Site: https://your-domain.vercel.app
- 📊 Dashboard Vercel: https://vercel.com/dashboard
- 💳 Stripe: https://dashboard.stripe.com
- 🔍 Sentry: https://sentry.io

---

## 🔄 Mises à Jour Futures

Pour déployer des mises à jour:

```bash
# Faire vos changements
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Vercel redéploie automatiquement !
```

Ou manuellement:
```bash
vercel --prod
```

---

## 💬 Support

- **Discord**: [discord.gg/crealia](https://discord.gg/crealia)
- **Email**: support@crealia.com
- **Documentation**: [docs/](docs/)

---

**Bon déploiement ! 🚀**

