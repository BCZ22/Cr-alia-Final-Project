#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# TEST CONTENT REACTOR - Script de test complet
# ═══════════════════════════════════════════════════════════════════════════

echo "🎬 Testing Content Reactor..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

# Test 1: Analyze Media
echo -e "${BLUE}📊 Test 1: Analyze Media${NC}"
curl -X POST "${BASE_URL}/api/content-reactor/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "/test-video.mp4",
    "mediaType": "video"
  }' \
  | jq '.'

echo ""
echo ""

# Test 2: Generate Reels
echo -e "${BLUE}🎥 Test 2: Generate Reels${NC}"
curl -X POST "${BASE_URL}/api/content-reactor/generate-reels" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "/test-video.mp4",
    "prompt": "3 Reels marketing pour agence de location de voiture",
    "tone": "luxury",
    "industry": "Location de voiture",
    "duration": 30
  }' \
  | jq '.'

echo ""
echo ""

# Test 3: Chat Interface
echo -e "${BLUE}💬 Test 3: Chat Interface${NC}"
curl -X POST "${BASE_URL}/api/content-reactor/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_123",
    "message": "Comment créer un Reel viral ?"
  }' \
  | jq '.'

echo ""
echo ""

# Test 4: API Info (GET requests)
echo -e "${BLUE}ℹ️  Test 4: API Info${NC}"
echo "Analyze endpoint info:"
curl -X GET "${BASE_URL}/api/content-reactor/analyze" | jq '.'

echo ""
echo "Generate endpoint info:"
curl -X GET "${BASE_URL}/api/content-reactor/generate-reels" | jq '.'

echo ""
echo "Chat endpoint info:"
curl -X GET "${BASE_URL}/api/content-reactor/chat" | jq '.'

echo ""
echo -e "${GREEN}✅ Tests completed!${NC}"

