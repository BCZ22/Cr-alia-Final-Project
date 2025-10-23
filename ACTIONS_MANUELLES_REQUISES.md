# 🎯 Actions Manuelles Requises - Chat Support Créalia

## ✅ CE QUI EST AUTOMATISÉ (100%)

Tout le code est prêt et déployé sur GitHub/Vercel :
- ✅ Modèles Prisma créés
- ✅ Routes API sécurisées (rate limiting + sanitation)
- ✅ Composant chat avec polling automatique
- ✅ Scripts d'automatisation créés
- ✅ Build réussi localement
- ✅ Documentation complète

---

## 🚧 CE QUI NÉCESSITE VOTRE ACTION (3 étapes - 10 minutes)

### 📋 ÉTAPE 1 : Migration Base de Données Supabase (5 min) ⚠️ CRITIQUE

**Pourquoi ?** Les tables `chat_sessions`, `chat_messages` et `user_usage_stats` doivent être créées.

**Comment faire ?**

#### Option A : Via Supabase SQL Editor (RECOMMANDÉ)

1. **Ouvrez** https://supabase.com
2. **Sélectionnez** votre projet Créalia
3. **Cliquez** sur **SQL Editor** (menu gauche)
4. **Cliquez** sur **New Query**
5. **Copiez-collez** CE CODE COMPLET :

```sql
-- Créer l'enum pour les rôles de messages
DO $$ BEGIN
    CREATE TYPE "ChatMessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table des sessions de chat
CREATE TABLE IF NOT EXISTS "chat_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "context" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- Table des messages de chat
CREATE TABLE IF NOT EXISTS "chat_messages" (
    "id" TEXT NOT NULL,
    "chatSessionId" TEXT NOT NULL,
    "role" "ChatMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- Table des statistiques d'utilisation
CREATE TABLE IF NOT EXISTS "user_usage_stats" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_usage_stats_pkey" PRIMARY KEY ("id")
);

-- Créer les index
CREATE UNIQUE INDEX IF NOT EXISTS "chat_sessions_sessionToken_key" ON "chat_sessions"("sessionToken");
CREATE INDEX IF NOT EXISTS "chat_sessions_userId_idx" ON "chat_sessions"("userId");
CREATE INDEX IF NOT EXISTS "chat_messages_chatSessionId_idx" ON "chat_messages"("chatSessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_usage_stats_userId_key" ON "user_usage_stats"("userId");

-- Ajouter les contraintes de clés étrangères
DO $$ BEGIN
    ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chatSessionId_fkey" 
        FOREIGN KEY ("chatSessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "user_usage_stats" ADD CONSTRAINT "user_usage_stats_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
```

6. **Cliquez** sur **RUN** (bouton vert ou Ctrl+Enter)
7. **Vérifiez** : Vous devriez voir "Success. No rows returned" ✅

#### Option B : Via Terminal (si vous préférez)

```bash
# 1. Récupérez votre DATABASE_URL depuis Supabase
# Settings → Database → Connection string (URI)

# 2. Exportez-la
export DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# 3. Lancez le script
./scripts/migrate-supabase.sh
```

---

### 📋 ÉTAPE 2 : Vérifier Variables Vercel (2 min)

**Pourquoi ?** Le chat a besoin de `CHAT_MOCK_MODE` pour fonctionner en mode test.

**Comment faire ?**

1. **Ouvrez** https://vercel.com
2. **Sélectionnez** votre projet Créalia
3. **Cliquez** sur **Settings** → **Environment Variables**
4. **Vérifiez** que ces variables existent :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `DATABASE_URL` | Votre URL Supabase | ✅ Tous |
| `NEXTAUTH_URL` | https://crealia.app | ✅ Tous |
| `NEXTAUTH_SECRET` | Votre secret | ✅ Tous |
| `NEXT_PUBLIC_APP_URL` | https://crealia.app | ✅ Tous |
| `CHAT_MOCK_MODE` | `true` | ✅ Tous |

5. **Si `CHAT_MOCK_MODE` manque** :
   - Cliquez sur **Add New**
   - Name : `CHAT_MOCK_MODE`
   - Value : `true`
   - ✅ Production ✅ Preview ✅ Development
   - Cliquez sur **Save**

6. **Si vous avez ajouté/modifié des variables** :
   - Allez dans **Deployments**
   - Cliquez sur les 3 points du dernier déploiement
   - Cliquez sur **Redeploy** → **Use existing Build Cache**

---

### 📋 ÉTAPE 3 : Tester le Chat en Production (3 min)

**Comment faire ?**

#### Test 1 : Via l'Interface Web

1. **Ouvrez** https://crealia.app/support/chat
2. **Attendez** 2-3 secondes
3. **Vérifiez** : Vous voyez un message de bienvenue ?
   - ✅ OUI → Tapez "Bonjour" et envoyez
   - ❌ NON → Voir "Dépannage" ci-dessous
4. **Attendez** 1-2 secondes
5. **Vérifiez** : Vous recevez une réponse ?
   - ✅ OUI → **SUCCÈS ! Le chat fonctionne !** 🎉
   - ❌ NON → Voir "Dépannage" ci-dessous

#### Test 2 : Via Terminal (Optionnel)

```bash
# Test de création de session
curl -X POST https://crealia.app/api/chat/create-session \
  -H "Content-Type: application/json" \
  -d '{}'

# Résultat attendu : JSON avec sessionId et message
```

#### Test 3 : Script Automatique (Optionnel)

```bash
./scripts/verify-deployment.sh
```

---

## 🆘 DÉPANNAGE

### ❌ Erreur : "relation chat_sessions does not exist"

**Cause** : L'Étape 1 (migration SQL) n'a pas été faite ou a échoué

**Solution** : Refaites l'Étape 1 complètement

**Vérification** : Dans Supabase SQL Editor, exécutez :
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'chat%';
```

Vous devriez voir :
- `chat_sessions`
- `chat_messages`

### ❌ Le chat ne répond pas / Pas de message de bienvenue

**Causes possibles** :
1. Migration SQL non appliquée → Refaites Étape 1
2. Variables Vercel manquantes → Vérifiez Étape 2
3. Build Vercel en erreur → Vérifiez logs Vercel

**Solution** :
1. Ouvrez la console browser (F12)
2. Regardez l'onglet **Network**
3. Cherchez la requête vers `/api/chat/create-session`
4. Si erreur 500 → Vérifiez logs Vercel
5. Si aucune requête → Vérifiez la console pour erreurs JS

### ❌ "ChatSession is not defined" (erreur Prisma)

**Cause** : Le client Prisma n'est pas régénéré sur Vercel

**Solution** :
1. Allez dans Vercel → Deployments
2. Cliquez sur **Redeploy** (sans cache)
3. Attendez la fin du build
4. Retestez

---

## ✅ CHECKLIST FINALE

Cochez au fur et à mesure :

- [ ] Étape 1 : Migration SQL exécutée dans Supabase ✅
- [ ] Tables `chat_sessions` et `chat_messages` existent ✅
- [ ] Étape 2 : Variable `CHAT_MOCK_MODE=true` dans Vercel ✅
- [ ] Étape 3 : Page `/support/chat` s'ouvre ✅
- [ ] Message de bienvenue s'affiche ✅
- [ ] Messages envoyés reçoivent une réponse ✅
- [ ] Aucune erreur dans la console browser ✅

### 🎉 Si tout est coché → **MISSION ACCOMPLIE !**

Le chat support est maintenant **100% fonctionnel** en production ! 🚀

---

## 📊 RÉSUMÉ

**Temps total** : 10-15 minutes
**Étapes automatisées** : 6/6 ✅
**Étapes manuelles** : 3 (simples)

**Progression actuelle** : 90% (il ne reste que les 3 étapes manuelles)

---

## 📞 BESOIN D'AIDE ?

Si un problème persiste :

1. **Vérifiez les logs Vercel** : Deployments → [Latest] → Function Logs
2. **Vérifiez la console browser** : F12 → Console
3. **Testez les endpoints** : `./scripts/test-chat-api.sh`
4. **Relisez le dépannage** ci-dessus

---

**Date** : 23 Octobre 2025  
**Version** : 1.0  
**Status** : 90% Complété - Actions manuelles requises

