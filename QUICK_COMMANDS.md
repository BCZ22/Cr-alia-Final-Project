# ⚡ Commandes Rapides - Créalia

Guide de référence rapide pour toutes les commandes importantes.

---

## 🚀 Démarrage

### Installation initiale
```bash
npm install
cp env.example .env.local
npx prisma generate --schema=./backend/prisma/schema.prisma
npx prisma db push --schema=./backend/prisma/schema.prisma
npm run dev
```

### Dev server
```bash
npm run dev              # Port 3000
```

---

## 🧪 Tests

### Tests unitaires
```bash
npm test                        # Tous les tests
npm test jobQueue.test.ts       # Test spécifique
npm run test:watch              # Mode watch
npm test -- --coverage          # Avec coverage
```

### Tests E2E
```bash
npx playwright test                          # Tous les tests E2E
npx playwright test footer-navigation        # Tests footer
npx playwright test --headed                 # Mode visible
npx playwright test --debug                  # Mode debug
npx playwright show-report                   # Voir rapport
```

---

## 🔍 Qualité du code

### Linting
```bash
npm run lint                # Vérifier
npm run lint:fix            # Corriger automatiquement
```

### Type checking
```bash
npm run type-check          # Vérification TypeScript
```

### Formatting
```bash
npm run format              # Prettier (auto-format)
```

### Tout vérifier
```bash
npm run lint && npm run type-check && npm test
```

---

## 🏗️ Build

### Build production
```bash
npm run build               # Build Next.js
npm start                   # Démarre le build
```

### Analyser le bundle
```bash
npm run build -- --analyze  # Analyse taille bundle
```

---

## 📦 Base de données

### Prisma
```bash
# Générer client
npx prisma generate --schema=./backend/prisma/schema.prisma

# Migrations
npx prisma migrate dev --schema=./backend/prisma/schema.prisma
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma

# Studio (UI pour DB)
npx prisma studio --schema=./backend/prisma/schema.prisma

# Reset DB (dev only)
npx prisma migrate reset --schema=./backend/prisma/schema.prisma
```

---

## 🔄 Git & PR

### Créer la branche et PR
```bash
# Option 1: Script automatique (recommandé)
./create-pr.sh

# Option 2: Manuel
git checkout -b cursor/auto-fix-footer-and-pages
git add .
git commit -m "feat: footer & pages complets"
git push -u origin cursor/auto-fix-footer-and-pages
```

### Vérifier status
```bash
git status                  # Fichiers modifiés
git diff                    # Changements
git log --oneline -5        # Derniers commits
```

---

## 🚢 Déploiement Vercel

### Via CLI
```bash
# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# Logs
vercel logs

# Rollback
vercel rollback [deployment-url]
```

### Via Git (automatique)
```bash
# Push vers main → déploie automatiquement
git push origin main

# PR → preview deployment automatique
```

---

## 🔍 Debug & Monitoring

### Logs locaux
```bash
npm run dev 2>&1 | tee dev.log      # Sauver logs
tail -f dev.log                      # Suivre logs
```

### Health check
```bash
# Local
curl http://localhost:3000/api/health

# Production
curl https://crealia.com/api/health
```

### Database check
```bash
# Test connection
psql $DATABASE_URL

# Query
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## 🧹 Nettoyage

### Nettoyage cache
```bash
# Next.js cache
rm -rf .next

# Node modules
rm -rf node_modules
npm install

# Prisma
rm -rf node_modules/.prisma
npx prisma generate --schema=./backend/prisma/schema.prisma

# Playwright cache
npx playwright install --force

# Tout nettoyer
rm -rf .next node_modules coverage test-results playwright-report
npm install
```

---

## 📊 Performance

### Lighthouse audit
```bash
# Install
npm install -g lighthouse

# Audit local
lighthouse http://localhost:3000 --view

# Audit production
lighthouse https://crealia.com --view

# CI mode
lighthouse https://crealia.com --output json --output-path ./lighthouse.json
```

### Bundle analyzer
```bash
npm run build -- --analyze
# Ouvre automatiquement le rapport dans le navigateur
```

---

## 🔒 Sécurité

### Audit dépendances
```bash
npm audit                   # Vérifier vulnérabilités
npm audit fix               # Corriger automatiquement
npm audit fix --force       # Force corrections majeures
```

### Secrets scanning
```bash
# Installer TruffleHog
brew install trufflehog

# Scanner le repo
trufflehog filesystem . --json
```

---

## 📝 Documentation

### Générer docs API
```bash
# Si vous avez un générateur de docs
npm run docs:generate

# Servir docs localement
npm run docs:serve
```

---

## 🎨 UI Development

### Storybook (si installé)
```bash
npm run storybook           # Démarre Storybook
npm run build-storybook     # Build Storybook
```

---

## 🔧 Utilitaires

### Variables d'environnement
```bash
# Copier template
cp env.example .env.local

# Générer secret
openssl rand -base64 32

# Vérifier vars
env | grep NEXT

# Pull vars Vercel (si configuré)
vercel env pull
```

### Port occupé
```bash
# Trouver processus sur port 3000
lsof -ti:3000

# Kill processus
kill -9 $(lsof -ti:3000)

# Ou avec npm
npx kill-port 3000
```

---

## 📦 Gestion packages

### Mettre à jour
```bash
# Vérifier outdated
npm outdated

# Update interactif
npx npm-check -u

# Update tous
npm update

# Update spécifique
npm update next
```

### Ajouter packages
```bash
# Dépendance production
npm install package-name

# Dépendance dev
npm install -D package-name

# Version spécifique
npm install package-name@1.2.3
```

---

## 🐛 Troubleshooting

### Build échoue
```bash
# Nettoyer et rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Tests échouent
```bash
# Nettoyer cache Jest
npm test -- --clearCache

# Nettoyer cache Playwright
npx playwright install --force
```

### TypeScript errors
```bash
# Rebuild types
rm -rf node_modules/.prisma
npx prisma generate --schema=./backend/prisma/schema.prisma
npm run type-check
```

### Database issues
```bash
# Reset DB (dev only)
npx prisma migrate reset --schema=./backend/prisma/schema.prisma

# Re-push schema
npx prisma db push --schema=./backend/prisma/schema.prisma --force-reset
```

---

## 📱 Mobile Testing

### iOS Simulator (macOS)
```bash
# Ouvrir dans Safari iOS
open -a Simulator
# Puis aller sur http://localhost:3000
```

### Android Emulator
```bash
# Ouvrir émulateur Android
emulator -avd Pixel_5_API_30
# Puis aller sur http://10.0.2.2:3000
```

### Responsive testing
```bash
# Playwright avec différentes tailles
npx playwright test --project=mobile
npx playwright test --project=tablet
npx playwright test --project=desktop
```

---

## 🚀 Commandes Combinées

### Pre-commit check
```bash
npm run lint && npm run type-check && npm test
```

### Full verification
```bash
npm run lint && \
npm run type-check && \
npm test && \
npx playwright test && \
npm run build
```

### Deploy check
```bash
npm run build && \
npm run lint && \
npm run type-check && \
npm test
```

---

## 📚 Documentation links

### Projets
- [FEATURE-FOOTER-COMPLETE.md](./FEATURE-FOOTER-COMPLETE.md) - Feature détaillée
- [DEPLOY.md](./DEPLOY.md) - Guide déploiement
- [IMPLEMENTATION_REPORT](./IMPLEMENTATION_REPORT_FOOTER_COMPLETE.md) - Rapport complet
- [SUMMARY](./SUMMARY_FOOTER_COMPLETE.md) - Résumé rapide

### External
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Vercel Docs](https://vercel.com/docs)

---

## 💡 Tips

### Aliases utiles (ajoutez dans ~/.bashrc ou ~/.zshrc)
```bash
alias dev="npm run dev"
alias test="npm test"
alias build="npm run build"
alias lint="npm run lint && npm run type-check"
alias clean="rm -rf .next node_modules coverage && npm install"
```

### Watch mode pour plusieurs commandes
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Tests en watch
npm run test:watch

# Terminal 3: TypeScript watch
npx tsc --watch --noEmit
```

---

**Dernière mise à jour:** 21 Octobre 2025  
**Maintenu par:** Équipe Créalia

