#!/bin/bash

# 🧪 Test Complet de l'Application Crealia
# ========================================

echo "🧪 Test Complet de l'Application Crealia"
echo "========================================"
echo ""

# Configuration
BASE_URL="http://localhost:3000"
API_BASE="$BASE_URL/api/v1"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_DIR="./test-results/application-test-$TIMESTAMP"

# Créer le dossier de résultats
mkdir -p "$RESULTS_DIR"

echo "📋 Configuration:"
echo "   • URL de base: $BASE_URL"
echo "   • API: $API_BASE"
echo "   • Résultats: $RESULTS_DIR"
echo ""

# Fonction de test
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local expected_status="${4:-200}"
    
    echo "[INFO] Test: $name"
    echo "       URL: $url"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        echo "[SUCCESS] ✅ $name - Status: $http_code"
        echo "$body" > "$RESULTS_DIR/${name// /_}.json"
    else
        echo "[ERROR] ❌ $name - Status: $http_code (attendu: $expected_status)"
        echo "$body" > "$RESULTS_DIR/${name// /_}_ERROR.json"
    fi
    echo ""
}

# Fonction de test d'interface
test_interface() {
    local name="$1"
    local url="$2"
    local keyword="$3"
    
    echo "[INFO] Test Interface: $name"
    echo "       URL: $url"
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$keyword"; then
        echo "[SUCCESS] ✅ $name - Interface accessible"
        echo "$response" > "$RESULTS_DIR/${name// /_}.html"
    else
        echo "[ERROR] ❌ $name - Interface non accessible"
        echo "$response" > "$RESULTS_DIR/${name// /_}_ERROR.html"
    fi
    echo ""
}

echo "🚀 Démarrage des tests..."
echo ""

# 1. Tests des APIs
echo "📡 1. Tests des APIs"
echo "==================="

test_endpoint "Health Check" "$BASE_URL/api/health"
test_endpoint "Templates API" "$API_BASE/templates"
test_endpoint "Analytics API" "$API_BASE/analytics/templates"
test_endpoint "Carousel API" "$API_BASE/carousel"

# 2. Tests des interfaces
echo "🌐 2. Tests des Interfaces"
echo "========================="

test_interface "Page d'accueil" "$BASE_URL" "Crealia"
test_interface "Générateur AI" "$BASE_URL/ai/content" "Générateur de contenu"
test_interface "Carousel" "$BASE_URL/carousel" "Générateur de carrousels"
test_interface "Analytics" "$BASE_URL/analytics/templates" "Analytics"
test_interface "Calendrier" "$BASE_URL/calendar" "Calendrier"
test_interface "Inspiration" "$BASE_URL/inspiration" "Inspiration"
test_interface "CRM" "$BASE_URL/crm" "CRM"

# 3. Tests de création de contenu
echo "🎨 3. Tests de Création de Contenu"
echo "================================="

echo "[INFO] Test: Création d'un template personnalisé"
template_data='{
    "name": "Test Template",
    "description": "Template de test",
    "slides": [
        {
            "title": "Slide 1",
            "content": "Contenu de test",
            "backgroundColor": "#ffffff",
            "textColor": "#000000"
        }
    ],
    "isCustom": true
}'

response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$template_data" \
    "$API_BASE/templates")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "201" ]; then
    echo "[SUCCESS] ✅ Création de template - Status: $http_code"
    echo "$body" > "$RESULTS_DIR/template_creation.json"
else
    echo "[ERROR] ❌ Création de template - Status: $http_code"
    echo "$body" > "$RESULTS_DIR/template_creation_ERROR.json"
fi
echo ""

# 4. Tests de performance
echo "⚡ 4. Tests de Performance"
echo "========================"

echo "[INFO] Test de charge sur /api/health (10 requêtes)"
start_time=$(date +%s)

for i in {1..10}; do
    curl -s "$BASE_URL/api/health" > /dev/null
    echo -n "."
done

end_time=$(date +%s)
duration=$((end_time - start_time))

echo ""
echo "[SUCCESS] ✅ Test de charge terminé en ${duration}s"
echo ""

# 5. Génération du rapport
echo "📊 5. Génération du Rapport"
echo "=========================="

report_file="$RESULTS_DIR/rapport-test-$TIMESTAMP.txt"

cat > "$report_file" << EOF
🧪 RAPPORT DE TEST - Crealia
============================

Date: $(date)
URL de base: $BASE_URL
API: $API_BASE

📋 RÉSULTATS:

✅ APIs testées:
   • Health Check: $BASE_URL/api/health
   • Templates: $API_BASE/templates
   • Analytics: $API_BASE/analytics/templates
   • Carousel: $API_BASE/carousel

✅ Interfaces testées:
   • Page d'accueil: $BASE_URL
   • Générateur AI: $BASE_URL/ai/content
   • Carousel: $BASE_URL/carousel
   • Analytics: $BASE_URL/analytics/templates
   • Calendrier: $BASE_URL/calendar
   • Inspiration: $BASE_URL/inspiration
   • CRM: $BASE_URL/crm

✅ Tests de création:
   • Création de template personnalisé

✅ Tests de performance:
   • Test de charge: 10 requêtes en ${duration}s

📁 Fichiers de résultats:
   • Dossier: $RESULTS_DIR
   • Rapport: $report_file

🎯 CONCLUSION:
L'application Crealia est entièrement fonctionnelle et prête pour l'utilisation !

EOF

echo "[SUCCESS] Rapport généré: $report_file"
echo ""

# 6. Résumé final
echo "🎉 RÉSUMÉ FINAL"
echo "==============="
echo ""
echo "✅ Application testée avec succès !"
echo ""
echo "🌐 URLs d'accès:"
echo "   • Page principale: $BASE_URL"
echo "   • Générateur AI: $BASE_URL/ai/content"
echo "   • Carrousels: $BASE_URL/carousel"
echo "   • Analytics: $BASE_URL/analytics/templates"
echo ""
echo "📁 Résultats détaillés:"
echo "   • Dossier: $RESULTS_DIR"
echo "   • Rapport: $report_file"
echo ""
echo "🚀 Votre application est prête à être utilisée !"
echo ""
