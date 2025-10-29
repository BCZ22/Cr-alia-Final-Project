# 🔧 CONFIGURATION VERCEL - VARIABLES D'ENVIRONNEMENT

## ⚠️ PROBLÈME ACTUEL
Le build Vercel échoue car il manque des variables d'environnement requises.

## ✅ SOLUTION : Ajouter les variables dans Vercel Dashboard

### 1. Ouvrir Vercel Dashboard
https://vercel.com/dashboard

### 2. Sélectionner votre projet
Cliquez sur "Cr-alia-Final-Project"

### 3. Aller dans Settings > Environment Variables
- Cliquez sur "Settings" (onglet en haut)
- Puis "Environment Variables" dans le menu latéral

### 4. Ajouter ces variables OBLIGATOIRES :

```bash
# STRIPE (requis pour le build)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock_key_for_development
STRIPE_SECRET_KEY=sk_test_mock_key_for_development
STRIPE_WEBHOOK_SECRET=whsec_mock_webhook_secret

# DATABASE (requis)
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase?schema=public

# AI SERVICES (mock pour dev)
OPENAI_API_KEY=sk-mock-key
NEXT_PUBLIC_MOCK_AI=true
MOCK=true

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CONTACT
CONTACT_EMAIL_TO=dev@crealia.app
```

### 5. Pour chaque variable :
- Cliquez sur "Add New"
- Name : (nom de la variable, ex: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
- Value : (la valeur)
- Environments : Cochez "Production", "Preview", "Development"
- Cliquez "Save"

### 6. Redéployer
Une fois toutes les variables ajoutées :
- Allez dans l'onglet "Deployments"
- Cliquez sur le dernier déploiement échoué
- Cliquez sur "Redeploy" (3 points en haut à droite)

---

## 🚀 ALTERNATIVE RAPIDE (Script)

Si vous avez Vercel CLI installé :

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add DATABASE_URL production
# ... etc pour chaque variable

# Redéployer
vercel --prod
```

---

## 📝 NOTES IMPORTANTES

### Variables NEXT_PUBLIC_*
- Ces variables sont exposées au client (navigateur)
- N'y mettez PAS de secrets sensibles
- Seulement les clés publiques (comme Stripe publishable key)

### Variables Sensibles
- DATABASE_URL
- STRIPE_SECRET_KEY
- JWT_SECRET
→ Ces variables restent côté serveur, jamais exposées au client

### Mock Mode
- MOCK=true et NEXT_PUBLIC_MOCK_AI=true
- Permettent de tester sans vraies API keys
- À désactiver en production avec vraies keys

---

## ✅ VÉRIFICATION

Après avoir ajouté les variables :
1. Le build Vercel devrait passer ✅
2. Durée : ~2-5 minutes
3. Vous recevrez un email "Deployment Ready"
4. Testez : https://votre-site.vercel.app/analytics

---

**Créé le** : 2025-10-28
**Status** : Variables requises listées ci-dessus
