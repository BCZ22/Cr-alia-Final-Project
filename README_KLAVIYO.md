# Intégration Klaviyo pour Crealia

## Vue d'ensemble

Cette intégration permet à Crealia de gérer complètement les campagnes email marketing via l'API Klaviyo (version 2023-10-15). Chaque utilisateur peut connecter son compte Klaviyo et gérer ses contacts, listes, segments et campagnes de manière sécurisée et isolée.

## Fonctionnalités

### 🔐 Connexion et authentification
- Connexion sécurisée avec clé API privée Klaviyo
- Stockage chiffré des clés API par utilisateur
- Validation automatique des clés API
- Gestion des comptes multiples

### 📧 Gestion des contacts
- Ajout de contacts avec attributs personnalisés
- Mise à jour des profils existants
- Assignation automatique aux listes
- Gestion des tags et attributs

### 📊 Gestion des listes et segments
- Récupération des listes existantes
- Récupération des segments dynamiques
- Synchronisation automatique des données
- Statistiques de membres

### 📈 Gestion des campagnes
- Récupération des campagnes existantes
- Filtrage par statut (brouillon, programmé, envoyé, annulé)
- Statistiques de performance (taux d'ouverture, clics, rebonds)
- Historique des envois

### 🚀 Déclenchement d'événements
- Envoi d'événements personnalisés
- Types d'événements prédéfinis (achat, navigation, engagement)
- Association automatique aux profils
- Déclenchement d'automatisations

### 🔄 Synchronisation
- Synchronisation automatique des données
- Gestion des limites de taux API
- Retry automatique en cas d'échec
- Logs de synchronisation détaillés

### 📡 Webhooks
- Réception des événements Klaviyo en temps réel
- Validation des signatures de sécurité
- Traitement automatique des événements
- Support de tous les types d'événements

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes     │    │   Klaviyo      │
│   Crealia       │◄──►│   Next.js        │◄──►│   API v2023     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Service Layer  │
                       │   KlaviyoService │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Database       │
                       │   Prisma/PostgreSQL│
                       └──────────────────┘
```

## Endpoints API

### 🔌 Connexion
- `POST /api/klaviyo/connect` - Connexion d'un compte Klaviyo
- `GET /api/klaviyo/connect` - Statut de connexion
- `DELETE /api/klaviyo/connect` - Déconnexion

### 📧 Contacts
- `POST /api/klaviyo/subscribe` - Ajout d'un contact à une liste
- `GET /api/klaviyo/subscribe` - Recherche de profil

### ✏️ Mise à jour
- `PATCH /api/klaviyo/update-contact` - Mise à jour d'un contact
- `GET /api/klaviyo/update-contact` - Informations sur la mise à jour

### 🚀 Événements
- `POST /api/klaviyo/trigger-event` - Déclenchement d'un événement
- `GET /api/klaviyo/trigger-event` - Types d'événements supportés

### 📊 Données marketing
- `GET /api/klaviyo/get-lists` - Récupération des listes
- `GET /api/klaviyo/get-segments` - Récupération des segments
- `GET /api/klaviyo/get-campaigns` - Récupération des campagnes

### 🔄 Synchronisation
- `POST /api/klaviyo/sync` - Synchronisation complète des données
- `GET /api/klaviyo/sync` - Statut de synchronisation

### 📡 Webhooks
- `POST /api/klaviyo/webhooks` - Création de webhook
- `GET /api/klaviyo/webhooks` - Récupération des webhooks
- `DELETE /api/klaviyo/webhooks` - Suppression de webhook
- `POST /api/klaviyo/webhook-receiver` - Réception des webhooks Klaviyo

## Installation

### 1. Dépendances
```bash
npm install axios crypto dotenv
```

### 2. Variables d'environnement
Copiez le contenu de `KLAVIYO_ENV_SETUP.md` dans votre fichier `.env`

### 3. Base de données
```bash
# Génération du client Prisma
npm run db:generate

# Application des migrations
npm run db:push
```

### 4. Démarrage
```bash
npm run dev
```

## Utilisation

### Connexion d'un compte Klaviyo

```typescript
const response = await fetch('/api/klaviyo/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 123,
    privateApiKey: 'pk_xxxxxxxxxx',
    publicApiKey: 'pk_xxxxxxxxxx' // optionnel
  })
});

const result = await response.json();
```

### Ajout d'un contact

```typescript
const response = await fetch('/api/klaviyo/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 123,
    profile: {
      email: 'contact@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      customAttributes: {
        company: 'Entreprise SA',
        role: 'Manager'
      },
      tags: ['prospect', 'qualifié']
    },
    listId: 'XxXxXx'
  })
});

const result = await response.json();
```

### Déclenchement d'un événement

```typescript
const response = await fetch('/api/klaviyo/trigger-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 123,
    event: {
      eventType: 'Placed Order',
      eventData: {
        orderId: 'ORD-12345',
        total: 99.99,
        currency: 'EUR',
        items: [
          { name: 'Produit A', price: 49.99, quantity: 1 },
          { name: 'Produit B', price: 50.00, quantity: 1 }
        ]
      },
      profileId: '01HXXXXXXXXX' // optionnel
    }
  })
});

const result = await response.json();
```

### Récupération des listes

```typescript
const response = await fetch('/api/klaviyo/get-lists?userId=123');
const result = await response.json();
console.log(result.lists);
```

## Sécurité

### 🔐 Chiffrement des données sensibles
- Toutes les clés API sont chiffrées avant stockage
- Utilisation d'AES-256-CBC avec clé et IV uniques
- Clés de chiffrement stockées dans les variables d'environnement

### 🛡️ Validation des webhooks
- Vérification des signatures HMAC-SHA256
- Validation des timestamps pour éviter les attaques de replay
- Clés secrètes uniques par environnement

### 🔒 Isolation des données
- Chaque utilisateur accède uniquement à ses propres données
- Validation du userId à chaque requête
- Pas de partage de données entre utilisateurs

### 🌐 Sécurité réseau
- Utilisation exclusive de HTTPS en production
- Validation des origines des requêtes
- Rate limiting pour éviter les abus

## Gestion des erreurs

### Codes d'erreur HTTP
- `400` - Paramètres invalides ou manquants
- `401` - Clé API invalide ou expirée
- `404` - Ressource non trouvée
- `429` - Limite de taux dépassée
- `500` - Erreur interne du serveur

### Gestion des erreurs Klaviyo
- Retry automatique en cas d'échec temporaire
- Logs détaillés pour le debugging
- Messages d'erreur utilisateur-friendly
- Fallback gracieux quand possible

## Monitoring et logs

### 📊 Métriques collectées
- Nombre de requêtes API
- Taux de succès/échec
- Temps de réponse
- Utilisation des limites de taux

### 📝 Logs structurés
- Niveau de log configurable
- Contexte utilisateur pour chaque opération
- Traçabilité complète des opérations
- Rotation automatique des logs

## Tests

### Tests unitaires
```bash
npm run test:klaviyo
```

### Tests d'intégration
```bash
npm run test:klaviyo:integration
```

### Tests de charge
```bash
npm run test:klaviyo:load
```

## Déploiement

### Environnements
- **Development** - Configuration locale avec base de données locale
- **Staging** - Environnement de test avec base de données de staging
- **Production** - Environnement de production avec base de données de production

### Variables d'environnement par environnement
- Utilisez des clés de chiffrement différentes par environnement
- Configurez des webhooks différents par environnement
- Ajustez les limites de taux selon l'environnement

### Monitoring en production
- Alertes en cas d'échec de synchronisation
- Surveillance des limites de taux API
- Monitoring des performances des webhooks
- Logs d'audit pour la conformité

## Support et maintenance

### Documentation API
- Documentation complète de chaque endpoint
- Exemples de requêtes et réponses
- Codes d'erreur et solutions
- Guide de migration des versions

### Support technique
- Issues GitHub pour les bugs
- Discussions pour les questions
- Wiki pour la documentation avancée
- Exemples de code et cas d'usage

### Mises à jour
- Suivi des changements de l'API Klaviyo
- Tests de compatibilité automatiques
- Migration guidée des anciennes versions
- Changelog détaillé

## Licence

Ce module est distribué sous la licence MIT. Voir le fichier LICENSE pour plus de détails.

## Contribution

Les contributions sont les bienvenues ! Veuillez :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Contact

Pour toute question ou support :
- Issues GitHub : [Crealia Repository](https://github.com/your-org/crealia)
- Email : support@crealia.com
- Documentation : [docs.crealia.com](https://docs.crealia.com) 