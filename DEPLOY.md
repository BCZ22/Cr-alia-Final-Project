# Guide de Déploiement Créalia

Guide complet pour déployer l'application Créalia en production sur Vercel.

---

## Prérequis

- [ ] Compte Vercel (Team plan recommandé)
- [ ] Accès au repository GitHub
- [ ] Variables d'environnement prêtes
- [ ] Base de données PostgreSQL configurée
- [ ] Compte Stripe configuré (pour checkout)
- [ ] Clés API des services externes (optionnel)

---

## 1. Setup Database

### PostgreSQL Production

Recommandations:
- **Supabase** (gratuit jusqu'à 500MB)
- **Neon** (serverless PostgreSQL)
- **Railway** (PostgreSQL managed)
- **AWS RDS** (production scale)

#### Supabase (Recommandé)

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans Settings > Database
3. Copier la connection string (mode "Transaction")
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### Migrations

```bash
# Install Prisma CLI
npm install -g prisma

# Generate Prisma client
npx prisma generate --schema=./backend/prisma/schema.prisma

# Run migrations
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
```

---

## 2. Configuration Vercel

### A. Créer le projet

```bash
# Via CLI
npm install -g vercel
vercel login
vercel

# Ou via Dashboard
# https://vercel.com/new
# Import from GitHub
```

### B. Settings

**Build & Development Settings:**

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm ci
Development Command: npm run dev
```

**Root Directory:** `.` (root)

**Node.js Version:** 20.x

---

## 3. Variables d'environnement

### A. Dans Vercel Dashboard

Settings > Environment Variables

### B. Variables obligatoires

```bash
# === Application ===
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=<générer-avec-openssl-rand-base64-32>

# === Database ===
DATABASE_URL=postgresql://user:password@host:5432/dbname

# === NextAuth (Auth) ===
# GitHub OAuth (optionnel)
GITHUB_ID=
GITHUB_SECRET=

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### C. Variables optionnelles (mais recommandées)

```bash
# === Storage S3 ===
STORAGE_PROVIDER=s3
S3_BUCKET=crealia-production
S3_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# === AI Services ===
OPENAI_API_KEY=
REPLICATE_API_TOKEN=

# === Email ===
SENDGRID_API_KEY=
EMAIL_FROM=noreply@crealia.com

# === Stripe ===
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# === Analytics ===
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_GA_ID=G-...

# === Rate Limiting ===
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW_MS=60000

# === Upload ===
UPLOAD_MAX_MB=10

# === Mock (false en production) ===
MOCK=false
API_MOCK_MODE=false
```

### D. Générer les secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# Ou via script fourni
chmod +x generate-vercel-secret.sh
./generate-vercel-secret.sh
```

---

## 4. Domaine personnalisé

### A. Ajouter le domaine

1. Settings > Domains
2. Ajouter votre domaine (ex: `crealia.com`)
3. Configurer DNS:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### B. SSL

- Automatique via Vercel (Let's Encrypt)
- Attendre ~5 minutes pour propagation

---

## 5. Webhooks Stripe

### Configuration

1. Dashboard Stripe > Developers > Webhooks
2. Add endpoint: `https://votre-domaine.com/api/checkout/webhook`
3. Events à écouter:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copier le Signing Secret dans `STRIPE_WEBHOOK_SECRET`

---

## 6. GitHub Integration

### A. Configurer les déploiements automatiques

Vercel > Project Settings > Git

- **Production Branch:** `main`
- **Preview Branches:** Toutes les branches
- **Auto-deploy:** Activé

### B. Protection de branches

GitHub > Settings > Branches

**Branch protection rule for `main`:**
- Require pull request before merging
- Require status checks to pass (CI)
- Require conversation resolution
- Require linear history

---

## 7. CI/CD Configuration

Le workflow `.github/workflows/ci.yml` est déjà configuré.

### Secrets GitHub à ajouter

Settings > Secrets and variables > Actions

```
VERCEL_TOKEN=<token>
VERCEL_ORG_ID=<org-id>
VERCEL_PROJECT_ID=<project-id>
```

Obtenir les IDs:

```bash
vercel link
# Crée .vercel/project.json avec les IDs
```

---

## 8. Monitoring & Logs

### A. Vercel Analytics

- Activer dans Project Settings > Analytics
- Monitoring temps réel des performances

### B. Sentry (Recommandé)

1. Créer projet sur [sentry.io](https://sentry.io)
2. Copier DSN dans `SENTRY_DSN`
3. Les erreurs seront automatiquement remontées

### C. Logs

```bash
# Via CLI
vercel logs

# Ou dans Dashboard
# Deployments > [deployment] > Runtime Logs
```

---

## 9. Health Checks

### Endpoint de santé

```bash
curl https://votre-domaine.com/api/health
# Response: {"status":"ok"}
```

### Monitoring externe (Recommandé)

Configurer un service comme:
- **UptimeRobot** (gratuit)
- **Pingdom**
- **Better Stack**

Check URL: `https://votre-domaine.com/api/health` toutes les 5 minutes

---

## 10. Procédure de déploiement

### Déploiement automatique (Recommandé)

```bash
# 1. Créer une branche
git checkout -b feature/ma-feature

# 2. Développer et commiter
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 3. Push
git push origin feature/ma-feature

# 4. Créer PR sur GitHub
# → Vercel crée automatiquement un preview deployment

# 5. Review + Tests
# → CI/CD s'exécute automatiquement

# 6. Merge dans main
# → Déploiement automatique en production
```

### Déploiement manuel

```bash
# Déploiement production
vercel --prod

# Déploiement preview
vercel
```

---

## 11. Rollback

### Via Dashboard

1. Deployments
2. Trouver le déploiement précédent stable
3. Click sur les 3 points > Promote to Production

### Via CLI

```bash
# Lister les déploiements
vercel ls

# Rollback vers un déploiement spécifique
vercel rollback [deployment-url]
```

---

## 12. Scaling & Performance

### Configuration recommandée

**Vercel Pro:**
- Serverless Functions: 1000 GB-Hrs/month
- Bandwidth: 1 TB/month
- Build minutes: 6000/month
- Preview deployments: Unlimited

### Optimisations

1. **Edge Config** (pour feature flags)
2. **Edge Middleware** (authentification)
3. **ISR** (Incremental Static Regeneration)
4. **Image Optimization** (automatique)

---

## 13. Backup & Recovery

### Database Backups

**Supabase:**
- Backups automatiques quotidiens (Pro plan)
- Point-in-time recovery

**Manual backup:**

```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20250101.sql
```

### Code Backups

- Git (GitHub) = backup automatique
- Cloner en local régulièrement

---

## 14. Security Checklist

- [ ] NEXTAUTH_SECRET unique et sécurisé (32+ chars)
- [ ] DATABASE_URL ne contient pas d'espaces/caractères spéciaux
- [ ] Stripe keys en mode live (pas test)
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] HTTPS forcé
- [ ] Secrets ne sont pas dans le code
- [ ] `.env.local` dans `.gitignore`
- [ ] Webhooks Stripe avec signature vérifiée
- [ ] SQL injection prévention (Prisma ORM)

---

## 15. Post-déploiement

### Tests à effectuer

```bash
# 1. Health check
curl https://votre-domaine.com/api/health

# 2. Test auth
curl -X POST https://votre-domaine.com/api/auth/signin

# 3. Test job creation
curl -X POST https://votre-domaine.com/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"type":"reel_generation","payload":{}}'

# 4. Test upload
curl -X POST https://votre-domaine.com/api/studio/upload \
  -F "file=@test.jpg"
```

### Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://votre-domaine.com --view
```

**Targets:**
- Performance: >= 90
- Accessibility: >= 95
- Best Practices: >= 90
- SEO: >= 90

---

## 16. Troubleshooting

### Build échoue

```bash
# Vérifier logs
vercel logs --follow

# Construire localement
npm run build

# Vérifier variables d'environnement
vercel env pull
```

### Runtime errors

```bash
# Logs en temps réel
vercel logs --follow

# Vérifier Sentry pour stack traces
```

### Database connection fails

```bash
# Tester connection
psql $DATABASE_URL

# Vérifier IP whitelist (Supabase)
# Ajouter 0.0.0.0/0 si serverless
```

### Webhooks Stripe ne fonctionnent pas

```bash
# Tester localement avec Stripe CLI
stripe listen --forward-to localhost:3000/api/checkout/webhook

# Vérifier signing secret
echo $STRIPE_WEBHOOK_SECRET
```

---

## 17. Maintenance

### Updates régulières

```bash
# Dépendances
npm outdated
npm update

# Security patches
npm audit fix

# Prisma
npx prisma migrate deploy
```

### Monitoring

- [ ] Vérifier Sentry quotidiennement
- [ ] Vérifier métriques Vercel (erreurs 5xx)
- [ ] Vérifier uptime (UptimeRobot)
- [ ] Vérifier utilisation DB (disk space)
- [ ] Vérifier quotas API externes

---

## 18. Contact & Support

**Documentation:**
- README.md
- FEATURE-FOOTER-COMPLETE.md
- Ce fichier (DEPLOY.md)

**Support Vercel:**
- [vercel.com/support](https://vercel.com/support)
- Documentation: [vercel.com/docs](https://vercel.com/docs)

**Issues GitHub:**
- [github.com/votre-org/crealia/issues](https://github.com)

---

## Checklist finale

Avant de considérer le déploiement comme réussi:

- [ ] Build réussit sans erreur
- [ ] Toutes les variables d'environnement configurées
- [ ] Database migrée et accessible
- [ ] Domaine personnalisé configuré et SSL actif
- [ ] Health check endpoint répond 200 OK
- [ ] Tests manuels passent (auth, jobs, upload)
- [ ] Lighthouse score >= 90
- [ ] Monitoring activé (Sentry, UptimeRobot)
- [ ] Webhooks Stripe configurés et testés
- [ ] Backups database configurés
- [ ] CI/CD GitHub Actions fonctionne
- [ ] Documentation à jour

---

**Date:** 2025-10-21  
**Version:** 1.0.0  
**Auteur:** Anthony Bocca + Cursor AI

