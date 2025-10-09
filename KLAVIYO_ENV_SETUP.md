# Configuration des variables d'environnement pour Klaviyo

## Variables requises

```bash
# Configuration Klaviyo
KLAVIYO_API_VERSION=2023-10-15
KLAVIYO_BASE_URL=https://a.klaviyo.com/api/2023-10-15

# Clés de chiffrement pour les données sensibles
ENCRYPTION_KEY=your-32-character-encryption-key-here
ENCRYPTION_IV=your-16-char-iv

# Configuration des webhooks
KLAVIYO_WEBHOOK_SECRET=your-webhook-secret-key-here
KLAVIYO_WEBHOOK_ENDPOINT=https://your-domain.com/api/klaviyo/webhook-receiver

# Configuration de la base de données
DATABASE_URL="postgresql://username:password@localhost:5432/crealia"
# ou pour MongoDB
# MONGODB_URI=mongodb://localhost:27017/crealia

# Configuration Redis (optionnel, pour le cache)
REDIS_URL=redis://localhost:6379

# Configuration des logs
LOG_LEVEL=info
NODE_ENV=development

# Limites de taux API
KLAVIYO_RATE_LIMIT_PER_MINUTE=300
KLAVIYO_RATE_LIMIT_PER_HOUR=10000

# Configuration de la synchronisation
KLAVIYO_SYNC_INTERVAL_HOURS=24
KLAVIYO_MAX_SYNC_RETRIES=3
```

## Instructions d'installation

1. Copiez ces variables dans votre fichier `.env`
2. Remplacez les valeurs par vos propres clés et configurations
3. Assurez-vous que les clés de chiffrement sont suffisamment sécurisées
4. Configurez l'URL de votre webhook dans `KLAVIYO_WEBHOOK_ENDPOINT`

## Sécurité

- Ne partagez jamais vos clés API Klaviyo
- Utilisez des clés de chiffrement fortes et uniques
- Limitez l'accès à votre base de données
- Utilisez HTTPS en production
- Validez toujours les signatures des webhooks 