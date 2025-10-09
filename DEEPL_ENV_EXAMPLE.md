# Exemple de fichier d'environnement pour DeepL API

## 📁 Créer le fichier `.env.local`

Copiez ce contenu dans un fichier `.env.local` à la racine de votre projet :

```bash
# DeepL API Configuration
# Obtenez votre clé API depuis https://www.deepl.com/pro-api

# Clé API DeepL (OBLIGATOIRE)
DEEPL_API_KEY=your_deepl_api_key_here

# URL de l'API DeepL
# Version gratuite (500,000 caractères/mois)
DEEPL_BASE_URL=https://api-free.deepl.com

# Version pro (illimitée)
# DEEPL_BASE_URL=https://api.deepl.com

# Configuration des timeouts et retry
DEEPL_TIMEOUT=30000
DEEPL_MAX_RETRIES=3
DEEPL_RETRY_DELAY=1000

# Configuration des paramètres par défaut
DEEPL_DEFAULT_FORMALITY=prefer_less
DEEPL_DEFAULT_TAG_HANDLING=html
DEEPL_PRESERVE_FORMATTING=true
DEEPL_SPLIT_SENTENCES=1
DEEPL_OUTLINE_DETECTION=1

# Configuration de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔑 Obtenir votre clé API DeepL

1. Allez sur [https://www.deepl.com/pro-api](https://www.deepl.com/pro-api)
2. Créez un compte ou connectez-vous
3. Souscrivez à un plan (gratuit ou payant)
4. Récupérez votre clé API depuis le dashboard
5. Remplacez `your_deepl_api_key_here` par votre vraie clé API

## ⚠️ Important

- **NE JAMAIS** commiter ce fichier dans Git
- Ajoutez `.env.local` à votre `.gitignore`
- Utilisez des variables d'environnement différentes pour chaque environnement (dev, staging, prod)

## 🧪 Test de la configuration

Après avoir configuré votre fichier `.env.local`, testez l'intégration :

```bash
# Test complet
npm run test:deepl

# Test rapide
npm run test:deepl:quick

# Test avec logs détaillés
npm run test:deepl:verbose
```
