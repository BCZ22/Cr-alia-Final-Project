#!/bin/bash

# Script de tests de performance complets pour Crealia
# ===================================================

set -e

echo "🧪 Tests de Performance Complets - Crealiao"
echo "=========================================="

# Vérification de K6
if ! command -v k6 &> /dev/null; then
    echo "❌ K6 n'est pas installé"
    echo "📦 Installation de K6..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install k6
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install k6
    else
        echo "❌ Système d'exploitation non supporté"
        exit 1
    fi
fi

# Vérification que l'application est démarrée
echo "🔍 Vérification de l'application..."
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "❌ L'application n'est pas démarrée sur http://localhost:3000"
    echo "🚀 Démarrage de l'application..."
    docker-compose up -d
    sleep 30
fi

# Création du dossier de résultats
mkdir -p test-results/performance/$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="test-results/performance/$(date +%Y%m%d_%H%M%S)"

echo "📊 Démarrage des tests de performance..."
echo "📁 Résultats dans: $RESULTS_DIR"

# Test 1: Test de charge général
echo ""
echo "🔥 Test 1: Charge générale de l'application"
echo "==========================================="
k6 run --out json=$RESULTS_DIR/general-load-test.json tests/performance/comprehensive-load-test.js

# Test 2: Test de charge des exports vidéo
echo ""
echo "🎥 Test 2: Charge des exports vidéo"
echo "==================================="
k6 run --out json=$RESULTS_DIR/video-export-test.json tests/performance/video-export-load-test.js

# Test 3: Test de stress (charge extrême)
echo ""
echo "💥 Test 3: Test de stress"
echo "========================"
k6 run --out json=$RESULTS_DIR/stress-test.json tests/performance/stress-test.js

# Test 4: Test de montée en charge
echo ""
echo "📈 Test 4: Test de montée en charge"
echo "==================================="
k6 run --out json=$RESULTS_DIR/ramp-up-test.json tests/performance/ramp-up-test.js

# Génération du rapport consolidé
echo ""
echo "📋 Génération du rapport consolidé..."
node scripts/generate-performance-report.js $RESULTS_DIR

# Affichage des résultats
echo ""
echo "🎉 Tests de performance terminés !"
echo "================================="
echo ""
echo "📊 Résultats disponibles dans: $RESULTS_DIR"
echo ""
echo "📈 Métriques clés:"
echo "  - Temps de réponse P95: < 2s"
echo "  - Taux d'erreur: < 10%"
echo "  - Exports vidéo: < 10s"
echo "  - Taux de succès exports: > 80%"
echo ""
echo "🔍 Analyse des résultats:"
echo "  - Rapport HTML: $RESULTS_DIR/performance-report.html"
echo "  - Données JSON: $RESULTS_DIR/*.json"
echo "  - Logs détaillés: $RESULTS_DIR/*.log"



