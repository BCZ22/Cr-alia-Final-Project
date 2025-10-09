# Configuration des Variables d'Environnement pour l'Automatisation

Ce guide vous explique comment configurer toutes les variables d'environnement nécessaires pour utiliser les fonctionnalités d'automatisation de création de contenu.

## Variables Requises

### 1. OpenAI (Obligatoire)
```bash
# Clé API OpenAI pour la génération de contenu et d'images
OPENAI_API_KEY=sk-your-openai-api-key-here

# Modèle OpenAI à utiliser (optionnel, défaut: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

### 2. Twitter API (Optionnel - pour l'analyse des tendances)
```bash
# Token Bearer Twitter pour l'analyse des tendances
TWITTER_BEARER_TOKEN=your-twitter-bearer-token-here
```

### 3. Services d'Images IA

#### DALL-E 3 (via OpenAI)
```bash
# Utilise la même clé OpenAI_API_KEY
# Aucune configuration supplémentaire requise
```

#### Midjourney (Optionnel)
```bash
# Token d'accès Midjourney
MIDJOURNEY_TOKEN=your-midjourney-token-here

# URL de l'API Midjourney
MIDJOURNEY_API_URL=https://api.midjourney.com
```

#### Stable Diffusion (Optionnel)
```bash
# URL de l'API Stable Diffusion
STABLE_DIFFUSION_API_URL=http://localhost:7860

# Clé API Stable Diffusion (si requise)
STABLE_DIFFUSION_API_KEY=your-stable-diffusion-key-here
```

### 4. Services d'Analyse des Tendances

#### Google Trends (Optionnel - API officielle)
```bash
# Clé API Google Trends
GOOGLE_TRENDS_API_KEY=your-google-trends-api-key-here
```

#### BuzzSumo (Optionnel)
```bash
# Clé API BuzzSumo
BUZZSUMO_API_KEY=your-buzzsumo-api-key-here

# URL de l'API BuzzSumo
BUZZSUMO_API_URL=https://api.buzzsumo.com
```

## Configuration Complète

Créez un fichier `.env.local` à la racine de votre projet avec toutes les variables nécessaires :

```bash
# ========================================
# AUTOMATISATION DE CRÉATION DE CONTENU
# ========================================

# OpenAI - Obligatoire
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# Twitter API - Optionnel
TWITTER_BEARER_TOKEN=your-twitter-bearer-token-here

# Midjourney - Optionnel
MIDJOURNEY_TOKEN=your-midjourney-token-here
MIDJOURNEY_API_URL=https://api.midjourney.com

# Stable Diffusion - Optionnel
STABLE_DIFFUSION_API_URL=http://localhost:7860
STABLE_DIFFUSION_API_KEY=your-stable-diffusion-key-here

# Google Trends - Optionnel
GOOGLE_TRENDS_API_KEY=your-google-trends-api-key-here

# BuzzSumo - Optionnel
BUZZSUMO_API_KEY=your-buzzsumo-api-key-here
BUZZSUMO_API_URL=https://api.buzzsumo.com
```

## Obtenir les Clés API

### OpenAI
1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys"
4. Créez une nouvelle clé API
5. Copiez la clé et ajoutez-la à votre fichier `.env.local`

### Twitter API
1. Allez sur [developer.twitter.com](https://developer.twitter.com)
2. Créez un compte développeur
3. Créez une nouvelle application
4. Générez un Bearer Token
5. Copiez le token et ajoutez-le à votre fichier `.env.local`

### Midjourney
1. Rejoignez le serveur Discord Midjourney
2. Utilisez le bot Midjourney pour générer des images
3. Obtenez votre token d'accès (consultez la documentation officielle)
4. Ajoutez le token à votre fichier `.env.local`

### Stable Diffusion
1. Installez Stable Diffusion localement ou utilisez un service cloud
2. Configurez l'URL de l'API
3. Si une clé API est requise, ajoutez-la à votre fichier `.env.local`

## Vérification de la Configuration

Après avoir configuré vos variables d'environnement, vous pouvez vérifier que tout fonctionne :

1. Redémarrez votre serveur de développement
2. Allez sur `/automation` dans votre application
3. Testez chaque fonctionnalité :
   - Analyse des tendances
   - Génération de contenu
   - Reformatage
   - Génération d'images

## Dépannage

### Erreur "OPENAI_API_KEY is not defined"
- Vérifiez que votre fichier `.env.local` est bien à la racine du projet
- Redémarrez votre serveur de développement
- Vérifiez que la variable est bien nommée `OPENAI_API_KEY`

### Erreur "Rate limit exceeded"
- Vérifiez vos quotas OpenAI
- Attendez quelques minutes avant de réessayer
- Considérez l'utilisation d'un plan payant

### Images non générées
- Vérifiez que votre clé OpenAI est valide
- Vérifiez que vous avez des crédits disponibles
- Vérifiez les logs de votre serveur pour plus de détails

## Sécurité

⚠️ **Important** : Ne commettez jamais vos clés API dans votre code source

- Ajoutez `.env.local` à votre `.gitignore`
- Utilisez des variables d'environnement en production
- Régénérez vos clés API si elles sont compromises
- Limitez les permissions de vos clés API au minimum nécessaire

## Support

Si vous rencontrez des problèmes avec la configuration :

1. Vérifiez que toutes les variables sont correctement définies
2. Consultez les logs de votre serveur
3. Vérifiez la documentation des APIs tierces
4. Créez une issue sur le repository du projet

