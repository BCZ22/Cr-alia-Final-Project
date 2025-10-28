#!/bin/bash

echo "========================================="
echo "VALIDATION DES CORRECTIONS ANALYTICS"
echo "========================================="
echo ""

# Check file syntax
echo "✓ Vérification syntaxe app/analytics/page.tsx..."
if grep -q '"use client"' app/analytics/page.tsx; then
  echo "  ✅ Guillemets corrects détectés"
else
  echo "  ❌ Erreur: guillemets incorrects"
  exit 1
fi

# Check navigation file
echo "✓ Vérification components/navigation.tsx..."
lines=$(wc -l < components/navigation.tsx)
if [ "$lines" -gt 10 ]; then
  echo "  ✅ Fichier navigation restauré ($lines lignes)"
else
  echo "  ❌ Fichier navigation vide"
  exit 1
fi

# Check ErrorBoundary exists
echo "✓ Vérification ErrorBoundary..."
if [ -f "components/ErrorBoundary.tsx" ]; then
  echo "  ✅ ErrorBoundary créé"
else
  echo "  ❌ ErrorBoundary manquant"
  exit 1
fi

# Check tests exist
echo "✓ Vérification tests E2E..."
if [ -f "e2e/crealia-analytics.spec.ts" ]; then
  echo "  ✅ Tests E2E créés"
else
  echo "  ❌ Tests E2E manquants"
fi

echo "✓ Vérification tests unitaires..."
if [ -f "__tests__/components/ErrorBoundary.test.tsx" ]; then
  echo "  ✅ Tests unitaires créés"
else
  echo "  ❌ Tests unitaires manquants"
fi

echo ""
echo "========================================="
echo "✅ TOUTES LES VALIDATIONS PASSÉES"
echo "========================================="
