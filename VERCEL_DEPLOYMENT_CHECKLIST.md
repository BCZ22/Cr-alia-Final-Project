# ✅ Checklist de Déploiement Vercel - Chat Support Crealia

## 🎯 Status: Code Poussé sur GitHub

✅ Commit créé : `96b337d`
✅ Push réussi sur `origin/main`
✅ Build local réussi (0 erreurs)
✅ Vercel déclenchera automatiquement le build

---

## 📋 Actions à Effectuer sur Vercel

### 1. ⚙️ Variables d'Environnement (CRITIQUE)

Connectez-vous à https://vercel.com et allez dans **Settings → Environment Variables**.

Assurez-vous que ces variables sont **définies** :

#### **Obligatoires**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://crealia.app
NEXTAUTH_SECRET=votre-secret-nextauth-32-chars-minimum
NEXT_PUBLIC_APP_URL=https://crealia.app
```

#### **Pour le Chat Support**
```env
# Option 1: Avec OpenAI (production)
OPENAI_API_KEY=sk-votre-clé-openai

# Option 2: Mode MOCK (test sans OpenAI)
CHAT_MOCK_MODE=true
```

#### **Optionnelles**
```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-clé-anon
RESEND_API_KEY=re_votre_clé_resend
```

### 2. 🗄️ Migration Base de Données

**IMPORTANT** : Les nouveaux modèles doivent être créés dans votre base Supabase.

#### **Option A: Via Prisma CLI (Recommandé)**

Depuis votre machine locale avec la `DATABASE_URL` de production :

```bash
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
```

#### **Option B: Via Supabase SQL Editor**

1. Ouvrez https://supabase.com
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Créez une nouvelle query
5. Copiez le contenu de `backend/prisma/migrations/migration_script.sql`
6. Exécutez la query

#### **Option C: Via Vercel CLI**

Si Prisma est installé dans votre projet Vercel :

```bash
vercel env pull .env.production
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
```

### 3. 🔍 Vérification du Déploiement Vercel

1. Allez sur https://vercel.com/votre-projet
2. Vérifiez l'onglet **Deployments**
3. Le dernier deployment devrait être en cours
4. Attendez que le status passe à **✅ Ready**

#### **Logs à Vérifier**

Dans **Deployments → [Dernier déploiement] → Build Logs** :

✅ `Prisma schema loaded from backend/prisma/schema.prisma`
✅ `Generated Prisma Client`
✅ `Compiled successfully`
✅ Pas d'erreurs TypeScript
✅ Pas d'erreurs de build

### 4. 🧪 Tests Post-Déploiement

Une fois le déploiement **Ready**, testez ces endpoints :

#### **Test 1: Health Check**
```bash
curl https://crealia.app/api/health
# Attendu: {"status":"ok"}
```

#### **Test 2: Création de Session Chat**
```bash
curl -X POST https://crealia.app/api/chat/create-session \
  -H "Content-Type: application/json" \
  -d '{}'
```

Réponse attendue :
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

#### **Test 3: Envoi de Message**
```bash
SESSION_ID="<ID_DE_SESSION>"

curl -X POST https://crealia.app/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"message\":\"Bonjour\"}"
```

#### **Test 4: Récupération d'Historique**
```bash
curl "https://crealia.app/api/chat/history?session_id=$SESSION_ID&limit=10"
```

#### **Test 5: Interface Web**

1. Ouvrez https://crealia.app/support/chat
2. ✅ Page charge sans erreur
3. ✅ Message de bienvenue apparaît
4. ✅ Envoyez un message : "Test"
5. ✅ Réponse apparaît en <2 secondes
6. ✅ Ouvrez la console : aucune erreur

### 5. 📊 Monitoring Post-Déploiement

Dans **Vercel → Deployments → [Production] → Functions** :

Vérifiez les logs en temps réel :
```
/api/chat/create-session  → Succès 200
/api/chat/message         → Succès 200
/api/chat/history         → Succès 200
```

Si erreurs, vérifiez :
- ❌ Erreur 500 → Problème de base de données (migration manquante ?)
- ❌ "ChatSession is not defined" → Client Prisma non généré
- ❌ "connect ECONNREFUSED" → DATABASE_URL incorrecte

---

## 🚨 Dépannage Rapide

### Problème : "Prisma Client not found"

**Solution** :
```bash
# Dans Vercel, déclenchez un re-deploy
vercel --prod
```

Ou ajoutez dans `package.json` :
```json
{
  "scripts": {
    "postinstall": "prisma generate --schema=./backend/prisma/schema.prisma"
  }
}
```

### Problème : "Database migration needed"

**Solution** :
Exécutez manuellement la migration (voir Option A/B/C ci-dessus)

### Problème : "OpenAI API error"

**Solution** :
Activez le mode MOCK dans Vercel :
```env
CHAT_MOCK_MODE=true
```

### Problème : "Rate limit exceeded" en test

**Solution** :
Attendez 1 minute ou augmentez la limite dans `lib/security/rate-limiter.ts`

---

## ✅ Validation Finale

Cochez ces éléments **après déploiement** :

- [ ] Le déploiement Vercel est **Ready**
- [ ] Les variables d'environnement sont configurées
- [ ] La migration de base de données est appliquée
- [ ] `/api/chat/create-session` fonctionne
- [ ] `/api/chat/message` fonctionne
- [ ] `/api/chat/history` fonctionne
- [ ] La page `/support/chat` charge correctement
- [ ] Les messages s'envoient et reçoivent des réponses
- [ ] Le polling fonctionne (messages mis à jour toutes les 2s)
- [ ] Aucune erreur dans les logs Vercel
- [ ] Aucune erreur dans la console browser

---

## 🎉 Succès !

Si tous les tests passent, votre **Chat Support est maintenant 100% fonctionnel en production** ! 🚀

### Prochaines Étapes (Optionnelles)

1. **Activer OpenAI en production** : Remplacez `CHAT_MOCK_MODE=true` par une vraie `OPENAI_API_KEY`
2. **Configurer Supabase Realtime** : Pour du temps réel au lieu du polling
3. **Ajouter des analytics** : Tracker l'utilisation du chat
4. **Créer des dashboard admin** : Voir les conversations support

---

**Date**: $(date)
**Status**: ✅ Prêt pour validation
**Commit**: 96b337d
**Branch**: main

