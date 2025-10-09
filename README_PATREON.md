# 🎭 Intégration Patreon - Guide Complet

Cette intégration permet aux créateurs de gérer leurs campagnes Patreon et aux utilisateurs de soutenir les créateurs directement depuis votre SaaS, sans redirection vers Patreon.

## 🚀 Fonctionnalités

### Pour les Créateurs
- **Connexion OAuth 2.0** sécurisée avec Patreon
- **Gestion des campagnes** : création, modification, synchronisation
- **Gestion des paliers** : création, tarification, avantages
- **Suivi des patrons** : liste, statistiques, gestion des abonnements
- **Gestion des posts** : publication, contenu exclusif
- **Tableau de bord** avec métriques et analyses
- **Synchronisation automatique** des données Patreon

### Pour les Patrons/Supporters
- **Découverte de créateurs** et leurs campagnes
- **Souscription intégrée** aux paliers
- **Gestion des abonnements** existants
- **Accès au contenu exclusif**
- **Historique des paiements** et récompenses

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Patreon API   │
│   (Next.js)     │◄──►│   (Next.js)      │◄──►│   (v2)         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │    │   Database       │    │   Webhooks      │
│   React         │    │   (Prisma)       │    │   (Real-time)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Structure des Fichiers

```
├── app/
│   ├── patreon-auth/           # Page d'authentification
│   ├── patreon-dashboard/      # Dashboard principal
│   ├── patreon-creator/        # Interface créateur
│   ├── patreon-patron/         # Interface patron
│   └── api/
│       ├── auth/patreon/       # Routes OAuth
│       ├── patreon/            # API Patreon
│       └── webhooks/patreon/   # Webhooks
├── components/
│   └── patreon/                # Composants React
├── lib/
│   └── patreon/                # Services et utilitaires
├── prisma/
│   └── schema.prisma           # Modèles de base de données
├── config/
│   └── patreon.config.ts       # Configuration
└── tests/
    └── patreon-integration.test.ts
```

## 🛠️ Installation

### 1. Variables d'Environnement

Créez un fichier `.env.local` avec :

```bash
# Patreon OAuth
PATREON_CLIENT_ID=your_client_id
PATREON_CLIENT_SECRET=your_client_secret
PATREON_WEBHOOK_SECRET=your_webhook_secret

# Sécurité
ENCRYPTION_KEY=your_32_character_encryption_key

# NextAuth (si pas déjà configuré)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 2. Configuration Patreon

1. Allez sur [Patreon Developer Portal](https://www.patreon.com/portal/registration/register-clients)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - **Redirect URIs** : `http://localhost:3000/api/auth/patreon/callback`
   - **Webhook URL** : `http://localhost:3000/api/webhooks/patreon`
4. Notez votre **Client ID** et **Client Secret**

### 3. Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Ou créer une migration personnalisée
npx prisma migrate dev --name add-patreon-integration
```

### 4. Dépendances

```bash
npm install axios crypto
npm install -D @types/node
```

## 🔐 Authentification OAuth

### Flux de Connexion

1. **Initiation** : L'utilisateur clique sur "Connecter Patreon"
2. **Redirection** : Redirection vers Patreon pour autorisation
3. **Callback** : Patreon renvoie un code d'autorisation
4. **Échange** : Échange du code contre des tokens d'accès
5. **Stockage** : Stockage sécurisé des tokens dans la base de données

### Gestion des Tokens

- **Chiffrement** : Les tokens sont chiffrés avant stockage
- **Rafraîchissement** : Renouvellement automatique des tokens expirés
- **Sécurité** : Validation des signatures webhook

## 📊 Synchronisation des Données

### Types de Synchronisation

- **Campagnes** : Informations de base, objectifs, statistiques
- **Paliers** : Tarifs, avantages, nombre de patrons
- **Patrons** : Informations des supporters, abonnements
- **Posts** : Contenu publié, statut de publication
- **Paiements** : Historique des transactions

### Fréquence de Synchronisation

- **Automatique** : Toutes les heures (configurable)
- **Manuelle** : Via le dashboard
- **Webhooks** : Temps réel pour les événements importants

## 🌐 API Endpoints

### Authentification

```typescript
GET  /api/auth/patreon/connect     # Initier la connexion OAuth
GET  /api/auth/patreon/callback    # Callback OAuth
POST /api/auth/patreon/refresh     # Rafraîchir le token
POST /api/auth/patreon/disconnect  # Déconnecter Patreon
```

### Données

```typescript
GET  /api/patreon/connections      # Connexions de l'utilisateur
GET  /api/patreon/campaigns       # Campagnes avec sync optionnel
POST /api/patreon/campaigns       # Forcer la synchronisation
```

### Webhooks

```typescript
POST /api/webhooks/patreon        # Réception des événements
GET  /api/webhooks/patreon        # Logs des webhooks (debug)
```

## 🎨 Interface Utilisateur

### Dashboard Créateur

- **Vue d'ensemble** : Statistiques globales, connexions actives
- **Campagnes** : Liste, édition, synchronisation
- **Patrons** : Gestion des supporters, filtres
- **Posts** : Contenu publié, statuts
- **Analyses** : Métriques de performance

### Composants Réutilisables

- `PatreonCampaigns` : Gestion des campagnes
- `PatreonPatrons` : Liste des patrons
- `PatreonPosts` : Gestion des posts
- `PatreonAnalytics` : Tableaux de bord

## 🔧 Configuration Avancée

### Fréquences de Synchronisation

```typescript
// config/patreon.config.ts
SYNC_FREQUENCIES: {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly'
}
```

### Limites de Taux

```typescript
RATE_LIMIT_REQUESTS_PER_HOUR: 200
RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000
```

### Webhooks Supportés

- `pledges:create` : Nouveau supporter
- `pledges:update` : Modification d'abonnement
- `pledges:delete` : Fin d'abonnement
- `posts:publish` : Nouveau post

## 🧪 Tests

### Test Simple

```bash
node scripts/test-patreon.js
```

### Tests Complets (avec Vitest)

```bash
npm install -D vitest
npm run test:patreon
```

### Tests d'Intégration

- Validation OAuth
- Synchronisation des données
- Traitement des webhooks
- Gestion des erreurs

## 📈 Monitoring

### Métriques Disponibles

- Tentatives de connexion OAuth
- Jobs de synchronisation
- Événements webhook
- Appels API
- Limites de taux

### Alertes

- Échecs de synchronisation (seuil : 3)
- Échecs OAuth (seuil : 5)
- Échecs webhook (seuil : 10)
- Avertissements de limite de taux (75%)

## 🚀 Déploiement

### Prérequis

- Base de données PostgreSQL/MySQL
- Variables d'environnement configurées
- Certificats SSL pour les webhooks

### Étapes

1. **Build** : `npm run build`
2. **Migration** : Appliquer les migrations de base de données
3. **Variables** : Configurer les variables d'environnement de production
4. **Webhooks** : Mettre à jour les URLs webhook dans le portail Patreon
5. **Test** : Vérifier la connectivité et les webhooks

### Environnements

- **Développement** : `http://localhost:3000`
- **Staging** : `https://staging.yourapp.com`
- **Production** : `https://yourapp.com`

## 🔒 Sécurité

### Mesures Implémentées

- **Chiffrement** des tokens d'accès
- **Validation** des signatures webhook
- **Gestion** des erreurs sécurisée
- **Audit trail** des opérations
- **Limites de taux** respectées

### Bonnes Pratiques

- Utilisez des clés de chiffrement fortes (32+ caractères)
- Surveillez les logs d'authentification
- Testez régulièrement la validation des webhooks
- Maintenez les dépendances à jour

## 🐛 Dépannage

### Problèmes Courants

#### Erreur OAuth
```
❌ Failed to authenticate with Patreon
```
**Solution** : Vérifiez les variables d'environnement et la configuration de l'app Patreon

#### Webhook Non Reçu
```
❌ No webhook events received
```
**Solution** : Vérifiez l'URL webhook et la validation des signatures

#### Synchronisation Échouée
```
❌ Failed to sync Patreon data
```
**Solution** : Vérifiez les tokens d'accès et les permissions

### Logs de Debug

```bash
# Activer les logs détaillés
DEBUG=patreon:* npm run dev

# Vérifier les webhooks
GET /api/webhooks/patreon?limit=10
```

## 📚 Ressources

- [Documentation API Patreon v2](https://docs.patreon.com/)
- [Portail Développeur Patreon](https://www.patreon.com/portal/registration/register-clients)
- [Guide OAuth 2.0](https://oauth.net/2/)
- [Documentation Prisma](https://www.prisma.io/docs/)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

- 📧 Email : support@yourapp.com
- 💬 Discord : [Serveur Discord](https://discord.gg/yourapp)
- 📖 Documentation : [docs.yourapp.com](https://docs.yourapp.com)
- 🐛 Issues : [GitHub Issues](https://github.com/yourapp/patreon-integration/issues)

---

**🎉 Félicitations !** Votre intégration Patreon est maintenant prête à être utilisée. N'oubliez pas de tester toutes les fonctionnalités avant le déploiement en production. 