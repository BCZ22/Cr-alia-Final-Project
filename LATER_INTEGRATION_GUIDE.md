# 🚀 Guide d'Intégration Later API - Crealia

## 📋 Vue d'ensemble

Ce guide détaille l'intégration complète de l'API Later dans Crealia, permettant aux utilisateurs de planifier visuellement leurs contenus sur les réseaux sociaux directement depuis notre SaaS, sans jamais être exposés à l'API Later native.

## 🎯 Objectifs de l'intégration

### ✅ Fonctionnalités principales
- **Calendrier visuel drag & drop** pour la planification de contenu
- **Éditeur de posts avancé** avec aperçu multi-plateformes
- **Gestion des profils** avec connexion multi-réseaux
- **Analytics complets** avec insights IA
- **Synchronisation automatique** des données
- **Interface unifiée** sans redirection vers Later

### 🔐 Architecture sécurisée
- **Authentification OAuth** côté serveur uniquement
- **Gestion automatique des tokens** avec refresh
- **Stockage sécurisé** des données sensibles
- **API Gateway** pour isoler les appels Later

## 🏗️ Architecture technique

### 📁 Structure des fichiers

```
lib/
├── later/
│   ├── config.ts          # Configuration centralisée
│   ├── types.ts           # Types TypeScript
│   ├── errors.ts          # Gestion d'erreurs
│   ├── http-client.ts     # Client HTTP robuste
│   └── mapper.ts          # Mapping des données
├── later-service.ts       # Service principal
└── token-manager.ts       # Gestion des tokens

components/ui/later/
├── later-calendar.tsx     # Calendrier drag & drop
├── later-post-editor.tsx  # Éditeur de posts
├── later-analytics.tsx    # Analytics avancés
└── later-profiles.tsx     # Gestion des profils

app/api/later/
├── auth/                  # Endpoints OAuth
├── posts/                 # Gestion des posts
├── profiles/              # Gestion des profils
├── analytics/             # Analytics
└── calendar/              # Calendrier

app/later/
└── page.tsx              # Page principale Later
```

### 🔧 Configuration

#### Variables d'environnement requises

```env
# Later API Configuration
LATER_CLIENT_ID=your_later_client_id
LATER_CLIENT_SECRET=your_later_client_secret
LATER_REDIRECT_URI=https://your-domain.com/api/later/auth/callback

# Database (pour stocker les tokens et données)
DATABASE_URL=your_database_url

# Redis (pour le cache et les sessions)
REDIS_URL=your_redis_url

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

#### Configuration Later API

```typescript
// lib/later/config.ts
export const LATER_CONFIG = {
  // Authentification
  clientId: process.env.LATER_CLIENT_ID,
  clientSecret: process.env.LATER_CLIENT_SECRET,
  redirectUri: process.env.LATER_REDIRECT_URI,
  
  // API Limits
  maxPostsPerBatch: 50,
  maxMediaPerPost: 10,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  
  // Refresh Intervals
  tokenRefreshInterval: 5 * 60 * 1000, // 5 minutes
  profilesSyncInterval: 10 * 60 * 1000, // 10 minutes
  postsSyncInterval: 2 * 60 * 1000, // 2 minutes
  
  // Features
  enableLogging: true,
  enableCache: true,
  enableRateLimiting: true,
  enableRetry: true,
  enableCompression: true,
  enableMetrics: true,
};
```

## 🚀 Installation et déploiement

### 1. Prérequis

```bash
# Dépendances requises
npm install react-big-calendar moment recharts
npm install @types/react-big-calendar

# Dépendances de développement
npm install --save-dev @types/moment
```

### 2. Configuration de la base de données

```sql
-- Table pour les tokens Later
CREATE TABLE later_tokens (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les profils Later
CREATE TABLE later_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  later_profile_id VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  is_connected BOOLEAN DEFAULT false,
  last_sync TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les posts Later
CREATE TABLE later_posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  later_post_id VARCHAR(255),
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  scheduled_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configuration des endpoints API

#### Endpoint d'authentification

```typescript
// app/api/later/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLaterService } from '@/lib/later-service';

export async function GET(request: NextRequest) {
  try {
    const laterService = createLaterService();
    const authUrl = laterService.generateAuthUrl();
    
    return NextResponse.json({ 
      success: true, 
      authUrl 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de la génération de l\'URL d\'authentification' 
    }, { status: 500 });
  }
}
```

#### Endpoint de callback

```typescript
// app/api/later/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLaterService } from '@/lib/later-service';
import { saveLaterToken } from '@/lib/token-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Code d\'autorisation manquant' 
      }, { status: 400 });
    }
    
    const laterService = createLaterService();
    const authResult = await laterService.authenticateUser(code);
    
    if (authResult.success) {
      // Sauvegarder le token
      await saveLaterToken(authResult.data);
      
      // Rediriger vers la page Later
      return NextResponse.redirect('/later');
    } else {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de l\'authentification' 
    }, { status: 500 });
  }
}
```

### 4. Configuration des webhooks

```typescript
// app/api/later/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyLaterWebhook } from '@/lib/later/webhook-verifier';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-later-signature');
    
    // Vérifier la signature du webhook
    if (!verifyLaterWebhook(body, signature)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Signature invalide' 
      }, { status: 401 });
    }
    
    const data = JSON.parse(body);
    
    // Traiter les événements Later
    switch (data.event) {
      case 'post.published':
        await handlePostPublished(data);
        break;
      case 'post.failed':
        await handlePostFailed(data);
        break;
      case 'profile.updated':
        await handleProfileUpdated(data);
        break;
      default:
        console.log('Événement non géré:', data.event);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors du traitement du webhook' 
    }, { status: 500 });
  }
}
```

## 🎨 Interface utilisateur

### Composants principaux

#### 1. Calendrier visuel (`LaterCalendar`)

```typescript
// Utilisation du composant calendrier
<LaterCalendar
  events={calendarEvents}
  onEventSelect={handleEventSelect}
  onEventCreate={handleCreatePost}
  onEventUpdate={handleUpdatePost}
  onEventDelete={handleDeletePost}
  onViewChange={handleViewChange}
  onNavigate={handleNavigate}
  loading={loading}
  error={error}
/>
```

**Fonctionnalités :**
- Vue calendrier avec drag & drop
- Vue liste pour gestion détaillée
- Navigation temporelle avancée
- Aperçu des posts avec tooltips
- Statuts visuels avec codes couleur

#### 2. Éditeur de posts (`LaterPostEditor`)

```typescript
// Utilisation de l'éditeur de posts
<LaterPostEditor
  post={selectedPost}
  profiles={connectedProfiles}
  onSave={handleSavePost}
  onCancel={handleCancel}
  loading={loading}
  error={error}
/>
```

**Fonctionnalités :**
- Upload de médias avec validation
- Aperçu multi-plateformes en temps réel
- Gestion des hashtags et mentions
- Optimisation automatique par plateforme
- Templates prédéfinis

#### 3. Analytics (`LaterAnalytics`)

```typescript
// Utilisation des analytics
<LaterAnalytics
  data={analyticsData}
  posts={postPerformance}
  platforms={platformPerformance}
  insights={aiInsights}
  onPeriodChange={handlePeriodChange}
  onPlatformFilter={handlePlatformFilter}
  onExport={handleExport}
  loading={loading}
  error={error}
/>
```

**Fonctionnalités :**
- Métriques détaillées par plateforme
- Graphiques interactifs avec Recharts
- Insights IA pour optimiser les performances
- Rapports automatisés avec export
- Monitoring en temps réel

#### 4. Gestion des profils (`LaterProfiles`)

```typescript
// Utilisation de la gestion des profils
<LaterProfiles
  profiles={profiles}
  onConnect={handleConnectProfile}
  onDisconnect={handleDisconnectProfile}
  onSync={handleSyncProfile}
  onUpdate={handleUpdateProfile}
  onDelete={handleDeleteProfile}
  loading={loading}
  error={error}
/>
```

**Fonctionnalités :**
- Connexion multi-plateformes
- Statuts en temps réel
- Statistiques détaillées par profil
- Gestion des permissions
- Synchronisation automatique

## 🔐 Sécurité et performance

### Sécurité

```typescript
// Chiffrement des tokens sensibles
import { encrypt, decrypt } from '@/lib/encryption';

export async function saveLaterToken(tokenData: any) {
  const encryptedToken = encrypt(JSON.stringify(tokenData));
  
  await db.laterTokens.upsert({
    where: { userId: tokenData.userId },
    update: {
      accessToken: encryptedToken,
      expiresAt: new Date(tokenData.expiresAt),
    },
    create: {
      userId: tokenData.userId,
      accessToken: encryptedToken,
      expiresAt: new Date(tokenData.expiresAt),
    },
  });
}
```

### Performance

```typescript
// Cache Redis pour les données fréquentes
import { redis } from '@/lib/redis';

export async function getCachedProfiles(userId: string) {
  const cacheKey = `later:profiles:${userId}`;
  
  // Vérifier le cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Récupérer depuis l'API
  const profiles = await laterService.getConnectedProfiles();
  
  // Mettre en cache pour 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(profiles));
  
  return profiles;
}
```

### Rate Limiting

```typescript
// Rate limiting par utilisateur
import { rateLimit } from '@/lib/rate-limit';

export const laterApiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function handleLaterApiRequest(req: NextRequest) {
  const identifier = req.headers.get('x-user-id') || req.ip;
  
  try {
    await laterApiLimiter.check(identifier, 10); // 10 requêtes par minute
  } catch {
    return NextResponse.json({ 
      success: false, 
      error: 'Rate limit exceeded' 
    }, { status: 429 });
  }
  
  // Continuer avec la requête...
}
```

## 📊 Monitoring et logs

### Configuration des logs

```typescript
// lib/later/logging.ts
import { createLogger, format, transports } from 'winston';

export const laterLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'later-api' },
  transports: [
    new transports.File({ filename: 'logs/later-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/later-combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  laterLogger.add(new transports.Console({
    format: format.simple()
  }));
}
```

### Métriques de performance

```typescript
// lib/later/metrics.ts
import { register, Counter, Histogram } from 'prom-client';

export const laterMetrics = {
  apiRequests: new Counter({
    name: 'later_api_requests_total',
    help: 'Total des requêtes API Later',
    labelNames: ['endpoint', 'status'],
  }),
  
  apiResponseTime: new Histogram({
    name: 'later_api_response_time_seconds',
    help: 'Temps de réponse des API Later',
    labelNames: ['endpoint'],
  }),
  
  postsCreated: new Counter({
    name: 'later_posts_created_total',
    help: 'Total des posts créés',
    labelNames: ['platform'],
  }),
  
  profilesConnected: new Counter({
    name: 'later_profiles_connected_total',
    help: 'Total des profils connectés',
    labelNames: ['platform'],
  }),
};
```

## 🧪 Tests

### Tests unitaires

```typescript
// tests/later-service.test.ts
import { createLaterService } from '@/lib/later-service';

describe('LaterService', () => {
  let laterService: LaterService;
  
  beforeEach(() => {
    laterService = createLaterService();
  });
  
  test('should generate auth URL', () => {
    const authUrl = laterService.generateAuthUrl();
    expect(authUrl).toContain('api.later.com/oauth/authorize');
  });
  
  test('should authenticate user with valid code', async () => {
    const mockCode = 'valid_auth_code';
    const result = await laterService.authenticateUser(mockCode);
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('accessToken');
  });
  
  test('should handle authentication error', async () => {
    const mockCode = 'invalid_auth_code';
    const result = await laterService.authenticateUser(mockCode);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Tests d'intégration

```typescript
// tests/later-integration.test.ts
import { createTestClient } from '@/lib/test-client';

describe('Later Integration', () => {
  let client: TestClient;
  
  beforeEach(() => {
    client = createTestClient();
  });
  
  test('should create post via API', async () => {
    const postData = {
      content: 'Test post content',
      platforms: ['instagram'],
      scheduledAt: new Date().toISOString(),
    };
    
    const response = await client.post('/api/later/posts', postData);
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.post).toHaveProperty('id');
  });
  
  test('should sync profiles', async () => {
    const response = await client.get('/api/later/profiles/sync');
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.profiles).toBeInstanceOf(Array);
  });
});
```

## 🚀 Déploiement

### Configuration de production

```bash
# Variables d'environnement de production
export NODE_ENV=production
export LATER_CLIENT_ID=your_production_client_id
export LATER_CLIENT_SECRET=your_production_client_secret
export DATABASE_URL=your_production_database_url
export REDIS_URL=your_production_redis_url

# Build de l'application
npm run build

# Démarrage en production
npm start
```

### Configuration Nginx

```nginx
# /etc/nginx/sites-available/crealia
server {
    listen 80;
    server_name your-domain.com;
    
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
    
    # Configuration SSL
    listen 443 ssl;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
}
```

### Configuration PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'crealia-later',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
```

## 📈 Monitoring et alertes

### Configuration Sentry

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});

export const captureLaterError = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    tags: {
      service: 'later-api',
    },
    extra: context,
  });
};
```

### Alertes automatiques

```typescript
// lib/alerts.ts
export const laterAlerts = {
  async onPostFailed(postId: string, error: string) {
    // Envoyer une notification Slack
    await sendSlackNotification({
      channel: '#later-alerts',
      text: `❌ Post ${postId} a échoué: ${error}`,
    });
    
    // Envoyer un email à l'équipe
    await sendEmail({
      to: 'team@crealia.com',
      subject: 'Later Post Failed',
      body: `Post ${postId} a échoué: ${error}`,
    });
  },
  
  async onApiError(endpoint: string, error: string) {
    // Log l'erreur et envoie une alerte si critique
    console.error(`Later API Error: ${endpoint} - ${error}`);
    
    if (error.includes('rate limit') || error.includes('authentication')) {
      await sendSlackNotification({
        channel: '#later-critical',
        text: `🚨 Later API Error: ${endpoint} - ${error}`,
      });
    }
  },
};
```

## 🔄 Maintenance et mises à jour

### Scripts de maintenance

```bash
#!/bin/bash
# scripts/later-maintenance.sh

# Nettoyage des tokens expirés
echo "Nettoyage des tokens expirés..."
node scripts/cleanup-expired-tokens.js

# Synchronisation des profils
echo "Synchronisation des profils..."
node scripts/sync-all-profiles.js

# Sauvegarde des données
echo "Sauvegarde des données..."
pg_dump later_data > backups/later_$(date +%Y%m%d_%H%M%S).sql

# Vérification de la santé du système
echo "Vérification de la santé du système..."
node scripts/health-check.js
```

### Mises à jour automatiques

```typescript
// lib/later/updater.ts
export class LaterUpdater {
  async checkForUpdates() {
    try {
      const response = await fetch('https://api.later.com/v1/version');
      const latestVersion = await response.json();
      
      if (latestVersion.version > CURRENT_VERSION) {
        await this.notifyUpdateAvailable(latestVersion);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error);
    }
  }
  
  async notifyUpdateAvailable(version: any) {
    await sendSlackNotification({
      channel: '#dev-updates',
      text: `🔄 Mise à jour Later disponible: ${version.version}`,
    });
  }
}
```

## 📚 Documentation API

### Endpoints disponibles

#### Authentification
- `GET /api/later/auth` - Générer l'URL d'authentification
- `GET /api/later/auth/callback` - Callback OAuth

#### Posts
- `GET /api/later/posts` - Lister les posts
- `POST /api/later/posts` - Créer un post
- `PUT /api/later/posts/:id` - Modifier un post
- `DELETE /api/later/posts/:id` - Supprimer un post

#### Profils
- `GET /api/later/profiles` - Lister les profils
- `POST /api/later/profiles/connect` - Connecter un profil
- `DELETE /api/later/profiles/:id` - Déconnecter un profil
- `POST /api/later/profiles/:id/sync` - Synchroniser un profil

#### Analytics
- `GET /api/later/analytics` - Récupérer les analytics
- `GET /api/later/analytics/export` - Exporter les données

#### Webhooks
- `POST /api/later/webhooks` - Recevoir les webhooks Later

### Codes d'erreur

```typescript
export enum LaterErrorCodes {
  AUTHENTICATION_FAILED = 'LATER_AUTH_001',
  TOKEN_EXPIRED = 'LATER_TOKEN_001',
  RATE_LIMIT_EXCEEDED = 'LATER_RATE_001',
  INVALID_REQUEST = 'LATER_REQ_001',
  POST_CREATION_FAILED = 'LATER_POST_001',
  PROFILE_SYNC_FAILED = 'LATER_PROFILE_001',
  API_UNAVAILABLE = 'LATER_API_001',
}
```

## 🎯 Bonnes pratiques

### 1. Gestion des erreurs

```typescript
// Toujours gérer les erreurs de manière appropriée
try {
  const result = await laterService.createPost(postData);
  if (!result.success) {
    // Logger l'erreur et informer l'utilisateur
    logger.error('Erreur création post:', result.error);
    throw new Error(result.error);
  }
} catch (error) {
  // Gérer l'erreur de manière gracieuse
  showUserFriendlyError(error);
}
```

### 2. Validation des données

```typescript
// Valider toutes les entrées utilisateur
import { z } from 'zod';

const PostSchema = z.object({
  content: z.string().min(1).max(2200),
  platforms: z.array(z.string()).min(1),
  scheduledAt: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
});

export function validatePostData(data: any) {
  return PostSchema.parse(data);
}
```

### 3. Cache intelligent

```typescript
// Utiliser le cache pour améliorer les performances
export async function getCachedData(key: string, fetcher: () => Promise<any>) {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetcher();
  await redis.setex(key, 300, JSON.stringify(data)); // Cache 5 minutes
  
  return data;
}
```

## 🚀 Conclusion

Cette intégration Later API offre une solution complète et professionnelle pour la planification de contenu multi-plateformes. Avec une architecture robuste, une interface utilisateur moderne et des fonctionnalités avancées, elle permet aux utilisateurs de gérer efficacement leur présence sur les réseaux sociaux directement depuis Crealia.

**Points clés :**
- ✅ Interface unifiée sans redirection
- ✅ Sécurité renforcée avec OAuth côté serveur
- ✅ Performance optimisée avec cache Redis
- ✅ Monitoring complet avec alertes
- ✅ Documentation détaillée et tests
- ✅ Architecture scalable et maintenable

**Prêt pour la production !** 🎉 