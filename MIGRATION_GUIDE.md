# 🗄️ Guide de Migration Base de Données

## ⚠️ Problème Actuel

Votre base Supabase n'a pas toutes les migrations appliquées, notamment la table `users`.

## ✅ Solution Complète

### **Option 1 : Via Prisma (Automatique - Recommandé)**

#### **1. Créez `.env.production`** avec votre vraie DATABASE_URL Supabase

```env
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

> **Comment obtenir cette URL ?**
> 1. https://supabase.com → Votre projet
> 2. Settings → Database
> 3. Connection string → URI
> 4. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

#### **2. Appliquez TOUTES les migrations**

```bash
# Charger les variables d'environnement
export $(cat .env.production | grep DATABASE_URL | xargs)

# Appliquer toutes les migrations
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
```

✅ **Cela créera automatiquement toutes les tables nécessaires !**

---

### **Option 2 : Via SQL Direct (Manuel)**

Si Option 1 ne fonctionne pas, créez les tables manuellement dans Supabase SQL Editor.

#### **Étape 1 : Vérifier les tables existantes**

Dans Supabase SQL Editor, exécutez :
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

#### **Étape 2 : Si la table `users` existe**

Copiez et exécutez uniquement le code pour les tables chat :

```sql
-- CreateEnum
CREATE TYPE "ChatMessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "context" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "chatSessionId" TEXT NOT NULL,
    "role" "ChatMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_usage_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aiGenerationsCount" INTEGER NOT NULL DEFAULT 0,
    "studioJobsCount" INTEGER NOT NULL DEFAULT 0,
    "chatMessagesCount" INTEGER NOT NULL DEFAULT 0,
    "exportMinutesUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "voiceoverMinutesUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imagesGenerated" INTEGER NOT NULL DEFAULT 0,
    "lastResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_usage_stats_pkey" PRIMARY KEY ("id")
);

-- Index
CREATE UNIQUE INDEX "chat_sessions_sessionToken_key" ON "chat_sessions"("sessionToken");
CREATE INDEX "chat_sessions_userId_idx" ON "chat_sessions"("userId");
CREATE INDEX "chat_messages_chatSessionId_idx" ON "chat_messages"("chatSessionId");
CREATE UNIQUE INDEX "user_usage_stats_userId_key" ON "user_usage_stats"("userId");

-- Foreign Keys
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chatSessionId_fkey" 
    FOREIGN KEY ("chatSessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_usage_stats" ADD CONSTRAINT "user_usage_stats_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### **Étape 3 : Si la table `users` N'EXISTE PAS**

Vous devez d'abord créer le schéma complet. Contactez-moi pour le script complet.

---

## 🧪 Vérification

Après migration, vérifiez dans Supabase SQL Editor :

```sql
-- Vérifier les tables créées
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'chat%';

-- Devrait retourner :
-- chat_sessions
-- chat_messages
```

---

## 🆘 Dépannage

### ❌ "relation users does not exist"
→ La table users n'existe pas. Utilisez **Option 1** pour créer toutes les tables.

### ❌ "already exists"
→ Les tables existent déjà, c'est bon ! Passez au test.

### ❌ "syntax error"
→ Vérifiez que vous avez copié le code SQL complet, pas le chemin du fichier.

---

## ✅ Après Migration Réussie

Testez votre chat :
```bash
curl -X POST https://crealia.app/api/chat/create-session
```

Ou ouvrez : https://crealia.app/support/chat

