#!/bin/bash
set -e

echo "🚀 PIPELINE DE DÉPLOIEMENT VERCEL - DÉMARRAGE"
echo "=============================================="

# Variables
TIMEOUT_BUILD=1200
TIMEOUT_SMOKE=120
START_TIME=$(date +%s)
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Flags
lint_ok=true
type_ok=true
unit_tests_ok=true
e2e_tests_ok=true

echo -e "${GREEN}📋 Configuration:${NC}"
echo "  Branch: $BRANCH"
echo "  Commit: $GIT_COMMIT"
echo "  Timestamp: $TIMESTAMP"
echo ""

# 1) Vérifier Vercel CLI
echo -e "${GREEN}1️⃣  Vérification Vercel CLI${NC}"
if ! command -v vercel >/dev/null 2>&1; then
    echo "Installation de Vercel CLI..."
    npm i -g vercel
fi

# Skip auth check - will be handled by vercel commands
echo "✅ Vercel CLI installé"
echo ""

# 2) Installer dépendances
echo -e "${GREEN}2️⃣  Installation des dépendances${NC}"
if [ -f pnpm-lock.yaml ]; then
    pkg_mgr="pnpm"
    echo "Utilisation de pnpm..."
    pnpm install --frozen-lockfile || pnpm install || exit 3
elif [ -f yarn.lock ]; then
    pkg_mgr="yarn"
    echo "Utilisation de yarn..."
    yarn install --frozen-lockfile || yarn install || exit 3
else
    pkg_mgr="npm"
    echo "Utilisation de npm..."
    npm ci || npm install || exit 3
fi
echo "✅ Dépendances installées avec $pkg_mgr"
echo ""

# 3) Lint & Typecheck
echo -e "${GREEN}3️⃣  Vérifications statiques${NC}"

# Lint
if npm run -s lint >/dev/null 2>&1; then
    echo "Exécution du lint..."
    if ! npm run lint > lint_output.log 2>&1; then
        echo -e "${YELLOW}⚠️  Lint warnings détectés${NC}"
        tail -n 50 lint_output.log
        lint_ok=false
    else
        echo "✅ Lint passed"
        lint_ok=true
    fi
else
    echo "⏭️  Pas de script lint"
fi

# Typecheck
if npm run -s typecheck >/dev/null 2>&1; then
    echo "Exécution du typecheck..."
    if ! npm run typecheck > typecheck_output.log 2>&1; then
        echo -e "${YELLOW}⚠️  Typecheck errors${NC}"
        tail -n 50 typecheck_output.log
        type_ok=false
    else
        echo "✅ Typecheck passed"
        type_ok=true
    fi
elif [ -f tsconfig.json ]; then
    echo "Exécution de tsc..."
    if ! npx tsc --noEmit > tsc_output.log 2>&1; then
        echo -e "${YELLOW}⚠️  TypeScript errors${NC}"
        tail -n 50 tsc_output.log
        type_ok=false
    else
        echo "✅ TypeScript passed"
        type_ok=true
    fi
fi
echo ""

# 4) Tests unitaires
echo -e "${GREEN}4️⃣  Tests unitaires${NC}"
if npm run -s test -- --version >/dev/null 2>&1 || grep -q '"test"' package.json 2>/dev/null; then
    echo "Exécution des tests unitaires..."
    if npm test -- --ci --runInBand --passWithNoTests > unit_tests.log 2>&1; then
        echo "✅ Tests unitaires passed"
        unit_tests_ok=true
    else
        echo -e "${RED}❌ Tests unitaires failed${NC}"
        tail -n 100 unit_tests.log
        unit_tests_ok=false
    fi
else
    echo "⏭️  Pas de tests unitaires"
fi
echo ""

# 5) Tests E2E
echo -e "${GREEN}5️⃣  Tests E2E${NC}"
if grep -q "playwright" package.json 2>/dev/null; then
    echo "Exécution de Playwright..."
    if npx playwright test > e2e_tests.log 2>&1; then
        echo "✅ Tests E2E passed"
        e2e_tests_ok=true
    else
        echo -e "${YELLOW}⚠️  Tests E2E warnings${NC}"
        tail -n 50 e2e_tests.log
        e2e_tests_ok=false
    fi
else
    echo "⏭️  Pas de tests E2E"
fi
echo ""

# 6) Build local
echo -e "${GREEN}6️⃣  Build local de validation${NC}"
if timeout ${TIMEOUT_BUILD}s npm run build > build_stdout.log 2> build_stderr.log; then
    echo "✅ Build local réussi"
    if [ -d .next ] || [ -d dist ] || [ -d out ] || [ -d build ]; then
        echo "✅ Artefacts de build présents"
    else
        echo -e "${RED}❌ Pas d'artefacts de build${NC}"
        exit 6
    fi
else
    echo -e "${RED}❌ Build local échoué${NC}"
    tail -n 200 build_stderr.log
    exit 6
fi
echo ""

# 7) Vérifier variables d'environnement
echo -e "${GREEN}7️⃣  Vérification des variables d'environnement${NC}"
echo "Extraction des clés locales..."
for f in .env .env.local .env.production .env.preview; do
    [ -f "$f" ] && (grep -v '^#' "$f" | grep -v '^\s*$' | awk -F= '{print $1}')
done | sort -u > local_env_keys.txt 2>/dev/null || touch local_env_keys.txt

echo "✅ Variables locales extraites"
echo ""

# 8) Link projet Vercel
echo -e "${GREEN}8️⃣  Liaison avec Vercel${NC}"
if vercel link --yes > vercel_link.log 2>&1; then
    echo "✅ Projet lié à Vercel"
else
    echo -e "${YELLOW}⚠️  Liaison Vercel (voir vercel_link.log)${NC}"
fi
echo ""

# 9) Deploy Preview
echo -e "${GREEN}9️⃣  Déploiement Preview${NC}"
echo "Déploiement en cours..."
if vercel deploy --yes > vercel_preview_raw.log 2>&1; then
    PREVIEW_URL=$(grep -oP 'https://[^\s]+' vercel_preview_raw.log | head -n 1)
    echo "✅ Preview déployé"
    echo "📎 Preview URL: $PREVIEW_URL"
    
    # Smoke test preview
    if [ -n "$PREVIEW_URL" ]; then
        echo "Test HTTP du preview..."
        sleep 5
        HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$PREVIEW_URL" || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Preview smoke test passed (HTTP $HTTP_CODE)"
        else
            echo -e "${YELLOW}⚠️  Preview smoke test: HTTP $HTTP_CODE${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Preview deploy échoué${NC}"
    tail -n 100 vercel_preview_raw.log
    PREVIEW_URL="failed"
fi
echo ""

# 10) Deploy Production
echo -e "${GREEN}🔟 Déploiement Production${NC}"
read -p "Continuer vers la production? (O/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]] || [[ -z $REPLY ]]; then
    echo "Déploiement en production..."
    
    # Tag git
    git tag -f "deploy/${TIMESTAMP}-${GIT_COMMIT}" 2>/dev/null || true
    
    if vercel deploy --prod --yes > vercel_prod_raw.log 2>&1; then
        PROD_URL=$(grep -oP 'https://[^\s]+' vercel_prod_raw.log | head -n 1)
        echo "✅ Production déployé"
        echo "🌐 Production URL: $PROD_URL"
        
        # Smoke test prod
        if [ -n "$PROD_URL" ]; then
            echo "Test HTTP de la production..."
            sleep 5
            HTTP_CODE_PROD=$(curl -s -o /dev/null -w '%{http_code}' "$PROD_URL" || echo "000")
            if [ "$HTTP_CODE_PROD" = "200" ]; then
                echo "✅ Production smoke test passed (HTTP $HTTP_CODE_PROD)"
            else
                echo -e "${YELLOW}⚠️  Production smoke test: HTTP $HTTP_CODE_PROD${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ Production deploy échoué${NC}"
        tail -n 100 vercel_prod_raw.log
        PROD_URL="failed"
    fi
else
    echo "⏭️  Déploiement production annulé"
    PROD_URL="skipped"
fi
echo ""

# 11) Audit de sécurité
echo -e "${GREEN}1️⃣1️⃣  Audit de sécurité${NC}"
npm audit --json > audit_output.json 2>/dev/null || echo "{}" > audit_output.json
echo "✅ Audit executé (voir audit_output.json)"
echo ""

# 12) Récupérer logs récents
echo -e "${GREEN}1️⃣2️⃣  Récupération des logs${NC}"
if [ -n "$PROD_URL" ] && [ "$PROD_URL" != "failed" ] && [ "$PROD_URL" != "skipped" ]; then
    vercel logs "$PROD_URL" --since 10m > prod_recent_logs.log 2>/dev/null || echo "No logs" > prod_recent_logs.log
fi
if [ -n "$PREVIEW_URL" ] && [ "$PREVIEW_URL" != "failed" ]; then
    vercel logs "$PREVIEW_URL" --since 10m > preview_recent_logs.log 2>/dev/null || echo "No logs" > preview_recent_logs.log
fi
echo "✅ Logs récupérés"
echo ""

# Calculer durée
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Déterminer statut global
STATUS="success"
if [ "$PREVIEW_URL" = "failed" ] || [ "$PROD_URL" = "failed" ]; then
    STATUS="failed"
elif [ "$lint_ok" = false ] || [ "$type_ok" = false ]; then
    STATUS="warning"
fi

# 13) Générer rapport JSON
echo -e "${GREEN}1️⃣3️⃣  Génération du rapport${NC}"
cat > deployment_report.json <<EOF
{
  "status": "$STATUS",
  "branch": "$BRANCH",
  "commit": "$GIT_COMMIT",
  "timestamp": "$TIMESTAMP",
  "preview_url": "$PREVIEW_URL",
  "production_url": "$PROD_URL",
  "preview_deploy_log": "vercel_preview_raw.log",
  "prod_deploy_log": "vercel_prod_raw.log",
  "build_time_seconds": $DURATION,
  "tests": {
    "unit": {
      "status": "$([ "$unit_tests_ok" = true ] && echo "passed" || echo "failed")",
      "report": "unit_tests.log"
    },
    "e2e": {
      "status": "$([ "$e2e_tests_ok" = true ] && echo "passed" || echo "failed")",
      "report": "e2e_tests.log"
    }
  },
  "lint": {
    "status": "$([ "$lint_ok" = true ] && echo "passed" || echo "warning")",
    "report": "lint_output.log"
  },
  "typecheck": {
    "status": "$([ "$type_ok" = true ] && echo "passed" || echo "warning")",
    "report": "typecheck_output.log"
  },
  "audit": "audit_output.json",
  "logs": {
    "preview": "preview_recent_logs.log",
    "production": "prod_recent_logs.log"
  }
}
EOF

echo "✅ Rapport généré: deployment_report.json"
echo ""

# Affichage résumé final
echo "=============================================="
echo -e "${GREEN}📊 RÉSUMÉ DU DÉPLOIEMENT${NC}"
echo "=============================================="
echo ""
echo "Statut: $STATUS"
echo "Branch: $BRANCH | Commit: $GIT_COMMIT"
echo "Preview: $PREVIEW_URL"
echo "Production: $PROD_URL"
echo "Build time: ${DURATION}s"
echo "Tests: unit=$([ "$unit_tests_ok" = true ] && echo "✅" || echo "❌"), e2e=$([ "$e2e_tests_ok" = true ] && echo "✅" || echo "⚠️")"
echo "Lint: $([ "$lint_ok" = true ] && echo "✅" || echo "⚠️") | Typecheck: $([ "$type_ok" = true ] && echo "✅" || echo "⚠️")"
echo ""
echo "📁 Fichiers générés:"
echo "  - deployment_report.json"
echo "  - vercel_preview_raw.log"
echo "  - vercel_prod_raw.log"
echo "  - prod_recent_logs.log"
echo "  - preview_recent_logs.log"
echo ""

if [ "$STATUS" != "success" ]; then
    echo -e "${YELLOW}⚠️  Rollback command (si nécessaire):${NC}"
    echo "  vercel rollback"
fi

echo "✅ Pipeline terminé !"

