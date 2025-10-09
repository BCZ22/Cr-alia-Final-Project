# Configuration des Variables d'Environnement - Intégration Medium

## Fichier .env

Créez un fichier `.env` à la racine de votre projet avec les variables suivantes :

```bash
# =============================================================================
# CONFIGURATION GÉNÉRALE
# =============================================================================
NODE_ENV=development
PORT=3000
MEDIUM_API_PORT=3001

# =============================================================================
# BASE DE DONNÉES
# =============================================================================
# URL de connexion à la base de données (SQLite par défaut)
DATABASE_URL="file:./dev.db"

# =============================================================================
# CHIFFREMENT
# =============================================================================
# Clé de chiffrement pour les tokens Medium (32 caractères minimum)
# Générez une clé sécurisée avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your_32_character_encryption_key_here

# =============================================================================
# API MEDIUM
# =============================================================================
# Client ID de votre application Medium
MEDIUM_CLIENT_ID=your_medium_client_id_here

# Client Secret de votre application Medium
MEDIUM_CLIENT_SECRET=your_medium_client_secret_here

# URL de redirection OAuth (doit correspondre à celle configurée dans Medium)
MEDIUM_REDIRECT_URI=http://localhost:3000/auth/medium/callback

# =============================================================================
# SÉCURITÉ
# =============================================================================
# Clé secrète JWT (générez une clé sécurisée)
JWT_SECRET=your_jwt_secret_key_here

# Durée de vie du token JWT (en secondes)
JWT_EXPIRES_IN=86400

# Origines autorisées pour CORS (séparées par des virgules)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# =============================================================================
# RATE LIMITING
# =============================================================================
# Limite de requêtes par fenêtre de temps (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100

# Fenêtre de temps pour le rate limiting (en millisecondes)
RATE_LIMIT_WINDOW_MS=900000

# =============================================================================
# LOGGING ET MONITORING
# =============================================================================
# Niveau de log (debug, info, warn, error)
LOG_LEVEL=info

# URL Sentry pour le monitoring des erreurs (optionnel)
SENTRY_DSN=

# =============================================================================
# REDIS (optionnel, pour le cache et le rate limiting avancé)
# =============================================================================
# URL de connexion Redis
REDIS_URL=redis://localhost:6379

# Mot de passe Redis (si configuré)
REDIS_PASSWORD=

# Base de données Redis
REDIS_DB=0

# =============================================================================
# NOTIFICATIONS (optionnel)
# =============================================================================
# Webhook URL pour les notifications (Slack, Discord, etc.)
WEBHOOK_URL=

# Email de contact pour les erreurs critiques
ADMIN_EMAIL=admin@yourdomain.com

# =============================================================================
# DÉVELOPPEMENT
# =============================================================================
# Activer le mode debug
DEBUG=false

# Port pour le serveur de développement
DEV_PORT=3001

# =============================================================================
# PRODUCTION
# =============================================================================
# Activer HTTPS en production
FORCE_HTTPS=false

# Certificat SSL (chemin vers le fichier .crt)
SSL_CERT_PATH=

# Clé privée SSL (chemin vers le fichier .key)
SSL_KEY_PATH=

# =============================================================================
# MÉDIAS ET UPLOADS
# =============================================================================
# Taille maximale des fichiers uploadés (en bytes)
MAX_FILE_SIZE=10485760

# Dossier de stockage des uploads
UPLOAD_DIR=./uploads

# =============================================================================
# BACKUP ET SYNC
# =============================================================================
# Activer la synchronisation automatique avec Medium
AUTO_SYNC_ENABLED=true

# Intervalle de synchronisation (en minutes)
SYNC_INTERVAL_MINUTES=60

# Activer le backup automatique des données
AUTO_BACKUP_ENABLED=false

# Dossier de backup
BACKUP_DIR=./backups
```

## Génération des Clés Sécurisées

### 1. Clé de Chiffrement (ENCRYPTION_KEY)

```bash
# Générer une clé de chiffrement de 32 caractères
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Clé JWT (JWT_SECRET)

```bash
# Générer une clé JWT sécurisée
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Configuration Medium OAuth

### 1. Créer une Application Medium

1. Allez sur [Medium Developer Portal](https://medium.com/developers)
2. Connectez-vous avec votre compte Medium
3. Cliquez sur "New Application"
4. Remplissez les informations :
   - **Name** : Nom de votre application
   - **Description** : Description de l'intégration
   - **Redirect URI** : `http://localhost:3000/auth/medium/callback`

### 2. Récupérer les Identifiants

Après création, vous obtiendrez :
- **Client ID** : À mettre dans `MEDIUM_CLIENT_ID`
- **Client Secret** : À mettre dans `MEDIUM_CLIENT_SECRET`

## Variables Requises vs Optionnelles

### Variables Requises (Production)
- `ENCRYPTION_KEY`
- `JWT_SECRET`
- `DATABASE_URL`
- `MEDIUM_CLIENT_ID`
- `MEDIUM_CLIENT_SECRET`

### Variables Optionnelles
- `REDIS_URL` (pour le cache avancé)
- `SENTRY_DSN` (pour le monitoring)
- `WEBHOOK_URL` (pour les notifications)
- `SSL_CERT_PATH` et `SSL_KEY_PATH` (pour HTTPS)

## Sécurité

### 1. Ne jamais commiter le fichier .env
```bash
# Ajouter à .gitignore
.env
.env.local
.env.production
```

### 2. Utiliser des clés différentes en production
- Générer de nouvelles clés pour chaque environnement
- Utiliser des clés d'au moins 32 caractères
- Changer régulièrement les clés de production

### 3. Restreindre les accès
- Limiter les origines CORS
- Configurer le rate limiting
- Utiliser HTTPS en production

## Validation de la Configuration

Après avoir configuré le fichier .env, testez la configuration :

```bash
# Vérifier que les variables sont chargées
npm run test:medium:config

# Tester la connexion à la base de données
npm run test:medium:db

# Tester l'API Medium
npm run test:medium:api
```

## Environnements

### Développement
```bash
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production
```bash
NODE_ENV=production
DEBUG=false
LOG_LEVEL=warn
FORCE_HTTPS=true
```

### Staging
```bash
NODE_ENV=staging
DEBUG=false
LOG_LEVEL=info
```

## Dépannage

### Erreur "ENCRYPTION_KEY environment variable is required"
- Vérifiez que le fichier .env existe
- Vérifiez que ENCRYPTION_KEY est défini
- Redémarrez le serveur après modification

### Erreur "Invalid Medium credentials"
- Vérifiez MEDIUM_CLIENT_ID et MEDIUM_CLIENT_SECRET
- Vérifiez MEDIUM_REDIRECT_URI
- Vérifiez que l'application Medium est active

### Erreur de connexion à la base de données
- Vérifiez DATABASE_URL
- Vérifiez que la base de données est accessible
- Vérifiez les permissions de l'utilisateur 