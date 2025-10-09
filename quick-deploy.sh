#!/bin/bash

# =============================================================================
# DÉPLOIEMENT RAPIDE LOCAL CREALIA
# =============================================================================

set -e

# Couleurs pour l'affichage
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

echo "🚀 DÉPLOIEMENT RAPIDE LOCAL CREALIA"
echo "===================================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    print_status "Installation de Node.js..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install node
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        print_error "Système d'exploitation non supporté"
        exit 1
    fi
fi

print_success "Node.js $(node --version) détecté"

# Installer les dépendances
print_status "Installation des dépendances..."
npm install

# Créer les dossiers nécessaires
print_status "Création des dossiers..."
mkdir -p tests/load/results
mkdir -p uploads
mkdir -p logs

# Démarrer le serveur de test
print_status "Démarrage du serveur de test..."
pkill -f "node simple-server.js" || true
node simple-server.js &
SERVER_PID=$!

# Attendre que le serveur démarre
sleep 3

# Vérifier que le serveur fonctionne
if curl -s http://localhost:3000/health > /dev/null; then
    print_success "Serveur démarré avec succès sur http://localhost:3000"
else
    print_error "Le serveur n'a pas démarré correctement"
    exit 1
fi

# Lancer un test de charge rapide
print_status "Lancement d'un test de charge rapide..."
node test-load-simple.js

# Afficher les informations
echo ""
echo "🎉 DÉPLOIEMENT LOCAL RÉUSSI !"
echo "=============================="
echo ""
echo "🌐 Serveur: http://localhost:3000"
echo "💚 Health: http://localhost:3000/health"
echo "📊 Métriques: http://localhost:3000/metrics"
echo "🔗 API: http://localhost:3000/api/v1"
echo ""
echo "🧪 Tests de charge:"
echo "  - Simple: node test-load-simple.js"
echo "  - Progressif: RUN_PROGRESSIVE=true node test-load-simple.js"
echo ""
echo "📁 Fichiers créés:"
echo "  - tests/load/results/ (résultats des tests)"
echo "  - uploads/ (fichiers uploadés)"
echo "  - logs/ (logs de l'application)"
echo ""
echo "⏹️  Pour arrêter le serveur: kill $SERVER_PID"
echo ""

# Garder le script en vie pour maintenir le serveur
print_status "Serveur en cours d'exécution. Appuyez sur Ctrl+C pour arrêter..."
wait $SERVER_PID




