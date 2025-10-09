# Configuration DeepL API - Variables d'environnement

## 🔑 Variables d'environnement requises

### 1. Clé API DeepL (OBLIGATOIRE)
```bash
# Clé API DeepL (obtenue depuis https://www.deepl.com/pro-api)
DEEPL_API_KEY=your_deepl_api_key_here
```

### 2. Configuration de l'URL (optionnel)
```bash
# URL de l'API DeepL
# Version gratuite (500,000 caractères/mois)
DEEPL_BASE_URL=https://api-free.deepl.com

# Version pro (illimitée)
# DEEPL_BASE_URL=https://api.deepl.com
```

### 3. Configuration des timeouts et retry (optionnel)
```bash
# Timeout en millisecondes (défaut: 30000)
DEEPL_TIMEOUT=30000

# Nombre maximum de tentatives (défaut: 3)
DEEPL_MAX_RETRIES=3

# Délai entre les tentatives en millisecondes (défaut: 1000)
DEEPL_RETRY_DELAY=1000
```

### 4. Configuration des paramètres par défaut (optionnel)
```bash
# Niveau de formalité par défaut
# Options: more, less, prefer_more, prefer_less
DEEPL_DEFAULT_FORMALITY=prefer_less

# Gestion des tags par défaut
# Options: xml, html
DEEPL_DEFAULT_TAG_HANDLING=html

# Préservation du formatage par défaut
# Options: true, false
DEEPL_PRESERVE_FORMATTING=true

# Découpage des phrases par défaut
# Options: 0, 1, nonewlines
DEEPL_SPLIT_SENTENCES=1

# Détection de contour par défaut
# Options: 0, 1
DEEPL_OUTLINE_DETECTION=1
```

## 📁 Fichiers de configuration

### 1. Fichier `.env.local` (développement)
```bash
# DeepL API Configuration
DEEPL_API_KEY=your_deepl_api_key_here
DEEPL_BASE_URL=https://api-free.deepl.com
DEEPL_TIMEOUT=30000
DEEPL_MAX_RETRIES=3
DEEPL_RETRY_DELAY=1000
DEEPL_DEFAULT_FORMALITY=prefer_less
DEEPL_DEFAULT_TAG_HANDLING=html
DEEPL_PRESERVE_FORMATTING=true
DEEPL_SPLIT_SENTENCES=1
DEEPL_OUTLINE_DETECTION=1
```

### 2. Fichier `.env.production` (production)
```bash
# DeepL API Configuration - Production
DEEPL_API_KEY=your_production_deepl_api_key
DEEPL_BASE_URL=https://api.deepl.com
DEEPL_TIMEOUT=60000
DEEPL_MAX_RETRIES=5
DEEPL_RETRY_DELAY=2000
DEEPL_DEFAULT_FORMALITY=prefer_more
DEEPL_DEFAULT_TAG_HANDLING=html
DEEPL_PRESERVE_FORMATTING=true
DEEPL_SPLIT_SENTENCES=1
DEEPL_OUTLINE_DETECTION=1
```

### 3. Fichier `docker-compose.yml` (Docker)
```yaml
version: '3.8'
services:
  app:
    environment:
      - DEEPL_API_KEY=${DEEPL_API_KEY}
      - DEEPL_BASE_URL=${DEEPL_BASE_URL}
      - DEEPL_TIMEOUT=${DEEPL_TIMEOUT}
      - DEEPL_MAX_RETRIES=${DEEPL_MAX_RETRIES}
      - DEEPL_RETRY_DELAY=${DEEPL_RETRY_DELAY}
      - DEEPL_DEFAULT_FORMALITY=${DEEPL_DEFAULT_FORMALITY}
      - DEEPL_DEFAULT_TAG_HANDLING=${DEEPL_DEFAULT_TAG_HANDLING}
      - DEEPL_PRESERVE_FORMATTING=${DEEPL_PRESERVE_FORMATTING}
      - DEEPL_SPLIT_SENTENCES=${DEEPL_SPLIT_SENTENCES}
      - DEEPL_OUTLINE_DETECTION=${DEEPL_OUTLINE_DETECTION}
```

## 🚀 Installation et configuration

### 1. Obtenir une clé API DeepL
1. Aller sur [https://www.deepl.com/pro-api](https://www.deepl.com/pro-api)
2. Créer un compte ou se connecter
3. Souscrire à un plan (gratuit ou payant)
4. Récupérer la clé API depuis le dashboard

### 2. Configuration du projet
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer le fichier avec votre clé API
nano .env.local
```

### 3. Vérification de la configuration
```bash
# Tester la configuration
npm run test:deepl

# Ou tester manuellement
curl -X GET "http://localhost:3000/api/translate?action=usage" \
  -H "Authorization: Bearer your_token_if_needed"
```

## 🔒 Sécurité

### 1. Protection de la clé API
- **NE JAMAIS** commiter la clé API dans Git
- Utiliser des variables d'environnement
- Restreindre l'accès aux fichiers `.env*`
- Utiliser des secrets managers en production

### 2. Fichier `.gitignore`
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.staging

# API keys
*.key
*.pem
```

### 3. Validation de la configuration
```typescript
// Vérification au démarrage de l'application
if (!process.env.DEEPL_API_KEY) {
  throw new Error('DeepL API key not configured');
}
```

## 📊 Monitoring et quotas

### 1. Vérification des quotas
```bash
# Endpoint pour vérifier l'utilisation
GET /api/translate?action=usage
```

### 2. Alertes de quota
```typescript
// Exemple d'alerte quand le quota approche de la limite
const usage = await translationService.getUsage();
const usagePercentage = (usage.characterCount / usage.characterLimit) * 100;

if (usagePercentage > 80) {
  console.warn(`DeepL quota usage: ${usagePercentage.toFixed(1)}%`);
  // Envoyer une alerte à l'équipe
}
```

## 🧪 Tests

### 1. Test de connectivité
```bash
# Test simple de traduction
curl -X POST "http://localhost:3000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "targetLang": "FR"
  }'
```

### 2. Test des options avancées
```bash
# Test avec formalité
curl -X POST "http://localhost:3000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "targetLang": "FR",
    "formality": "more"
  }'
```

## 🚨 Dépannage

### 1. Erreurs courantes
```bash
# Clé API invalide
Error: DeepL API error: 403 - Authorization failed

# Quota dépassé
Error: DeepL API error: 456 - Quota exceeded

# Timeout
Error: DeepL API error: 408 - Request timeout
```

### 2. Solutions
- Vérifier la validité de la clé API
- Vérifier les quotas et limites
- Augmenter les timeouts si nécessaire
- Vérifier la connectivité réseau

## 📚 Ressources

- [Documentation DeepL API](https://www.deepl.com/docs-api)
- [Guide des langues supportées](https://www.deepl.com/docs-api/translate)
- [Gestion des quotas](https://www.deepl.com/docs-api/usage)
- [Support DeepL](https://support.deepl.com/)
