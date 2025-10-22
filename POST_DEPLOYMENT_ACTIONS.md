# 🚀 Actions Post-Déploiement Créalia

## ✅ Déploiement Terminé avec Succès !

Le projet est maintenant en production sur Vercel. Voici les actions à effectuer pour activer toutes les fonctionnalités.

---

## 🔴 URGENT - Actions Immédiates (15 minutes)

### 1. Configurer la Base de Données

**Option A : Vercel Postgres (Recommandé - Intégration native)**

```bash
# Dans le terminal local
vercel postgres create crealia-db

# Copier l'URL générée et l'ajouter comme variable d'environnement
vercel env add DATABASE_URL production
# Coller la valeur : postgres://user:pass@host/db

# Appliquer les migrations
vercel env pull .env.production.local
npx prisma migrate deploy
```

**Option B : Supabase (Alternative gratuite)**

1. Créez un projet sur https://supabase.com
2. Allez dans Settings > Database
3. Copiez la "Connection string" (mode pooling)
4. Ajoutez-la dans Vercel :
   ```bash
   vercel env add DATABASE_URL production
   ```

**Option C : Neon (Serverless Postgres)**

1. Créez un projet sur https://neon.tech
2. Copiez la connection string
3. Ajoutez-la dans Vercel

### 2. Configurer NextAuth

```bash
# Générer un secret sécurisé
openssl rand -base64 32

# L'ajouter dans Vercel
vercel env add NEXTAUTH_SECRET production
# Coller le secret généré

# Ajouter l'URL publique
vercel env add NEXTAUTH_URL production
# Valeur : https://cr-alia-final-project-2gn2gd87v-anthbcz-9354s-projects.vercel.app

vercel env add NEXT_PUBLIC_APP_URL production
# Valeur : https://cr-alia-final-project-2gn2gd87v-anthbcz-9354s-projects.vercel.app
```

### 3. Configurer Stripe (Système d'Affiliation)

**a) Obtenir les clés API**

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez la clé secrète (sk_test_... ou sk_live_...)
3. Copiez la clé publique (pk_test_... ou pk_live_...)

```bash
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PUBLISHABLE_KEY production
```

**b) Configurer Stripe Connect (pour les affiliés)**

1. Allez sur https://dashboard.stripe.com/settings/applications
2. Activez Stripe Connect
3. Copiez le Client ID (commence par ca_...)

```bash
vercel env add STRIPE_CONNECT_CLIENT_ID production
```

**c) Configurer le Webhook Stripe**

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur "Add endpoint"
3. URL endpoint :
   ```
   https://cr-alia-final-project-2gn2gd87v-anthbcz-9354s-projects.vercel.app/api/checkout/webhook
   ```
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copiez le "Signing secret" (commence par whsec_...)

```bash
vercel env add STRIPE_WEBHOOK_SECRET production
```

### 4. Configurer Resend (E-mails)

1. Créez un compte sur https://resend.com
2. Allez dans API Keys
3. Créez une nouvelle clé

```bash
vercel env add RESEND_API_KEY production
```

### 5. Configurer le Token Admin

```bash
# Générer un token sécurisé pour les payouts admin
openssl rand -hex 32

# L'ajouter dans Vercel
vercel env add PAYOUT_TRIGGER_TOKEN production
```

### 6. Redéployer avec les variables

```bash
# Une fois toutes les variables ajoutées, redéployer
vercel --prod --force
```

---

## 🟡 IMPORTANT - Configuration GitHub Actions (10 minutes)

### Configurer les Secrets GitHub pour les Payouts Automatiques

1. Allez sur votre dépôt GitHub : https://github.com/BCZ22/Cr-alia-Final-Project
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Ajoutez ces secrets :

**VERCEL_API_URL**
```
https://cr-alia-final-project-2gn2gd87v-anthbcz-9354s-projects.vercel.app
```

**PAYOUT_TRIGGER_TOKEN**
```
(Le même token que vous avez généré et ajouté dans Vercel)
```

### Tester le Workflow

```bash
# Déclencher manuellement le workflow de test
gh workflow run test-affiliate-flow.yml

# Vérifier le status
gh run list --workflow=test-affiliate-flow.yml
```

---

## 🟢 OPTIONNEL - Améliorer l'Expérience (30 minutes)

### 1. Configurer un Domaine Custom

**Acheter un domaine** (GoDaddy, Namecheap, etc.)

Exemple : `crealia.app` ou `create.app`

**Dans Vercel :**
1. Allez dans Settings → Domains
2. Ajoutez votre domaine
3. Suivez les instructions DNS

**Mettre à jour les variables d'environnement :**
```bash
vercel env add NEXTAUTH_URL production
# Nouvelle valeur : https://crealia.app

vercel env add NEXT_PUBLIC_APP_URL production
# Nouvelle valeur : https://crealia.app
```

**Mettre à jour le webhook Stripe avec le nouveau domaine**

### 2. Activer Sentry (Monitoring des erreurs)

1. Créez un compte sur https://sentry.io
2. Créez un projet Next.js
3. Copiez le DSN

```bash
vercel env add SENTRY_DSN production
```

### 3. Configurer les Services IA

**OpenAI (ChatGPT, DALL-E)**
```bash
vercel env add OPENAI_API_KEY production
```

**Hugging Face (Modèles open-source)**
```bash
vercel env add HUGGINGFACE_API_KEY production
```

**Replicate (Stable Diffusion, etc.)**
```bash
vercel env add REPLICATE_API_KEY production
```

**Stability AI**
```bash
vercel env add STABILITY_API_KEY production
```

### 4. Désactiver la Protection Vercel

Pour rendre le site public :

1. Allez dans Settings → Deployment Protection
2. Désactivez "Vercel Authentication"
3. Ou configurez un password partagé

---

## 🧪 Tests Post-Configuration

### Une fois toutes les variables configurées, testez :

**1. Health Check**
```bash
curl https://cr-alia-final-project-2gn2gd87v-anthbcz-9354s-projects.vercel.app/api/health
```

**2. Base de données**
```bash
# Devrait retourner : {"status":"ok","database":"connected"}
```

**3. Générer un lien affilié**

Allez sur `/affiliate` et créez un compte affilié pour tester.

**4. Dashboard affilié**

Connectez-vous et vérifiez `/affiliate/dashboard` pour voir les statistiques.

**5. Checkout Stripe**

Testez l'achat d'un plan sur `/pricing` avec une carte test Stripe :
```
Numéro : 4242 4242 4242 4242
Expiration : 12/34
CVC : 123
```

---

## 📊 Monitoring

### Vérifier les Logs Vercel

```bash
# Logs en temps réel
vercel logs --follow

# Logs d'une route spécifique
vercel logs --filter /api/affiliate

# Logs avec erreurs uniquement
vercel logs --filter error
```

### Dashboard Vercel Analytics

1. Allez sur votre projet Vercel
2. Onglet **Analytics**
3. Activez Vercel Analytics (gratuit pour 100k events/mois)

---

## 🔄 Commandes Utiles

### Redéploiement

```bash
# Redéployer en production
vercel --prod

# Redéployer avec force (ignore cache)
vercel --prod --force

# Redéployer une version spécifique
vercel --prod --target production
```

### Variables d'Environnement

```bash
# Lister toutes les variables
vercel env ls

# Ajouter une variable
vercel env add VARIABLE_NAME production

# Supprimer une variable
vercel env rm VARIABLE_NAME production

# Télécharger les variables localement
vercel env pull .env.production.local
```

### Logs et Debug

```bash
# Logs en temps réel
vercel logs --follow

# Logs d'un déploiement spécifique
vercel logs <deployment-url>

# Inspecter un déploiement
vercel inspect <deployment-url>
```

### Domaines

```bash
# Lister les domaines
vercel domains ls

# Ajouter un domaine
vercel domains add crealia.app

# Vérifier le domaine
vercel domains inspect crealia.app
```

---

## 📞 Support

### Documentation Vercel
- Guide déploiement : https://vercel.com/docs/deployments
- Variables d'env : https://vercel.com/docs/environment-variables
- Domaines custom : https://vercel.com/docs/custom-domains

### Documentation Projet
- [Rapport de déploiement complet](DEPLOYMENT_FINAL_REPORT_2025-10-22.md)
- [Historique des déploiements](docs/deployment-history.md)
- [Guide Stripe Connect](README_STRIPE_CONNECT.md)
- [Système d'affiliation](AFFILIATE_SYSTEM_COMPLETE.md)

### Commandes Rapides Cursor

```bash
# Voir ce guide
cat POST_DEPLOYMENT_ACTIONS.md

# Voir le rapport complet
cat DEPLOYMENT_FINAL_REPORT_2025-10-22.md

# Lancer un build local
npm run build

# Tests E2E
npm run test:e2e

# Tests unitaires
npm test
```

---

## ✅ Checklist de Validation Finale

Avant de considérer le déploiement 100% complet, vérifiez :

- [ ] DATABASE_URL configurée et migrations appliquées
- [ ] NEXTAUTH_SECRET et NEXTAUTH_URL configurés
- [ ] Stripe keys (SECRET, PUBLISHABLE, WEBHOOK_SECRET, CONNECT_CLIENT_ID) configurés
- [ ] Webhook Stripe créé et testé
- [ ] RESEND_API_KEY configurée
- [ ] PAYOUT_TRIGGER_TOKEN configuré
- [ ] Secrets GitHub configurés (pour payouts automatiques)
- [ ] Site accessible publiquement (ou protection configurée)
- [ ] Page d'accueil charge sans erreur
- [ ] Flux d'affiliation testé end-to-end
- [ ] Checkout Stripe testé
- [ ] E-mails reçus correctement
- [ ] Dashboard admin accessible et fonctionnel
- [ ] Logs Vercel sans erreurs critiques

---

**Dernière mise à jour** : 22 octobre 2025  
**Version** : Production v1.0.0  
**Statut** : ✅ Déployé, ⏳ Configuration requise


