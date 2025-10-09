# Intégration BuzzSumo - Guide Complet

## 📋 Vue d'ensemble

L'intégration BuzzSumo permet aux utilisateurs du SaaS de faire de la **recherche de contenu automatisée** sans avoir besoin de se connecter à BuzzSumo. Le SaaS utilise une **clé API unique** pour centraliser toutes les requêtes et exploiter les données pour générer du contenu optimisé via l'IA.

## ✅ Fonctionnalités implémentées

### 🔍 Recherche de contenu
- **Recherche par mot-clé** : Trouver le contenu le plus partagé sur un sujet
- **Recherche par domaine** : Analyser le contenu d'un site spécifique
- **Filtres avancés** : Pays, langue, période, nombre de résultats
- **Tri par popularité** : Contenu trié par nombre de partages

### 📊 Analyse des tendances
- **Tendances actuelles** : Mots-clés en hausse
- **Sujets populaires** : Thèmes qui génèrent le plus d'engagement
- **Scores de tendance** : Évaluation de la viralité des sujets

### 👥 Analyse des influenceurs
- **Influenceurs par sujet** : Identifiez les créateurs populaires
- **Métriques d'engagement** : Partages moyens, nombre d'articles
- **Opportunités de collaboration** : Domaines performants

### 🤖 IA et recommandations
- **Analyse automatique** : Insights générés par GPT-4
- **Idées de contenu** : Suggestions basées sur le contenu populaire
- **Stratégies de publication** : Recommandations de timing et plateformes
- **Calendrier de contenu** : Planning suggéré par l'IA

### 🔄 Automatisation
- **Surveillance de sujets** : Suivi automatique des nouveaux contenus
- **Rapports hebdomadaires** : Génération automatique d'insights
- **Alertes intelligentes** : Notifications d'opportunités
- **Nettoyage automatique** : Suppression des anciens rapports

## ⚙️ Configuration requise

### 1. Compte BuzzSumo
- Créez un compte BuzzSumo Business ou Agency
- Obtenez votre clé API depuis le dashboard BuzzSumo

### 2. Variables d'environnement
Ajoutez dans votre fichier `.env.local` :

```bash
# BuzzSumo API
BUZZSUMO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI (pour les recommandations IA)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base de données
DATABASE_URL="file:./dev.db"

# Cache Redis (optionnel)
REDIS_URL=redis://localhost:6379
```

### 3. Base de données
Exécutez les migrations Prisma pour créer les tables BuzzSumo :

```bash
npx prisma migrate dev --name add_buzzsumo_models
```

## 🚀 Guide d'utilisation

### 1. Accès au dashboard
- Naviguez vers `/buzzsumo` dans votre application
- Interface intuitive avec onglets pour chaque fonctionnalité

### 2. Recherche de contenu
1. **Saisissez un mot-clé** dans le champ de recherche
2. **Choisissez le type d'analyse** (contenu, tendances, influenceurs, idées)
3. **Configurez les filtres** (pays, langue, période)
4. **Cliquez sur "Analyser"** pour générer un rapport complet

### 3. Analyse des résultats
- **Onglet Recherche** : Contenu populaire avec métriques de partage
- **Onglet Tendances** : Mots-clés en hausse et sujets viraux
- **Onglet Influenceurs** : Créateurs populaires par sujet
- **Onglet IA** : Recommandations et idées de contenu générées

### 4. Surveillance automatique
- **Ajoutez un sujet** à la surveillance
- **Choisissez la fréquence** (quotidienne, hebdomadaire, mensuelle)
- **Recevez des alertes** automatiques sur les nouvelles opportunités

## 🔧 Scripts CRON

### Analyse automatique
```bash
npm run buzzsumo:analyze
```
Analyse tous les sujets surveillés et génère des insights automatiques.

### Nettoyage des rapports
```bash
npm run buzzsumo:cleanup
```
Supprime les rapports de plus de 30 jours (configurable).

### Génération d'insights
```bash
npm run buzzsumo:insights
```
Analyse les rapports récents pour créer des insights automatiques.

### Analyse d'un sujet spécifique
```bash
npm run buzzsumo:topic "intelligence artificielle"
```
Analyse un sujet spécifique avec tous les types de rapports.

## 📡 Endpoints API

### Recherche de contenu
```
GET /api/buzzsumo/content?query=mot-clé&country=us&language=en&timeFilter=past_year&limit=100
```

### Tendances
```
GET /api/buzzsumo/trends?country=us&language=en&limit=50
```

### Influenceurs
```
GET /api/buzzsumo/influencers?query=mot-clé&country=us&limit=50
```

### Sujets populaires
```
GET /api/buzzsumo/topics?country=us&language=en&limit=50
```

### Rapports
```
POST /api/buzzsumo/reports
{
  "userId": 1,
  "reportType": "content_search",
  "query": "mot-clé",
  "country": "us",
  "language": "en",
  "timeFilter": "past_year",
  "limit": 100
}
```

### Surveillance
```
POST /api/buzzsumo/monitoring
{
  "userId": 1,
  "topic": "mot-clé",
  "reportType": "content_search",
  "frequency": "weekly"
}
```

## 🗄️ Modèles de données

### BuzzSumoContent
- Contenu populaire avec métriques de partage
- Informations sur l'auteur, le domaine, la date de publication
- Données de partage par plateforme (Facebook, Twitter, LinkedIn, etc.)

### BuzzSumoTrend
- Tendances et mots-clés en hausse
- Scores de tendance et métriques d'engagement
- Analyse par pays et langue

### BuzzSumoInfluencer
- Influenceurs identifiés par sujet
- Métriques d'engagement et contenu populaire
- Opportunités de collaboration

### BuzzSumoInsight
- Insights générés automatiquement
- Recommandations IA et stratégies
- Alertes d'opportunités

### BuzzSumoReport
- Rapports complets sauvegardés
- Données d'analyse et recommandations
- Historique des recherches utilisateur

### BuzzSumoMonitoring
- Sujets surveillés par utilisateur
- Fréquence de surveillance configurable
- État actif/inactif

## 🔒 Sécurité et bonnes pratiques

### Protection des clés API
- ✅ Clé API stockée côté serveur uniquement
- ✅ Aucune exposition côté client
- ✅ Variables d'environnement sécurisées

### Limites d'API
- ⚠️ Respect des quotas BuzzSumo
- ⚠️ Cache intelligent pour éviter les appels redondants
- ⚠️ Gestion des erreurs et retry automatique

### Données utilisateur
- ✅ Isolation des données par utilisateur
- ✅ Suppression automatique des anciens rapports
- ✅ Chiffrement des données sensibles

## 📊 Limitations de l'API

### Quotas BuzzSumo
- **Plan Business** : 10,000 requêtes/mois
- **Plan Agency** : 50,000 requêtes/mois
- **Limite par requête** : 100 résultats maximum

### Restrictions géographiques
- Certains pays peuvent avoir des limitations
- Contenu principalement en anglais
- Influenceurs limités par région

### Données historiques
- Contenu disponible sur 1 an maximum
- Tendances limitées aux 30 derniers jours
- Influenceurs basés sur l'activité récente

## 🛠️ Dépannage

### Erreur de connexion API
```bash
# Vérifiez votre clé API
echo $BUZZSUMO_API_KEY

# Testez la connexion
npm run test:buzzsumo
```

### Erreur de base de données
```bash
# Régénérez la base de données
npx prisma migrate reset --force
npx prisma migrate dev --name add_buzzsumo_models
```

### Problèmes de cache
```bash
# Redémarrez Redis si configuré
redis-cli flushall

# Ou utilisez le cache mémoire
# Le service bascule automatiquement
```

### Erreurs de l'IA
```bash
# Vérifiez votre clé OpenAI
echo $OPENAI_API_KEY

# Testez les recommandations
npm run buzzsumo:topic "test"
```

## 📈 Monitoring et alertes

### Métriques à surveiller
- **Taux de succès API** : > 95%
- **Temps de réponse** : < 2 secondes
- **Utilisation du cache** : > 80%
- **Erreurs IA** : < 5%

### Alertes automatiques
- Échec de connexion API
- Quota BuzzSumo atteint
- Erreurs de base de données
- Problèmes de cache Redis

### Logs importants
```bash
# Logs d'analyse automatique
npm run buzzsumo:analyze

# Logs de nettoyage
npm run buzzsumo:cleanup

# Logs d'insights
npm run buzzsumo:insights
```

## 🚀 Prochaines étapes recommandées

### Fonctionnalités avancées
1. **Export PDF** des rapports
2. **Intégration Slack** pour les alertes
3. **API webhook** pour les notifications
4. **Dashboard analytics** avancé

### Optimisations
1. **Cache Redis** pour améliorer les performances
2. **Queue de tâches** pour les analyses longues
3. **CDN** pour les assets statiques
4. **Monitoring** en temps réel

### Intégrations
1. **Google Analytics** pour le tracking
2. **Slack/Discord** pour les notifications
3. **Zapier** pour l'automatisation
4. **API REST** publique

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la configuration dans `.env.local`
2. Testez avec `npm run test:buzzsumo`
3. Consultez les logs d'erreur
4. Contactez l'équipe technique

---

**L'intégration BuzzSumo est maintenant prête pour la production !** 🎉 