# Configuration TikTok API

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` :

```env
# TikTok API Configuration
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/api/tiktok/auth/callback

# OpenAI Configuration (pour les recommandations IA)
OPENAI_API_KEY=your_openai_api_key
```

## Configuration TikTok Developer

### 1. Créer une application TikTok

1. Allez sur [TikTok for Developers](https://developers.tiktok.com/)
2. Créez un nouveau compte développeur
3. Créez une nouvelle application
4. Configurez les permissions OAuth2 :
   - `user.info.basic` : Accès aux informations de base du profil
   - `video.list` : Accès à la liste des vidéos
   - `video.upload` : Permission de publication (optionnel)
   - `user.info.stats` : Accès aux statistiques

### 2. Configuration OAuth2

Dans votre application TikTok :

1. **Redirect URI** : `http://localhost:3000/api/tiktok/auth/callback`
2. **Scopes** : `user.info.basic,video.list,video.upload,user.info.stats`
3. **Permissions** : Lecture des données publiques

### 3. Récupérer les credentials

- **Client Key** : Copié depuis le dashboard TikTok
- **Client Secret** : Copié depuis le dashboard TikTok

## Structure de l'API

### Routes disponibles

```
GET  /api/tiktok/auth          - Génère l'URL d'authentification
POST /api/tiktok/auth          - Traite le callback OAuth2
GET  /api/tiktok/videos        - Récupère les vidéos d'un utilisateur
POST /api/tiktok/videos        - Récupère les analytics d'une vidéo
GET  /api/tiktok/recommendations - Récupère les recommandations existantes
POST /api/tiktok/recommendations - Génère de nouvelles recommandations IA
```

### Pages disponibles

```
/tiktok - Page principale avec dashboard et authentification
```

## Fonctionnalités implémentées

### ✅ Authentification OAuth2
- Flux d'authentification TikTok complet
- Gestion des tokens d'accès et de rafraîchissement
- Stockage sécurisé des credentials

### ✅ Collecte de données
- Récupération des informations utilisateur
- Liste des vidéos avec métriques
- Analytics détaillées par vidéo
- Stockage en base de données

### ✅ Analyse des performances
- Calcul d'engagement automatique
- Identification des meilleures vidéos
- Analyse des hashtags utilisés
- Recommandations de formats

### ✅ IA et recommandations
- Intégration OpenAI GPT-4
- Génération d'idées de contenu
- Scripts optimisés pour l'engagement
- Hashtags tendance et efficaces
- Timing de publication optimal

### ✅ Interface utilisateur
- Dashboard moderne et responsive
- Visualisation des statistiques
- Affichage des recommandations IA
- Interface d'authentification

## Base de données

### Modèles créés

- `TikTokConnection` : Connexions utilisateur TikTok
- `TikTokVideo` : Vidéos et leurs métriques
- `TikTokAnalytics` : Données d'analytics
- `TikTokScheduledPost` : Publications planifiées
- `TikTokTrend` : Tendances TikTok
- `TikTokRecommendation` : Recommandations IA

## Sécurité

### Gestion des tokens
- Stockage sécurisé des access tokens
- Rafraîchissement automatique des tokens expirés
- Gestion des erreurs d'authentification

### Rate limiting
- Limitation des appels API TikTok
- Gestion des quotas d'API
- Retry automatique en cas d'erreur

### RGPD
- Stockage minimal des données
- Suppression des données à la demande
- Chiffrement des tokens sensibles

## Développement

### Installation

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

### Tests

```bash
# Tester l'API TikTok
npm run test:tiktok

# Tester l'intégration complète
npm run test:integration
```

## Prochaines étapes

### 🚀 Fonctionnalités à ajouter

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

5. **Collaboration et équipes**
   - Gestion d'équipes
   - Partage de recommandations
   - Workflows de validation

### 🔧 Améliorations techniques

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

## Support

Pour toute question ou problème :

1. Vérifiez la configuration des variables d'environnement
2. Consultez les logs du serveur
3. Testez les endpoints API individuellement
4. Vérifiez les permissions TikTok Developer

## Ressources

- [TikTok for Developers](https://developers.tiktok.com/)
- [TikTok API Documentation](https://developers.tiktok.com/doc/login-kit-web)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/) 