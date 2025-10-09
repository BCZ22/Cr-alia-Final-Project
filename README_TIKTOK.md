# 🎵 Intégration TikTok + IA pour Crealia

## 🚀 Vue d'ensemble

Cette intégration TikTok complète permet aux créateurs de contenu d'analyser leurs performances TikTok et de recevoir des recommandations IA personnalisées pour optimiser leur stratégie de contenu.

## ✨ Fonctionnalités principales

### 🔐 Authentification OAuth2
- Connexion sécurisée avec TikTok
- Gestion automatique des tokens d'accès
- Rafraîchissement automatique des tokens expirés

### 📊 Analytics avancées
- Analyse détaillée des performances vidéo
- Calcul automatique de l'engagement
- Identification des contenus performants
- Métriques en temps réel

### 🤖 IA et recommandations
- Génération d'idées de contenu personnalisées
- Scripts optimisés pour l'engagement
- Hashtags tendance et efficaces
- Timing de publication optimal
- Formats vidéo recommandés

### 📱 Interface moderne
- Dashboard responsive et intuitif
- Visualisation des statistiques
- Affichage des recommandations IA
- Interface d'authentification

## 🛠️ Architecture technique

### Stack utilisée
- **Frontend** : Next.js 15 + React 19 + TypeScript
- **Backend** : API Routes Next.js
- **Base de données** : SQLite avec Prisma ORM
- **IA** : OpenAI GPT-4 pour les recommandations
- **Authentification** : OAuth2 TikTok

### Structure des fichiers
```
├── lib/
│   ├── tiktok-service.ts          # Service TikTok API
│   └── tiktok-ai-service.ts       # Service IA recommandations
├── app/api/tiktok/
│   ├── auth/route.ts              # Authentification OAuth2
│   ├── videos/route.ts            # Gestion des vidéos
│   └── recommendations/route.ts   # Recommandations IA
├── components/ui/tiktok/
│   └── TikTokDashboard.tsx        # Dashboard principal
├── app/tiktok/
│   └── page.tsx                   # Page principale
└── prisma/
    └── schema.prisma              # Modèles base de données
```

## 🗄️ Modèles de base de données

### TikTokConnection
```sql
- id: Identifiant unique
- userId: Référence utilisateur
- tiktokUserId: ID TikTok utilisateur
- tiktokUsername: Nom d'utilisateur TikTok
- displayName: Nom d'affichage
- profilePicture: URL photo de profil
- followerCount: Nombre d'abonnés
- followingCount: Nombre d'abonnements
- videoCount: Nombre de vidéos
- likeCount: Nombre total de likes
- accessToken: Token d'accès TikTok
- refreshToken: Token de rafraîchissement
- expiresAt: Date d'expiration du token
- isActive: Statut actif
- lastUsed: Dernière utilisation
```

### TikTokVideo
```sql
- id: Identifiant unique
- tiktokConnectionId: Référence connexion
- videoId: ID vidéo TikTok
- shareId: ID de partage
- title: Titre de la vidéo
- description: Description
- hashtags: Hashtags utilisés
- musicName: Nom de la musique
- duration: Durée en secondes
- videoUrl: URL de la vidéo
- coverUrl: URL de la miniature
- viewCount: Nombre de vues
- likeCount: Nombre de likes
- commentCount: Nombre de commentaires
- shareCount: Nombre de partages
- bookmarkCount: Nombre de sauvegardes
- publishedAt: Date de publication
```

### TikTokRecommendation
```sql
- id: Identifiant unique
- userId: Référence utilisateur
- type: Type de recommandation
- title: Titre de la recommandation
- description: Description détaillée
- content: Contenu JSON structuré
- confidence: Score de confiance (0-1)
- source: Source de la recommandation
- isRead: Statut de lecture
- isApplied: Statut d'application
- createdAt: Date de création
```

## 🔧 Configuration

### 1. Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# TikTok API
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/api/tiktok/auth/callback

# OpenAI (pour les recommandations IA)
OPENAI_API_KEY=your_openai_api_key

# Base de données
DATABASE_URL="file:./dev.db"
```

### 2. Configuration TikTok Developer
1. Créez un compte sur [TikTok for Developers](https://developers.tiktok.com/)
2. Créez une nouvelle application
3. Configurez les permissions OAuth2 :
   - `user.info.basic`
   - `video.list`
   - `video.upload` (optionnel)
   - `user.info.stats`
4. Définissez l'URL de redirection : `http://localhost:3000/api/tiktok/auth/callback`

### 3. Installation et démarrage
```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Démarrer le serveur de développement
npm run dev
```

## 🧪 Tests

### Exécuter les tests TikTok
```bash
npm run test:tiktok
```

### Tests inclus
- ✅ Génération URL d'authentification
- ✅ Variables d'environnement
- ✅ Recommandations IA de fallback
- ✅ Formats recommandés
- ✅ Structure des données
- ✅ Performance avec gros datasets
- ✅ Endpoints API

## 📡 API Endpoints

### Authentification
```http
GET /api/tiktok/auth
# Génère l'URL d'authentification TikTok

POST /api/tiktok/auth
# Traite le callback OAuth2
Body: { "code": "authorization_code" }
```

### Vidéos
```http
GET /api/tiktok/videos?userId=1&maxCount=20
# Récupère les vidéos d'un utilisateur

POST /api/tiktok/videos
# Récupère les analytics d'une vidéo
Body: { "userId": 1, "videoId": "video_id" }
```

### Recommandations IA
```http
GET /api/tiktok/recommendations?userId=1&limit=10
# Récupère les recommandations existantes

POST /api/tiktok/recommendations
# Génère de nouvelles recommandations IA
Body: { "userId": 1 }
```

## 🎯 Utilisation

### 1. Accéder au dashboard
Naviguez vers `http://localhost:3000/tiktok`

### 2. Se connecter avec TikTok
- Cliquez sur "Se connecter avec TikTok"
- Autorisez l'application à accéder à vos données
- Vous serez redirigé vers le dashboard

### 3. Analyser vos performances
- Visualisez vos statistiques principales
- Consultez vos vidéos récentes
- Identifiez vos contenus performants

### 4. Recevoir des recommandations IA
- Cliquez sur "Nouvelles recommandations IA"
- Consultez les suggestions personnalisées
- Appliquez les recommandations à votre contenu

## 🔒 Sécurité

### Gestion des tokens
- Stockage sécurisé des access tokens
- Rafraîchissement automatique des tokens expirés
- Chiffrement des données sensibles

### Rate limiting
- Limitation des appels API TikTok
- Gestion des quotas d'API
- Retry automatique en cas d'erreur

### RGPD
- Stockage minimal des données
- Suppression des données à la demande
- Consentement explicite requis

## 🚀 Fonctionnalités avancées

### Analyse des performances
- Calcul automatique de l'engagement
- Identification des meilleures vidéos
- Analyse des hashtags utilisés
- Recommandations de formats

### IA et recommandations
- Intégration OpenAI GPT-4
- Génération d'idées de contenu
- Scripts optimisés pour l'engagement
- Hashtags tendance et efficaces
- Timing de publication optimal

### Interface utilisateur
- Dashboard moderne et responsive
- Visualisation des statistiques
- Affichage des recommandations IA
- Interface d'authentification

## 🔮 Prochaines étapes

### Fonctionnalités à venir
1. **Scraping des tendances TikTok**
   - API pour récupérer les sons en vogue
   - Hashtags viraux par catégorie
   - Formats vidéo qui explosent

2. **Génération de contenu avancée**
   - Intégration DALL-E pour les visuels
   - ElevenLabs pour la synthèse vocale
   - AssemblyAI pour l'analyse audio

3. **Planification et publication**
   - Interface de planification de contenu
   - Publication automatique via API TikTok
   - Calendrier éditorial intelligent

4. **Analytics avancées**
   - Graphiques de performance
   - Comparaison avec la concurrence
   - Prédictions de croissance

### Améliorations techniques
1. **Performance**
   - Cache Redis pour les données TikTok
   - Optimisation des requêtes base de données
   - Lazy loading des vidéos

2. **Scalabilité**
   - Queue de traitement pour l'IA
   - Microservices pour les analytics
   - CDN pour les assets

3. **Monitoring**
   - Logs détaillés des appels API
   - Métriques de performance
   - Alertes en cas d'erreur

## 🆘 Support

### Problèmes courants
1. **Erreur d'authentification**
   - Vérifiez les variables d'environnement TikTok
   - Assurez-vous que l'URL de redirection est correcte
   - Vérifiez les permissions de l'application TikTok

2. **Erreur API**
   - Vérifiez votre quota d'API TikTok
   - Assurez-vous que les tokens sont valides
   - Consultez les logs du serveur

3. **Erreur IA**
   - Vérifiez votre clé API OpenAI
   - Assurez-vous d'avoir des crédits OpenAI
   - Vérifiez la connexion internet

### Ressources utiles
- [TikTok for Developers](https://developers.tiktok.com/)
- [TikTok API Documentation](https://developers.tiktok.com/doc/login-kit-web)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**Développé avec ❤️ pour les créateurs de contenu TikTok** 