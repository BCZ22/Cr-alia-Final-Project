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
