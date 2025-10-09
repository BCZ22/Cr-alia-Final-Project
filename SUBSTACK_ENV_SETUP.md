# Configuration des variables d'environnement pour Substack

## Variables requises

### Production
```bash
# Configuration Substack Production
SUBSTACK_API_BASE_URL=https://api.substack.com
SUBSTACK_API_TOKEN=your_production_api_token_here
SUBSTACK_WEBHOOK_SECRET=your_webhook_secret_here
SUBSTACK_PUBLICATION_ID=your_publication_id_here

# Configuration des webhooks
SUBSTACK_WEBHOOK_URL=https://yourdomain.com/api/webhooks/substack
SUBSTACK_WEBHOOK_EVENTS=post.published,subscriber.created,subscription.cancelled

# Configuration des limites
SUBSTACK_RATE_LIMIT=1000
SUBSTACK_RATE_LIMIT_WINDOW=3600
```

### Développement
```bash
# Configuration Substack Development
SUBSTACK_API_BASE_URL=https://api.substack.com
SUBSTACK_API_TOKEN=your_dev_api_token_here
SUBSTACK_WEBHOOK_SECRET=your_dev_webhook_secret_here
SUBSTACK_PUBLICATION_ID=your_dev_publication_id_here

# Configuration des webhooks (dev)
SUBSTACK_WEBHOOK_URL=https://dev.yourdomain.com/api/webhooks/substack
SUBSTACK_WEBHOOK_EVENTS=post.published,subscriber.created

# Configuration des limites (dev)
SUBSTACK_RATE_LIMIT=100
SUBSTACK_RATE_LIMIT_WINDOW=3600
```

### Test
```bash
# Configuration Substack Test
SUBSTACK_API_BASE_URL=https://api.substack.com
SUBSTACK_API_TOKEN=your_test_api_token_here
SUBSTACK_WEBHOOK_SECRET=your_test_webhook_secret_here
SUBSTACK_PUBLICATION_ID=your_test_publication_id_here

# Configuration des webhooks (test)
SUBSTACK_WEBHOOK_URL=https://test.yourdomain.com/api/webhooks/substack
SUBSTACK_WEBHOOK_EVENTS=post.published

# Configuration des limites (test)
SUBSTACK_RATE_LIMIT=50
SUBSTACK_RATE_LIMIT_WINDOW=3600
```

## Fichier .env.local
Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Substack Configuration
SUBSTACK_API_BASE_URL=https://api.substack.com
SUBSTACK_API_TOKEN=your_api_token_here
SUBSTACK_WEBHOOK_SECRET=your_webhook_secret_here
SUBSTACK_PUBLICATION_ID=your_publication_id_here

# Webhook Configuration
SUBSTACK_WEBHOOK_URL=https://yourdomain.com/api/webhooks/substack
SUBSTACK_WEBHOOK_EVENTS=post.published,subscriber.created,subscription.cancelled

# Rate Limiting
SUBSTACK_RATE_LIMIT=1000
SUBSTACK_RATE_LIMIT_WINDOW=3600

# Logging
SUBSTACK_LOG_LEVEL=info
SUBSTACK_ENABLE_DEBUG=false
```

## Fichier .env.example
Créez également un fichier `.env.example` pour documenter les variables :

```bash
# Substack API Configuration
SUBSTACK_API_BASE_URL=
SUBSTACK_API_TOKEN=
SUBSTACK_WEBHOOK_SECRET=
SUBSTACK_PUBLICATION_ID=

# Webhook Configuration
SUBSTACK_WEBHOOK_URL=
SUBSTACK_WEBHOOK_EVENTS=

# Rate Limiting
SUBSTACK_RATE_LIMIT=
SUBSTACK_RATE_LIMIT_WINDOW=

# Logging
SUBSTACK_LOG_LEVEL=
SUBSTACK_ENABLE_DEBUG=
```

## Configuration Docker
Pour les environnements Docker, ajoutez ces variables dans votre `docker-compose.yml` :

```yaml
environment:
  - SUBSTACK_API_BASE_URL=https://api.substack.com
  - SUBSTACK_API_TOKEN=${SUBSTACK_API_TOKEN}
  - SUBSTACK_WEBHOOK_SECRET=${SUBSTACK_WEBHOOK_SECRET}
  - SUBSTACK_PUBLICATION_ID=${SUBSTACK_PUBLICATION_ID}
  - SUBSTACK_WEBHOOK_URL=${SUBSTACK_WEBHOOK_URL}
  - SUBSTACK_WEBHOOK_EVENTS=${SUBSTACK_WEBHOOK_EVENTS}
  - SUBSTACK_RATE_LIMIT=${SUBSTACK_RATE_LIMIT}
  - SUBSTACK_RATE_LIMIT_WINDOW=${SUBSTACK_RATE_LIMIT_WINDOW}
  - SUBSTACK_LOG_LEVEL=${SUBSTACK_LOG_LEVEL}
  - SUBSTACK_ENABLE_DEBUG=${SUBSTACK_ENABLE_DEBUG}
```

## Configuration Next.js
Dans votre fichier `next.config.js`, ajoutez :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUBSTACK_API_BASE_URL: process.env.SUBSTACK_API_BASE_URL,
    SUBSTACK_API_TOKEN: process.env.SUBSTACK_API_TOKEN,
    SUBSTACK_WEBHOOK_SECRET: process.env.SUBSTACK_WEBHOOK_SECRET,
    SUBSTACK_PUBLICATION_ID: process.env.SUBSTACK_PUBLICATION_ID,
  },
  // ... autres configurations
}

module.exports = nextConfig
```

## Vérification de la configuration
Créez un script de vérification pour tester votre configuration :

```bash
#!/bin/bash
# verify-substack-config.sh

echo "Vérification de la configuration Substack..."

# Vérifier les variables requises
required_vars=(
  "SUBSTACK_API_BASE_URL"
  "SUBSTACK_API_TOKEN"
  "SUBSTACK_WEBHOOK_SECRET"
  "SUBSTACK_PUBLICATION_ID"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Variable manquante: $var"
    exit 1
  else
    echo "✅ $var est configuré"
  fi
done

echo "✅ Configuration Substack complète!"
```

## Sécurité
⚠️ **IMPORTANT** : Ne jamais commiter les fichiers `.env` contenant des tokens réels !

1. Ajoutez `.env.local` à votre `.gitignore`
2. Utilisez des variables d'environnement sécurisées en production
3. Rotatez régulièrement vos tokens API
4. Utilisez des secrets managers en production (AWS Secrets Manager, Azure Key Vault, etc.)

## Test de la configuration
Testez votre configuration avec une requête simple :

```bash
curl -X GET "https://api.substack.com/api/v1/publications" \
  -H "Authorization: Bearer $SUBSTACK_API_TOKEN"
```

Si vous recevez une réponse 200, votre configuration est correcte ! 