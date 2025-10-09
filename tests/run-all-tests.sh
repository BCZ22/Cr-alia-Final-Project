#!/bin/bash

# Script pour lancer tous les tests avec couverture
# Usage: ./tests/run-all-tests.sh [options]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
COVERAGE=true
VERBOSE=false
WATCH=false
PATTERN=""

# Fonction d'aide
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Afficher cette aide"
    echo "  -c, --no-coverage   Désactiver la couverture de code"
    echo "  -v, --verbose       Mode verbeux"
    echo "  -w, --watch         Mode watch (relance automatique)"
    echo "  -p, --pattern PAT   Filtrer les tests par pattern"
    echo ""
    echo "Exemples:"
    echo "  $0                    # Tous les tests avec couverture"
    echo "  $0 --no-coverage     # Tous les tests sans couverture"
    echo "  $0 --watch           # Mode watch"
    echo "  $0 --pattern logger  # Tests contenant 'logger'"
}

# Parsing des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--no-coverage)
            COVERAGE=false
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -w|--watch)
            WATCH=true
            shift
            ;;
        -p|--pattern)
            PATTERN="$2"
            shift 2
            ;;
        *)
            echo "Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

# Vérification de l'environnement
echo -e "${BLUE}🔍 Vérification de l'environnement...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

# Vérification des dépendances
echo -e "${BLUE}📦 Vérification des dépendances...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installation des dépendances...${NC}"
    npm install
fi

# Vérification de Jest
if ! npx jest --version &> /dev/null; then
    echo -e "${RED}❌ Jest n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environnement prêt${NC}"

# Construction de la commande Jest
JEST_CMD="npx jest --preset ts-jest"

if [ "$COVERAGE" = true ]; then
    JEST_CMD="$JEST_CMD --coverage"
fi

if [ "$VERBOSE" = true ]; then
    JEST_CMD="$JEST_CMD --verbose"
fi

if [ "$WATCH" = true ]; then
    JEST_CMD="$JEST_CMD --watch"
fi

# Filtrage par pattern
if [ -n "$PATTERN" ]; then
    JEST_CMD="$JEST_CMD --testNamePattern=\"$PATTERN\""
fi

# Affichage de la configuration
echo -e "${BLUE}⚙️  Configuration:${NC}"
echo "  Couverture: $COVERAGE"
echo "  Verbose: $VERBOSE"
echo "  Watch: $WATCH"
if [ -n "$PATTERN" ]; then
    echo "  Pattern: $PATTERN"
fi
echo ""

# Lancement des tests
echo -e "${BLUE}🚀 Lancement des tests...${NC}"
echo "Commande: $JEST_CMD"
echo ""

# Exécution des tests
if [ "$WATCH" = true ]; then
    echo -e "${YELLOW}👀 Mode watch activé - Appuyez sur Ctrl+C pour arrêter${NC}"
    echo ""
fi

eval $JEST_CMD

# Affichage des résultats
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Tous les tests ont réussi !${NC}"
    
    if [ "$COVERAGE" = true ]; then
        echo ""
        echo -e "${BLUE}📊 Rapport de couverture disponible dans:${NC}"
        echo "  - HTML: coverage/lcov-report/index.html"
        echo "  - LCOV: coverage/lcov.info"
        echo "  - Console: voir ci-dessus"
    fi
else
    echo ""
    echo -e "${RED}❌ Certains tests ont échoué${NC}"
    exit 1
fi






