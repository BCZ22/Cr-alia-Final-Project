# 🚀 Configuration Later API - Crealia

## 📋 Variables d'environnement requises

### 🔑 Authentification Later

```bash
# Later OAuth Configuration
LATER_CLIENT_ID=your_later_client_id
LATER_CLIENT_SECRET=your_later_client_secret
LATER_REDIRECT_URI=https://your-domain.com/api/later/auth/callback

# Later API Configuration
LATER_API_BASE_URL=https://api.later.com/v1
LATER_OAUTH_URL=https://api.later.com/oauth/authorize
LATER_TOKEN_URL=https://api.later.com/oauth/token

# Later Scopes (permissions)
LATER_SCOPES=profiles.read,profiles.write,posts.read,posts.write,media.read,media.write,analytics.read,calendar.read,calendar.write,templates.read,templates.write,content-library.read,content-library.write,webhooks.read,webhooks.write
```

### 🔧 Configuration avancée

```bash
# Later API Limits
LATER_MAX_POSTS_PER_BATCH=50
LATER_MAX_MEDIA_PER_POST=10
LATER_MAX_FILE_SIZE=104857600
LATER_RATE_LIMIT_PER_MINUTE=100
LATER_RATE_LIMIT_PER_HOUR=1000

# Later Refresh Intervals (in milliseconds)
LATER_TOKEN_REFRESH_INTERVAL=300000
LATER_PROFILES_SYNC_INTERVAL=600000
LATER_POSTS_SYNC_INTERVAL=120000
LATER_ANALYTICS_SYNC_INTERVAL=900000

# Later Logging
LATER_LOG_LEVEL=info
LATER_ENABLE_LOGGING=true
LATER_ENABLE_CACHE=true
LATER_ENABLE_RATE_LIMITING=true
LATER_ENABLE_RETRY=true
LATER_ENABLE_COMPRESSION=true
LATER_ENABLE_METRICS=true
```

### 🌐 Configuration de l'application

```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_LATER_AUTH_URL=https://your-domain.com/api/later/auth

# Database Configuration
DATABASE_URL=your_database_url

# Redis Configuration (pour le cache)
REDIS_URL=your_redis_url
REDIS_PASSWORD=your_redis_password

# Session Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

## 🛠️ Configuration par plateforme

### 📱 Instagram
```bash
# Instagram Business Account
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://your-domain.com/api/instagram/auth/callback
```

### 📘 Facebook
```bash
# Facebook App
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://your-domain.com/api/facebook/auth/callback
```

### 🐦 Twitter/X
```bash
# Twitter API v2
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=https://your-domain.com/api/twitter/auth/callback
```

### 💼 LinkedIn
```bash
# LinkedIn API
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=https://your-domain.com/api/linkedin/auth/callback
```

### 📌 Pinterest
```bash
# Pinterest API
PINTEREST_APP_ID=your_pinterest_app_id
PINTEREST_APP_SECRET=your_pinterest_app_secret
PINTEREST_REDIRECT_URI=https://your-domain.com/api/pinterest/auth/callback
```

### 🎵 TikTok
```bash
# TikTok API
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=https://your-domain.com/api/tiktok/auth/callback
```

### 📺 YouTube
```bash
# YouTube Data API v3
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=https://your-domain.com/api/youtube/auth/callback
YOUTUBE_API_KEY=your_youtube_api_key
```

## 🔐 Sécurité et chiffrement

```bash
# Encryption Keys
ENCRYPTION_KEY=your_32_character_encryption_key
JWT_SECRET=your_jwt_secret_key

# SSL/TLS Configuration
SSL_CERT_PATH=/path/to/ssl/certificate
SSL_KEY_PATH=/path/to/ssl/private/key
```

## 📊 Monitoring et Analytics

```bash
# Sentry (Error Tracking)
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
MIXPANEL_TOKEN=your_mixpanel_token
HOTJAR_ID=your_hotjar_id
```

## 🚀 Configuration de production

### 🔧 Nginx Configuration

```nginx
# /etc/nginx/sites-available/crealia
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/certificate;
    ssl_certificate_key /path/to/ssl/private/key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Rate limiting configuration
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### 🔧 PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'crealia',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs']
  }]
};
```

### 🔧 Redis Configuration

```bash
# /etc/redis/redis.conf
# Cache configuration
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Security
requirepass your_redis_password
bind 127.0.0.1
protected-mode yes
```

## 📋 Checklist de déploiement

### ✅ Prérequis
- [ ] Compte Later développeur créé
- [ ] Applications OAuth configurées pour chaque plateforme
- [ ] Base de données PostgreSQL/MySQL configurée
- [ ] Redis installé et configuré
- [ ] Certificat SSL obtenu
- [ ] Domaine configuré

### ✅ Configuration
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Redis connecté
- [ ] SSL configuré
- [ ] Nginx configuré
- [ ] PM2 configuré

### ✅ Tests
- [ ] Tests d'authentification Later
- [ ] Tests de connexion multi-plateformes
- [ ] Tests de création de posts
- [ ] Tests d'analytics
- [ ] Tests de performance
- [ ] Tests de sécurité

### ✅ Monitoring
- [ ] Sentry configuré
- [ ] Logs configurés
- [ ] Métriques configurées
- [ ] Alertes configurées
- [ ] Backup configuré

## 🔧 Scripts de déploiement

### 🚀 Script de déploiement automatique

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Déploiement de Crealia..."

# Variables
APP_NAME="crealia"
DEPLOY_PATH="/var/www/crealia"
BACKUP_PATH="/var/backups/crealia"

# Créer le backup
echo "📦 Création du backup..."
mkdir -p $BACKUP_PATH
cp -r $DEPLOY_PATH $BACKUP_PATH/$(date +%Y%m%d_%H%M%S)

# Pull des dernières modifications
echo "⬇️ Récupération des dernières modifications..."
cd $DEPLOY_PATH
git pull origin main

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --production

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Migration de la base de données
echo "🗄️ Migration de la base de données..."
npm run db:migrate

# Redémarrage de l'application
echo "🔄 Redémarrage de l'application..."
pm2 restart $APP_NAME

# Vérification du statut
echo "✅ Vérification du statut..."
pm2 status $APP_NAME

echo "🎉 Déploiement terminé !"
```

### 🔧 Script de monitoring

```bash
#!/bin/bash
# monitor.sh

echo "📊 Monitoring Crealia..."

# Vérification des services
echo "🔍 Vérification des services..."

# PM2
if pm2 status | grep -q "online"; then
    echo "✅ PM2: OK"
else
    echo "❌ PM2: ERREUR"
fi

# Redis
if redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: ERREUR"
fi

# Base de données
if npm run db:check; then
    echo "✅ Base de données: OK"
else
    echo "❌ Base de données: ERREUR"
fi

# SSL
if curl -I https://your-domain.com | grep -q "200"; then
    echo "✅ SSL: OK"
else
    echo "❌ SSL: ERREUR"
fi

echo "📊 Monitoring terminé !"
```

## 🔐 Sécurité

### 🛡️ Bonnes pratiques

1. **Chiffrement des tokens**
   - Utiliser AES-256 pour chiffrer les tokens stockés
   - Rotation régulière des clés de chiffrement

2. **Rate limiting**
   - Limiter les requêtes API par IP
   - Implémenter un système de quota par utilisateur

3. **Validation des données**
   - Valider toutes les entrées utilisateur
   - Sanitiser les données avant stockage

4. **Logs de sécurité**
   - Logger toutes les tentatives d'authentification
   - Surveiller les activités suspectes

5. **Backup automatique**
   - Backup quotidien de la base de données
   - Backup hebdomadaire des fichiers

### 🔍 Audit de sécurité

```bash
# Vérification des vulnérabilités
npm audit

# Scan de sécurité
npx snyk test

# Vérification des dépendances
npm outdated
```

## 📈 Performance

### ⚡ Optimisations

1. **Cache Redis**
   - Cache des profils utilisateur
   - Cache des analytics
   - Cache des templates

2. **CDN**
   - Images servies via CDN
   - Assets statiques optimisés

3. **Database**
   - Index sur les colonnes fréquemment utilisées
   - Requêtes optimisées
   - Connection pooling

4. **Monitoring**
   - Métriques de performance
   - Alertes automatiques
   - Logs structurés

## 🎯 Conclusion

Cette configuration garantit une intégration Later robuste, sécurisée et performante pour votre SaaS Crealia. Tous les composants sont configurés pour une production de niveau entreprise avec monitoring, sécurité et scalabilité.

---

**📞 Support**
Pour toute question ou problème, consultez la documentation Later API ou contactez l'équipe de support. 