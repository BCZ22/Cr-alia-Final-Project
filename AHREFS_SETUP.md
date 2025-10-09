# 🔗 Configuration Ahrefs API - Crealia

## 🎯 Vue d'ensemble

Ce guide vous accompagne dans la configuration de l'intégration **Ahrefs API** pour votre SaaS Crealia. L'intégration permet d'analyser les backlinks, referring domains, ancres et concurrents de vos domaines.

## ✅ Fonctionnalités implémentées

### 🔐 Authentification API
- ✅ **Compte Ahrefs Business/Agency** centralisé pour le SaaS
- ✅ **Clé API sécurisée** stockée dans les variables d'environnement
- ✅ **Toutes les requêtes** passent par le backend du SaaS
- ✅ **Aucune connexion utilisateur** requise côté client

### 📊 Requêtes API exposées
- ✅ **Backlinks** : Analyse des liens entrants vers un domaine
- ✅ **Referring Domains** : Liste des domaines référents
- ✅ **Ancres** : Analyse des textes d'ancrage
- ✅ **Domain Rating** : Score d'autorité du domaine
- ✅ **Concurrents** : Sites concurrents naturels
- ✅ **Top Pages** : Pages les plus populaires d'un domaine

### 🤖 Traitement IA des données
- ✅ **Analyse automatique** des backlinks haute autorité
- ✅ **Recommandations de netlinking** générées par IA
- ✅ **Stratégies de contenu** basées sur les backlinks
- ✅ **Opportunités de partenariat** identifiées automatiquement

### 🧠 Moteur IA personnalisé
- ✅ **Suggestions de contenu** à forte viralité SEO
- ✅ **Stratégies de partenariat** et outreach
- ✅ **Scripts optimisés** pour vidéos et articles

### 🧾 Dashboard utilisateur
- ✅ **Profil de backlinks** analysé par l'IA
- ✅ **Backlinks concurrents** + opportunités à répliquer
- ✅ **Classement des referring domains** les plus utiles
- ✅ **Suggestions de contenu** automatisées

### 🔁 Automatisation CRON
- ✅ **Analyse périodique** des domaines surveillés
- ✅ **Génération automatique** d'insights et recommandations
- ✅ **Surveillance de concurrents** avec alertes

## 🔧 Configuration requise

### 1. Compte Ahrefs API

#### Étape 1 : Créer un compte Ahrefs
1. Allez sur [ahrefs.com](https://ahrefs.com)
2. Choisissez un plan **Business** ou **Agency** (recommandé)
3. Créez votre compte avec un email professionnel

#### Étape 2 : Générer la clé API
1. Connectez-vous à votre compte Ahrefs
2. Allez dans **API Access** dans les paramètres
3. Générez une nouvelle clé API
4. Notez la clé API (format : `ahrefs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 2. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# =============================================================================
# AHREFS API CONFIGURATION
# =============================================================================

# Clé API Ahrefs (Business/Agency plan requis)
AHREFS_API_KEY=ahrefs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Configuration du cache (optionnel)
AHREFS_CACHE_TTL=3600
AHREFS_MAX_REQUESTS_PER_MINUTE=100

# Configuration des webhooks (optionnel)
AHREFS_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Configuration de la base de données

Les modèles Prisma ont été créés automatiquement. Exécutez :

```bash
# Générer le client Prisma avec les nouveaux modèles
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev
```

## 🚀 Utilisation

### 1. Accès au dashboard

Visitez `/ahrefs` dans votre application pour accéder au dashboard complet.

### 2. Analyse d'un domaine

1. **Entrez un domaine** dans le champ de recherche
2. **Choisissez le type d'analyse** :
   - `domain_analysis` : Analyse complète
   - `backlinks` : Backlinks uniquement
   - `refdomains` : Referring domains
   - `anchors` : Ancres
   - `competitors` : Concurrents
3. **Cliquez sur "Analyser"**

### 3. Fonctionnalités disponibles

#### Vue d'ensemble
- **Domain Rating** avec barre de progression
- **Nombre de backlinks** et referring domains
- **Trafic organique** estimé
- **Recommandations IA** automatiques

#### Backlinks
- **Liste des backlinks** avec DR et ancres
- **Filtrage par autorité** (DR 70+, 50+, etc.)
- **Analyse des ancres** (branded vs generic)
- **Opportunités haute autorité** identifiées

#### Referring Domains
- **Liste des domaines référents**
- **Analyse de la qualité** des domaines
- **Stratégies de partenariat** suggérées

#### Ancres
- **Profil d'ancrage** complet
- **Détection d'ancres génériques**
- **Recommandations d'amélioration**

#### Concurrents
- **Liste des concurrents** naturels
- **Score de chevauchement**
- **Opportunités de différenciation**

#### IA & Recommandations
- **Stratégies de netlinking** personnalisées
- **Suggestions de contenu** basées sur les backlinks
- **Opportunités de partenariat** identifiées

## 🔄 Automatisation

### Scripts CRON disponibles

```bash
# Analyse automatique des domaines surveillés
npm run ahrefs:analyze

# Nettoyage des anciens rapports (30 jours par défaut)
npm run ahrefs:cleanup

# Génération d'insights automatiques
npm run ahrefs:insights

# Analyse d'un domaine spécifique
npm run ahrefs:domain example.com 1 domain_analysis
```

### Configuration CRON (Linux/Mac)

Ajoutez ces lignes à votre crontab (`crontab -e`) :

```bash
# Analyse quotidienne des domaines surveillés (6h du matin)
0 6 * * * cd /path/to/crealia && npm run ahrefs:analyze

# Nettoyage hebdomadaire des anciens rapports (dimanche 2h du matin)
0 2 * * 0 cd /path/to/crealia && npm run ahrefs:cleanup

# Génération d'insights hebdomadaire (samedi 8h du matin)
0 8 * * 6 cd /path/to/crealia && npm run ahrefs:insights
```

## 📊 API Endpoints

### Backlinks
```bash
GET /api/ahrefs/backlinks?domain=example.com&limit=100&offset=0
```

### Referring Domains
```bash
GET /api/ahrefs/refdomains?domain=example.com&limit=100&offset=0
```

### Ancres
```bash
GET /api/ahrefs/anchors?domain=example.com&limit=100&offset=0
```

### Analyse de domaine
```bash
GET /api/ahrefs/domain?domain=example.com
```

### Concurrents
```bash
GET /api/ahrefs/competitors?domain=example.com&limit=50&offset=0
```

### Rapports
```bash
# Générer un rapport
POST /api/ahrefs/reports
{
  "userId": 1,
  "reportType": "domain_analysis",
  "target": "example.com",
  "limit": 100
}

# Récupérer les rapports d'un utilisateur
GET /api/ahrefs/reports?userId=1
```

### Surveillance
```bash
# Ajouter un domaine à la surveillance
POST /api/ahrefs/monitoring
{
  "userId": 1,
  "domain": "example.com",
  "reportType": "domain_analysis",
  "frequency": "weekly"
}

# Récupérer la surveillance d'un utilisateur
GET /api/ahrefs/monitoring?userId=1

# Supprimer une surveillance
DELETE /api/ahrefs/monitoring?userId=1&domain=example.com
```

## 🧪 Tests

### Test manuel d'une analyse

```bash
# Analyser un domaine spécifique
npm run ahrefs:domain example.com 1 domain_analysis
```

### Vérification des endpoints

```bash
# Test des backlinks
curl "http://localhost:3000/api/ahrefs/backlinks?domain=example.com"

# Test de l'analyse de domaine
curl "http://localhost:3000/api/ahrefs/domain?domain=example.com"
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Clé API sécurisée** : Stockez la clé dans `.env.local` (non commitée)
2. **Rate limiting** : Respectez les limites de l'API Ahrefs
3. **Cache intelligent** : Évitez les requêtes redondantes
4. **Validation des données** : Vérifiez les domaines avant analyse

### Limitations API

- **Business Plan** : 1000 requêtes/jour
- **Agency Plan** : 5000 requêtes/jour
- **Rate Limit** : 100 requêtes/minute
- **Cache TTL** : 1 heure par défaut

## 🚨 Dépannage

### Erreurs courantes

#### "API key invalid"
- Vérifiez que `AHREFS_API_KEY` est correcte
- Assurez-vous que votre compte Ahrefs est actif

#### "Rate limit exceeded"
- Attendez quelques minutes avant de refaire une requête
- Vérifiez votre plan Ahrefs (Business/Agency requis)

#### "Domain not found"
- Vérifiez l'orthographe du domaine
- Assurez-vous que le domaine existe et est accessible

#### "Database connection error"
- Vérifiez que Prisma est configuré correctement
- Exécutez `npx prisma generate` et `npx prisma migrate dev`

### Logs de débogage

Activez les logs détaillés en ajoutant dans `.env.local` :

```bash
DEBUG=ahrefs:*
```

## 📈 Monitoring

### Métriques à surveiller

1. **Nombre de requêtes API** par jour
2. **Taux de succès** des analyses
3. **Temps de réponse** moyen
4. **Utilisation du cache** (hit rate)

### Alertes recommandées

- **Quota API** dépassé à 80%
- **Erreurs API** > 5% sur 1 heure
- **Temps de réponse** > 10 secondes

## 🎯 Prochaines étapes

### Améliorations recommandées

1. **Interface avancée** : Graphiques et visualisations
2. **Export PDF** : Rapports détaillés exportables
3. **Alertes email** : Notifications d'opportunités
4. **Intégration Slack** : Notifications en temps réel
5. **API publique** : Endpoints pour intégrations tierces

### Optimisations techniques

1. **Cache Redis** : Amélioration des performances
2. **Queue system** : Gestion des analyses en arrière-plan
3. **Webhooks** : Notifications en temps réel
4. **Analytics** : Suivi de l'utilisation

## 🎉 Conclusion

L'intégration Ahrefs est maintenant **complète et fonctionnelle** ! Vos utilisateurs peuvent :

- ✅ **Analyser leurs backlinks** en temps réel
- ✅ **Identifier des opportunités** de netlinking
- ✅ **Surveiller leurs concurrents** automatiquement
- ✅ **Recevoir des recommandations IA** personnalisées
- ✅ **Générer du contenu optimisé** basé sur les données

Le système est **prêt pour la production** et peut gérer des **créateurs de contenu** avec toutes les fonctionnalités nécessaires pour un SaaS de niveau professionnel ! 🚀 