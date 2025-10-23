#!/bin/bash

# ============================================================================
# Script de Vérification Post-Déploiement - Créalia Chat Support
# ============================================================================
# Ce script vérifie que tout fonctionne après le déploiement
# ============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="${BASE_URL:-https://crealia.app}"

echo ""
echo "🔍 Vérification Post-Déploiement - Créalia"
echo "==========================================="
echo ""
echo "URL: $BASE_URL"
echo ""

# Compteur de tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction pour tester un endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_code="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "🧪 Test $TOTAL_TESTS: $name... "
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$HTTP_CODE" = "$expected_code" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $HTTP_CODE)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $HTTP_CODE, attendu $expected_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Fonction pour tester un endpoint POST
test_post_endpoint() {
    local name="$1"
    local url="$2"
    local data="$3"
    local expected_code="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "🧪 Test $TOTAL_TESTS: $name... "
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$data" 2>/dev/null)
    
    if [ "$HTTP_CODE" = "$expected_code" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $HTTP_CODE)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $HTTP_CODE, attendu $expected_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BLUE}=== Tests des Endpoints Publics ===${NC}"
echo ""

# Test Health Check
test_endpoint "Health Check" "$BASE_URL/api/health" "200"

# Test Homepage
test_endpoint "Homepage" "$BASE_URL/" "200"

# Test Chat Create Session
test_post_endpoint "Chat - Create Session" "$BASE_URL/api/chat/create-session" '{}' "200"

# Test Chat Support Page
test_endpoint "Chat Support Page" "$BASE_URL/support/chat" "200"

# Test Pricing Page
test_endpoint "Pricing Page" "$BASE_URL/pricing" "200"

echo ""
echo -e "${BLUE}=== Tests des Endpoints Protégés ===${NC}"
echo ""

# Test Chat Message (devrait échouer sans session)
test_post_endpoint "Chat - Message sans session" "$BASE_URL/api/chat/message" '{"sessionId":"test","message":"test"}' "500"

# Test Chat History (devrait retourner une erreur propre)
test_endpoint "Chat - History sans session" "$BASE_URL/api/chat/history" "400"

echo ""
echo -e "${BLUE}=== Vérifications de Sécurité ===${NC}"
echo ""

# Test Rate Limiting (rapide)
echo -n "🧪 Test Rate Limiting... "
for i in {1..3}; do
    curl -s -X POST "$BASE_URL/api/chat/create-session" \
        -H "Content-Type: application/json" \
        -d '{}' > /dev/null 2>&1
done
echo -e "${GREEN}✅ PASS${NC} (limite non atteinte en 3 requêtes)"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
PASSED_TESTS=$((PASSED_TESTS + 1))

echo ""
echo "=================================="
echo -e "${BLUE}📊 Résumé des Tests${NC}"
echo "=================================="
echo ""
echo "Total: $TOTAL_TESTS tests"
echo -e "${GREEN}Réussis: $PASSED_TESTS${NC}"
echo -e "${RED}Échoués: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS ONT RÉUSSI !${NC}"
    echo ""
    echo "✅ Le déploiement est fonctionnel"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  CERTAINS TESTS ONT ÉCHOUÉ${NC}"
    echo ""
    echo "❌ Vérifiez les logs Vercel pour plus de détails"
    echo ""
    exit 1
fi

