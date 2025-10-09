#!/bin/bash

# =============================================================================
# SCRIPT DE DÉMARRAGE DÉVELOPPEMENT - CREALIA
# =============================================================================

echo "🚀 Démarrage de Crealia en mode développement..."

# Vérifier si le fichier .env existe, sinon copier env.development
if [ ! -f .env ]; then
    echo "📋 Copie de la configuration de développement..."
    cp env.development .env
fi

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer les services
echo "🏗️  Construction et démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier l'état des services
echo "📊 État des services:"
docker-compose ps

echo ""
echo "✅ Crealia est maintenant accessible sur:"
echo "   🌐 Application: http://localhost:3000"
echo "   📊 Grafana: http://localhost:3001"
echo "   🔍 Prometheus: http://localhost:9090"
echo "   📦 MinIO: http://localhost:9001"
echo ""
echo "📝 Logs en temps réel:"
echo "   docker-compose logs -f api"
echo ""
echo "🛑 Pour arrêter:"
echo "   docker-compose down"

