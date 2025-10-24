#!/bin/bash

# Script de vérification Créalia Studio
# Vérifie que tous les fichiers nécessaires sont présents

echo "🔍 Vérification de l'installation Créalia Studio..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Fonction de test
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $1 - MANQUANT"
        ((FAILED++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $1/ - MANQUANT"
        ((FAILED++))
    fi
}

echo "📁 Vérification des composants..."
check_file "components/crealia-studio-interface-v2.tsx"

echo ""
echo "📚 Vérification des bibliothèques..."
check_file "lib/studio/types.ts"
check_file "lib/studio/tools-config.ts"

echo ""
echo "🔌 Vérification des API routes..."
check_file "app/api/crealia/upload/route.ts"
check_file "app/api/crealia/analyze/route.ts"
check_file "app/api/crealia/generate/route.ts"
check_file "app/api/crealia/jobs/[jobId]/route.ts"
check_file "app/api/crealia/captions/route.ts"
check_file "app/api/crealia/presets/route.ts"
check_file "app/api/crealia/brand/route.ts"

echo ""
echo "🛠️ Vérification des services..."
check_file "backend/services/crealia-studio.service.ts"

echo ""
echo "🧪 Vérification des tests..."
check_file "e2e/crealia-studio.spec.ts"

echo ""
echo "📖 Vérification de la documentation..."
check_file "docs/FEATURE-CREALIA-STUDIO.md"
check_file "CREALIA_STUDIO_QUICKSTART.md"
check_file "CREALIA_STUDIO_README.md"
check_file "INTEGRATION_GUIDE.md"
check_file "VERCEL_CREALIA_STUDIO_CHECKLIST.md"
check_file "TEST_CREALIA_STUDIO_VERCEL.md"

echo ""
echo "⚙️ Vérification des configurations..."
check_file "env.example"
check_file "vercel.json"
check_file "next.config.mjs"
check_file "package.json"

echo ""
echo "📂 Vérification des répertoires uploads..."
check_dir "public/uploads"

if [ ! -d "public/uploads/crealia" ]; then
    echo -e "${YELLOW}⚠️${NC} public/uploads/crealia/ - À créer"
    echo "   → Exécutez: mkdir -p public/uploads/crealia"
else
    echo -e "${GREEN}✅${NC} public/uploads/crealia/"
    ((PASSED++))
fi

if [ ! -d "public/uploads/brand" ]; then
    echo -e "${YELLOW}⚠️${NC} public/uploads/brand/ - À créer"
    echo "   → Exécutez: mkdir -p public/uploads/brand"
else
    echo -e "${GREEN}✅${NC} public/uploads/brand/"
    ((PASSED++))
fi

echo ""
echo "🔍 Vérification des dépendances NPM..."

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️${NC} node_modules/ non trouvé"
    echo "   → Exécutez: npm install"
else
    # Vérifier lucide-react
    if [ -d "node_modules/lucide-react" ]; then
        echo -e "${GREEN}✅${NC} lucide-react installé"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} lucide-react - MANQUANT"
        echo "   → Exécutez: npm install lucide-react"
        ((FAILED++))
    fi
    
    # Vérifier autres dépendances importantes
    for dep in "react" "next" "@radix-ui/react-select" "@radix-ui/react-slider"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "${GREEN}✅${NC} $dep installé"
            ((PASSED++))
        else
            echo -e "${RED}❌${NC} $dep - MANQUANT"
            ((FAILED++))
        fi
    done
fi

echo ""
echo "🎨 Vérification des composants UI..."

UI_COMPONENTS=("button" "card" "input" "label" "select" "textarea" "switch" "slider" "progress" "alert" "badge" "separator" "tabs" "scroll-area")

UI_MISSING=0
for component in "${UI_COMPONENTS[@]}"; do
    if [ -f "components/ui/$component.tsx" ]; then
        echo -e "${GREEN}✅${NC} components/ui/$component.tsx"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC} components/ui/$component.tsx - Manquant"
        ((UI_MISSING++))
    fi
done

if [ $UI_MISSING -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️${NC} $UI_MISSING composants UI manquants"
    echo "   → Installez avec: npx shadcn-ui@latest add [component-name]"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 RÉSULTAT DE LA VÉRIFICATION"
echo ""
echo -e "✅ Vérifications réussies: ${GREEN}$PASSED${NC}"
echo -e "❌ Vérifications échouées: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 CRÉALIA STUDIO EST PRÊT !${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Vérifiez votre .env.local (copiez depuis env.example)"
    echo "2. Lancez: npm run dev"
    echo "3. Ouvrez http://localhost:3000"
    echo "4. Testez Créalia Studio"
    echo ""
    echo "Pour déployer sur Vercel:"
    echo "1. git add ."
    echo "2. git commit -m 'feat: Créalia Studio V2'"
    echo "3. git push"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}⚠️ PROBLÈMES DÉTECTÉS${NC}"
    echo ""
    echo "Corrigez les problèmes ci-dessus, puis relancez ce script."
    echo ""
    exit 1
fi

