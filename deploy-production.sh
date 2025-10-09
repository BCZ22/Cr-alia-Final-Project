#!/bin/bash

# Script de déploiement en production pour Crealia
# ================================================

set -e

echo "🚀 Déploiement de Crealia en production"
echo "========================================"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Vérification du fichier d'environnement
if [ ! -f ".env.production" ]; then
    echo "⚠️  Fichier .env.production non trouvé"
    echo "📝 Copie du fichier d'exemple..."
    cp env.production.example .env.production
    echo "✏️  Veuillez éditer .env.production avec vos configurations"
    exit 1
fi

# Arrêt des services existants
echo "🛑 Arrêt des services existants..."
docker-compose -f docker-compose.production.yml down

# Nettoyage des images orphelines
echo "🧹 Nettoyage des images orphelines..."
docker system prune -f

# Build des images
echo "🔨 Construction des images Docker..."
docker-compose -f docker-compose.production.yml build --no-cache

# Démarrage des services
echo "🚀 Démarrage des services..."
docker-compose -f docker-compose.production.yml up -d

# Attente du démarrage des services
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérification de la santé des services
echo "🏥 Vérification de la santé des services..."

# Vérification de l'application
echo "🔍 Test de l'application..."
for i in {1..10}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Application démarrée avec succès"
        break
    fi
    echo "⏳ Tentative $i/10 - Attente du démarrage..."
    sleep 10
done

# Vérification de la base de données
echo "🗄️  Test de la base de données..."
docker-compose -f docker-compose.production.yml exec postgres pg_isready -U crealia

# Vérification de Redis
echo "🔴 Test de Redis..."
docker-compose -f docker-compose.production.yml exec redis redis-cli ping

# Vérification de MinIO
echo "📦 Test de MinIO..."
curl -f http://localhost:9000/minio/health/live

# Vérification de Prometheus
echo "📊 Test de Prometheus..."
curl -f http://localhost:9090/-/healthy

# Vérification de Grafana
echo "📈 Test de Grafana..."
curl -f http://localhost:3001/api/health

# Tests de performance
echo "⚡ Lancement des tests de performance..."
./test-production.sh

# Affichage des informations de déploiement
echo ""
echo "🎉 Déploiement terminé avec succès !"
echo "===================================="
echo ""
echo "📱 Application: http://localhost:3000"
echo "📊 Grafana: http://localhost:3001 (admin/admin)"
echo "📈 Prometheus: http://localhost:9090"
echo "📦 MinIO: http://localhost:9001 (minioadmin/minioadmin123)"
echo ""
echo "🔧 Commandes utiles:"
echo "  - Voir les logs: docker-compose -f docker-compose.production.yml logs -f"
echo "  - Arrêter: docker-compose -f docker-compose.production.yml down"
echo "  - Redémarrer: docker-compose -f docker-compose.production.yml restart"
echo ""
echo "📋 Statut des services:"
docker-compose -f docker-compose.production.yml ps



