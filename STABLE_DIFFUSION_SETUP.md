# 🎨 Intégration Stable Diffusion Complète pour Crealia

## 📋 Vue d'ensemble

Cette intégration Stable Diffusion permet de :
- ✅ **Générer** des visuels artistiques automatiquement à partir d'un brief textuel
- 🎨 **Personnaliser** les styles artistiques (réaliste, anime, photoréaliste, etc.)
- 🤖 **Enrichir** les prompts avec GPT-4 pour de meilleurs résultats
- 📱 **Adapter** les images aux formats des réseaux sociaux
- 💾 **Stocker** les images générées sur le serveur
- 📥 **Télécharger** ou réutiliser les images dans le planificateur
- ⚙️ **Contrôler** les paramètres de génération (étapes, guidance, CFG)

## 🏗️ Architecture

### Services principaux
```
lib/
├── stable-diffusion-service.ts    # Service principal Stable Diffusion
└── cache-service.ts               # Cache pour optimiser les appels

app/api/stable-diffusion/
├── generate/                      # Génération d'images
├── associate/                     # Association aux posts
└── delete/                       # Suppression d'images
```

### Composants UI
```
components/ui/stable-diffusion/
├── StableDiffusionGenerator.tsx   # Générateur principal
└── StableDiffusionGallery.tsx    # Galerie d'images
```

## 🔧 Configuration

### 1. Variables d'environnement
```env
# Stable Diffusion API
STABLE_DIFFUSION_API_URL="https://api.stability.ai"
STABLE_DIFFUSION_API_KEY="your-stability-api-key"
STABLE_DIFFUSION_PROVIDER="stability" # "stability", "replicate", "custom"

# OpenAI pour l'enrichissement des prompts
OPENAI_API_KEY="sk-your-openai-api-key"

# Stockage des images
UPLOAD_DIR="./public/uploads"
BASE_URL="http://localhost:3000"

# Base de données
DATABASE_URL="file:./dev.db"
```

### 2. Configurer l'API Stable Diffusion
1. **Option 1 - Stability.ai** :
   - Créer un compte sur [Stability.ai](https://platform.stability.ai)
   - Obtenir une clé API
   - Utiliser l'endpoint `/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`

2. **Option 2 - Replicate** :
   - Créer un compte sur [Replicate.com](https://replicate.com)
   - Obtenir un token API
   - Utiliser le modèle Stable Diffusion via l'API Replicate

3. **Option 3 - Instance locale** :
   - Déployer Stable Diffusion localement
   - Configurer l'API personnalisée
   - Adapter les endpoints selon votre setup

### 3. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
```

## 🚀 Utilisation

### 1. Génération d'image simple
```typescript
const response = await fetch('/api/stable-diffusion/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    prompt: "post Instagram sur les bienfaits du jeûne intermittent",
    style: "realistic",
    format: "square",
    width: 512,
    height: 512,
    steps: 50,
    guidanceScale: 7.5,
    cfgScale: 7.5,
    enhancePrompt: true
  })
});
```

### 2. Vérifier le statut d'une génération
```typescript
const response = await fetch('/api/stable-diffusion/generate?userId=1&type=status&generationId=generation_id');
const data = await response.json();
console.log(data.status);
```

### 3. Récupérer les styles disponibles
```typescript
const response = await fetch('/api/stable-diffusion/generate?userId=1&type=styles');
const data = await response.json();
console.log(data.styles);
```

## 📊 Fonctionnalités

### 🎨 Styles artistiques disponibles
- **Réaliste** : Rendu photoréaliste et détaillé
- **Artistique** : Style créatif et expressif
- **Anime** : Style manga et animation japonaise
- **Photographique** : Style photographie professionnelle
- **Art Digital** : Art numérique et concept art
- **Cinématique** : Éclairage dramatique et épique
- **Minimaliste** : Design simple et élégant
- **Vintage** : Style rétro et nostalgique
- **Cyberpunk** : Style futuriste et néon
- **Fantasy** : Art fantastique et mystique

### 📱 Formats adaptés aux réseaux sociaux
- **Carré** : 512x512 (format standard)
- **Portrait** : 512x768 (format vertical)
- **Paysage** : 768x512 (format horizontal)
- **Instagram Post** : 1080x1080 (carré haute résolution)
- **Instagram Story** : 1080x1920 (vertical haute résolution)
- **Facebook Post** : 1200x630 (paysage optimisé)
- **LinkedIn Post** : 1200x627 (professionnel)
- **YouTube Thumbnail** : 1280x720 (paysage haute résolution)
- **Pinterest Pin** : 1000x1500 (vertical optimisé)

### 🤖 Enrichissement IA avec GPT-4
- **Analyse du contexte** : Comprend le sujet et l'intention
- **Optimisation par plateforme** : Adapte le style selon le réseau
- **Amélioration des prompts** : Transforme un brief en description visuelle détaillée
- **Gestion des contraintes** : Respecte les limites de Stable Diffusion
- **Prompts négatifs** : Génère automatiquement des éléments à éviter

### ⚙️ Paramètres de génération
- **Étapes** : 20-100 (qualité vs vitesse)
- **Guidance Scale** : 1-20 (cohérence du prompt)
- **CFG Scale** : 1-20 (contrôle de la génération)
- **Seed** : Valeur fixe pour reproductibilité
- **Dimensions** : Largeur et hauteur personnalisables

### 📋 Prompts prédéfinis
- **Succès Business** : Représentation du succès entrepreneurial
- **Motivation Matinale** : Énergie positive pour commencer la journée
- **Innovation Technologique** : Technologies du futur et innovation
- **Méditation et Pleine Conscience** : Calme et sérénité intérieure
- **Espace de Travail Créatif** : Bureau inspirant pour la créativité

## 🎯 API Endpoints

### Génération d'images
```
POST /api/stable-diffusion/generate
{
  "userId": 1,
  "prompt": "description de l'image",
  "negativePrompt": "éléments à éviter",
  "style": "realistic",
  "format": "square",
  "width": 512,
  "height": 512,
  "steps": 50,
  "guidanceScale": 7.5,
  "cfgScale": 7.5,
  "seed": 12345,
  "enhancePrompt": true
}
```

### Récupération des données
```
GET /api/stable-diffusion/generate?userId=1&type=styles
GET /api/stable-diffusion/generate?userId=1&type=prompts
GET /api/stable-diffusion/generate?userId=1&type=user_images&limit=20
GET /api/stable-diffusion/generate?userId=1&type=status&generationId=generation_id
```

### Gestion des images
```
POST /api/stable-diffusion/associate
{
  "imageId": 123,
  "scheduledPostId": 456
}

DELETE /api/stable-diffusion/delete?imageId=123&userId=1
```

## 🎨 Interface utilisateur

### Générateur principal
- 📝 **Formulaire intuitif** : Saisie du prompt et sélection des options
- 🎨 **Sélecteur de styles** : Choix parmi les styles artistiques disponibles
- 📱 **Sélecteur de formats** : Adaptation aux réseaux sociaux
- ⚙️ **Options avancées** : Contrôle des paramètres de génération
- 🔄 **Polling automatique** : Vérification du statut en temps réel
- 📋 **Prompts prédéfinis** : Suggestions pour démarrer rapidement
- 📏 **Dimensions personnalisables** : Largeur et hauteur ajustables
- 🎛️ **Contrôles de qualité** : Étapes, guidance, CFG scale

### Galerie d'images
- 📊 **Vue grille/liste** : Deux modes d'affichage
- 🔍 **Recherche et filtres** : Par prompt, style, statut
- 📈 **Statistiques** : Nombre de générations, téléchargements, utilisations
- 📥 **Téléchargement** : Export des images en PNG
- 🗑️ **Gestion** : Suppression des générations
- 📊 **Métriques détaillées** : Paramètres utilisés pour chaque génération

## 🔒 Sécurité

### Gestion des clés API
- 🔐 **Clé sécurisée** : Stockage en variables d'environnement
- 📊 **Monitoring** : Suivi des utilisations et coûts
- 🛡️ **Rate limiting** : Protection contre les abus
- 🔄 **Rotation** : Gestion de plusieurs clés si nécessaire

### Stockage des images
- 💾 **Stockage local** : Images téléchargées sur le serveur
- 🔗 **URLs sécurisées** : Accès contrôlé aux images
- 🗑️ **Nettoyage** : Suppression automatique des anciennes images
- 📁 **Organisation** : Structure de dossiers par utilisateur

## 🚀 Déploiement

### Variables de production
```env
STABLE_DIFFUSION_API_URL="https://api.stability.ai"
STABLE_DIFFUSION_API_KEY="your-production-key"
STABLE_DIFFUSION_PROVIDER="stability"
UPLOAD_DIR="/var/www/uploads"
BASE_URL="https://votre-domaine.com"
DATABASE_URL="postgresql://..."
```

### Optimisations production
- 🖼️ **CDN** : Utilisation d'un CDN pour les images
- 💾 **Stockage cloud** : AWS S3, Cloudinary, ou Supabase Storage
- 🔄 **Cache Redis** : Mise en cache des styles et prompts
- 📊 **Monitoring** : Suivi des performances et coûts
- ⚡ **Queue asynchrone** : Gestion des générations longues

## 🧪 Tests

### Tests unitaires
```bash
npm run test:stable-diffusion
```

### Tests d'intégration
```bash
# Tester la génération
curl -X POST http://localhost:3000/api/stable-diffusion/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"prompt":"test image"}'

# Tester la récupération des styles
curl http://localhost:3000/api/stable-diffusion/generate?userId=1&type=styles
```

## 📈 Monitoring

### Métriques importantes
- 🎨 **Images générées** : Nombre total par utilisateur
- 💰 **Coût Stable Diffusion** : Suivi des dépenses API
- ⏱️ **Temps de génération** : Performance moyenne
- 📊 **Qualité** : Taux de satisfaction utilisateur
- 🔄 **Échecs** : Fréquence des générations échouées
- ⚙️ **Paramètres populaires** : Styles et formats les plus utilisés

### Logs à surveiller
```
✅ Stable Diffusion generation started
🤖 Prompt enhanced with GPT-4
📊 Generation status: PROCESSING
✅ Image generated successfully
📥 Image downloaded and stored
🗑️ Generation deleted successfully
❌ Generation failed: rate limit exceeded
```

## 🐛 Dépannage

### Erreurs courantes

1. **"Stable Diffusion API key not found"**
   - Vérifiez `STABLE_DIFFUSION_API_KEY` dans `.env`
   - Assurez-vous que la clé est valide

2. **"Rate limit exceeded"**
   - Stable Diffusion limite les appels API
   - Implémentez du cache et de la file d'attente

3. **"Generation failed"**
   - Vérifiez le prompt (pas de contenu inapproprié)
   - Vérifiez les crédits Stable Diffusion

4. **"Status check failed"**
   - Vérifiez la connectivité avec l'API Stable Diffusion
   - Vérifiez les permissions de l'API

5. **"Invalid parameters"**
   - Vérifiez les dimensions (multiples de 64)
   - Vérifiez les valeurs des paramètres (étapes, guidance, etc.)

## 🔄 Mise à jour

### Nouvelles fonctionnalités
- 🎨 **Styles personnalisés** : Création de styles par utilisateur
- 📱 **Formats dynamiques** : Adaptation automatique aux nouvelles plateformes
- 🤖 **IA améliorée** : Prompts plus intelligents et contextuels
- 📊 **Analytics avancées** : Insights sur les performances des images
- 🔄 **Variations** : Génération de variations à partir d'une image source
- 🎨 **Inpainting/Outpainting** : Retouche et extension d'images

### Maintenance
- 🧹 **Nettoyage automatique** : Suppression des anciennes générations
- 📈 **Optimisation coûts** : Gestion intelligente des appels API
- 🔄 **Mise à jour styles** : Ajout de nouveaux styles artistiques
- 🔒 **Sécurité** : Audits réguliers des permissions

## 📞 Support

### Documentation
- 📖 **API Reference** : Endpoints détaillés
- 🎯 **Guides utilisateur** : Tutoriels pas à pas
- 🔧 **Configuration** : Setup complet
- 🐛 **Dépannage** : Solutions courantes

### Contact
- 📧 **Email** : support@crealia.com
- 💬 **Discord** : communauté développeurs
- 📚 **Documentation** : docs.crealia.com

---

**🎉 Félicitations !** Votre intégration Stable Diffusion est maintenant opérationnelle et prête à créer des visuels artistiques uniques et engageants pour vos utilisateurs ! 