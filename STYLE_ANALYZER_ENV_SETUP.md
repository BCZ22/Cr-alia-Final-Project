# Configuration des Variables d'Environnement - Analyseur de Style

## Variables Requises

### 1. Variables Principales

```bash
# URL de l'API Hemingway Editor (optionnel - utilise l'analyse locale par défaut)
HEMINGWAY_API_URL=https://api.hemingwayapp.com

# Clé API Hemingway Editor (optionnel - utilise l'analyse locale par défaut)
HEMINGWAY_API_KEY=your_hemingway_api_key_here

# Limite de taux par minute (défaut: 100)
STYLE_ANALYZER_RATE_LIMIT=100

# Taille maximale du cache (défaut: 1000)
STYLE_ANALYZER_CACHE_SIZE=1000

# Timeout des requêtes API en millisecondes (défaut: 10000)
STYLE_ANALYZER_TIMEOUT=10000

# Nombre maximum de tentatives (défaut: 3)
STYLE_ANALYZER_MAX_RETRIES=3
```

### 2. Variables de Sécurité

```bash
# Clé secrète pour le chiffrement des données sensibles
STYLE_ANALYZER_SECRET_KEY=your_secret_key_here

# JWT Secret pour l'authentification (si applicable)
JWT_SECRET=your_jwt_secret_here

# CORS Origins autorisés
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 3. Variables de Monitoring

```bash
# Activer les logs détaillés (défaut: false)
STYLE_ANALYZER_DEBUG=true

# URL du service de monitoring (optionnel)
MONITORING_URL=https://your-monitoring-service.com

# Clé API pour le monitoring
MONITORING_API_KEY=your_monitoring_api_key_here
```

## Configuration par Environnement

### Développement (.env.local)

```bash
# .env.local
NODE_ENV=development
HEMINGWAY_API_URL=http://localhost:8000
STYLE_ANALYZER_DEBUG=true
STYLE_ANALYZER_RATE_LIMIT=1000
STYLE_ANALYZER_CACHE_SIZE=100
```

### Production (.env.production)

```bash
# .env.production
NODE_ENV=production
HEMINGWAY_API_URL=https://api.hemingwayapp.com
HEMINGWAY_API_KEY=your_production_api_key
STYLE_ANALYZER_DEBUG=false
STYLE_ANALYZER_RATE_LIMIT=100
STYLE_ANALYZER_CACHE_SIZE=1000
STYLE_ANALYZER_TIMEOUT=5000
```

### Test (.env.test)

```bash
# .env.test
NODE_ENV=test
HEMINGWAY_API_URL=http://localhost:8000
STYLE_ANALYZER_DEBUG=true
STYLE_ANALYZER_RATE_LIMIT=10000
STYLE_ANALYZER_CACHE_SIZE=10
```

## Installation et Configuration

### 1. Copier le fichier d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Ou créer un nouveau fichier
touch .env.local
```

### 2. Configurer les variables

```bash
# Éditer le fichier .env.local
nano .env.local

# Ajouter vos variables
HEMINGWAY_API_KEY=your_actual_api_key
STYLE_ANALYZER_SECRET_KEY=your_secret_key
```

### 3. Vérifier la configuration

```bash
# Vérifier que les variables sont chargées
npm run dev

# Ou tester avec un script de vérification
node scripts/verify-env.js
```

## Script de Vérification des Variables

Créez un fichier `scripts/verify-env.js` :

```javascript
#!/usr/bin/env node

const requiredVars = [
  'STYLE_ANALYZER_SECRET_KEY',
  'HEMINGWAY_API_KEY'
];

const optionalVars = [
  'HEMINGWAY_API_URL',
  'STYLE_ANALYZER_RATE_LIMIT',
  'STYLE_ANALYZER_CACHE_SIZE',
  'STYLE_ANALYZER_TIMEOUT',
  'STYLE_ANALYZER_MAX_RETRIES'
];

console.log('🔍 Vérification des variables d\'environnement...\n');

// Vérifier les variables requises
let hasErrors = false;
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ ${varName} - REQUIS mais manquant`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName} - Configuré`);
  }
});

// Vérifier les variables optionnelles
console.log('\n📋 Variables optionnelles :');
optionalVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} - Configuré (${process.env[varName]})`);
  } else {
    console.log(`⚠️  ${varName} - Non configuré (utilise la valeur par défaut)`);
  }
});

// Résumé
console.log('\n📊 Résumé :');
if (hasErrors) {
  console.log('❌ Configuration incomplète. Veuillez configurer toutes les variables requises.');
  process.exit(1);
} else {
  console.log('✅ Configuration valide !');
}

console.log('\n🚀 L\'analyseur de style est prêt à être utilisé !');
```

## Variables d'Environnement pour Docker

### docker-compose.yml

```yaml
version: '3.8'
services:
  style-analyzer:
    build: .
    environment:
      - NODE_ENV=production
      - HEMINGWAY_API_URL=${HEMINGWAY_API_URL}
      - HEMINGWAY_API_KEY=${HEMINGWAY_API_KEY}
      - STYLE_ANALYZER_SECRET_KEY=${STYLE_ANALYZER_SECRET_KEY}
      - STYLE_ANALYZER_RATE_LIMIT=${STYLE_ANALYZER_RATE_LIMIT:-100}
      - STYLE_ANALYZER_CACHE_SIZE=${STYLE_ANALYZER_CACHE_SIZE:-1000}
    env_file:
      - .env.production
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
```

## Sécurité et Bonnes Pratiques

### 1. Protection des Clés API

- Ne jamais commiter les clés API dans le code source
- Utiliser des variables d'environnement pour toutes les clés sensibles
- Chiffrer les clés API en production
- Rotation régulière des clés API

### 2. Limites de Taux

- Configurer des limites de taux appropriées par environnement
- Surveiller l'utilisation des API
- Implémenter un système de backoff exponentiel

### 3. Cache et Performance

- Configurer la taille du cache selon la mémoire disponible
- Implémenter une stratégie d'expiration du cache
- Surveiller les performances du cache

### 4. Monitoring

- Activer les logs détaillés en développement
- Désactiver les logs sensibles en production
- Implémenter un système de métriques
- Surveiller les erreurs et les performances

## Dépannage

### Problèmes Courants

1. **Variables non chargées**
   ```bash
   # Vérifier que le fichier .env.local existe
   ls -la .env.local
   
   # Redémarrer le serveur de développement
   npm run dev
   ```

2. **Erreurs de clé API**
   ```bash
   # Vérifier la validité de la clé API
   curl -H "Authorization: Bearer $HEMINGWAY_API_KEY" \
        https://api.hemingwayapp.com/health
   ```

3. **Limites de taux dépassées**
   ```bash
   # Augmenter la limite de taux temporairement
   export STYLE_ANALYZER_RATE_LIMIT=1000
   
   # Ou modifier le fichier .env.local
   echo "STYLE_ANALYZER_RATE_LIMIT=1000" >> .env.local
   ```

### Support

Pour toute question ou problème de configuration :

1. Vérifier la documentation officielle
2. Consulter les logs d'erreur
3. Vérifier la configuration des variables d'environnement
4. Contacter l'équipe de développement

---

**Note** : Ce guide couvre la configuration de base. Pour des déploiements en production, consultez également la documentation de sécurité et de performance de votre plateforme.
