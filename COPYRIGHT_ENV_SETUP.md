# Configuration du Service de Détection de Plagiat et Copyright

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine de votre projet avec les variables suivantes :

```bash
# Configuration de l'API de détection de plagiat
COPYRIGHT_API_KEY=your_api_key_here
COPYRIGHT_API_BASE_URL=https://api.copyright-checker.com/v1
COPYRIGHT_API_TIMEOUT=30000
COPYRIGHT_API_MAX_RETRIES=3
COPYRIGHT_API_RATE_LIMIT_PER_MIN=60
COPYRIGHT_API_RATE_LIMIT_PER_HOUR=1000
```

## Configuration des variables

### COPYRIGHT_API_KEY
- **Description** : Clé API pour accéder au service de détection de plagiat
- **Format** : Chaîne de caractères
- **Exemple** : `sk-1234567890abcdef...`
- **Obligatoire** : ✅ Oui

### COPYRIGHT_API_BASE_URL
- **Description** : URL de base de l'API de détection
- **Format** : URL HTTPS
- **Valeur par défaut** : `https://api.copyright-checker.com/v1`
- **Obligatoire** : ✅ Oui

### COPYRIGHT_API_TIMEOUT
- **Description** : Timeout des requêtes API en millisecondes
- **Format** : Nombre entier
- **Valeur par défaut** : `30000` (30 secondes)
- **Obligatoire** : ❌ Non

### COPYRIGHT_API_MAX_RETRIES
- **Description** : Nombre maximum de tentatives en cas d'échec
- **Format** : Nombre entier
- **Valeur par défaut** : `3`
- **Obligatoire** : ❌ Non

### COPYRIGHT_API_RATE_LIMIT_PER_MIN
- **Description** : Limite de requêtes par minute
- **Format** : Nombre entier
- **Valeur par défaut** : `60`
- **Obligatoire** : ❌ Non

### COPYRIGHT_API_RATE_LIMIT_PER_HOUR
- **Description** : Limite de requêtes par heure
- **Format** : Nombre entier
- **Valeur par défaut** : `1000`
- **Obligatoire** : ❌ Non

## Services d'API recommandés

### 1. Copyscape
- **URL** : https://www.copyscape.com/
- **Avantages** : Très précis, base de données étendue
- **Prix** : Payant par vérification
- **Limite** : 200 mots par vérification gratuite

### 2. Turnitin
- **URL** : https://www.turnitin.com/
- **Avantages** : Standard académique, très complet
- **Prix** : Abonnement institutionnel
- **Limite** : Principalement pour l'éducation

### 3. Grammarly Plagiarism
- **URL** : https://www.grammarly.com/plagiarism-checker
- **Avantages** : Intégré à Grammarly, interface simple
- **Prix** : Inclus dans Grammarly Premium
- **Limite** : 100,000 caractères par vérification

### 4. Plagiarism Checker X
- **URL** : https://plagiarismcheckerx.com/
- **Avantages** : API disponible, bon rapport qualité/prix
- **Prix** : Plans à partir de $19.99/mois
- **Limite** : 25,000 mots par vérification

### 5. Copyleaks
- **URL** : https://api.copyleaks.com/
- **Avantages** : API robuste, support multilingue
- **Prix** : Plans à partir de $9.99/mois
- **Limite** : 100,000 mots par vérification

## Configuration pour différents environnements

### Développement
```bash
COPYRIGHT_API_KEY=dev_test_key
COPYRIGHT_API_BASE_URL=https://api-dev.copyright-checker.com/v1
COPYRIGHT_API_TIMEOUT=60000
COPYRIGHT_API_MAX_RETRIES=5
COPYRIGHT_API_RATE_LIMIT_PER_MIN=100
COPYRIGHT_API_RATE_LIMIT_PER_HOUR=2000
```

### Staging
```bash
COPYRIGHT_API_KEY=staging_key_here
COPYRIGHT_API_BASE_URL=https://api-staging.copyright-checker.com/v1
COPYRIGHT_API_TIMEOUT=45000
COPYRIGHT_API_MAX_RETRIES=3
COPYRIGHT_API_RATE_LIMIT_PER_MIN=80
COPYRIGHT_API_RATE_LIMIT_PER_HOUR=1500
```

### Production
```bash
COPYRIGHT_API_KEY=production_key_here
COPYRIGHT_API_BASE_URL=https://api.copyright-checker.com/v1
COPYRIGHT_API_TIMEOUT=30000
COPYRIGHT_API_MAX_RETRIES=3
COPYRIGHT_API_RATE_LIMIT_PER_MIN=60
COPYRIGHT_API_RATE_LIMIT_PER_HOUR=1000
```

## Vérification de la configuration

Après avoir configuré les variables d'environnement, vous pouvez tester la configuration :

```bash
# Vérifier que les variables sont chargées
npm run dev

# Tester l'API de copyright
curl -X POST http://localhost:3000/api/copyright/check \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test de contenu pour vérifier la configuration.",
    "contentType": "article",
    "checkType": "comprehensive"
  }'
```

## Gestion des erreurs courantes

### Erreur : "COPYRIGHT_API_KEY is required"
- **Cause** : Variable d'environnement manquante
- **Solution** : Vérifier que `.env.local` existe et contient `COPYRIGHT_API_KEY`

### Erreur : "API request failed: 401"
- **Cause** : Clé API invalide ou expirée
- **Solution** : Vérifier la validité de la clé API

### Erreur : "Rate limit exceeded"
- **Cause** : Limite de requêtes dépassée
- **Solution** : Attendre ou augmenter les limites dans la configuration

### Erreur : "Request timeout exceeded"
- **Cause** : Timeout trop court
- **Solution** : Augmenter `COPYRIGHT_API_TIMEOUT`

## Sécurité

### Bonnes pratiques
- ✅ Ne jamais commiter les clés API dans le code
- ✅ Utiliser des variables d'environnement
- ✅ Limiter l'accès aux clés API
- ✅ Surveiller l'utilisation des quotas
- ✅ Implémenter le rate limiting côté client

### Variables sensibles
```bash
# ❌ Ne jamais faire
COPYRIGHT_API_KEY=sk-1234567890abcdef

# ✅ Toujours utiliser des variables d'environnement
COPYRIGHT_API_KEY=${COPYRIGHT_API_KEY}
```

## Monitoring et alertes

### Métriques à surveiller
- Nombre de vérifications par jour
- Taux de succès des requêtes
- Temps de réponse moyen
- Utilisation du quota
- Erreurs API

### Alertes recommandées
- Quota utilisé > 80%
- Taux de succès < 90%
- Temps de réponse > 10 secondes
- Erreurs 4xx/5xx > 5%

## Support et dépannage

### Logs utiles
```bash
# Vérifier les logs de l'application
npm run dev

# Vérifier les erreurs dans la console du navigateur
# Vérifier les logs du serveur Next.js
```

### Tests de connectivité
```bash
# Test de base de l'API
curl -X GET https://api.copyright-checker.com/v1/health

# Test avec authentification
curl -X GET https://api.copyright-checker.com/v1/health \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Contact support
- **Documentation API** : Consulter la documentation officielle
- **Support technique** : Contacter l'équipe support de l'API
- **Communauté** : Forums et groupes d'entraide








