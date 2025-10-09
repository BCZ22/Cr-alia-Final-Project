#!/bin/bash

# =============================================================================
# SCRIPT DE LANCEMENT DES TESTS DE PERFORMANCE K6
# =============================================================================

set -e

echo "🚀 Tests de Performance K6 - Crealia"
echo "===================================="

# Configuration
BASE_URL=${BASE_URL:-"http://localhost:3000"}
RESULTS_DIR="./test-results/performance"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Créer le répertoire de résultats
mkdir -p "$RESULTS_DIR"

# Fonction pour exécuter un test K6
run_k6_test() {
    local test_name=$1
    local test_file=$2
    local output_file="$RESULTS_DIR/${test_name}_${TIMESTAMP}"
    
    echo ""
    echo "🧪 Exécution du test: $test_name"
    echo "📁 Fichier: $test_file"
    echo "📊 Résultats: $output_file"
    echo "----------------------------------------"
    
    # Vérifier que K6 est installé
    if ! command -v k6 &> /dev/null; then
        echo "❌ K6 n'est pas installé. Installation..."
        brew install k6 2>/dev/null || {
            echo "❌ Impossible d'installer K6. Veuillez l'installer manuellement:"
            echo "   macOS: brew install k6"
            echo "   Linux: https://k6.io/docs/getting-started/installation/"
            exit 1
        }
    fi
    
    # Exécuter le test K6
    k6 run \
        --env BASE_URL="$BASE_URL" \
        --out json="$output_file.json" \
        --out csv="$output_file.csv" \
        "$test_file"
    
    echo "✅ Test $test_name terminé"
    echo "📈 Résultats sauvegardés:"
    echo "   - JSON: $output_file.json"
    echo "   - CSV: $output_file.csv"
}

# Fonction pour vérifier que l'API est accessible
check_api() {
    echo "🔍 Vérification de l'API..."
    
    if curl -f "$BASE_URL/api/health" >/dev/null 2>&1; then
        echo "✅ API accessible sur $BASE_URL"
    else
        echo "❌ API non accessible sur $BASE_URL"
        echo "💡 Assurez-vous que le serveur est démarré:"
        echo "   npm run dev"
        exit 1
    fi
}

# Fonction pour afficher le résumé des résultats
show_summary() {
    echo ""
    echo "📊 RÉSUMÉ DES TESTS DE PERFORMANCE"
    echo "=================================="
    echo ""
    
    if [ -d "$RESULTS_DIR" ]; then
        echo "📁 Résultats disponibles dans: $RESULTS_DIR"
        echo ""
        
        # Lister les fichiers de résultats
        ls -la "$RESULTS_DIR"/*"$TIMESTAMP"* 2>/dev/null | while read -r line; do
            echo "📄 $line"
        done
        
        echo ""
        echo "💡 Pour analyser les résultats:"
        echo "   - Ouvrez les fichiers JSON/CSV dans un tableur"
        echo "   - Utilisez K6 Cloud pour des visualisations avancées"
        echo "   - Consultez les logs pour les détails d'erreur"
    else
        echo "❌ Aucun résultat trouvé"
    fi
}

# Fonction principale
main() {
    echo "🎯 Tests de performance pour l'API Crealia"
    echo "🌐 URL de base: $BASE_URL"
    echo "⏰ Timestamp: $TIMESTAMP"
    echo ""
    
    # Vérifier l'API
    check_api
    
    # Attendre que l'API soit stable
    echo "⏳ Attente de la stabilisation de l'API..."
    sleep 5
    
    # Tests disponibles
    echo ""
    echo "📋 Tests disponibles:"
    echo "1. Test de charge API générale"
    echo "2. Test d'export de carrousels"
    echo "3. Tous les tests"
    echo "4. Test personnalisé"
    echo ""
    
    read -p "Choisissez un test (1-4): " choice
    
    case $choice in
        1)
            run_k6_test "api_load" "tests/performance/api-load.test.js"
            ;;
        2)
            run_k6_test "carousel_export" "tests/performance/carousel-export.test.js"
            ;;
        3)
            run_k6_test "api_load" "tests/performance/api-load.test.js"
            run_k6_test "carousel_export" "tests/performance/carousel-export.test.js"
            ;;
        4)
            echo "Tests personnalisés disponibles:"
            echo "- api-load: Charge générale de l'API"
            echo "- carousel-export: Exports de carrousels"
            echo ""
            read -p "Nom du test: " custom_test
            run_k6_test "custom_$custom_test" "tests/performance/$custom_test.test.js"
            ;;
        *)
            echo "❌ Choix invalide"
            exit 1
            ;;
    esac
    
    # Afficher le résumé
    show_summary
    
    echo ""
    echo "🎉 Tests de performance terminés!"
    echo "📊 Consultez les résultats dans $RESULTS_DIR"
}

# Gestion des signaux
trap 'echo "⏹️ Tests interrompus"; exit 130' INT TERM

# Exécution
main "$@"
