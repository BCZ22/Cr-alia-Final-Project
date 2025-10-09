# 🎬 Intégration Runway ML - Guide de Démarrage Rapide

## 🚀 Installation et Configuration

### 1. Variables d'Environnement
Ajoutez ces variables à votre fichier `.env` :

```env
# Runway ML API
RUNWAY_API_KEY=your_runway_api_key_here
RUNWAY_API_URL=https://api.runwayml.com

# Upload et Stockage
UPLOAD_DIR=./public/uploads
BASE_URL=http://localhost:3000

# OpenAI (pour l'amélioration des prompts)
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Génération de la Base de Données
```bash
# Générer le client Prisma avec les nouveaux modèles
npm run db:generate

# Pousser les changements de schéma vers la base de données
npm run db:push
```

### 3. Initialisation des Données
```bash
# Initialiser les données de test pour Runway ML
npm run seed:runway
```

## 🧪 Tests

### Exécuter les Tests
```bash
# Tests d'intégration Runway ML
npm run test:runway
```

### Tests Disponibles
- ✅ Initialisation du service
- ✅ Génération de vidéos
- ✅ Gestion des styles et prompts
- ✅ Vérification des statuts
- ✅ Gestion des erreurs
- ✅ Validation des formats et dimensions

## 🎯 Utilisation

### 1. Accès à l'Interface
- **URL** : `http://localhost:3000/runway-generator`
- **Dashboard** : Intégré dans le dashboard principal

### 2. Génération de Vidéo
```typescript
// Exemple d'utilisation programmatique
const runwayService = new RunwayService();

const result = await runwayService.generateVideo({
  userId: 1,
  prompt: "Un drone survolant une ville futuriste au coucher du soleil",
  generationType: 'text-to-video',
  style: 'cinematic',
  format: 'portrait',
  duration: 4,
  fps: 24,
  width: 1080,
  height: 1920,
  enhancePrompt: true
});
```

### 3. API Endpoints
```bash
# Générer une vidéo
POST /api/runway/generate

# Récupérer les styles
GET /api/runway/generate?type=styles

# Récupérer les prompts
GET /api/runway/generate?type=prompts

# Récupérer les vidéos utilisateur
GET /api/runway/generate?type=user_videos&userId=1

# Vérifier le statut
GET /api/runway/generate?type=status&taskId=xxx

# Supprimer une vidéo
DELETE /api/runway/delete
```

## 🎨 Styles Disponibles

### Cinematic
- **Utilisation** : Films, publicités, contenus premium
- **Format** : Portrait/Landscape
- **Durée** : 4-8 secondes
- **FPS** : 24-30

### Artistic
- **Utilisation** : Contenu Instagram, TikTok créatif
- **Format** : Portrait
- **Durée** : 3-6 secondes
- **FPS** : 24

### Commercial
- **Utilisation** : Publicités, présentations d'entreprise
- **Format** : Landscape
- **Durée** : 5-10 secondes
- **FPS** : 30

### Social Media
- **Utilisation** : Instagram, TikTok, YouTube Shorts
- **Format** : Portrait
- **Durée** : 3-5 secondes
- **FPS** : 24-30

## 📱 Intégration par Plateforme

### TikTok
```typescript
const tiktokConfig = {
  format: 'portrait',
  duration: 3,
  fps: 24,
  width: 1080,
  height: 1920,
  style: 'social_media',
  platform: 'tiktok'
};
```

### Instagram
```typescript
const instagramConfig = {
  format: 'portrait', // ou 'square'
  duration: 3,
  fps: 24,
  width: 1080,
  height: 1920, // ou 1080 pour square
  style: 'social_media',
  platform: 'instagram'
};
```

### YouTube Shorts
```typescript
const youtubeConfig = {
  format: 'portrait',
  duration: 5,
  fps: 24,
  width: 1080,
  height: 1920,
  style: 'cinematic',
  platform: 'youtube'
};
```

### LinkedIn
```typescript
const linkedinConfig = {
  format: 'landscape',
  duration: 5,
  fps: 30,
  width: 1920,
  height: 1080,
  style: 'commercial',
  platform: 'linkedin'
};
```

## 🔄 Workflow Complet

### 1. Saisie du Prompt
```typescript
const prompt = "Un drone survolant une ville futuriste au coucher du soleil";
```

### 2. Amélioration Automatique
```typescript
// Amélioration avec GPT-4 (optionnel)
const enhancedPrompt = await runwayService.enhancePromptWithGPT4(
  prompt,
  'cinematic',
  'tiktok',
  'short_video'
);
```

### 3. Génération Asynchrone
```typescript
const result = await runwayService.generateVideo({
  userId: 1,
  prompt: enhancedPrompt,
  generationType: 'text-to-video',
  style: 'cinematic',
  format: 'portrait',
  duration: 4,
  fps: 24
});
```

### 4. Polling du Statut
```typescript
const checkStatus = async () => {
  const status = await runwayService.checkGenerationStatus(result.runwayTaskId);
  
  if (status.status === 'COMPLETED') {
    // Téléchargement et stockage
    const localPath = await runwayService.downloadAndStoreVideo(
      status.videoUrl,
      userId
    );
  }
};
```

### 5. Intégration Editorial
```typescript
// Association avec un post planifié
await runwayService.associateVideoWithPost(videoId, scheduledPostId);
```

## 🛡 Gestion d'Erreurs

### Erreurs Communes
```typescript
try {
  const result = await runwayService.generateVideo(request);
} catch (error) {
  if (error.code === 'INVALID_PROMPT') {
    // Prompt non conforme
    console.error('Prompt invalide:', error.message);
  } else if (error.code === 'API_LIMIT_EXCEEDED') {
    // Limite API dépassée
    console.error('Limite API dépassée');
  } else if (error.code === 'GENERATION_FAILED') {
    // Échec de génération
    console.error('Échec de génération:', error.message);
  }
}
```

### Validation des Paramètres
```typescript
// Validation des types de génération
const validTypes = ['text-to-video', 'image-to-video', 'video-to-video'];

// Validation des formats
const validFormats = ['portrait', 'landscape', 'square'];

// Validation des styles
const validStyles = ['cinematic', 'artistic', 'commercial', 'social_media'];
```

## 📊 Monitoring et Analytics

### Métriques à Suivre
```typescript
const metrics = {
  totalGenerations: 1250,
  successRate: 94.2,
  averageGenerationTime: 45, // secondes
  popularStyles: ['cinematic', 'social_media', 'artistic'],
  platformUsage: {
    tiktok: 45,
    instagram: 30,
    youtube: 15,
    linkedin: 10
  }
};
```

### Dashboard Intégré
Le composant `RunwayDashboard` affiche :
- 📊 Statistiques en temps réel
- 🎨 Styles populaires
- 📱 Utilisation par plateforme
- 🎬 Vidéos récentes
- ⚡ Actions rapides

## 🔧 Configuration Avancée

### Personnalisation des Styles
```typescript
// Ajouter un style personnalisé
const customStyle = {
  name: 'custom_style',
  displayName: 'Style Personnalisé',
  description: 'Description du style',
  category: 'custom',
  promptTemplate: 'custom, {prompt}',
  defaultDuration: 4,
  defaultFps: 24,
  defaultWidth: 1080,
  defaultHeight: 1920
};
```

### Optimisation des Performances
```typescript
// Cache des styles
const cachedStyles = await runwayService.getRunwayVideoStyles();

// Compression automatique
const compressedVideo = await runwayService.compressVideo(videoPath);

// Cleanup automatique
await runwayService.cleanupTempFiles();
```

## 🚀 Déploiement

### Variables de Production
```env
# Production
RUNWAY_API_KEY=prod_runway_api_key
RUNWAY_API_URL=https://api.runwayml.com
UPLOAD_DIR=/var/www/uploads
BASE_URL=https://your-domain.com
```

### Optimisations Production
- ✅ CDN pour les assets
- ✅ Compression des vidéos
- ✅ Cache Redis pour les styles
- ✅ Monitoring avec Sentry
- ✅ Rate limiting par utilisateur

## 🔗 Ressources

- **Documentation Runway ML** : https://docs.runwayml.com
- **API Reference** : https://api.runwayml.com/docs
- **Exemples de Prompts** : https://runwayml.com/examples
- **Communauté** : https://community.runwayml.com

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs de l'application
2. Consultez la documentation Runway ML
3. Testez avec les données de test fournies
4. Contactez l'équipe de développement

---

*Cette intégration Runway ML offre une solution complète et professionnelle pour la génération de contenu vidéo dans votre SaaS de création de contenu intelligent.* 