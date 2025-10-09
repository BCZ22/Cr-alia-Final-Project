# Intégration Medium API - Documentation Complète

## 🚀 Vue d'ensemble

L'intégration Medium API transforme votre SaaS en un hub centralisé de gestion avancée de contenu Medium. Elle permet aux utilisateurs de gérer la récupération et la publication de contenu de manière automatisée pour plusieurs clients en simultané.

## ✨ Fonctionnalités Principales

- 🔐 **Authentification OAuth 2.0** avec Medium
- 📝 **Gestion complète des articles** (création, modification, suppression)
- 📊 **Statistiques et métriques** des publications
- 🔄 **Synchronisation automatique** avec Medium
- 🛡️ **Sécurité maximale** avec chiffrement AES-256
- 📈 **Rate limiting intelligent** et gestion des erreurs
- 🎯 **Support multi-utilisateurs** avec isolation des données

## 🏗️ Architecture

```
src/
├── controllers/
│   └── mediumController.ts      # Contrôleur principal
├── services/
│   ├── mediumService.ts         # Logique métier
│   ├── mediumApiClient.ts       # Client API Medium
│   └── encryptionService.ts     # Service de chiffrement
├── middleware/
│   ├── auth.ts                  # Authentification JWT
│   └── rateLimiter.ts           # Rate limiting
├── routes/
│   └── medium.ts                # Routes API
├── utils/
│   └── errorHandler.ts          # Gestion d'erreurs
└── server/
    └── mediumServer.ts          # Serveur Express
```

## 🚀 Installation et Configuration

### 1. Prérequis

- Node.js 18+ 
- PostgreSQL ou SQLite
- Compte développeur Medium

### 2. Installation des Dépendances

```bash
npm install
npm install --save-dev @types/jest jest tsx
```

### 3. Configuration des Variables d'Environnement

Créez un fichier `.env` basé sur `MEDIUM_ENV_SETUP.md` :

```bash
# Variables requises
ENCRYPTION_KEY=your_32_character_encryption_key
JWT_SECRET=your_jwt_secret_key
MEDIUM_CLIENT_ID=your_medium_client_id
MEDIUM_CLIENT_SECRET=your_medium_client_secret
DATABASE_URL="file:./dev.db"
```

### 4. Configuration de la Base de Données

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push
```

### 5. Configuration Medium OAuth

1. Allez sur [Medium Developer Portal](https://medium.com/developers)
2. Créez une nouvelle application
3. Configurez l'URL de redirection : `http://localhost:3000/auth/medium/callback`
4. Récupérez le Client ID et Client Secret

## 📚 API Endpoints

### Authentification et Connexion

#### POST `/api/medium/connect`
Connecte un compte Medium à un utilisateur.

**Body :**
```json
{
  "accessToken": "medium_access_token",
  "mediumUserId": "medium_user_id",
  "username": "medium_username",
  "name": "User Full Name",
  "imageUrl": "https://example.com/avatar.jpg",
  "url": "https://medium.com/@username"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "message": "Medium account connected successfully"
  },
  "message": "Medium account connected successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### DELETE `/api/medium/disconnect`
Déconnecte le compte Medium de l'utilisateur.

#### GET `/api/medium/status`
Vérifie le statut de l'intégration Medium.

### Gestion des Publications

#### GET `/api/medium/posts`
Récupère les publications de l'utilisateur.

**Query Parameters :**
- `status` : Filtre par statut (`draft`, `public`, `unlisted`)

**Réponse :**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Article Title",
        "content": "<p>Article content...</p>",
        "status": "public",
        "tags": ["tag1", "tag2"],
        "clapCount": 42,
        "responseCount": 5,
        "readingTime": 3,
        "publishedAt": "2024-01-15T10:00:00Z",
        "url": "https://medium.com/p/article-id"
      }
    ],
    "count": 1
  }
}
```

#### GET `/api/medium/posts/:id`
Récupère une publication spécifique.

#### POST `/api/medium/posts`
Publie un nouvel article sur Medium.

**Body :**
```json
{
  "title": "Article Title",
  "content": "<p>Article content in HTML</p>",
  "contentFormat": "html",
  "status": "draft",
  "tags": ["technology", "programming"],
  "canonicalUrl": "https://yourdomain.com/article",
  "license": "CC BY-NC-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-nc-sa/4.0/"
}
```

#### PUT `/api/medium/posts/:id`
Met à jour un article existant.

#### DELETE `/api/medium/posts/:id`
Supprime un article.

### Statistiques et Métriques

#### GET `/api/medium/stats`
Récupère les statistiques globales de l'utilisateur.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalPosts": 15,
      "publishedPosts": 12,
      "draftPosts": 3,
      "totalClaps": 1250,
      "totalResponses": 89,
      "totalReadingTime": 180,
      "averageClapsPerPost": 83,
      "averageResponsesPerPost": 6
    }
  }
}
```

#### GET `/api/medium/stats/:postId`
Récupère les statistiques d'un article spécifique.

### Synchronisation

#### POST `/api/medium/sync`
Synchronise les publications depuis Medium.

## 🔐 Sécurité

### Authentification
- **JWT** pour l'authentification des utilisateurs
- **OAuth 2.0** pour l'authentification Medium
- **Middleware d'authentification** sur toutes les routes protégées

### Chiffrement
- **AES-256-GCM** pour le chiffrement des tokens
- **Clés de chiffrement** stockées en variables d'environnement
- **Aucun token sensible** exposé côté frontend

### Rate Limiting
- **Limite globale** : 100 requêtes/15 minutes
- **Limite de publication** : 5 articles/heure
- **Limite stricte** : 10 requêtes/minute pour les opérations sensibles

### Isolation des Données
- **Vérification des permissions** sur chaque ressource
- **Isolation stricte** entre utilisateurs
- **Middleware de vérification** des accès

## 🧪 Tests

### Exécution des Tests

```bash
# Tests unitaires
npm run test:medium

# Tests avec coverage
npm run test:medium:coverage

# Tests en mode watch
npm run test:medium:watch
```

### Structure des Tests

- **Tests de service** : Logique métier et intégration API
- **Tests de contrôleur** : Gestion des requêtes HTTP
- **Tests de chiffrement** : Sécurité des données
- **Tests d'erreurs** : Gestion des cas d'erreur

## 📊 Monitoring et Logs

### Logs Structurés
- **Format JSON** pour faciliter l'analyse
- **Niveaux de log** configurables (debug, info, warn, error)
- **Contexte utilisateur** inclus dans chaque log

### Métriques
- **Temps de réponse** des endpoints
- **Taux d'erreur** par type d'opération
- **Utilisation des ressources** (base de données, API externe)

### Alertes
- **Erreurs critiques** envoyées par webhook
- **Rate limiting** dépassé
- **Échecs d'authentification** répétés

## 🚀 Déploiement

### Environnement de Développement

```bash
# Démarrer le serveur de développement
npm run dev:medium

# Port par défaut : 3001
```

### Environnement de Production

```bash
# Build de production
npm run build

# Démarrage du serveur
npm run start:medium

# Variables d'environnement requises
NODE_ENV=production
FORCE_HTTPS=true
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:medium"]
```

## 🔧 Configuration Avancée

### Redis (Optionnel)
Pour le cache et le rate limiting avancé :

```bash
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

### Sentry (Optionnel)
Pour le monitoring des erreurs :

```bash
SENTRY_DSN=your_sentry_dsn
```

### Webhooks (Optionnel)
Pour les notifications :

```bash
WEBHOOK_URL=https://hooks.slack.com/services/your/webhook
```

## 📝 Exemples d'Utilisation

### Connexion d'un Compte Medium

```typescript
import { mediumService } from './lib/services/mediumService';

// Connexion d'un compte Medium
await mediumService.connectAccount(userId, {
  accessToken: 'medium_access_token',
  mediumUserId: 'medium_user_id',
  username: 'username',
  name: 'Full Name'
});
```

### Publication d'un Article

```typescript
// Publication d'un article
const result = await mediumService.publishPost(userId, {
  title: 'Mon Article',
  content: '<p>Contenu de l\'article...</p>',
  contentFormat: 'html',
  status: 'public',
  tags: ['tech', 'programming']
});

console.log('Article publié:', result.url);
```

### Récupération des Statistiques

```typescript
// Statistiques globales
const stats = await mediumService.getUserStats(userId);
console.log('Total des articles:', stats.totalPosts);
console.log('Total des claps:', stats.totalClaps);

// Statistiques d'un article
const postStats = await mediumService.getPostStats(userId, postId);
console.log('Claps de l\'article:', postStats.claps);
```

## 🐛 Dépannage

### Erreurs Communes

#### "ENCRYPTION_KEY environment variable is required"
- Vérifiez que le fichier `.env` existe
- Vérifiez que `ENCRYPTION_KEY` est défini
- Redémarrez le serveur

#### "Medium API error: Invalid token"
- Vérifiez les identifiants Medium
- Vérifiez que l'application Medium est active
- Vérifiez l'URL de redirection

#### "Database connection failed"
- Vérifiez `DATABASE_URL`
- Vérifiez que la base de données est accessible
- Vérifiez les permissions

### Logs de Débogage

```bash
# Activer les logs de débogage
DEBUG=true
LOG_LEVEL=debug

# Vérifier la santé de l'API
curl http://localhost:3001/health
```

## 📚 Ressources Supplémentaires

- [Documentation Medium API](https://github.com/Medium/medium-api-docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- **Issues GitHub** : [Créer une issue](https://github.com/your-repo/issues)
- **Email** : support@yourdomain.com
- **Documentation** : [Wiki du projet](https://github.com/your-repo/wiki)

---

**Note** : Cette intégration est conçue pour être robuste, sécurisée et scalable. Elle respecte les meilleures pratiques de développement et de sécurité pour les applications SaaS professionnelles. 