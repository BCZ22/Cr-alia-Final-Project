#!/bin/bash

# =============================================================================
# SCRIPT DE LANCEMENT DES TESTS E2E
# =============================================================================

echo "🚀 Démarrage des tests E2E - Flux Complet Crealia"
echo "=================================================="

# Vérifier que les dépendances sont installées
if ! command -v npx &> /dev/null; then
    echo "❌ npx n'est pas installé"
    exit 1
fi

# Vérifier que Playwright est installé
if ! npx playwright --version &> /dev/null; then
    echo "📦 Installation de Playwright..."
    npx playwright install
fi

# Démarrer le serveur de développement en arrière-plan
echo "🔧 Démarrage du serveur de développement..."
npm run dev &
SERVER_PID=$!

# Attendre que le serveur soit prêt
echo "⏳ Attente du démarrage du serveur..."
sleep 10

# Vérifier que le serveur répond
if ! curl -f http://localhost:3000/api/v1 &> /dev/null; then
    echo "❌ Le serveur n'est pas accessible sur http://localhost:3000"
    kill $SERVER_PID
    exit 1
fi

echo "✅ Serveur démarré avec succès"

# Exécuter les tests E2E
echo "🧪 Exécution des tests E2E..."
npx playwright test tests/e2e/content-generation-flow.spec.ts --headed

# Capturer le code de sortie des tests
TEST_EXIT_CODE=$?

# Arrêter le serveur
echo "🛑 Arrêt du serveur..."
kill $SERVER_PID

# Générer le rapport
echo "📊 Génération du rapport..."
npx playwright show-report

# Afficher le résultat
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Tous les tests E2E ont réussi !"
else
    echo "❌ Certains tests E2E ont échoué"
fi

exit $TEST_EXIT_CODE


