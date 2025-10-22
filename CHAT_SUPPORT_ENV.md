# Variables d'Environnement pour le Chat Support

## Variables Requises

Ajoutez ces variables à votre `.env.local` pour le développement et à Vercel pour la production :

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# OpenAI (pour le chat support IA)
OPENAI_API_KEY=sk-your-openai-api-key

# Mode MOCK (pour développement sans clé OpenAI)
CHAT_MOCK_MODE=true

# Supabase (optionnel pour temps réel)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Resend (pour notifications email)
RESEND_API_KEY=re_your_resend_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://crealia.app

# Rate Limiting
RATE_LIMIT_WINDOW=10
RATE_LIMIT_MAX=5
```

## Configuration de Production (Vercel)

1. Connectez-vous à Vercel
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez toutes les variables ci-dessus
5. Important : `CHAT_MOCK_MODE` devrait être `false` en production si vous avez une clé OpenAI valide

## Migration de la Base de Données

Pour appliquer la migration en production (Supabase) :

```bash
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
```

Ou connectez-vous à votre console Supabase SQL Editor et exécutez le script dans `backend/prisma/migrations/migration_script.sql`

## Fonctionnalités du Chat Support

✅ **Rate limiting** : 10 messages par minute par utilisateur
✅ **Sanitation** : Nettoyage automatique des entrées utilisateur
✅ **Polling automatique** : Mise à jour des messages toutes les 2 secondes
✅ **Mode MOCK** : Fonctionne sans clé OpenAI pour le développement
✅ **Persistance** : Tous les messages sont sauvegardés dans PostgreSQL

## Test Local

Pour tester localement sans base de données :

1. Définissez `CHAT_MOCK_MODE=true` dans `.env`
2. Lancez `npm run dev`
3. Visitez `http://localhost:3000/support/chat`
4. Le chat fonctionnera en mode mock avec des réponses simulées

