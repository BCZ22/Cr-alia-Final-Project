# 🔗 Configuration des Comptes Sociaux - OAuth2

## 📋 Vue d'ensemble

Ce document explique comment configurer les connexions OAuth2 pour toutes les plateformes sociales supportées par Crealia.

## 🛠️ Configuration requise

### Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# =============================================================================
# CONFIGURATION DES PLATEFORMES SOCIAUX - OAUTH2
# =============================================================================

# URL de base de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clé de chiffrement pour les tokens
ENCRYPTION_KEY=your-32-character-encryption-key-here

# =============================================================================
# INSTAGRAM API
# =============================================================================
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# =============================================================================
# YOUTUBE API (Google)
# =============================================================================
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# =============================================================================
# TIKTOK API
# =============================================================================
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# =============================================================================
# FACEBOOK API
# =============================================================================
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# =============================================================================
# TWITTER/X API
# =============================================================================
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# =============================================================================
# LINKEDIN API
# =============================================================================
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# =============================================================================
# PINTEREST API
# =============================================================================
PINTEREST_CLIENT_ID=your_pinterest_client_id
PINTEREST_CLIENT_SECRET=your_pinterest_client_secret

# =============================================================================
# SNAPCHAT API
# =============================================================================
SNAPCHAT_CLIENT_ID=your_snapchat_client_id
SNAPCHAT_CLIENT_SECRET=your_snapchat_client_secret
```

## 🔧 Configuration des applications OAuth2

### 1. Instagram

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez le produit "Instagram Basic Display"
4. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/instagram/callback` (développement)
   - `https://votre-domaine.com/api/oauth/instagram/callback` (production)
5. Récupérez le Client ID et Client Secret

### 2. YouTube (Google)

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API YouTube Data API v3
4. Créez des identifiants OAuth 2.0
5. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/youtube/callback` (développement)
   - `https://votre-domaine.com/api/oauth/youtube/callback` (production)
6. Récupérez le Client ID et Client Secret

### 3. TikTok

1. Allez sur [TikTok for Developers](https://developers.tiktok.com/)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/tiktok/callback` (développement)
   - `https://votre-domaine.com/api/oauth/tiktok/callback` (production)
4. Récupérez le Client ID et Client Secret

### 4. Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez le produit "Facebook Login"
4. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/facebook/callback` (développement)
   - `https://votre-domaine.com/api/oauth/facebook/callback` (production)
5. Récupérez le Client ID et Client Secret

### 5. Twitter/X

1. Allez sur [Twitter Developer Portal](https://developer.twitter.com/)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/twitter/callback` (développement)
   - `https://votre-domaine.com/api/oauth/twitter/callback` (production)
4. Récupérez le Client ID et Client Secret

### 6. LinkedIn

1. Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/linkedin/callback` (développement)
   - `https://votre-domaine.com/api/oauth/linkedin/callback` (production)
4. Récupérez le Client ID et Client Secret

### 7. Pinterest

1. Allez sur [Pinterest Developers](https://developers.pinterest.com/)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/pinterest/callback` (développement)
   - `https://votre-domaine.com/api/oauth/pinterest/callback` (production)
4. Récupérez le Client ID et Client Secret

### 8. Snapchat

1. Allez sur [Snapchat for Developers](https://developers.snapchat.com/)
2. Créez une nouvelle application
3. Configurez les URLs de redirection :
   - `http://localhost:3000/api/oauth/snapchat/callback` (développement)
   - `https://votre-domaine.com/api/oauth/snapchat/callback` (production)
4. Récupérez le Client ID et Client Secret

## 🔐 Sécurité

### Chiffrement des tokens

Les tokens d'accès sont chiffrés avant d'être stockés en base de données. Utilisez une clé de chiffrement forte de 32 caractères.

### Permissions

Chaque plateforme a ses propres permissions. Les permissions par défaut sont :

- **Instagram** : `user_profile`, `user_media`
- **YouTube** : `youtube.readonly`, `youtube.upload`
- **TikTok** : `user.info.basic`, `video.list`
- **Facebook** : `pages_read_engagement`, `pages_show_list`, `pages_manage_posts`
- **Twitter** : `tweet.read`, `users.read`, `tweet.write`
- **LinkedIn** : `r_liteprofile`, `r_emailaddress`, `w_member_social`
- **Pinterest** : `boards:read`, `pins:read`, `pins:write`
- **Snapchat** : `user.bitmoji.avatar`

## 🚀 Utilisation

### Connexion d'un compte

1. L'utilisateur clique sur "Connecter un compte"
2. Sélectionne la plateforme
3. Choisit le type de compte (personnel, business, créateur, agence)
4. Définit le rôle (admin, analyste, éditeur, visualiseur)
5. Est redirigé vers la page d'autorisation de la plateforme
6. Autorise l'application
7. Est redirigé vers l'application avec le compte connecté

### Gestion des comptes

- **Voir tous les comptes** : Liste avec statut, métadonnées, actions
- **Rafraîchir un token** : Pour les comptes expirés
- **Déconnecter un compte** : Supprime l'accès
- **Synchroniser** : Vérifie le statut de tous les comptes

## 🔄 Synchronisation

La synchronisation vérifie :
- La validité des tokens d'accès
- Les métadonnées des comptes (followers, posts, etc.)
- Le statut de connexion

## 📊 Métadonnées récupérées

Pour chaque plateforme, nous récupérons :

- **Instagram** : followers, following, posts, verified, website, bio
- **YouTube** : subscribers, videos, views, country, language, description
- **TikTok** : followers, following, likes, videos, verified, bio
- **Facebook** : followers, posts, verified, website, bio
- **Twitter** : followers, following, tweets, verified, bio
- **LinkedIn** : connections, posts, verified, company, bio
- **Pinterest** : followers, boards, pins, verified, bio
- **Snapchat** : friends, snaps, verified, bio

## 🛠️ Développement

### Structure des fichiers

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

## 🧪 Tests

### Tests unitaires

```bash
npm run test:social-accounts
```

### Tests d'intégration

```bash
npm run test:oauth
```

## 📝 Logs et monitoring

Les logs incluent :
- Connexions/déconnexions de comptes
- Erreurs OAuth
- Synchronisations
- Utilisation des APIs

## 🔧 Dépannage

### Problèmes courants

1. **Token expiré** : Utilisez la fonction de rafraîchissement
2. **Permissions insuffisantes** : Vérifiez les scopes demandés
3. **URL de redirection incorrecte** : Vérifiez la configuration OAuth
4. **Rate limiting** : Implémentez des délais entre les requêtes

### Support

Pour toute question ou problème, consultez :
- La documentation des APIs des plateformes
- Les logs de l'application
- Le support technique

