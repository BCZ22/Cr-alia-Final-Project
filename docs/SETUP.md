# 🚀 Guide d'Installation - Créalia

Ce guide vous accompagne pas à pas dans l'installation et la configuration de Créalia en local et en production.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Locale](#installation-locale)
3. [Configuration Base de Données](#configuration-base-de-données)
4. [Variables d'Environnement](#variables-denvironnement)
5. [Configuration Stripe](#configuration-stripe)
6. [Configuration OpenAI](#configuration-openai)
7. [Démarrage](#démarrage)
8. [Vérification](#vérification)
9. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### **Logiciels Requis**

- **Node.js**: 18.0 ou supérieur
- **npm**: 9.0 ou supérieur (ou pnpm 8.0+)
- **PostgreSQL**: 14.0 ou supérieur
- **Git**: Pour cloner le repository

### **Comptes Externes**

- **GitHub**: Pour cloner le repository
- **Stripe**: Pour les paiements (compte test gratuit)
- **OpenAI**: Pour l'IA (optionnel, mode mock disponible)
- **Vercel**: Pour le déploiement production (gratuit pour commencer)

---

## 💻 Installation Locale

### **Étape 1: Cloner le Repository**

```bash
# HTTPS
git clone https://github.com/BCZ22/Cr-alia-Final-Project.git

# SSH
git clone git@github.com:BCZ22/Cr-alia-Final-Project.git

# Entrer dans le dossier
cd Cr-alia-Final-Project
```

### **Étape 2: Installer les Dépendances**

```bash
# Avec npm
npm install

# Avec pnpm (recommandé pour la vitesse)
pnpm install
```

**Temps d'installation**: ~2-3 minutes

---

## 🗄️ Configuration Base de Données

### **Option 1: PostgreSQL Local**

#### **Installation PostgreSQL**

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-14
sudo systemctl start postgresql
```

**Windows:**
Téléchargez l'installeur depuis [postgresql.org](https://www.postgresql.org/download/windows/)

#### **Créer la Base de Données**

```bash
# Se connecter à PostgreSQL
psql postgres

# Créer l'utilisateur et la base de données
CREATE USER crealia WITH PASSWORD 'your-secure-password';
CREATE DATABASE crealia OWNER crealia;
GRANT ALL PRIVILEGES ON DATABASE crealia TO crealia;

# Quitter
\q
```

**URL de connexion:**
```
postgresql://crealia:your-secure-password@localhost:5432/crealia
```

---

### **Option 2: Supabase (Cloud, Recommandé)**

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Attendez ~2 minutes que la base de données soit prête
4. Copiez l'URL de connexion depuis Settings → Database → Connection string → URI

**Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

### **Option 3: Neon (Cloud, Gratuit)**

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez l'URL de connexion

---

### **Initialiser Prisma**

```bash
# Générer le client Prisma
npx prisma generate --schema=./backend/prisma/schema.prisma

# Créer les tables (push schema)
npx prisma db push --schema=./backend/prisma/schema.prisma

# Vérifier la base de données
npx prisma studio --schema=./backend/prisma/schema.prisma
```

Prisma Studio s'ouvre sur [http://localhost:5555](http://localhost:5555)

---

## 🌍 Variables d'Environnement

### **Étape 1: Créer .env.local**

```bash
cp env.example .env.local
```

### **Étape 2: Configurer les Variables**

Ouvrez `.env.local` et remplissez les valeurs :

```bash
# ========================================
# DATABASE
# ========================================
DATABASE_URL="postgresql://crealia:password@localhost:5432/crealia"

# ========================================
# NEXTAUTH (Authentication)
# ========================================
NEXTAUTH_SECRET="your-random-secret-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# ========================================
# STRIPE (Paiements)
# ========================================
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Price IDs (voir Configuration Stripe ci-dessous)
STRIPE_PRICE_CREATOR_MONTHLY="price_..."
STRIPE_PRICE_CREATOR_YEARLY="price_..."
STRIPE_PRICE_VIRAL_MONTHLY="price_..."
STRIPE_PRICE_VIRAL_YEARLY="price_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."

# ========================================
# OPENAI (IA - Optionnel)
# ========================================
OPENAI_API_KEY="sk-..."
# Si vide, le mode MOCK sera utilisé

# ========================================
# SECURITY
# ========================================
ENCRYPTION_KEY="your-64-character-hex-key"
CRON_SECRET="your-cron-secret-for-cron-jobs"

# ========================================
# MONITORING (Optionnel)
# ========================================
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."

# ========================================
# APP
# ========================================
NEXT_PUBLIC_APP_ENV="development"
NODE_ENV="development"
```

### **Générer des Secrets**

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**ENCRYPTION_KEY:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**CRON_SECRET:**
```bash
openssl rand -hex 32
```

---

## 💳 Configuration Stripe

### **Étape 1: Créer un Compte Stripe**

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte
3. Activez le mode Test

### **Étape 2: Récupérer les Clés API**

1. Allez dans Developers → API keys
2. Copiez la **Secret key** (commence par `sk_test_`)
3. Copiez la **Publishable key** (commence par `pk_test_`)

### **Étape 3: Créer les Produits et Prix**

#### **Via le Dashboard Stripe:**

1. Allez dans Products → Add product

**Produit 1: Créateur**
- Name: Créateur
- Description: Plan Créateur - 50 vidéos/mois
- Pricing:
  - Monthly: $19 → Copiez le Price ID (`price_...`)
  - Yearly: $160 ($13.33/mois) → Copiez le Price ID

**Produit 2: Viral**
- Name: Viral
- Description: Plan Viral - 150 vidéos/mois
- Pricing:
  - Monthly: $39 → Copiez le Price ID
  - Yearly: $327 ($27.25/mois) → Copiez le Price ID

**Produit 3: Pro**
- Name: Pro
- Description: Plan Pro - 250 vidéos/mois
- Pricing:
  - Monthly: $79 → Copiez le Price ID
  - Yearly: $664 ($55.33/mois) → Copiez le Price ID

#### **Via Stripe CLI (Alternative):**

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe
# ou: https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Créer les produits et prix
stripe products create --name="Créateur" --description="Plan Créateur"
stripe prices create --product=prod_... --unit-amount=1900 --currency=usd --recurring[interval]=month
# ... répétez pour tous les plans
```

### **Étape 4: Configurer le Webhook**

1. Allez dans Developers → Webhooks
2. Cliquez sur "Add endpoint"
3. URL: `http://localhost:3000/api/stripe-webhook`
4. Événements à écouter:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez le **Signing secret** (commence par `whsec_`)

**Pour le développement local:**
```bash
# Utiliser Stripe CLI pour forward les webhooks
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## 🤖 Configuration OpenAI

### **Optionnel - Mode MOCK Disponible**

Si vous ne configurez pas OpenAI, l'application fonctionnera en mode MOCK (réponses simulées).

### **Pour utiliser l'IA Réelle:**

1. Créez un compte sur [platform.openai.com](https://platform.openai.com)
2. Ajoutez un mode de paiement
3. Allez dans API keys
4. Créez une nouvelle clé (commence par `sk-`)
5. Ajoutez-la à `.env.local`:

```bash
OPENAI_API_KEY="sk-..."
```

**Modèles utilisés:**
- GPT-4 Turbo (chatbot)
- DALL-E 3 (images)
- TTS-1 (voix off)
- Whisper (sous-titres)

**Coûts estimés:**
- GPT-4 Turbo: $0.01 / 1K tokens
- DALL-E 3: $0.04 / image
- TTS-1: $0.015 / 1K caractères
- Whisper: $0.006 / minute

---

## 🚀 Démarrage

### **Vérifier la Configuration**

```bash
# Vérifier les variables d'environnement
./scripts/verify-env.sh
```

### **Démarrer le Serveur de Développement**

```bash
npm run dev
```

**Sortie attendue:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

### **Accéder à l'Application**

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## ✅ Vérification

### **1. Tester la Page d'Accueil**

- [ ] La page d'accueil se charge correctement
- [ ] Les images et styles s'affichent
- [ ] La navigation fonctionne

### **2. Tester l'Authentification**

- [ ] Cliquer sur "Se connecter"
- [ ] Créer un compte
- [ ] Se connecter
- [ ] Voir le dashboard

### **3. Tester Stripe**

- [ ] Aller sur /pricing
- [ ] Cliquer sur "Commencer"
- [ ] Être redirigé vers Stripe Checkout
- [ ] Utiliser une carte de test: `4242 4242 4242 4242`

### **4. Tester l'IA**

- [ ] Ouvrir le chat (/support/chat)
- [ ] Envoyer un message
- [ ] Recevoir une réponse (mock ou réelle)

### **5. Health Check**

```bash
curl http://localhost:3000/api/health
```

**Réponse attendue:**
```json
{
  "status": "healthy",
  "database": "connected",
  "memory": { "used": 123, "total": 512, "percentage": 24 },
  "uptime": 120
}
```

---

## 🐛 Dépannage

### **Erreur: "Cannot connect to database"**

**Solution:**
```bash
# Vérifier PostgreSQL
psql $DATABASE_URL

# Tester la connexion
npx prisma db push --schema=./backend/prisma/schema.prisma
```

---

### **Erreur: "NEXTAUTH_SECRET is not set"**

**Solution:**
```bash
# Générer un secret
openssl rand -base64 32

# Ajouter à .env.local
echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env.local
```

---

### **Erreur: "Stripe webhook signature verification failed"**

**Solution:**

En développement, utilisez Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Copiez le webhook secret affiché et mettez-le dans `.env.local`

---

### **Erreur: "Module not found"**

**Solution:**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

### **Port 3000 déjà utilisé**

**Solution:**
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill

# Ou utiliser un autre port
PORT=3001 npm run dev
```

---

### **Build échoue avec erreur Prisma**

**Solution:**
```bash
# Régénérer le client Prisma
npx prisma generate --schema=./backend/prisma/schema.prisma

# Rebuild
npm run build
```

---

## 📚 Prochaines Étapes

Une fois l'installation terminée :

1. **Lire la documentation utilisateur**: [USER_GUIDE.md](USER_GUIDE.md)
2. **Explorer l'API**: [API_REFERENCE.md](API_REFERENCE.md)
3. **Configurer le déploiement**: [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Contribuer**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 💬 Support

Besoin d'aide ? Contactez-nous :

- **Discord**: [discord.gg/crealia](https://discord.gg/crealia)
- **Email**: support@crealia.com
- **GitHub Issues**: [github.com/BCZ22/Cr-alia-Final-Project/issues](https://github.com/BCZ22/Cr-alia-Final-Project/issues)

---

**Bon développement ! 🚀**

