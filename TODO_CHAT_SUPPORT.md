# 📋 TODO LIST - Chat Support Créalia

## 🎯 Objectif Initial
**Corriger, tester et déployer le système de chat support afin qu'il fonctionne à 100%**

---

## ✅ CE QUI EST DÉJÀ FAIT

### 1. Diagnostic et Corrections (TERMINÉ ✅)
- ✅ Problème identifié : Modèles Prisma manquants (ChatSession, ChatMessage)
- ✅ Ajout des 3 modèles dans `backend/prisma/schema.prisma`
- ✅ Création du module de sanitation (`lib/security/sanitizer.ts`)
- ✅ Ajout du rate limiting sur les routes API chat
- ✅ Mise à jour du composant chat avec polling automatique (2s)
- ✅ Mode MOCK activé (fonctionne sans clé OpenAI)

### 2. Build et Tests Locaux (TERMINÉ ✅)
- ✅ Build réussi : `npm run build` → 0 erreurs
- ✅ Client Prisma généré avec succès
- ✅ Aucune erreur TypeScript
- ✅ Aucune erreur de linter

### 3. Déploiement Git (TERMINÉ ✅)
- ✅ 3 commits créés et poussés sur GitHub :
  - `96b337d` : Corrections principales
  - `1f4f6c7` : Documentation
  - `0f2e3ee` : Guide de démarrage
- ✅ Vercel déclenché automatiquement

### 4. Documentation (TERMINÉ ✅)
- ✅ 5 guides créés (README_CHAT_SUPPORT.md, etc.)
- ✅ Migration SQL préparée

---

## 🚧 CE QUI RESTE À FAIRE

### ⏳ ÉTAPE 1 : Appliquer la Migration Base de Données (EN COURS)

**Problème actuel** : Les tables `chat_sessions`, `chat_messages` et `user_usage_stats` n'existent pas dans Supabase.

#### Option A : Via Supabase SQL Editor (RECOMMANDÉ - Plus Simple)

**[ ] 1.1 Vérifier si la table `users` existe**

1. Allez sur https://supabase.com
2. Sélectionnez votre projet Créalia
3. Cliquez sur **SQL Editor** (menu gauche)
4. Cliquez sur **New Query**
5. Copiez-collez ce code :
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
   ```
6. Cliquez sur **RUN** (ou Ctrl+Enter)
7. **Notez le résultat** : Voyez-vous `users` dans la liste ?

**[ ] 1.2a Si `users` EXISTE dans la liste** → Exécutez ce code :

```sql
-- Créer l'enum
DO $$ BEGIN
    CREATE TYPE "ChatMessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Créer les tables
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

CREATE TABLE IF NOT EXISTS "chat_messages" (
    "id" TEXT NOT NULL,
    "chatSessionId" TEXT NOT NULL,
    "role" "ChatMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

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

-- Index
CREATE UNIQUE INDEX IF NOT EXISTS "chat_sessions_sessionToken_key" ON "chat_sessions"("sessionToken");
CREATE INDEX IF NOT EXISTS "chat_sessions_userId_idx" ON "chat_sessions"("userId");
CREATE INDEX IF NOT EXISTS "chat_messages_chatSessionId_idx" ON "chat_messages"("chatSessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_usage_stats_userId_key" ON "user_usage_stats"("userId");

-- Foreign Keys
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

**Résultat attendu** : "Success. No rows returned"

**[ ] 1.2b Si `users` N'EXISTE PAS** → Dites-moi et je fournirai le script complet

**[ ] 1.3 Vérifier que les tables sont créées**

Exécutez dans SQL Editor :
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'chat%';
```

**Résultat attendu** :
- `chat_sessions`
- `chat_messages`

---

### ⏳ ÉTAPE 2 : Vérifier les Variables d'Environnement Vercel

**[ ] 2.1 Aller dans Vercel**
1. https://vercel.com
2. Sélectionnez votre projet Créalia
3. Cliquez sur **Settings** → **Environment Variables**

**[ ] 2.2 Vérifier/Ajouter ces variables (TOUTES les environnements : Production, Preview, Development)**

```
✅ DATABASE_URL             → Votre URL Supabase PostgreSQL
✅ NEXTAUTH_URL             → https://crealia.app
✅ NEXTAUTH_SECRET          → Votre secret (32 caractères min)
✅ NEXT_PUBLIC_APP_URL      → https://crealia.app
✅ CHAT_MOCK_MODE           → true (pour tester sans OpenAI)
```

**[ ] 2.3 Si manquant : Ajouter `CHAT_MOCK_MODE`**
- Nom : `CHAT_MOCK_MODE`
- Valeur : `true`
- Environnements : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

**[ ] 2.4 Si vous avez changé des variables**
- Allez dans **Deployments**
- Cliquez sur les 3 points du dernier déploiement
- Cliquez sur **Redeploy**

---

### ⏳ ÉTAPE 3 : Vérifier le Déploiement Vercel

**[ ] 3.1 Vérifier le status du déploiement**
1. Vercel → Votre projet → **Deployments**
2. Le dernier déploiement devrait être **Ready** ✅
3. Si **Building** ⏳ → Attendez quelques minutes
4. Si **Error** ❌ → Cliquez dessus pour voir les logs

**[ ] 3.2 Si erreur de build**
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez les logs dans **Function Logs**
- Si erreur Prisma → Re-déployez

---

### ⏳ ÉTAPE 4 : Tester en Production

**[ ] 4.1 Test API - Création de session**

Ouvrez votre terminal et exécutez :
```bash
curl -X POST https://crealia.app/api/chat/create-session \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Résultat attendu** (JSON) :
```json
{
  "sessionId": "clxxx...",
  "message": {
    "id": "clyyy...",
    "role": "ASSISTANT",
    "content": "Bonjour ! 👋 Je suis l'assistant IA de Créalia..."
  }
}
```

**Si erreur** :
- Vérifiez que la migration SQL est appliquée (Étape 1)
- Vérifiez les logs Vercel

**[ ] 4.2 Test API - Envoi de message**

Remplacez `SESSION_ID` par l'ID reçu à l'étape 4.1 :
```bash
curl -X POST https://crealia.app/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"SESSION_ID","message":"Bonjour"}'
```

**Résultat attendu** : Une réponse de l'assistant

**[ ] 4.3 Test Interface Web**

1. Ouvrez https://crealia.app/support/chat
2. ✅ Page charge sans erreur
3. ✅ Message de bienvenue apparaît (~2 secondes)
4. ✅ Tapez "Test" et envoyez
5. ✅ Réponse apparaît en <2 secondes
6. ✅ Envoyez un autre message → Réponse arrive
7. ✅ Ouvrez la console (F12) → Aucune erreur rouge

**[ ] 4.4 Test du Polling (temps réel)**

1. Restez sur `/support/chat`
2. Attendez 2 secondes
3. Dans la console, vous devriez voir des requêtes vers `/api/chat/history` toutes les 2 secondes
4. C'est normal ✅

**[ ] 4.5 Test du Rate Limiting**

1. Envoyez 10 messages rapidement
2. Le 11ème devrait afficher "Rate limit exceeded"
3. Attendez 1 minute
4. Vous pouvez renvoyer des messages ✅

---

### ⏳ ÉTAPE 5 : Validation Finale

**[ ] 5.1 Checklist de validation**

- [ ] Vercel déploiement = Ready ✅
- [ ] Variables d'environnement configurées
- [ ] Migration SQL appliquée (tables créées)
- [ ] `/api/chat/create-session` fonctionne (200 OK)
- [ ] `/api/chat/message` fonctionne (200 OK)
- [ ] Page `/support/chat` s'ouvre correctement
- [ ] Message de bienvenue s'affiche
- [ ] Messages envoyés reçoivent une réponse
- [ ] Polling fonctionne (mise à jour toutes les 2s)
- [ ] Aucune erreur dans les logs Vercel
- [ ] Aucune erreur dans la console browser

**[ ] 5.2 Si TOUT fonctionne** ✅

🎉 **FÉLICITATIONS ! Le chat support est 100% fonctionnel !**

---

## 🆘 EN CAS DE PROBLÈME

### ❌ Erreur : "ChatSession is not defined"
**Solution** : Re-déployez sur Vercel pour régénérer le client Prisma

### ❌ Erreur : "relation chat_sessions does not exist"
**Solution** : La migration SQL n'est pas appliquée → Refaites l'Étape 1

### ❌ Erreur : "Rate limit exceeded" dès le 1er message
**Solution** : Attendez 1 minute, c'est un cache rate limit

### ❌ Erreur : "OpenAI API error"
**Solution** : Vérifiez que `CHAT_MOCK_MODE=true` dans Vercel

### ❌ Chat ne répond pas
**Solution** :
1. Vérifiez les logs Vercel (Deployments → Functions)
2. Vérifiez que `DATABASE_URL` est correcte
3. Testez les API en direct (étape 4.1)

---

## 📊 RÉSUMÉ

**Statut Global** : 80% Complété ✅

✅ Code corrigé et sécurisé
✅ Build réussi
✅ Déployé sur GitHub/Vercel
⏳ Migration BDD en attente
⏳ Tests production en attente

**Temps estimé pour finir** : 10-15 minutes

**Prochaine action immédiate** : **ÉTAPE 1** (Migration SQL)

---

**Dernière mise à jour** : Octobre 2025
**Fichiers importants** :
- Ce fichier (TODO)
- `README_CHAT_SUPPORT.md` (Guide complet)
- `MIGRATION_GUIDE.md` (Guide migration détaillé)

