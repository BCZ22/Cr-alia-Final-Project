#!/bin/bash

# Script de test pour la production
set -e

echo "🧪 Tests de Production - Crealia"
echo "================================"

BASE_URL="http://localhost:3000"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test 1: Health Check
print_status "Test 1: Health Check API"
if curl -s -f "$BASE_URL/api/health" >/dev/null; then
    print_success "✅ Health Check OK"
else
    print_error "❌ Health Check FAILED"
    exit 1
fi

# Test 2: Templates API
print_status "Test 2: Templates API"
if curl -s -f "$BASE_URL/api/v1/templates" >/dev/null; then
    print_success "✅ Templates API OK"
else
    print_error "❌ Templates API FAILED"
    exit 1
fi

# Test 3: Analytics API
print_status "Test 3: Analytics API"
if curl -s -f "$BASE_URL/api/v1/analytics/templates" >/dev/null; then
    print_success "✅ Analytics API OK"
else
    print_error "❌ Analytics API FAILED"
    exit 1
fi

# Test 4: Carousel API
print_status "Test 4: Carousel API"
if curl -s -f "$BASE_URL/api/v1/carousel" >/dev/null; then
    print_success "✅ Carousel API OK"
else
    print_error "❌ Carousel API FAILED"
    exit 1
fi

# Test 5: Interface Analytics
print_status "Test 5: Interface Analytics"
if curl -s "$BASE_URL/analytics/templates" | grep -q "analytics"; then
    print_success "✅ Interface Analytics OK"
else
    print_error "❌ Interface Analytics FAILED"
    exit 1
fi

# Test 6: Interface Carousel
print_status "Test 6: Interface Carousel"
if curl -s "$BASE_URL/carousel" | grep -q "carousel"; then
    print_success "✅ Interface Carousel OK"
else
    print_error "❌ Interface Carousel FAILED"
    exit 1
fi

# Test 7: Interface AI Content
print_status "Test 7: Interface AI Content"
if curl -s "$BASE_URL/ai/content" | grep -q "content"; then
    print_success "✅ Interface AI Content OK"
else
    print_error "❌ Interface AI Content FAILED"
    exit 1
fi

print_success "🎉 Tous les tests de production sont passés !"
echo ""
print_status "📋 Résumé:"
echo "   • APIs fonctionnelles"
echo "   • Interfaces accessibles"
echo "   • Application prête pour la production"
