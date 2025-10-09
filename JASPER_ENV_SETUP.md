# 🔧 Configuration des Variables d'Environnement - Jasper AI

## 📋 Variables Requises

### 1. Variables Principales

```bash
# Clé API Jasper (OBLIGATOIRE)
JASPER_API_KEY=your_jasper_api_key_here

# URL de l'API Jasper (optionnel, défaut: https://api.jasper.ai)
JASPER_BASE_URL=https://api.jasper.ai

# Timeout des requêtes en millisecondes (optionnel, défaut: 30000)
JASPER_TIMEOUT=30000

# Nombre maximum de tentatives en cas d'échec (optionnel, défaut: 3)
JASPER_MAX_RETRIES=3

# Délai entre les tentatives en millisecondes (optionnel, défaut: 1000)
JASPER_RETRY_DELAY=1000
```

### 2. Variables de Cache (Optionnelles)

```bash
# Activation du cache (optionnel, défaut: true)
JASPER_CACHE_ENABLED=true

# TTL du cache en millisecondes (optionnel, défaut: 1800000 = 30 min)
JASPER_CACHE_TTL=1800000

# Taille maximale du cache (optionnel, défaut: 1000)
JASPER_CACHE_MAX_SIZE=1000

# Intervalle de nettoyage en millisecondes (optionnel, défaut: 300000 = 5 min)
JASPER_CACHE_CLEANUP_INTERVAL=300000
```

### 3. Variables de Rate Limiting (Optionnelles)

```bash
# Activation du rate limiting (optionnel, défaut: true)
JASPER_RATE_LIMIT_ENABLED=true

# Limite de requêtes par minute (optionnel, défaut: 60)
JASPER_REQUESTS_PER_MINUTE=60

# Limite de requêtes par heure (optionnel, défaut: 1000)
JASPER_REQUESTS_PER_HOUR=1000

# Limite de requêtes par jour (optionnel, défaut: 10000)
JASPER_REQUESTS_PER_DAY=10000

# Limite de tokens par minute (optionnel, défaut: 10000)
JASPER_TOKENS_PER_MINUTE=10000

# Limite de tokens par heure (optionnel, défaut: 100000)
JASPER_TOKENS_PER_HOUR=100000

# Limite de tokens par jour (optionnel, défaut: 1000000)
JASPER_TOKENS_PER_DAY=1000000

# Limite de burst (requêtes simultanées) (optionnel, défaut: 10)
JASPER_BURST_LIMIT=10

# Fenêtre de burst en millisecondes (optionnel, défaut: 1000)
JASPER_BURST_WINDOW=1000
```

## 🚀 Configuration par Environnement

### Développement (.env.local)

```bash
# Configuration de développement
NODE_ENV=development

# Jasper AI - Développement
JASPER_API_KEY=sk-dev-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JASPER_TIMEOUT=30000
JASPER_MAX_RETRIES=3
JASPER_RETRY_DELAY=1000

# Cache - Développement
JASPER_CACHE_ENABLED=true
JASPER_CACHE_TTL=1800000
JASPER_CACHE_MAX_SIZE=500

# Rate Limiting - Développement (plus permissif)
JASPER_RATE_LIMIT_ENABLED=true
JASPER_REQUESTS_PER_MINUTE=120
JASPER_TOKENS_PER_MINUTE=20000
```

### Staging (.env.staging)

```bash
# Configuration de staging
NODE_ENV=staging

# Jasper AI - Staging
JASPER_API_KEY=sk-staging-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JASPER_TIMEOUT=45000
JASPER_MAX_RETRIES=3
JASPER_RETRY_DELAY=1500

# Cache - Staging
JASPER_CACHE_ENABLED=true
JASPER_CACHE_TTL=1800000
JASPER_CACHE_MAX_SIZE=1000

# Rate Limiting - Staging
JASPER_RATE_LIMIT_ENABLED=true
JASPER_REQUESTS_PER_MINUTE=60
JASPER_TOKENS_PER_MINUTE=10000
```

### Production (.env.production)

```bash
# Configuration de production
NODE_ENV=production

# Jasper AI - Production
JASPER_API_KEY=sk-prod-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JASPER_TIMEOUT=60000
JASPER_MAX_RETRIES=5
JASPER_RETRY_DELAY=2000

# Cache - Production
JASPER_CACHE_ENABLED=true
JASPER_CACHE_TTL=3600000
JASPER_CACHE_MAX_SIZE=2000

# Rate Limiting - Production (plus strict)
JASPER_RATE_LIMIT_ENABLED=true
JASPER_REQUESTS_PER_MINUTE=30
JASPER_TOKENS_PER_MINUTE=5000
JASPER_BURST_LIMIT=5
```

## 🔐 Sécurité

### 1. Protection des Clés API

```bash
# ❌ JAMAIS dans le code source
JASPER_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ✅ Toujours dans les variables d'environnement
JASPER_API_KEY=${JASPER_API_KEY}
```

### 2. Rotation des Clés

```bash
# Script de rotation automatique (optionnel)
#!/bin/bash
# rotate-jasper-keys.sh

OLD_KEY=$JASPER_API_KEY
NEW_KEY=$(curl -s -X POST "https://api.jasper.ai/v1/keys/rotate" \
  -H "Authorization: Bearer $OLD_KEY" \
  -H "Content-Type: application/json")

echo "Nouvelle clé générée: $NEW_KEY"
echo "Mettez à jour votre fichier .env avec cette nouvelle clé"
```

### 3. Validation des Variables

```typescript
// validation/env.ts
export function validateJasperConfig() {
  const requiredVars = [
    'JASPER_API_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
  }

  // Validation des valeurs numériques
  const numericVars = [
    'JASPER_TIMEOUT',
    'JASPER_MAX_RETRIES',
    'JASPER_RETRY_DELAY',
  ];

  for (const varName of numericVars) {
    const value = process.env[varName];
    if (value && isNaN(Number(value))) {
      throw new Error(`Variable ${varName} doit être numérique: ${value}`);
    }
  }

  console.log('✅ Configuration Jasper validée avec succès');
}
```

## 🐳 Configuration Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de configuration
COPY .env.example .env
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Exposition du port
EXPOSE 3000

# Démarrage
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JASPER_API_KEY=${JASPER_API_KEY}
      - JASPER_TIMEOUT=${JASPER_TIMEOUT:-60000}
      - JASPER_MAX_RETRIES=${JASPER_MAX_RETRIES:-5}
    env_file:
      - .env.production
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

## ☸️ Configuration Kubernetes

### ConfigMap

```yaml
# k8s/jasper-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jasper-config
data:
  JASPER_TIMEOUT: "60000"
  JASPER_MAX_RETRIES: "5"
  JASPER_RETRY_DELAY: "2000"
  JASPER_CACHE_ENABLED: "true"
  JASPER_CACHE_TTL: "3600000"
  JASPER_CACHE_MAX_SIZE: "2000"
  JASPER_RATE_LIMIT_ENABLED: "true"
  JASPER_REQUESTS_PER_MINUTE: "30"
  JASPER_TOKENS_PER_MINUTE: "5000"
```

### Secret

```yaml
# k8s/jasper-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: jasper-secrets
type: Opaque
data:
  api-key: <base64-encoded-jasper-api-key>
```

### Deployment

```yaml
# k8s/jasper-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jasper-integration
spec:
  replicas: 3
  selector:
    matchLabels:
      app: jasper-integration
  template:
    metadata:
      labels:
        app: jasper-integration
    spec:
      containers:
      - name: app
        image: your-registry/crealia:latest
        envFrom:
        - configMapRef:
            name: jasper-config
        env:
        - name: JASPER_API_KEY
          valueFrom:
            secretKeyRef:
              name: jasper-secrets
              key: api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: NODE_ENV
          value: "production"
```

## 🔍 Vérification de la Configuration

### Script de Test

```bash
#!/bin/bash
# test-jasper-config.sh

echo "🔍 Vérification de la configuration Jasper..."

# Vérification des variables requises
if [ -z "$JASPER_API_KEY" ]; then
  echo "❌ JASPER_API_KEY non définie"
  exit 1
else
  echo "✅ JASPER_API_KEY configurée"
fi

# Vérification de la connexion
echo "🔗 Test de connexion à l'API Jasper..."
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $JASPER_API_KEY" \
  "https://api.jasper.ai/v1/models"

if [ $? -eq 0 ]; then
  echo "✅ Connexion à l'API Jasper réussie"
else
  echo "❌ Échec de la connexion à l'API Jasper"
  exit 1
fi

echo "🎉 Configuration Jasper validée avec succès !"
```

### Test dans l'Application

```typescript
// test-jasper-connection.ts
import JasperService from './lib/services/jasper-service';

async function testJasperConnection() {
  try {
    const jasper = new JasperService({
      apiKey: process.env.JASPER_API_KEY!,
    });

    console.log('🔍 Test de connexion Jasper...');
    
    const isConnected = await jasper.testConnection();
    if (isConnected) {
      console.log('✅ Connexion Jasper réussie');
      
      const models = await jasper.getModels();
      console.log('📋 Modèles disponibles:', models);
      
      const usage = await jasper.getUsage();
      console.log('📊 Utilisation actuelle:', usage);
      
    } else {
      console.log('❌ Échec de la connexion Jasper');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution du test
testJasperConnection();
```

## 📊 Monitoring et Alertes

### Variables de Monitoring

```bash
# Monitoring des performances
JASPER_MONITORING_ENABLED=true
JASPER_METRICS_INTERVAL=60000

# Alertes
JASPER_ALERT_ERROR_RATE=0.1
JASPER_ALERT_RESPONSE_TIME=10000
JASPER_ALERT_QUOTA_USAGE=0.8

# Logging
JASPER_LOG_LEVEL=info
JASPER_LOG_REQUESTS=true
JASPER_LOG_RESPONSES=false
```

### Script de Monitoring

```bash
#!/bin/bash
# monitor-jasper.sh

while true; do
  echo "📊 $(date): Monitoring Jasper..."
  
  # Vérification de la santé de l'API
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $JASPER_API_KEY" \
    "https://api.jasper.ai/v1/models")
  
  if [ "$HTTP_CODE" != "200" ]; then
    echo "🚨 ALERTE: API Jasper retourne le code $HTTP_CODE"
    # Envoi d'alerte (email, Slack, etc.)
  fi
  
  # Attente avant la prochaine vérification
  sleep 60
done
```

## 🚨 Dépannage

### Problèmes Courants

#### 1. "JASPER_API_KEY non configurée"

```bash
# Solution
export JASPER_API_KEY="your-api-key"
# Ou ajoutez dans .env.local
echo "JASPER_API_KEY=your-api-key" >> .env.local
```

#### 2. "Timeout de connexion"

```bash
# Augmentez le timeout
export JASPER_TIMEOUT=60000
```

#### 3. "Limite de taux dépassée"

```bash
# Ajustez les limites
export JASPER_REQUESTS_PER_MINUTE=30
export JASPER_TOKENS_PER_MINUTE=5000
```

### Logs de Debug

```bash
# Activation des logs détaillés
export JASPER_DEBUG=true
export JASPER_LOG_LEVEL=debug

# Redémarrage de l'application
npm run dev
```

---

**Note** : Remplacez `your_jasper_api_key_here` par votre vraie clé API Jasper.  
**Sécurité** : Ne committez jamais vos clés API dans le code source.
