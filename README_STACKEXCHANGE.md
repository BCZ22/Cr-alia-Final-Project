# Intégration Stack Exchange (Stack Overflow) - Documentation API

## Vue d'ensemble

Cette intégration permet aux utilisateurs du SaaS de gérer la récupération et la publication de contenu Stack Overflow de manière automatisée et sécurisée. Chaque utilisateur dispose de ses propres identifiants Stack Exchange via OAuth 2.0.

## Fonctionnalités principales

- 🔐 **Authentification OAuth 2.0** sécurisée
- 📊 **Récupération de questions** avec filtres avancés
- 💬 **Récupération de réponses** avec tri et pagination
- ✍️ **Publication de réponses** avec validation
- 📈 **Statistiques utilisateur** complètes
- 🔄 **Gestion automatique des tokens** (renouvellement)
- 🛡️ **Sécurité multi-utilisateur** avec isolation des données

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes     │    │ Stack Exchange  │
│   (React/Next)  │◄──►│   (Next.js)      │◄──►│   API v2.3      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Service Layer  │
                       │ (StackExchange   │
                       │   Service)       │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Database       │
                       │ (PostgreSQL/     │
                       │   SQLite)        │
                       └──────────────────┘
```

## Endpoints API

### 1. Connexion OAuth 2.0

#### Générer l'URL d'autorisation
```http
GET /api/stackexchange/connect
```

**Réponse :**
```json
{
  "authUrl": "https://stackoverflow.com/oauth?client_id=...&redirect_uri=...&state=...",
  "state": "generated_state_hash"
}
```

#### Échanger le code contre un token
```http
POST /api/stackexchange/connect
Content-Type: application/json

{
  "code": "authorization_code",
  "state": "state_hash"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Compte Stack Exchange connecté avec succès",
  "user": {
    "displayName": "John Doe",
    "reputation": 1250,
    "profileImage": "https://..."
  }
}
```

### 2. Récupération de questions

```http
GET /api/stackexchange/questions?tagged=javascript,react&sort=votes&order=desc&page=1&pageSize=20
```

**Paramètres de requête :**
- `tagged` : Tags séparés par des virgules (ex: `javascript,react,nodejs`)
- `notTagged` : Tags à exclure (ex: `php,wordpress`)
- `inTitle` : Recherche dans le titre (ex: `"async await"`)
- `fromDate` : Date de début (ex: `2024-01-01`)
- `toDate` : Date de fin (ex: `2024-12-31`)
- `min` : Score minimum (ex: `5`)
- `max` : Score maximum (ex: `100`)
- `sort` : Tri (`activity`, `votes`, `creation`, `relevance`)
- `order` : Ordre (`desc`, `asc`)
- `page` : Numéro de page (défaut: `1`)
- `pageSize` : Taille de page (défaut: `20`, max: `100`)

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "questionId": 12345,
      "title": "How to handle async operations in React?",
      "body": "I'm trying to implement...",
      "tags": ["javascript", "react", "async-await"],
      "score": 25,
      "viewCount": 1250,
      "answerCount": 8,
      "isAnswered": true,
      "acceptedAnswerId": 67890,
      "creationDate": "2024-01-15T10:30:00Z",
      "lastActivityDate": "2024-01-20T14:45:00Z",
      "owner": {
        "userId": 111,
        "displayName": "ReactDev",
        "reputation": 2500,
        "profileImage": "https://..."
      },
      "link": "https://stackoverflow.com/questions/12345/..."
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

### 3. Récupération de réponses

```http
GET /api/stackexchange/answers?questionId=12345&sort=votes&order=desc
```

**Paramètres de requête :**
- `questionId` : ID de la question (obligatoire)
- `sort` : Tri (`activity`, `votes`, `creation`)
- `order` : Ordre (`desc`, `asc`)

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "answerId": 67890,
      "questionId": 12345,
      "body": "Here's how you can handle async operations...",
      "score": 15,
      "isAccepted": true,
      "creationDate": "2024-01-15T11:00:00Z",
      "lastActivityDate": "2024-01-18T09:30:00Z",
      "owner": {
        "userId": 222,
        "displayName": "AsyncExpert",
        "reputation": 5000,
        "profileImage": "https://..."
      },
      "commentCount": 3,
      "upvoteCount": 18,
      "downvoteCount": 3
    }
  ],
  "questionId": 12345,
  "total": 1
}
```

### 4. Publication de réponses

```http
POST /api/stackexchange/answers/post
Content-Type: application/json

{
  "questionId": 12345,
  "body": "Based on your question, here's a comprehensive solution...",
  "preview": false
}
```

**Paramètres :**
- `questionId` : ID de la question (obligatoire)
- `body` : Contenu de la réponse (15-30000 caractères)
- `preview` : Mode aperçu (optionnel, défaut: `false`)

**Réponse :**
```json
{
  "success": true,
  "message": "Réponse publiée avec succès",
  "data": {
    "answerId": 78901,
    "link": "https://stackoverflow.com/a/78901/..."
  }
}
```

### 5. Statistiques utilisateur

```http
GET /api/stackexchange/stats
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "reputation": 1250,
    "questionCount": 15,
    "answerCount": 45,
    "acceptedAnswerCount": 12,
    "totalVotes": 180,
    "totalViews": 2500,
    "badges": {
      "gold": 2,
      "silver": 8,
      "bronze": 25
    },
    "topTags": [
      {
        "tag": "javascript",
        "count": 20,
        "score": 150
      },
      {
        "tag": "react",
        "count": 15,
        "score": 120
      }
    ]
  },
  "timestamp": "2024-01-20T15:30:00Z"
}
```

### 6. Statut de la connexion

```http
GET /api/stackexchange/status
```

**Réponse :**
```json
{
  "success": true,
  "connected": true,
  "data": {
    "id": 1,
    "stackExchangeUserId": 12345,
    "displayName": "John Doe",
    "reputation": 1250,
    "profileImage": "https://...",
    "expiresAt": "2024-02-20T15:30:00Z",
    "lastUsed": "2024-01-20T15:30:00Z",
    "createdAt": "2024-01-01T10:00:00Z",
    "isExpired": false,
    "isExpiringSoon": false,
    "status": "active"
  }
}
```

### 7. Déconnexion

```http
POST /api/stackexchange/disconnect
```

**Réponse :**
```json
{
  "success": true,
  "message": "Compte Stack Exchange déconnecté avec succès"
}
```

## Exemples d'utilisation

### Exemple 1 : Recherche de questions par tag

```javascript
// Rechercher les questions JavaScript les plus populaires
const response = await fetch('/api/stackexchange/questions?tagged=javascript&sort=votes&order=desc&pageSize=10');
const data = await response.json();

if (data.success) {
  data.data.forEach(question => {
    console.log(`${question.title} - Score: ${question.score}`);
  });
}
```

### Exemple 2 : Publier une réponse

```javascript
const response = await fetch('/api/stackexchange/answers/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    questionId: 12345,
    body: `Voici une solution complète à votre problème :

\`\`\`javascript
async function handleAsyncOperation() {
  try {
    const result = await someAsyncFunction();
    return result;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}
\`\`\`

Cette approche utilise async/await pour une gestion propre des opérations asynchrones.`,
  }),
});

const result = await response.json();
if (result.success) {
  console.log(`Réponse publiée: ${result.data.link}`);
}
```

### Exemple 3 : Récupérer les statistiques

```javascript
const response = await fetch('/api/stackexchange/stats');
const data = await response.json();

if (data.success) {
  const stats = data.data;
  console.log(`Réputation: ${stats.reputation}`);
  console.log(`Questions: ${stats.questionCount}`);
  console.log(`Réponses: ${stats.answerCount}`);
  console.log(`Badges: ${stats.badges.gold} or, ${stats.badges.silver} argent, ${stats.badges.bronze} bronze`);
}
```

## Gestion des erreurs

### Codes d'erreur HTTP

- `400` : Paramètres invalides ou manquants
- `401` : Non authentifié ou compte non connecté
- `403` : Accès refusé
- `429` : Limite de quota atteinte
- `500` : Erreur interne du serveur

### Format des erreurs

```json
{
  "error": "Description de l'erreur",
  "details": "Détails supplémentaires (optionnel)"
}
```

### Erreurs courantes

1. **"Compte Stack Exchange non connecté"**
   - Solution : L'utilisateur doit d'abord se connecter via OAuth

2. **"Token expiré"**
   - Solution : Le token sera automatiquement renouvelé

3. **"Limite de quota atteinte"**
   - Solution : Attendre la réinitialisation quotidienne (10 000 requêtes/jour)

4. **"Le contenu de la réponse semble suspect"**
   - Solution : Réviser le contenu (éviter les URLs, majuscules excessives, etc.)

## Sécurité

### Authentification

- OAuth 2.0 avec state sécurisé
- Tokens chiffrés en base de données
- Renouvellement automatique des tokens expirés

### Validation des entrées

- Sanitisation de tous les paramètres
- Validation de la longueur des réponses
- Protection contre le spam et le contenu inapproprié

### Isolation des données

- Chaque utilisateur n'accède qu'à ses propres données
- Tokens isolés par utilisateur
- Validation stricte des permissions

## Performance et limitations

### Quotas API

- **Requêtes par jour** : 10 000 (avec clé API)
- **Requêtes par seconde** : 30
- **Taille des réponses** : Max 30 000 caractères

### Optimisations

- Mise en cache des requêtes fréquentes
- Pagination automatique
- Gestion des erreurs avec retry

## Support et maintenance

### Logs

Toutes les opérations sont loggées avec :
- Timestamp
- Type d'opération
- ID utilisateur
- Détails de la requête
- Erreurs éventuelles

### Monitoring

- Vérification automatique de la validité des tokens
- Nettoyage des tokens expirés
- Alertes en cas d'erreurs répétées

### Mise à jour

Pour mettre à jour l'intégration :

1. Mettre à jour les dépendances
2. Exécuter les migrations de base de données
3. Redémarrer le service
4. Tester les fonctionnalités principales

## Conclusion

Cette intégration Stack Exchange offre une solution complète et sécurisée pour la gestion de contenu Stack Overflow dans votre SaaS. Elle respecte les meilleures pratiques de sécurité et de performance, tout en offrant une API simple et intuitive pour vos utilisateurs. 