# Documentation de l'API Substack

## Vue d'ensemble
Substack est une plateforme de newsletters qui permet aux créateurs de publier du contenu et de gérer leurs abonnés. L'API Substack offre des fonctionnalités pour interagir avec les publications, les abonnés et le contenu.

## Endpoints principaux

### 1. Publications
- **GET** `/api/v1/publications` - Récupérer la liste des publications
- **GET** `/api/v1/publications/{id}` - Récupérer une publication spécifique
- **POST** `/api/v1/publications` - Créer une nouvelle publication

### 2. Posts/Articles
- **GET** `/api/v1/posts` - Récupérer les posts d'une publication
- **GET** `/api/v1/posts/{id}` - Récupérer un post spécifique
- **POST** `/api/v1/posts` - Créer un nouveau post
- **PUT** `/api/v1/posts/{id}` - Mettre à jour un post
- **DELETE** `/api/v1/posts/{id}` - Supprimer un post

### 3. Abonnés
- **GET** `/api/v1/subscribers` - Récupérer la liste des abonnés
- **GET** `/api/v1/subscribers/{id}` - Récupérer un abonné spécifique
- **POST** `/api/v1/subscribers` - Ajouter un nouvel abonné

### 4. Analytics
- **GET** `/api/v1/analytics/views` - Statistiques de vues
- **GET** `/api/v1/analytics/subscribers` - Statistiques d'abonnés
- **GET** `/api/v1/analytics/revenue` - Statistiques de revenus

## Authentification
L'API Substack utilise l'authentification par token Bearer. Le token doit être inclus dans l'en-tête `Authorization` de chaque requête.

```http
Authorization: Bearer YOUR_API_TOKEN
```

## Limites de l'API
- **Rate limiting**: 1000 requêtes par heure par défaut
- **Taille des fichiers**: 10MB maximum pour les images
- **Format des données**: JSON uniquement

## Codes de statut HTTP
- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non autorisé
- `403` - Interdit
- `404` - Non trouvé
- `429` - Trop de requêtes
- `500` - Erreur serveur

## Exemples de requêtes

### Récupérer les publications
```bash
curl -X GET "https://api.substack.com/api/v1/publications" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Créer un nouveau post
```bash
curl -X POST "https://api.substack.com/api/v1/posts" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon titre",
    "body": "Contenu de l'article",
    "publication_id": "pub_id"
  }'
```

### Récupérer les abonnés
```bash
curl -X GET "https://api.substack.com/api/v1/subscribers?publication_id=pub_id" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Gestion des erreurs
L'API retourne des messages d'erreur détaillés au format JSON :

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Le champ 'title' est requis",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

## Webhooks
Substack supporte les webhooks pour les événements suivants :
- Nouveau post publié
- Nouvel abonné
- Abonnement annulé
- Paiement reçu

## Configuration des webhooks
```json
{
  "url": "https://votre-domaine.com/webhook/substack",
  "events": ["post.published", "subscriber.created"],
  "secret": "votre_secret_webhook"
}
```

## Bonnes pratiques
1. **Gestion des erreurs** : Toujours vérifier les codes de statut HTTP
2. **Rate limiting** : Implémenter une logique de retry avec backoff exponentiel
3. **Validation** : Valider les données avant envoi
4. **Logging** : Logger toutes les interactions avec l'API
5. **Sécurité** : Ne jamais exposer les tokens API côté client

## Ressources supplémentaires
- [Documentation officielle Substack](https://substack.com/api/docs)
- [Forum développeurs](https://community.substack.com)
- [GitHub Substack](https://github.com/substack) 