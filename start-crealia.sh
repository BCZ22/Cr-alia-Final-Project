#!/bin/bash

# =============================================================================
# SCRIPT DE DÉMARRAGE CRÉALIA
# =============================================================================

echo "🚀 Démarrage de Créalia..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
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

# Vérification de Node.js
print_status "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION détectée. Version 18+ requise."
    exit 1
fi

print_success "Node.js $(node -v) détecté"

# Vérification des dépendances
print_status "Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    print_warning "node_modules manquant. Installation des dépendances..."
    npm install
fi

# Vérification du fichier d'environnement
print_status "Vérification de la configuration d'environnement..."
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    print_warning "Fichier d'environnement manquant. Copie de env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env.local
        print_success "Fichier .env.local créé depuis env.example"
    else
        print_warning "env.example manquant. Création d'un fichier .env.local minimal..."
        cat > .env.local << EOF
# Configuration minimale pour Créalia
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Base de données (optionnelle pour les fonctionnalités de base)
DATABASE_URL="postgresql://postgres:password@localhost:5432/crealia"

# JWT (optionnel)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# IA Services (optionnelles)
OPENAI_API_KEY=sk-your-openai-key-here
EOF
        print_success "Fichier .env.local minimal créé"
    fi
fi

# Génération du client Prisma (si nécessaire)
if [ -f "prisma/schema.prisma" ]; then
    print_status "Génération du client Prisma..."
    npx prisma generate > /dev/null 2>&1 || print_warning "Prisma client non généré (optionnel pour les fonctionnalités de base)"
fi

# Démarrage de l'application
print_status "Démarrage de l'application Next.js..."
print_success "✅ Créalia est maintenant accessible sur:"
echo ""
echo -e "${GREEN}   🌐 Interface principale: ${BLUE}http://localhost:3000${NC}"
echo -e "${GREEN}   🎨 Interface Creati: ${BLUE}http://localhost:3000/creati${NC}"
echo -e "${GREEN}   📱 Reels Studio: ${BLUE}http://localhost:3000/reels-studio${NC}"
echo -e "${GREEN}   🤖 IA Content: ${BLUE}http://localhost:3000/ai/content${NC}"
echo -e "${GREEN}   📊 Analytics: ${BLUE}http://localhost:3000/analytics${NC}"
echo ""
print_status "Appuyez sur Ctrl+C pour arrêter l'application"
echo ""

# Démarrage du serveur de développement
npm run dev
