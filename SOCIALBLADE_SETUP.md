# Intégration SocialBlade - Guide Complet

## 📋 Vue d'ensemble

L'intégration SocialBlade permet aux utilisateurs du SaaS d'analyser automatiquement des créateurs de contenu (YouTube, TikTok, Instagram) sans avoir besoin de se connecter à SocialBlade. Le SaaS utilise une **clé API unique** pour centraliser toutes les requêtes et exploiter les données pour générer des recommandations stratégiques via l'IA.

## ✅ Fonctionnalités implémentées

### 🔍 Analyse de créateurs
- **Analyse YouTube** : Chaînes avec métriques complètes (abonnés, vues, engagement, revenus)
- **Analyse TikTok** : Comptes avec statistiques de croissance et viralité
- **Analyse Instagram** : Profils avec métriques d'engagement et de portée
- **Statistiques historiques** : Évolution des métriques dans le temps

### 📊 Comparaisons et benchmarks
- **Comparaison de créateurs** : Analyse comparative entre plusieurs créateurs
- **Benchmarks par plateforme** : Classements et moyennes par niche
- **Scores de performance** : Évaluation automatisée de la qualité du contenu
- **Recommandations stratégiques** : Insights basés sur les meilleures pratiques

### 🤖 IA et recommandations
- **Analyse automatique** : Insights générés par GPT-4
- **Stratégies de contenu** : Recommandations basées sur les créateurs performants
- **Planning de publication** : Calendriers optimisés inspirés des meilleures chaînes
- **Scripts de contenu** : Idées générées automatiquement

### 🔄 Automatisation
- **Surveillance de créateurs** : Suivi automatique des créateurs d'intérêt
- **Rapports de tendances** : Génération hebdomadaire d'analyses
- **Alertes intelligentes** : Notifications d'opportunités et de changements
- **Nettoyage automatique** : Suppression des anciens rapports

## ⚙️ Configuration requise

### 1. Compte SocialBlade
- Créez un compte SocialBlade Pro ou Business
- Obtenez votre clé API depuis le dashboard SocialBlade

### 2. Variables d'environnement
Ajoutez dans votre fichier `.env.local` :

```bash
# SocialBlade API
SOCIALBLADE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI (pour les recommandations IA)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base de données
DATABASE_URL="file:./dev.db"

# Cache Redis (optionnel)
REDIS_URL=redis://localhost:6379
```

### 3. Base de données
Exécutez les migrations Prisma pour créer les tables SocialBlade :

```bash
npx prisma migrate dev --name add_socialblade_models
```

## 🚀 Guide d'utilisation

### 1. Accès au dashboard
- Naviguez vers `/socialblade` dans votre application
- Interface intuitive avec onglets pour chaque fonctionnalité

### 2. Analyse de créateur
1. **Sélectionnez la plateforme** (YouTube, TikTok, Instagram)
2. **Saisissez l'URL ou le nom d'utilisateur** du créateur
3. **Cliquez sur "Analyser"** pour obtenir les métriques complètes
4. **Consultez les insights IA** pour les recommandations

### 3. Analyse des résultats
- **Onglet Analyse** : Métriques détaillées du créateur
- **Onglet Tendance** : Créateurs populaires par plateforme
- **Onglet Comparaison** : Benchmarks entre créateurs
- **Onglet IA** : Recommandations et stratégies générées

### 4. Surveillance automatique
- **Ajoutez un créateur** à la surveillance
- **Choisissez la fréquence** (quotidienne, hebdomadaire, mensuelle)
- **Recevez des alertes** automatiques sur les changements

## 🔧 Scripts CRON

### Analyse automatique
```bash
npm run socialblade:analyze
```
Analyse tous les créateurs surveillés et génère des insights automatiques.

### Nettoyage des rapports
```bash
npm run socialblade:cleanup
```
Supprime les rapports de plus de 30 jours (configurable).

### Génération d'insights
```bash
npm run socialblade:insights
```
Analyse les rapports récents pour créer des insights automatiques.

### Analyse d'un créateur spécifique
```bash
npm run socialblade:creator "https://youtube.com/@channel"
```
Analyse un créateur spécifique avec tous les types de rapports.

### Rapport de tendances
```bash
npm run socialblade:trends youtube
```
Génère un rapport de tendances pour une plateforme spécifique.

## 📡 Endpoints API

### Analyse YouTube
```
GET /api/socialblade/youtube?url=https://youtube.com/@channel
```

### Analyse TikTok
```
GET /api/socialblade/tiktok?username=username
```

### Analyse Instagram
```
GET /api/socialblade/instagram?username=username
```

### Statistiques historiques
```
GET /api/socialblade/stats?channelId=ID&platform=youtube&days=30
```

### Comparaison de créateurs
```
POST /api/socialblade/compare
{
  "channels": ["channel1", "channel2"],
  "platform": "youtube"
}
```

### Créateurs tendance
```
GET /api/socialblade/trending?platform=youtube&niche=general&limit=10
```

### Rapports
```
POST /api/socialblade/reports
{
  "userId": 1,
  "reportType": "channel_analysis",
  "channelUrl": "https://youtube.com/@channel",
  "platform": "youtube"
}
```

### Surveillance
```
POST /api/socialblade/monitoring
{
  "userId": 1,
  "channelUrl": "https://youtube.com/@channel",
  "platform": "youtube",
  "frequency": "weekly"
}
```

## 🗄️ Modèles de données

### SocialBladeChannel
- Données complètes des créateurs (abonnés, vues, engagement)
- Métriques de performance et de croissance
- Estimations de revenus et classements
- Informations par plateforme (YouTube, TikTok, Instagram)

### SocialBladeStats
- Statistiques historiques des créateurs
- Évolution des métriques dans le temps
- Données de croissance et d'engagement
- Analyses temporelles

### SocialBladeComparison
- Comparaisons entre créateurs
- Différences calculées automatiquement
- Insights de benchmarking
- Recommandations basées sur les comparaisons

### SocialBladeInsight
- Insights générés automatiquement
- Recommandations IA et stratégies
- Alertes d'opportunités
- Analyses de performance

### SocialBladeReport
- Rapports complets sauvegardés
- Données d'analyse et recommandations
- Historique des recherches utilisateur
- Métadonnées des analyses

### SocialBladeMonitoring
- Créateurs surveillés par utilisateur
- Fréquence de surveillance configurable
- État actif/inactif
- Historique des vérifications

## 🔒 Sécurité et bonnes pratiques

### Protection des clés API
- ✅ Clé API stockée côté serveur uniquement
- ✅ Aucune exposition côté client
- ✅ Variables d'environnement sécurisées

### Limites d'API
- ⚠️ Respect des quotas SocialBlade
- ⚠️ Cache intelligent pour éviter les appels redondants
- ⚠️ Gestion des erreurs et retry automatique

### Données utilisateur
- ✅ Isolation des données par utilisateur
- ✅ Suppression automatique des anciens rapports
- ✅ Chiffrement des données sensibles

## 📊 Limitations de l'API

### Quotas SocialBlade
- **Plan Pro** : 1,000 requêtes/mois
- **Plan Business** : 10,000 requêtes/mois
- **Limite par requête** : Données en temps réel

### Restrictions par plateforme
- **YouTube** : Données publiques uniquement
- **TikTok** : Limités aux comptes publics
- **Instagram** : Métriques de base disponibles

### Données historiques
- **YouTube** : Historique complet disponible
- **TikTok** : Données limitées à 30 jours
- **Instagram** : Métriques de base uniquement

## 🛠️ Dépannage

### Erreur de connexion API
```bash
# Vérifiez votre clé API
echo $SOCIALBLADE_API_KEY

# Testez la connexion
npm run test:socialblade
```

### Erreur de base de données
```bash
# Régénérez la base de données
npx prisma migrate reset --force
npx prisma migrate dev --name add_socialblade_models
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
npm run socialblade:creator "test"
```

## 📈 Monitoring et alertes

### Métriques à surveiller
- **Taux de succès API** : > 95%
- **Temps de réponse** : < 3 secondes
- **Utilisation du cache** : > 80%
- **Erreurs IA** : < 5%

### Alertes automatiques
- Échec de connexion API
- Quota SocialBlade atteint
- Erreurs de base de données
- Problèmes de cache Redis

### Logs importants
```bash
# Logs d'analyse automatique
npm run socialblade:analyze

# Logs de nettoyage
npm run socialblade:cleanup

# Logs d'insights
npm run socialblade:insights
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
2. Testez avec `npm run test:socialblade`
3. Consultez les logs d'erreur
4. Contactez l'équipe technique

---

**L'intégration SocialBlade est maintenant prête pour la production !** 🎉 