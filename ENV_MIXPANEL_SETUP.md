# 🔧 Configuration Mixpanel Centralisée - Variables d'environnement

## 📋 Variables requises

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# ========================================
# MIXPANEL CENTRALIZED CONFIGURATION
# ========================================

# Mixpanel Project Configuration (compte SaaS unique)
MIXPANEL_PROJECT_TOKEN=your_mixpanel_project_token_here
MIXPANEL_API_SECRET=your_mixpanel_api_secret_here
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_project_token_here

# OpenAI (pour les insights IA)
OPENAI_API_KEY=your_openai_api_key_here

# ========================================
# EXISTING VARIABLES (gardez celles-ci)
# ========================================

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Stripe (pour les paiements)
STRIPE_SECRET_KEY=your_stripe_secret_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Redis (pour le cache)
REDIS_URL=redis://localhost:6379

# Autres APIs existantes...
```

## 🚀 Étapes de configuration

### 1. Créer un projet Mixpanel

1. Allez sur [Mixpanel](https://mixpanel.com/) et créez un compte
2. Créez un nouveau projet pour votre SaaS
3. Notez le **Project Token** (visible dans les paramètres du projet)
4. Générez une **API Secret** dans les paramètres avancés

### 2. Configurer les événements

Dans votre projet Mixpanel :

1. **Événements automatiques** configurés :
   - `page_view` - Pages visitées
   - `button_click` - Clics sur boutons
   - `form_interaction` - Interactions formulaires
   - `page_scroll` - Scroll de pages
   - `time_on_page` - Temps passé
   - `conversion` - Conversions
   - `content_engagement` - Engagement contenu

2. **Propriétés utilisateur** :
   - `$userId` - ID utilisateur du SaaS
   - `$distinctId` - Identifiant unique Mixpanel
   - `$created` - Date de création du profil

### 3. Obtenir les clés

Après création du projet Mixpanel, vous obtiendrez :
- **Project Token** : Copiez dans `MIXPANEL_PROJECT_TOKEN` et `NEXT_PUBLIC_MIXPANEL_TOKEN`
- **API Secret** : Copiez dans `MIXPANEL_API_SECRET`

### 4. Test de configuration

```bash
# Vérifier que les variables sont chargées
npm run dev

# Tester le tracking
curl -X POST http://localhost:3000/api/mixpanel/track \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "event": {
      "eventName": "test_event",
      "properties": {"test": true}
    }
  }'
```

## 🔒 Sécurité

### Variables sensibles
- `MIXPANEL_API_SECRET` : Ne jamais commiter dans Git
- `NEXT_PUBLIC_MIXPANEL_TOKEN` : Visible côté client (sécurisé)
- `OPENAI_API_KEY` : Gardez votre clé OpenAI secrète
- `DATABASE_URL` : En production, utilisez PostgreSQL

### Environnements
```bash
# Développement
.env.local

# Production
.env.production

# Test
.env.test
```

## 🧪 Test de l'intégration

### 1. Démarrage
```bash
npm run dev
```

### 2. Test du tracking automatique
1. Allez sur `http://localhost:3000/behavior`
2. Interagissez avec l'interface (clics, scrolls, etc.)
3. Vérifiez dans Mixpanel que les événements apparaissent
4. Vérifiez en base locale que les données sont sauvegardées

### 3. Test des rapports
```bash
# Générer un rapport de test
curl -X POST "http://localhost:3000/api/mixpanel/reports?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "engagement",
    "dateRange": {
      "startDate": "7daysAgo",
      "endDate": "today"
    }
  }'
```

### 4. Test des insights
```bash
# Vérifier les insights générés
curl "http://localhost:3000/api/mixpanel/insights?userId=1"
```

## 🚨 Dépannage

### Erreurs courantes

**1. "Invalid project token"**
- Vérifiez que `MIXPANEL_PROJECT_TOKEN` est correct
- Assurez-vous que le projet Mixpanel existe

**2. "API Secret not found"**
- Vérifiez que `MIXPANEL_API_SECRET` est correct
- Régénérez la clé API si nécessaire

**3. "Events not tracking"**
- Vérifiez que `NEXT_PUBLIC_MIXPANEL_TOKEN` est défini
- Vérifiez la console du navigateur pour les erreurs

**4. "No data in reports"**
- Vérifiez que des événements ont été trackés
- Attendez quelques minutes pour la synchronisation

### Logs utiles

```bash
# Voir les logs de l'application
npm run dev

# Vérifier la base de données
npx prisma studio

# Tester les APIs
curl -v http://localhost:3000/api/mixpanel/profile?userId=1
```

## 📊 Monitoring

### Métriques à surveiller
- **Événements trackés** : Volume d'événements par jour
- **Erreurs de tracking** : Taux d'échec des envois
- **Latence API** : Temps de réponse Mixpanel
- **Insights générés** : Nombre d'insights par utilisateur

### Alertes recommandées
- **Taux d'erreur > 5%** : Problème de configuration
- **Aucun événement > 1h** : Problème de tracking
- **Latence > 2s** : Problème de performance

## 📚 Ressources

- [Mixpanel Dashboard](https://mixpanel.com/report)
- [Documentation Mixpanel API](https://developer.mixpanel.com/reference/api-overview)
- [Guide Mixpanel JavaScript](https://developer.mixpanel.com/docs/javascript)
- [Événements Mixpanel](https://developer.mixpanel.com/docs/tracking/how-tos/event-tracking)

## ✅ Checklist de configuration

- [ ] Projet Mixpanel créé
- [ ] Project Token obtenu
- [ ] API Secret généré
- [ ] Variables d'environnement ajoutées
- [ ] Base de données migrée
- [ ] Tracking automatique testé
- [ ] Génération de rapports testée
- [ ] Insights IA testés
- [ ] Monitoring configuré

Une fois cette checklist complétée, l'intégration Mixpanel centralisée est prête pour la production ! 🚀

## 🎯 Avantages du modèle centralisé

### Pour le SaaS
- ✅ **Contrôle total** des données et de la configuration
- ✅ **Analyse cross-utilisateurs** pour optimiser le produit
- ✅ **Modèle scalable** pour toutes les APIs tierces
- ✅ **Sécurité renforcée** avec données centralisées

### Pour l'utilisateur
- ✅ **Aucune configuration** requise
- ✅ **Insights automatiques** sans intervention
- ✅ **Données sécurisées** et privées
- ✅ **Expérience transparente** et fluide 