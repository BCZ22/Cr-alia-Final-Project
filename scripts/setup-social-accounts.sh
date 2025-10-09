#!/bin/bash

# =============================================================================
# SCRIPT DE CONFIGURATION DES COMPTES SOCIAUX
# =============================================================================

set -e

echo "🔗 Configuration des comptes sociaux pour Crealia..."

# Vérifier que Prisma est installé
if ! command -v npx &> /dev/null; then
    echo "❌ npx n'est pas installé. Veuillez installer Node.js et npm."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  Fichier .env.local non trouvé. Création d'un fichier d'exemple..."
    cp .env.example .env.local
    echo "📝 Veuillez configurer les variables d'environnement dans .env.local"
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "🗄️  Application des migrations de base de données..."
npx prisma db push

# Vérifier la connexion à la base de données
echo "🔍 Vérification de la connexion à la base de données..."
npx prisma db pull --print

echo "✅ Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les variables d'environnement dans .env.local"
echo "2. Créez les applications OAuth2 sur chaque plateforme"
echo "3. Ajoutez les Client ID et Client Secret dans .env.local"
echo "4. Redémarrez l'application avec 'npm run dev'"
echo ""
echo "📚 Documentation : docs/SOCIAL_ACCOUNTS_SETUP.md"
echo "🌐 Interface : http://localhost:3000/social-accounts"

