# 🔧 Configuration Google Analytics 4 - Variables d'environnement

## 📋 Variables requises

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# ========================================
# GOOGLE ANALYTICS 4 API CONFIGURATION
# ========================================

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration (pour les redirections OAuth2)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OpenAI (pour les insights IA)
OPENAI_API_KEY=your_openai_api_key_here

# ========================================
# EXISTING VARIABLES (gardez celles-ci)
# ========================================

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Stripe (pour les paiements)
STRIPE_SECRET_KEY=your_stripe_secret_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Redis (pour le cache)
REDIS_URL=redis://localhost:6379

# Autres APIs existantes...
```

## 🚀 Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez les APIs suivantes :
   - **Google Analytics Data API v1**
   - **Google Analytics Admin API v1beta**

### 2. Configurer OAuth2

Dans votre projet Google Cloud :

1. **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
2. **Application type** : Web application
3. **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/ga4/auth
   https://votre-domaine.com/api/ga4/auth
   ```
4. **Scopes requis** :
   ```
   https://www.googleapis.com/auth/analytics.readonly
   https://www.googleapis.com/auth/analytics.manage.users.readonly
   ```

### 3. Obtenir les clés

Après création des credentials, vous obtiendrez :
- **Client ID** : Copiez dans `GOOGLE_CLIENT_ID`
- **Client Secret** : Copiez dans `GOOGLE_CLIENT_SECRET`

### 4. Test de configuration

```bash
# Vérifier que les variables sont chargées
npm run dev

# Tester l'authentification
curl http://localhost:3000/api/ga4/auth
```

## 🔒 Sécurité

### Variables sensibles
- `GOOGLE_CLIENT_SECRET` : Ne jamais commiter dans Git
- `NEXTAUTH_SECRET` : Utilisez une chaîne aléatoire forte
- `OPENAI_API_KEY` : Gardez votre clé OpenAI secrète
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
1. Allez sur `http://localhost:3000/analytics`
2. Cliquez sur "Se connecter à Google Analytics"
3. Autorisez l'application
4. Vérifiez la redirection vers `/analytics?success=connected`

### 3. Test des propriétés
```bash
# Vérifier que les propriétés sont chargées
curl "http://localhost:3000/api/ga4/properties?userId=1"
```

### 4. Test de génération de rapport
```bash
# Générer un rapport de test
curl -X POST "http://localhost:3000/api/ga4/reports?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "your_property_id",
    "dateRange": {
      "startDate": "7daysAgo",
      "endDate": "today"
    },
    "metrics": ["totalUsers", "sessions"],
    "dimensions": ["date"],
    "reportType": "traffic"
  }'
```

## 🚨 Dépannage

### Erreurs courantes

**1. "Invalid client_id"**
- Vérifiez que `GOOGLE_CLIENT_ID` est correct
- Assurez-vous que l'API est activée dans Google Cloud

**2. "Invalid redirect_uri"**
- Vérifiez que l'URL de redirection est exactement la même
- Incluez le protocole (http/https)

**3. "Token expired"**
- Le système gère automatiquement le refresh
- Vérifiez les logs pour plus de détails

**4. "No properties found"**
- Vérifiez que l'utilisateur a accès à des propriétés GA4
- Assurez-vous que les scopes sont corrects

### Logs utiles

```bash
# Voir les logs de l'application
npm run dev

# Vérifier la base de données
npx prisma studio

# Tester les APIs
curl -v http://localhost:3000/api/ga4/properties?userId=1
```

## 📚 Ressources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Guide OAuth2 Google](https://developers.google.com/identity/protocols/oauth2)
- [Métriques GA4](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics)

## ✅ Checklist de configuration

- [ ] Projet Google Cloud créé
- [ ] APIs Google Analytics activées
- [ ] OAuth2 configuré avec les bonnes URLs
- [ ] Variables d'environnement ajoutées
- [ ] Base de données migrée
- [ ] Authentification testée
- [ ] Génération de rapports testée
- [ ] Insights IA testés

Une fois cette checklist complétée, l'intégration GA4 est prête pour la production ! 🚀 