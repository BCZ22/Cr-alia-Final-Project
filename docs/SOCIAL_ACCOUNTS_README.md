# 🔗 Système de Gestion des Comptes Sociaux

## 📋 Vue d'ensemble

Le système de gestion des comptes sociaux de Crealia permet de connecter et gérer des comptes sur toutes les principales plateformes sociales via OAuth2. Il offre une interface unifiée pour la connexion, la synchronisation et la gestion des comptes.

## 🚀 Fonctionnalités

### ✅ Implémentées

- **Connexion OAuth2** pour 8 plateformes (Instagram, YouTube, TikTok, Facebook, Twitter, LinkedIn, Pinterest, Snapchat)
- **Gestion des comptes** avec statut, métadonnées et permissions
- **Interface utilisateur** moderne et intuitive
- **Synchronisation automatique** des données
- **Rafraîchissement des tokens** d'accès
- **Sécurité** avec chiffrement des tokens
- **Tests automatisés** et validation

### 🔄 En cours de développement

- **Analyse de performance** des comptes connectés
- **Recommandations IA** basées sur les données
- **Planification de contenu** automatisée
- **Publishing cross-platform** avec validation

## 🏗️ Architecture

### Services

```
src/services/social/
├── social-accounts.service.ts          # Service principal
├── instagram-integration.service.ts    # Intégration Instagram
├── youtube-integration.service.ts      # Intégration YouTube
├── tiktok-integration.service.ts       # Intégration TikTok
├── facebook-integration.service.ts     # Intégration Facebook
├── twitter-integration.service.ts      # Intégration Twitter
├── linkedin-integration.service.ts     # Intégration LinkedIn
├── pinterest-integration.service.ts    # Intégration Pinterest
├── snapchat-integration.service.ts     # Intégration Snapchat
└── social-media-orchestrator.service.ts # Orchestrateur
```

### Routes API

```
/api/social-accounts/
├── route.ts                    # CRUD des comptes
├── refresh/route.ts           # Rafraîchissement des tokens
├── sync/route.ts              # Synchronisation
└── stats/route.ts             # Statistiques

/api/oauth/
├── instagram/
│   ├── authorize/route.ts     # URL d'autorisation
│   └── callback/route.ts      # Callback OAuth
├── youtube/
│   ├── authorize/route.ts
│   └── callback/route.ts
├── tiktok/
│   ├── authorize/route.ts
│   └── callback/route.ts
└── ... (autres plateformes)
```

### Base de données

```sql
-- Table des comptes sociaux
CREATE TABLE social_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  account_type TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  profile_picture TEXT,
  status TEXT DEFAULT 'connected',
  permissions TEXT NOT NULL, -- JSON
  metadata TEXT, -- JSON
  access_token TEXT NOT NULL, -- Chiffré
  refresh_token TEXT, -- Chiffré
  connected_at TIMESTAMP DEFAULT NOW(),
  last_sync_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des états OAuth
CREATE TABLE oauth_states (
  id TEXT PRIMARY KEY,
  state TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL,
  user_id TEXT NOT NULL,
  account_type TEXT NOT NULL,
  permissions TEXT NOT NULL, -- JSON
  role TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Installation et Configuration

### 1. Prérequis

- Node.js 18+
- PostgreSQL
- Redis
- Comptes développeur sur les plateformes sociales

### 2. Installation

```bash
# Cloner le projet
git clone <repository-url>
cd crealia

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Configurer la base de données
npm run setup:social-accounts
```

### 3. Configuration OAuth2

Pour chaque plateforme, créez une application OAuth2 et configurez :

- **Client ID** et **Client Secret**
- **URL de redirection** : `https://votre-domaine.com/api/oauth/{platform}/callback`
- **Permissions** appropriées

Voir [SOCIAL_ACCOUNTS_SETUP.md](./SOCIAL_ACCOUNTS_SETUP.md) pour les détails.

### 4. Test

```bash
# Tester le système
npm run test:social-accounts

# Tester l'interface
npm run dev
# Aller sur http://localhost:3000/social-accounts/test
```

## 🎯 Utilisation

### Interface utilisateur

1. **Accéder à la gestion des comptes** : `/social-accounts`
2. **Connecter un compte** : Cliquer sur "Connecter un compte"
3. **Sélectionner la plateforme** et le type de compte
4. **Autoriser l'application** sur la plateforme
5. **Gérer les comptes** : voir, rafraîchir, déconnecter

### API

```typescript
// Récupérer les comptes d'un utilisateur
const response = await fetch('/api/social-accounts?userId=user-id');
const { accounts } = await response.json();

// Connecter un compte
const authResponse = await fetch('/api/oauth/instagram/authorize?userId=user-id&accountType=personal');
const { authUrl } = await authResponse.json();

// Rafraîchir un token
const refreshResponse = await fetch('/api/social-accounts/refresh', {
  method: 'POST',
  body: JSON.stringify({ accountId: 'account-id' })
});

// Synchroniser les comptes
const syncResponse = await fetch('/api/social-accounts/sync', {
  method: 'POST',
  body: JSON.stringify({ userId: 'user-id' })
});
```

## 🔐 Sécurité

### Chiffrement des tokens

Les tokens d'accès sont chiffrés avant stockage :

```typescript
// Chiffrement
const encryptedToken = encryptToken(accessToken);

// Déchiffrement
const decryptedToken = decryptToken(encryptedToken);
```

### Permissions

Chaque plateforme a ses propres permissions :

- **Instagram** : `user_profile`, `user_media`
- **YouTube** : `youtube.readonly`, `youtube.upload`
- **TikTok** : `user.info.basic`, `video.list`
- **Facebook** : `pages_read_engagement`, `pages_show_list`, `pages_manage_posts`
- **Twitter** : `tweet.read`, `users.read`, `tweet.write`
- **LinkedIn** : `r_liteprofile`, `r_emailaddress`, `w_member_social`
- **Pinterest** : `boards:read`, `pins:read`, `pins:write`
- **Snapchat** : `user.bitmoji.avatar`

### Validation

- Validation des entrées avec Zod
- Vérification des permissions
- Gestion des erreurs OAuth2
- Rate limiting

## 📊 Métadonnées récupérées

Pour chaque plateforme, nous récupérons :

| Plateforme | Followers | Posts | Verified | Bio | Website |
|------------|-----------|-------|----------|-----|---------|
| Instagram  | ✅        | ✅     | ✅        | ✅   | ✅       |
| YouTube    | ✅        | ✅     | ✅        | ✅   | ✅       |
| TikTok     | ✅        | ✅     | ✅        | ✅   | ✅       |
| Facebook   | ✅        | ✅     | ✅        | ✅   | ✅       |
| Twitter    | ✅        | ✅     | ✅        | ✅   | ✅       |
| LinkedIn   | ✅        | ✅     | ✅        | ✅   | ✅       |
| Pinterest  | ✅        | ✅     | ✅        | ✅   | ✅       |
| Snapchat   | ✅        | ✅     | ✅        | ✅   | ✅       |

## 🧪 Tests

### Tests unitaires

```bash
npm run test:social-accounts
```

### Tests d'intégration

```bash
npm run test:integration
```

### Tests E2E

```bash
npm run test:e2e
```

## 📈 Monitoring

### Logs

- Connexions/déconnexions de comptes
- Erreurs OAuth2
- Synchronisations
- Utilisation des APIs

### Métriques

- Nombre de comptes connectés
- Taux de succès des connexions
- Temps de synchronisation
- Erreurs par plateforme

## 🔧 Dépannage

### Problèmes courants

1. **Token expiré**
   - Solution : Utiliser la fonction de rafraîchissement
   - Prévention : Synchronisation automatique

2. **Permissions insuffisantes**
   - Solution : Vérifier les scopes demandés
   - Prévention : Documentation des permissions

3. **URL de redirection incorrecte**
   - Solution : Vérifier la configuration OAuth2
   - Prévention : Validation des URLs

4. **Rate limiting**
   - Solution : Implémenter des délais
   - Prévention : Gestion des quotas

### Support

- Documentation des APIs des plateformes
- Logs de l'application
- Support technique

## 🚀 Roadmap

### Version 1.1
- [ ] Analyse de performance des comptes
- [ ] Recommandations IA personnalisées
- [ ] Planification de contenu automatisée

### Version 1.2
- [ ] Publishing cross-platform
- [ ] Analytics avancées
- [ ] Intégration CRM

### Version 2.0
- [ ] IA de création de contenu
- [ ] Automatisation complète
- [ ] Marketplace de templates

## 📝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Implémenter les changements
4. Ajouter des tests
5. Soumettre une PR

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

