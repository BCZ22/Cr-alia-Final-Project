# 🔧 Configuration des Variables d'Environnement - Creati

## 📋 **Variables d'Environnement Requises**

### 🗄️ **Base de Données**
```env
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/video_ai_saas"
```

### 🤖 **IA & LangChain**
```env
# OpenAI
OPENAI_API_KEY="sk-votre-cle-api-openai"
OPENAI_MODEL="gpt-4o-mini"
OPENAI_MAX_TOKENS=4000

# LangChain
LANGCHAIN_API_KEY="votre-cle-langchain"
LANGCHAIN_TRACING_V2=true
```

### 🌐 **Réseaux Sociaux**

#### LinkedIn
```env
LINKEDIN_CLIENT_ID="votre-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="votre-linkedin-client-secret"
LINKEDIN_REDIRECT_URI="http://localhost:3000/auth/linkedin/callback"
```

#### Twitter/X
```env
TWITTER_CLIENT_ID="votre-twitter-client-id"
TWITTER_CLIENT_SECRET="votre-twitter-client-secret"
TWITTER_REDIRECT_URI="http://localhost:3000/auth/twitter/callback"
```

#### Instagram
```env
INSTAGRAM_CLIENT_ID="votre-instagram-client-id"
INSTAGRAM_CLIENT_SECRET="votre-instagram-client-secret"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/auth/instagram/callback"
```

#### YouTube
```env
YOUTUBE_CLIENT_ID="votre-youtube-client-id"
YOUTUBE_CLIENT_SECRET="votre-youtube-client-secret"
YOUTUBE_REDIRECT_URI="http://localhost:3000/auth/youtube/callback"
```

#### TikTok
```env
TIKTOK_CLIENT_ID="votre-tiktok-client-id"
TIKTOK_CLIENT_SECRET="votre-tiktok-client-secret"
TIKTOK_REDIRECT_URI="http://localhost:3000/auth/tiktok/callback"
```

#### Facebook
```env
FACEBOOK_CLIENT_ID="votre-facebook-client-id"
FACEBOOK_CLIENT_SECRET="votre-facebook-client-secret"
FACEBOOK_REDIRECT_URI="http://localhost:3000/auth/facebook/callback"
```

### 🔐 **Authentification**
```env
# JWT
JWT_SECRET="votre-secret-jwt-super-securise-ici"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Clerk (optionnel)
CLERK_PUBLISHABLE_KEY="pk_test_votre-cle-clerk"
CLERK_SECRET_KEY="sk_test_votre-secret-clerk"

# Supabase (optionnel)
SUPABASE_URL="https://votre-projet.supabase.co"
SUPABASE_ANON_KEY="votre-cle-anon-supabase"
SUPABASE_SERVICE_ROLE_KEY="votre-cle-service-role-supabase"
```

### 📤 **Export & Stockage**
```env
# AWS S3
AWS_ACCESS_KEY_ID="votre-access-key-aws"
AWS_SECRET_ACCESS_KEY="votre-secret-key-aws"
AWS_REGION="eu-west-3"
AWS_S3_BUCKET="video-ai-saas-bucket"

# Cloudflare R2 (alternative)
CLOUDFLARE_ACCOUNT_ID="votre-account-id-cloudflare"
CLOUDFLARE_API_TOKEN="votre-api-token-cloudflare"
CLOUDFLARE_R2_BUCKET="video-ai-saas-bucket"
```

### 📧 **Notifications**
```env
# Email
SENDGRID_API_KEY="votre-api-key-sendgrid"
SENDGRID_FROM_EMAIL="noreply@votre-domaine.com"

# Slack
SLACK_WEBHOOK_URL="votre-webhook-url-slack"
SLACK_CHANNEL="#video-ai-alerts"
```

## 🚀 **Instructions de Configuration**

### 1. **Créer le fichier .env.local**
```bash
cp env.example .env.local
```

### 2. **Remplir les variables**
- Copier les variables ci-dessus dans `.env.local`
- Remplacer les valeurs par vos vraies clés API
- Ne jamais commiter le fichier `.env.local`

### 3. **Vérifier la configuration**
```bash
# Tester la connexion DB
npx prisma db push

# Tester les APIs
npm run test:api
```

## 🔒 **Sécurité**

### ⚠️ **Important**
- Ne jamais exposer les clés API dans le code
- Utiliser des variables d'environnement
- Chiffrer les tokens OAuth2 en base
- Limiter les permissions des clés API

### 🛡️ **Bonnes Pratiques**
- Rotation régulière des clés
- Monitoring des accès API
- Rate limiting sur les endpoints
- Validation des entrées utilisateur

## 📊 **Monitoring**

### 📈 **Métriques à Surveiller**
- Utilisation des APIs IA
- Taux de succès des publications
- Performance des exports
- Erreurs d'authentification

### 🚨 **Alertes Recommandées**
- Quota API dépassé
- Échec de publication
- Erreur de base de données
- Token expiré
