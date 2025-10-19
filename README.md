# 🎨 Créalia - Plateforme de Création de Contenu IA

[![CI/CD](https://github.com/BCZ22/Cr-alia-Final-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/BCZ22/Cr-alia-Final-Project/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Créalia** est une plateforme SaaS tout-en-un pour créateurs de contenu, offrant des outils IA puissants pour générer, éditer et publier du contenu viral sur les réseaux sociaux.

---

## ✨ Fonctionnalités

### 🤖 **Créalia AI**
- Génération de Reels/Shorts IA
- Création d'avatars IA
- Génération d'images (DALL-E 3)
- Voix-off IA (TTS)
- Sous-titres automatiques (Whisper)
- Générateur de memes

### 🎬 **Créalia Studio**
- Éditeur vidéo en ligne
- Compositeur de vidéos
- Upload & gestion de médias
- Templates & effets
- Export haute qualité

### 📊 **Créalia Analytics**
- Suivi des performances
- Métriques en temps réel
- Rapports détaillés
- Tableaux de bord personnalisés

### 💡 **Inspiration**
- Bibliothèque de templates
- Idées de contenu
- Tendances virales
- Catalogue recherchable

### 💬 **Support 24/7**
- Chatbot IA intelligent
- Chat en direct
- Base de connaissances (FAQ)
- Documentation complète

### 👥 **Communauté**
- Forum intégré
- Discord officiel
- Partage de créations
- Entraide créateurs

### 💳 **Tarification Flexible**
- Plan Créateur: $19/mois ($13/mois annuel)
- Plan Viral: $39/mois ($27/mois annuel)
- Plan Pro: $79/mois ($55/mois annuel)
- Essai gratuit 14 jours

---

## 🚀 Démarrage Rapide

### **Prérequis**

- Node.js 18+
- PostgreSQL 14+
- npm ou pnpm
- Compte Vercel (production)

### **Installation Locale**

```bash
# Cloner le repository
git clone https://github.com/BCZ22/Cr-alia-Final-Project.git
cd Cr-alia-Final-Project

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp env.example .env.local

# Configurer la base de données
npx prisma generate --schema=./backend/prisma/schema.prisma
npx prisma db push --schema=./backend/prisma/schema.prisma

# Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📁 Structure du Projet

```
créalia/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication (NextAuth)
│   │   ├── checkout/        # Stripe checkout
│   │   ├── chat/            # AI Chatbot
│   │   ├── ai/              # AI generation endpoints
│   │   ├── studio/          # Studio endpoints
│   │   ├── forum/           # Forum endpoints
│   │   ├── gdpr/            # GDPR endpoints
│   │   └── cron/            # Cron jobs
│   ├── dashboard/           # Dashboard pages
│   ├── pricing/             # Pricing pages
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── navigation.tsx       # Main navigation
│   ├── footer.tsx           # Footer
│   └── ...                  # Feature components
├── lib/                     # Core libraries
│   ├── db/                  # Database (Prisma)
│   ├── stripe/              # Stripe integration
│   ├── ai/                  # OpenAI integration
│   ├── security/            # Encryption, rate limiting
│   ├── gdpr/                # GDPR compliance
│   ├── monitoring/          # Logging, metrics, Sentry
│   └── routing/             # Centralized routing
├── backend/                 # Backend resources
│   └── prisma/              # Prisma schema & migrations
├── e2e/                     # E2E tests (Playwright)
├── __tests__/               # Unit tests (Jest)
├── scripts/                 # Deployment scripts
├── docs/                    # Documentation
└── public/                  # Static assets
```

---

## 🛠️ Stack Technique

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **State Management**: React Hooks

### **Backend**
- **Runtime**: Node.js 18
- **API**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL 14
- **ORM**: Prisma 5.0
- **Authentication**: NextAuth.js

### **Intégrations**
- **Paiements**: Stripe
- **IA**: OpenAI (GPT-4, DALL-E 3, Whisper, TTS)
- **Analytics**: Custom + Sentry
- **Monitoring**: Sentry
- **Email**: (À configurer)

### **Infrastructure**
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Database**: Supabase / Railway / Neon
- **CDN**: Vercel Edge Network

---

## ⚙️ Configuration

### **Variables d'Environnement**

Créez un fichier `.env.local` avec les variables suivantes :

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/crealia"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Price IDs
STRIPE_PRICE_CREATOR_MONTHLY="price_..."
STRIPE_PRICE_CREATOR_YEARLY="price_..."
STRIPE_PRICE_VIRAL_MONTHLY="price_..."
STRIPE_PRICE_VIRAL_YEARLY="price_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."

# OpenAI (Optional)
OPENAI_API_KEY="sk-..."

# Security
ENCRYPTION_KEY="your-64-character-hex-key"
CRON_SECRET="your-cron-secret"

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."

# App
NEXT_PUBLIC_APP_ENV="development"
```

Voir [docs/SETUP.md](docs/SETUP.md) pour les instructions détaillées.

---

## 🧪 Tests

### **Tests Unitaires**

```bash
# Exécuter tous les tests
npm run test

# Mode watch
npm run test:watch

# Avec coverage
npm run test -- --coverage
```

### **Tests E2E**

```bash
# Installer Playwright
npx playwright install

# Exécuter E2E tests
npm run test:e2e

# Mode UI
npm run test:e2e -- --ui

# Mode debug
npm run test:e2e -- --debug
```

---

## 🚀 Déploiement

### **Vercel (Recommandé)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Lier le projet
vercel link

# Configurer les variables d'environnement
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... (voir env.example)

# Déployer
vercel --prod
```

### **Script de Déploiement**

```bash
# Preview
./scripts/deploy.sh preview

# Production
./scripts/deploy.sh production
```

Voir [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) pour plus de détails.

---

## 📖 Documentation

### **Guides Utilisateur**
- [Guide de démarrage](docs/USER_GUIDE.md)
- [Créalia AI](docs/AI_GUIDE.md)
- [Créalia Studio](docs/STUDIO_GUIDE.md)
- [Analytics](docs/ANALYTICS_GUIDE.md)

### **Documentation Technique**
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Base de données](docs/DATABASE.md)
- [Sécurité & GDPR](docs/SECURITY.md)

### **Développement**
- [Guide développeur](docs/DEVELOPER_GUIDE.md)
- [Contribution](docs/CONTRIBUTING.md)
- [Tests](docs/TESTING.md)

### **Phases d'Implémentation**
- [Phase 1: Discovery](docs/PHASE1_DISCOVERY_REPORT.json)
- [Phase 2: Routing](docs/PHASE2_ROUTING_SYSTEM.md)
- [Phase 3: Database](docs/PHASE3_DATABASE_SCHEMA.md)
- [Phase 4: Stripe](docs/PHASE4_STRIPE_INTEGRATION.md)
- [Phase 5: Chat AI](docs/PHASE5_CHAT_AI_SYSTEM.md)
- [Phase 6: Communauté](docs/PHASE6_COMMUNITY_SYSTEM.md)
- [Phase 7: Studio & AI](docs/PHASE7_STUDIO_AI_TOOLS.md)
- [Phase 8: Tests](docs/PHASE8_E2E_TESTING.md)
- [Phase 9: Monitoring](docs/PHASE9_OBSERVABILITY_ERRORS.md)
- [Phase 10: Sécurité](docs/PHASE10_SECURITY_GDPR.md)
- [Phase 11: CI/CD](docs/PHASE11_VERCEL_AUTOMATION.md)

---

## 🔒 Sécurité

### **Mesures Implémentées**

✅ **Chiffrement AES-256-GCM** pour données sensibles  
✅ **Rate limiting** sur tous les endpoints  
✅ **Headers de sécurité** (CSP, X-Frame-Options, etc.)  
✅ **HTTPS uniquement** en production  
✅ **Sessions sécurisées** (HttpOnly, Secure, SameSite)  
✅ **Validation des entrées** (Zod)  
✅ **Protection CSRF**  
✅ **Conformité GDPR** complète  

### **Signaler une Vulnérabilité**

Envoyez un email à security@crealia.com (ne pas créer d'issue publique).

---

## 🌍 GDPR & Conformité

Créalia est conforme au RGPD (GDPR) :

✅ **Consentement cookies** - Bannière conforme  
✅ **Droit d'accès** - Export de toutes les données  
✅ **Droit à l'effacement** - Suppression complète  
✅ **Portabilité** - Export JSON  
✅ **Transparence** - Politique de confidentialité claire  

Voir [docs/GDPR.md](docs/GDPR.md) pour plus d'informations.

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

Voir [CONTRIBUTING.md](docs/CONTRIBUTING.md) pour les guidelines.

---

## 📊 Statut du Projet

| Feature | Status |
|---------|--------|
| Authentication | ✅ Complete |
| Pricing & Stripe | ✅ Complete |
| AI Chat | ✅ Complete |
| AI Generation | ✅ Complete |
| Studio | ✅ Complete |
| Analytics | ✅ Complete |
| Forum | ✅ Complete |
| GDPR | ✅ Complete |
| Tests E2E | ✅ Complete |
| CI/CD | ✅ Complete |
| Documentation | ✅ Complete |

**Statut Global**: 🟢 Production Ready

---

## 📝 Changelog

### **Version 1.0.0** (2024-01-20)

✅ **Release initiale**
- Toutes les 12 phases implémentées
- Système d'authentification complet
- Intégration Stripe fonctionnelle
- IA Chat & génération
- Studio de création
- Conformité GDPR
- CI/CD automatisé

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique complet.

---

## 📞 Support

- **Email**: support@crealia.com
- **Discord**: [discord.gg/crealia](https://discord.gg/crealia)
- **Documentation**: [docs.crealia.com](https://docs.crealia.com)
- **Status**: [status.crealia.com](https://status.crealia.com)

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Vercel](https://vercel.com/) - Hébergement & CI/CD
- [Stripe](https://stripe.com/) - Paiements
- [OpenAI](https://openai.com/) - Intelligence Artificielle
- [Prisma](https://prisma.io/) - ORM
- [shadcn/ui](https://ui.shadcn.com/) - Components UI
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 👨‍💻 Auteurs

**Créalia Team**
- Website: [crealia.com](https://crealia.com)
- GitHub: [@BCZ22](https://github.com/BCZ22)

---

<div align="center">

**[Website](https://crealia.com)** • **[Documentation](docs/)** • **[Changelog](CHANGELOG.md)** • **[Contributing](docs/CONTRIBUTING.md)**

Fait avec ❤️ par l'équipe Créalia

</div>
