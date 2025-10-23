#!/bin/bash

# ============================================================================
# Script de Test API Chat - Créalia
# ============================================================================
# Test les endpoints du chat support
# ============================================================================

set -e

# Configuration
BASE_URL="${BASE_URL:-https://crealia.app}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "🧪 Test des API Chat Support - Créalia"
echo "========================================"
echo ""
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Création de session
echo "📝 Test 1: Création de session chat"
echo "Endpoint: POST $BASE_URL/api/chat/create-session"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/chat/create-session" \
  -H "Content-Type: application/json" \
  -d '{}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Test 1 RÉUSSI${NC} (HTTP $HTTP_CODE)"
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    
    # Extraire sessionId pour le test suivant
    SESSION_ID=$(echo "$BODY" | jq -r '.sessionId' 2>/dev/null)
    
    if [ "$SESSION_ID" != "null" ] && [ -n "$SESSION_ID" ]; then
        echo ""
        echo -e "${GREEN}Session ID: $SESSION_ID${NC}"
        echo ""
        
        # Test 2: Envoi de message
        echo "📝 Test 2: Envoi de message"
        echo "Endpoint: POST $BASE_URL/api/chat/message"
        echo ""
        
        MESSAGE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/chat/message" \
          -H "Content-Type: application/json" \
          -d "{\"sessionId\":\"$SESSION_ID\",\"message\":\"Bonjour\"}")
        
        MESSAGE_HTTP_CODE=$(echo "$MESSAGE_RESPONSE" | tail -n1)
        MESSAGE_BODY=$(echo "$MESSAGE_RESPONSE" | sed '$d')
        
        if [ "$MESSAGE_HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Test 2 RÉUSSI${NC} (HTTP $MESSAGE_HTTP_CODE)"
            echo "Response:"
            echo "$MESSAGE_BODY" | jq '.' 2>/dev/null || echo "$MESSAGE_BODY"
            echo ""
            
            # Test 3: Récupération d'historique
            echo "📝 Test 3: Récupération d'historique"
            echo "Endpoint: GET $BASE_URL/api/chat/history?session_id=$SESSION_ID"
            echo ""
            
            HISTORY_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/chat/history?session_id=$SESSION_ID&limit=10")
            
            HISTORY_HTTP_CODE=$(echo "$HISTORY_RESPONSE" | tail -n1)
            HISTORY_BODY=$(echo "$HISTORY_RESPONSE" | sed '$d')
            
            if [ "$HISTORY_HTTP_CODE" = "200" ]; then
                echo -e "${GREEN}✅ Test 3 RÉUSSI${NC} (HTTP $HISTORY_HTTP_CODE)"
                echo "Response:"
                echo "$HISTORY_BODY" | jq '.' 2>/dev/null || echo "$HISTORY_BODY"
                echo ""
                echo -e "${GREEN}🎉 TOUS LES TESTS RÉUSSIS !${NC}"
            else
                echo -e "${RED}❌ Test 3 ÉCHOUÉ${NC} (HTTP $HISTORY_HTTP_CODE)"
                echo "$HISTORY_BODY"
            fi
        else
            echo -e "${RED}❌ Test 2 ÉCHOUÉ${NC} (HTTP $MESSAGE_HTTP_CODE)"
            echo "$MESSAGE_BODY"
        fi
    else
        echo -e "${YELLOW}⚠️  Session ID non trouvé dans la réponse${NC}"
    fi
else
    echo -e "${RED}❌ Test 1 ÉCHOUÉ${NC} (HTTP $HTTP_CODE)"
    echo "$BODY"
fi

echo ""
echo "📊 Résumé des Tests"
echo "==================="
echo "Base URL: $BASE_URL"
echo ""
echo "Pour tester manuellement:"
echo "1. Interface web: $BASE_URL/support/chat"
echo "2. Health check: $BASE_URL/api/health"
echo ""

