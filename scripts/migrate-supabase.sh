#!/bin/bash

# ============================================================================
# Script de Migration Supabase - Chat Support Créalia
# ============================================================================
# Ce script aide à appliquer les migrations sur Supabase
# ============================================================================

set -e  # Exit on error

echo ""
echo "🗄️  Migration Supabase - Chat Support Créalia"
echo "=============================================="
echo ""

# Vérifier si DATABASE_URL est définie
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL n'est pas définie"
    echo ""
    echo "📋 Instructions:"
    echo "1. Récupérez votre DATABASE_URL depuis Supabase:"
    echo "   - https://supabase.com → Votre projet → Settings → Database"
    echo "   - Copiez la 'Connection string' (URI)"
    echo ""
    echo "2. Exportez-la dans votre terminal:"
    echo "   export DATABASE_URL='postgresql://postgres.xxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'"
    echo ""
    echo "3. Relancez ce script:"
    echo "   ./scripts/migrate-supabase.sh"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL trouvée"
echo ""

# Vérifier si Prisma est installé
if ! command -v npx &> /dev/null; then
    echo "❌ ERROR: npx n'est pas installé"
    echo "Installez Node.js et npm d'abord"
    exit 1
fi

echo "📦 Génération du client Prisma..."
npx prisma generate --schema=./backend/prisma/schema.prisma

echo ""
echo "🚀 Application des migrations..."
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma

echo ""
echo "✅ Migrations appliquées avec succès!"
echo ""
echo "🧪 Vérification des tables créées..."
npx prisma db execute --schema=./backend/prisma/schema.prisma --stdin <<EOF
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'chat%' ORDER BY tablename;
EOF

echo ""
echo "🎉 Migration terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifiez les variables d'environnement Vercel"
echo "2. Testez l'API: https://crealia.app/api/chat/create-session"
echo "3. Testez l'interface: https://crealia.app/support/chat"
echo ""

