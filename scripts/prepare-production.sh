#!/bin/bash

# =============================================================================
# SCRIPT DE PRÉPARATION POUR LA PRODUCTION - Crealia
# =============================================================================

set -e

echo "🚀 Préparation pour la Production - Crealia"
echo "==========================================="

# Configuration
PROJECT_NAME="crealia"
ENVIRONMENT="production"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour créer le Dockerfile de production
create_dockerfile() {
    print_status "Création du Dockerfile de production..."
    
    cat > Dockerfile.production << 'EOF'
# Dockerfile de production pour Crealia
FROM node:18-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache libc6-compat

# Étape de build
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Étape de construction
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
EOF
    
    print_success "Dockerfile de production créé"
}

# Fonction pour créer le docker-compose de production
create_docker_compose() {
    print_status "Création du docker-compose de production..."
    
    cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-crealia}
      - POSTGRES_USER=${POSTGRES_USER:-crealia}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-crealia}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
EOF
    
    print_success "Docker-compose de production créé"
}

# Fonction pour créer le fichier .env de production
create_env_production() {
    print_status "Création du fichier .env de production..."
    
    cat > .env.production << 'EOF'
# Configuration de production pour Crealia
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Base de données
DATABASE_URL=postgresql://crealia:password@postgres:5432/crealia
POSTGRES_DB=crealia
POSTGRES_USER=crealia
POSTGRES_PASSWORD=your_secure_password_here

# Redis
REDIS_URL=redis://redis:6379

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Sécurité
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# URLs
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info

# Features
ENABLE_ANALYTICS=true
ENABLE_EXPORTS=true
ENABLE_TEMPLATES=true
ENABLE_AI_CONTENT=true
EOF
    
    print_success "Fichier .env de production créé"
}

# Fonction pour créer le script de démarrage
create_startup_script() {
    print_status "Création du script de démarrage..."
    
    cat > start-production.sh << 'EOF'
#!/bin/bash

# Script de démarrage en production
set -e

echo "🚀 Démarrage de Crealia en production..."

# Vérifier les variables d'environnement
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL non définie"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY non définie"
    exit 1
fi

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
until pg_isready -h postgres -p 5432 -U crealia; do
    echo "Base de données non prête, attente..."
    sleep 2
done

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
npx prisma migrate deploy

# Démarrer l'application
echo "🎉 Démarrage de l'application..."
exec npm start
EOF
    
    chmod +x start-production.sh
    print_success "Script de démarrage créé"
}

# Fonction pour créer la documentation de déploiement
create_deployment_docs() {
    print_status "Création de la documentation de déploiement..."
    
    cat > DEPLOYMENT.md << 'EOF'
# 🚀 Guide de Déploiement - Crealia

## Prérequis

- Node.js 18+
- Docker et Docker Compose
- PostgreSQL 15+
- Redis 7+
- OpenAI API Key

## Déploiement avec Docker

### 1. Configuration

```bash
# Copier le fichier d'environnement
cp .env.production .env

# Éditer les variables d'environnement
nano .env
```

### 2. Démarrage

```bash
# Démarrer tous les services
docker-compose -f docker-compose.production.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.production.yml logs -f
```

### 3. Vérification

```bash
# Vérifier la santé de l'application
curl http://localhost:3000/api/health

# Vérifier les services
docker-compose -f docker-compose.production.yml ps
```

## Déploiement Manuel

### 1. Installation

```bash
# Installer les dépendances
npm ci --production

# Construire l'application
npm run build
```

### 2. Configuration de la base de données

```bash
# Exécuter les migrations
npx prisma migrate deploy

# Seeder les données initiales
npm run db:seed:carousel
```

### 3. Démarrage

```bash
# Démarrer l'application
npm start
```

## Monitoring

### Health Checks

- Application: `GET /api/health`
- Base de données: Vérification automatique
- Redis: Vérification automatique

### Logs

```bash
# Logs de l'application
docker-compose logs -f app

# Logs de la base de données
docker-compose logs -f postgres

# Logs de Redis
docker-compose logs -f redis
```

## Maintenance

### Sauvegarde

```bash
# Sauvegarde de la base de données
docker-compose exec postgres pg_dump -U crealia crealia > backup.sql

# Restauration
docker-compose exec -T postgres psql -U crealia crealia < backup.sql
```

### Mise à jour

```bash
# Arrêter les services
docker-compose down

# Mettre à jour le code
git pull origin main

# Reconstruire et redémarrer
docker-compose up -d --build
```

## Sécurité

- Utiliser des mots de passe forts
- Configurer HTTPS
- Limiter l'accès aux ports
- Surveiller les logs
- Mettre à jour régulièrement

## Support

En cas de problème, vérifier :
1. Les logs des services
2. La connectivité réseau
3. Les variables d'environnement
4. L'espace disque disponible
EOF
    
    print_success "Documentation de déploiement créée"
}

# Fonction pour créer un script de test de production
create_production_test() {
    print_status "Création du script de test de production..."
    
    cat > test-production.sh << 'EOF'
#!/bin/bash

# Script de test pour la production
set -e

echo "🧪 Tests de Production - Crealia"
echo "================================"

BASE_URL="http://localhost:3000"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test 1: Health Check
print_status "Test 1: Health Check API"
if curl -s -f "$BASE_URL/api/health" >/dev/null; then
    print_success "✅ Health Check OK"
else
    print_error "❌ Health Check FAILED"
    exit 1
fi

# Test 2: Templates API
print_status "Test 2: Templates API"
if curl -s -f "$BASE_URL/api/v1/templates" >/dev/null; then
    print_success "✅ Templates API OK"
else
    print_error "❌ Templates API FAILED"
    exit 1
fi

# Test 3: Analytics API
print_status "Test 3: Analytics API"
if curl -s -f "$BASE_URL/api/v1/analytics/templates" >/dev/null; then
    print_success "✅ Analytics API OK"
else
    print_error "❌ Analytics API FAILED"
    exit 1
fi

# Test 4: Carousel API
print_status "Test 4: Carousel API"
if curl -s -f "$BASE_URL/api/v1/carousel" >/dev/null; then
    print_success "✅ Carousel API OK"
else
    print_error "❌ Carousel API FAILED"
    exit 1
fi

# Test 5: Interface Analytics
print_status "Test 5: Interface Analytics"
if curl -s -f "$BASE_URL/analytics/templates" >/dev/null; then
    print_success "✅ Interface Analytics OK"
else
    print_error "❌ Interface Analytics FAILED"
    exit 1
fi

# Test 6: Interface Carousel
print_status "Test 6: Interface Carousel"
if curl -s -f "$BASE_URL/carousel" >/dev/null; then
    print_success "✅ Interface Carousel OK"
else
    print_error "❌ Interface Carousel FAILED"
    exit 1
fi

# Test 7: Interface AI Content
print_status "Test 7: Interface AI Content"
if curl -s -f "$BASE_URL/ai/content" >/dev/null; then
    print_success "✅ Interface AI Content OK"
else
    print_error "❌ Interface AI Content FAILED"
    exit 1
fi

print_success "🎉 Tous les tests de production sont passés !"
echo ""
print_status "📋 Résumé:"
echo "   • APIs fonctionnelles"
echo "   • Interfaces accessibles"
echo "   • Application prête pour la production"
EOF
    
    chmod +x test-production.sh
    print_success "Script de test de production créé"
}

# Fonction pour générer un rapport de déploiement
generate_deployment_report() {
    print_status "Génération du rapport de déploiement..."
    
    local report_file="deployment-report-$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Rapport de Préparation Production - Crealia"
        echo "==========================================="
        echo "Date: $(date)"
        echo "Environnement: $ENVIRONMENT"
        echo "Version: 1.0.0"
        echo ""
        
        echo "Fichiers créés:"
        echo "• Dockerfile.production"
        echo "• docker-compose.production.yml"
        echo "• .env.production"
        echo "• start-production.sh"
        echo "• test-production.sh"
        echo "• DEPLOYMENT.md"
        echo ""
        
        echo "Services configurés:"
        echo "• Application Next.js (port 3000)"
        echo "• PostgreSQL (port 5432)"
        echo "• Redis (port 6379)"
        echo ""
        
        echo "Fonctionnalités activées:"
        echo "• AI Content Generation"
        echo "• Carousel Generator"
        echo "• Templates System"
        echo "• Analytics Dashboard"
        echo "• Export Services"
        echo ""
        
        echo "Prochaines étapes:"
        echo "1. Configurer les variables d'environnement dans .env.production"
        echo "2. docker-compose -f docker-compose.production.yml up -d"
        echo "3. ./test-production.sh"
        echo "4. Vérifier http://localhost:3000/api/health"
        echo "5. Déployer en production"
        echo ""
        
        echo "Préparation terminée! 🎉"
    } > "$report_file"
    
    print_success "Rapport généré: $report_file"
}

# Fonction principale
main() {
    echo ""
    print_status "Démarrage de la préparation pour la production..."
    echo ""
    
    local start_time=$(date +%s)
    
    # Étapes de préparation
    create_dockerfile
    create_docker_compose
    create_env_production
    create_startup_script
    create_deployment_docs
    create_production_test
    generate_deployment_report
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_success "Préparation terminée en ${duration}s !"
    echo ""
    print_status "🎉 Résultats:"
    echo "   • Configuration Docker créée"
    echo "   • Scripts de déploiement générés"
    echo "   • Documentation complète"
    echo "   • Tests de production prêts"
    echo ""
    print_status "📋 Prochaines étapes:"
    echo "   1. Configurer .env.production"
    echo "   2. docker-compose -f docker-compose.production.yml up -d"
    echo "   3. ./test-production.sh"
    echo "   4. Déployer en production"
    echo ""
}

# Gestion des signaux
trap 'print_error "Préparation interrompue"; exit 130' INT TERM

# Exécution
main "$@"

