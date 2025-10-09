# 🔧 Configuration Canva API - Variables d'environnement

## 📋 Variables requises

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# ========================================
# CANVA API CONFIGURATION
# ========================================

# Canva OAuth2 Credentials
CANVA_CLIENT_ID=your_canva_client_id_here
CANVA_CLIENT_SECRET=your_canva_client_secret_here

# NextAuth Configuration (pour les redirections OAuth2)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# ========================================
# EXISTING VARIABLES (gardez celles-ci)
# ========================================

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# OpenAI (pour l'IA)
OPENAI_API_KEY=your_openai_key_here

# Stripe (pour les paiements)
STRIPE_SECRET_KEY=your_stripe_secret_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Redis (pour le cache)
REDIS_URL=redis://localhost:6379

# Autres APIs existantes...
```

## 🚀 Étapes de configuration

### 1. Créer une application Canva

1. Allez sur [Canva Developers](https://www.canva.com/developers/)
2. Connectez-vous à votre compte Canva
3. Cliquez sur "Create App"
4. Remplissez les informations :
   - **App Name** : Crealia Design Generator
   - **Description** : SaaS pour génération automatique de designs
   - **Website URL** : https://votre-domaine.com

### 2. Configurer OAuth2

Dans votre app Canva, configurez :

**Redirect URIs :**
```
http://localhost:3000/api/canva/auth
https://votre-domaine.com/api/canva/auth
```

**Scopes requis :**
```
designs:read
designs:write
templates:read
```

### 3. Obtenir les clés

Après création de l'app, vous obtiendrez :
- **Client ID** : Copiez dans `CANVA_CLIENT_ID`
- **Client Secret** : Copiez dans `CANVA_CLIENT_SECRET`

### 4. Test de configuration

```bash
# Vérifier que les variables sont chargées
npm run dev

# Tester l'authentification
curl http://localhost:3000/api/canva/auth
```

## 🔒 Sécurité

### Variables sensibles
- `CANVA_CLIENT_SECRET` : Ne jamais commiter dans Git
- `NEXTAUTH_SECRET` : Utilisez une chaîne aléatoire forte
- `DATABASE_URL` : En production, utilisez PostgreSQL

### Environnements
```bash
# Développement
.env.local

# Production
.env.production

# Test
.env.test
```

## 🧪 Test de l'intégration

### 1. Démarrage
```bash
npm run dev
```

### 2. Test de l'authentification
1. Allez sur `http://localhost:3000/canva`
2. Cliquez sur "Se connecter à Canva"
3. Autorisez l'application
4. Vérifiez la redirection vers `/canva?success=connected`

### 3. Test des templates
```bash
# Vérifier que les templates sont chargés
curl "http://localhost:3000/api/canva/templates?userId=1"
```

### 4. Test de génération
```bash
# Générer un design de test
curl -X POST "http://localhost:3000/api/canva/generate?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "instagram-post-template-1",
    "variables": {
      "title": "Test Design",
      "subtitle": "Généré automatiquement",
      "hashtags": "#test #canva #crealia"
    },
    "format": "png"
  }'
```

## 🚨 Dépannage

### Erreurs courantes

**1. "Invalid client_id"**
- Vérifiez que `CANVA_CLIENT_ID` est correct
- Assurez-vous que l'app Canva est active

**2. "Invalid redirect_uri"**
- Vérifiez que l'URL de redirection est exactement la même
- Incluez le protocole (http/https)

**3. "Token expired"**
- Le système gère automatiquement le refresh
- Vérifiez les logs pour plus de détails

**4. "Template not found"**
- Exécutez `npm run seed:canva` pour ajouter les templates de test
- Vérifiez que l'utilisateur a une connexion Canva active

### Logs utiles

```bash
# Voir les logs de l'application
npm run dev

# Vérifier la base de données
npx prisma studio

# Tester les APIs
curl -v http://localhost:3000/api/canva/templates?userId=1
```

## 📚 Ressources

- [Documentation Canva API](https://www.canva.com/developers/)
- [Guide OAuth2](https://www.canva.com/developers/docs/oauth/)
- [Variables de design](https://www.canva.com/developers/docs/design-variables/)
- [Templates API](https://www.canva.com/developers/docs/templates/)

## ✅ Checklist de configuration

- [ ] Application Canva créée
- [ ] OAuth2 configuré avec les bonnes URLs
- [ ] Variables d'environnement ajoutées
- [ ] Base de données migrée
- [ ] Templates de test ajoutés
- [ ] Authentification testée
- [ ] Génération de designs testée
- [ ] Téléchargement testé

Une fois cette checklist complétée, l'intégration Canva est prête pour la production ! 🚀 