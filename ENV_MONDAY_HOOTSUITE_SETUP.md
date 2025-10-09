# 🔧 Configuration Variables d'Environnement - Monday.com & Hootsuite

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la configuration complète des variables d'environnement nécessaires pour l'intégration **Monday.com** et **Hootsuite** dans votre SaaS.

---

## 🚀 Configuration Monday.com

### 1. Création de l'Application Monday.com

1. **Accédez au Developer Portal Monday.com**
   - Rendez-vous sur [https://monday.com/developers](https://monday.com/developers)
   - Connectez-vous avec votre compte Monday.com

2. **Créez une nouvelle application**
   - Cliquez sur "Create App"
   - Remplissez les informations suivantes :
     - **App Name** : `Crealia Project Management`
     - **App Description** : `Intégration de gestion de projets pour Crealia`
     - **App Category** : `Productivity`

3. **Configurez l'OAuth**
   - Dans la section "OAuth & Permissions"
   - **Redirect URL** : `https://your-domain.com/auth/monday/callback`
   - **Scopes** : Sélectionnez `read` et `write`

4. **Récupérez vos credentials**
   - **Client ID** : Copiez l'ID de votre application
   - **Client Secret** : Copiez le secret de votre application

### 2. Variables d'Environnement Monday.com

Ajoutez ces variables à votre fichier `.env` :

```bash
# ============================================================================
# CONFIGURATION MONDAY.COM
# ============================================================================

# Credentials OAuth
MONDAY_CLIENT_ID=your_monday_client_id_here
MONDAY_CLIENT_SECRET=your_monday_client_secret_here
MONDAY_REDIRECT_URI=https://your-domain.com/auth/monday/callback

# Configuration API
MONDAY_BASE_URL=https://api.monday.com/v2
MONDAY_TIMEOUT=30000
MONDAY_MAX_RETRIES=3
MONDAY_RETRY_DELAY=1000

# Configuration Cache
MONDAY_CACHE_ENABLED=true
MONDAY_CACHE_TTL=3600
MONDAY_CACHE_PREFIX=monday:

# Configuration Logging
MONDAY_LOGGING_ENABLED=true
MONDAY_LOGGING_LEVEL=info

# Configuration Webhooks (optionnel)
MONDAY_WEBHOOK_SECRET=your_webhook_secret_here
MONDAY_WEBHOOK_ENDPOINT=https://your-domain.com/webhooks/monday
```

---

## 📱 Configuration Hootsuite

### 1. Création de l'Application Hootsuite

1. **Accédez au Developer Portal Hootsuite**
   - Rendez-vous sur [https://developer.hootsuite.com](https://developer.hootsuite.com)
   - Connectez-vous avec votre compte Hootsuite

2. **Créez une nouvelle application**
   - Cliquez sur "Create App"
   - Remplissez les informations suivantes :
     - **App Name** : `Crealia Social Media Management`
     - **App Description** : `Intégration de gestion des réseaux sociaux pour Crealia`
     - **App Category** : `Social Media`

3. **Configurez l'OAuth**
   - Dans la section "OAuth Settings"
   - **Redirect URL** : `https://your-domain.com/auth/hootsuite/callback`
   - **Scopes** : Sélectionnez `read` et `write`

4. **Récupérez vos credentials**
   - **Client ID** : Copiez l'ID de votre application
   - **Client Secret** : Copiez le secret de votre application

### 2. Variables d'Environnement Hootsuite

Ajoutez ces variables à votre fichier `.env` :

```bash
# ============================================================================
# CONFIGURATION HOOTSUITE
# ============================================================================

# Credentials OAuth
HOOTSUITE_CLIENT_ID=your_hootsuite_client_id_here
HOOTSUITE_CLIENT_SECRET=your_hootsuite_client_secret_here
HOOTSUITE_REDIRECT_URI=https://your-domain.com/auth/hootsuite/callback

# Configuration API
HOOTSUITE_BASE_URL=https://platform.hootsuite.com/rest/v1
HOOTSUITE_TIMEOUT=30000
HOOTSUITE_MAX_RETRIES=3
HOOTSUITE_RETRY_DELAY=1000

# Configuration Cache
HOOTSUITE_CACHE_ENABLED=true
HOOTSUITE_CACHE_TTL=3600
HOOTSUITE_CACHE_PREFIX=hootsuite:

# Configuration Logging
HOOTSUITE_LOGGING_ENABLED=true
HOOTSUITE_LOGGING_LEVEL=info

# Configuration Webhooks (optionnel)
HOOTSUITE_WEBHOOK_SECRET=your_webhook_secret_here
HOOTSUITE_WEBHOOK_ENDPOINT=https://your-domain.com/webhooks/hootsuite
```

---

## 🔐 Configuration Sécurité

### 1. Chiffrement des Tokens

Pour une sécurité maximale, ajoutez ces variables :

```bash
# ============================================================================
# CONFIGURATION SÉCURITÉ
# ============================================================================

# Clés de chiffrement pour les tokens
ENCRYPTION_KEY=your_32_character_encryption_key_here
ENCRYPTION_IV=your_16_character_iv_here

# Secret pour les sessions
SESSION_SECRET=your_session_secret_here

# Configuration JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### 2. Base de Données

```bash
# ============================================================================
# CONFIGURATION BASE DE DONNÉES
# ============================================================================

# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/crealia

# Redis (pour le cache et les sessions)
REDIS_URL=redis://localhost:6379

# Configuration Prisma
PRISMA_DATABASE_URL=postgresql://username:password@localhost:5439/crealia
PRISMA_SHADOW_DATABASE_URL=postgresql://username:password@localhost:5439/crealia_shadow
```

---

## 🌐 Configuration Production

### 1. Variables de Production

```bash
# ============================================================================
# CONFIGURATION PRODUCTION
# ============================================================================

# Environnement
NODE_ENV=production

# URL de l'application
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Configuration CORS
CORS_ORIGIN=https://your-domain.com

# Configuration Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
```

### 2. Configuration CDN et Stockage

```bash
# ============================================================================
# CONFIGURATION CDN ET STOCKAGE
# ============================================================================

# AWS S3 (pour les médias)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# CloudFront (pour le CDN)
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
```

---

## 🧪 Configuration Développement

### 1. Variables de Développement

```bash
# ============================================================================
# CONFIGURATION DÉVELOPPEMENT
# ============================================================================

# Environnement
NODE_ENV=development

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configuration CORS
CORS_ORIGIN=http://localhost:3000

# Configuration Logging
LOG_LEVEL=debug

# Configuration Base de Données (Développement)
DATABASE_URL=postgresql://postgres:password@localhost:5432/crealia_dev
REDIS_URL=redis://localhost:6379
```

---

## 🔍 Validation de la Configuration

### 1. Script de Validation

Créez un script pour valider votre configuration :

```typescript
// scripts/validate-env.ts
import { validateEnvironmentConfig as validateMonday } from '@/lib/monday/config';
import { validateEnvironmentConfig as validateHootsuite } from '@/lib/hootsuite/config';

export function validateEnvironment() {
  try {
    // Valider Monday.com
    const mondayConfig = validateMonday();
    console.log('✅ Configuration Monday.com valide');

    // Valider Hootsuite
    const hootsuiteConfig = validateHootsuite();
    console.log('✅ Configuration Hootsuite valide');

    return true;
  } catch (error) {
    console.error('❌ Erreur de configuration:', error.message);
    return false;
  }
}
```

### 2. Test de Connectivité

```typescript
// scripts/test-connectivity.ts
import { createMondayService } from '@/lib/monday-service';
import { createHootsuiteService } from '@/lib/hootsuite-service';

export async function testConnectivity() {
  try {
    // Test Monday.com
    const mondayService = createMondayService();
    const mondayHealthy = await mondayService.healthCheck();
    console.log('Monday.com:', mondayHealthy ? '✅ Connecté' : '❌ Erreur');

    // Test Hootsuite
    const hootsuiteService = createHootsuiteService();
    const hootsuiteHealthy = await hootsuiteService.healthCheck();
    console.log('Hootsuite:', hootsuiteHealthy ? '✅ Connecté' : '❌ Erreur');

    return mondayHealthy && hootsuiteHealthy;
  } catch (error) {
    console.error('❌ Erreur de connectivité:', error);
    return false;
  }
}
```

---

## 🚨 Sécurité et Bonnes Pratiques

### 1. Protection des Secrets

- **Ne jamais commiter** les fichiers `.env` dans Git
- Utilisez des variables d'environnement sécurisées en production
- Chiffrez les tokens sensibles avant stockage
- Utilisez des secrets managers (AWS Secrets Manager, Azure Key Vault, etc.)

### 2. Monitoring et Alertes

- Configurez des alertes pour les échecs d'authentification
- Surveillez les rate limits des APIs
- Loggez toutes les opérations sensibles
- Mettez en place des métriques de performance

### 3. Gestion des Erreurs

- Implémentez un système de retry intelligent
- Gérez les timeouts et les erreurs réseau
- Affichez des messages d'erreur utilisateur appropriés
- Maintenez des logs détaillés pour le debugging

---

## 📚 Ressources Supplémentaires

### Documentation Officielle

- **Monday.com API** : [https://developer.monday.com/api-reference](https://developer.monday.com/api-reference)
- **Hootsuite API** : [https://developer.hootsuite.com/docs/api](https://developer.hootsuite.com/docs/api)

### Outils de Test

- **Postman Collections** : Importez les collections fournies pour tester les APIs
- **Insomnia** : Alternative à Postman pour tester les requêtes GraphQL
- **GraphQL Playground** : Pour tester les requêtes Monday.com

### Support

- **Monday.com Developer Support** : [https://monday.com/developers/support](https://monday.com/developers/support)
- **Hootsuite Developer Support** : [https://developer.hootsuite.com/support](https://developer.hootsuite.com/support)

---

## ✅ Checklist de Configuration

- [ ] Application Monday.com créée et configurée
- [ ] Application Hootsuite créée et configurée
- [ ] Variables d'environnement configurées
- [ ] Base de données configurée
- [ ] Redis configuré pour le cache
- [ ] Tests de connectivité effectués
- [ ] Monitoring et alertes configurés
- [ ] Documentation mise à jour
- [ ] Équipe formée sur la configuration

---

**🎯 Objectif** : Une configuration robuste et sécurisée permettant une intégration transparente et fiable de Monday.com et Hootsuite dans votre SaaS. 