# 🎬 Intégration Runway ML - Guide Complet

## 📋 Vue d'ensemble

L'intégration Runway ML dans Crealia permet aux utilisateurs de générer des contenus multimédias avancés (vidéos, avatars, images, effets spéciaux) à partir de prompts textuels ou visuels, dans une interface simple et performante.

## 🎯 Fonctionnalités Implémentées

### ✅ Génération de Contenu Multimédia
- **Text-to-Video** : Génération de vidéos à partir de prompts textuels
- **Image-to-Video** : Transformation d'images en vidéos animées
- **Video-to-Video** : Modification et stylisation de vidéos existantes
- **Formats Supportés** : Portrait (1080x1920), Landscape (1920x1080), Square (1080x1080)

### ✅ Interface Utilisateur Avancée
- **Générateur Intuitif** : Interface simple avec prompts textuels et preview
- **Styles Prédéfinis** : Cinematic, Artistic, Commercial, Social Media, etc.
- **Prompts Templates** : Suggestions de prompts optimisés par plateforme
- **Galerie de Contenu** : Historique des créations avec gestion des assets

### ✅ Gestion Asynchrone
- **Polling Intelligent** : Vérification automatique du statut de génération
- **Progress Tracking** : Affichage en temps réel de l'avancement
- **Error Handling** : Gestion robuste des erreurs et timeouts

### ✅ Intégration SaaS
- **Multi-utilisateur** : Isolation des contenus par utilisateur
- **Stockage Cloud** : Sauvegarde sécurisée des assets générés
- **Workflow Editorial** : Intégration avec le calendrier de contenu

## 🏗 Architecture Technique

### Backend Services
```
lib/runway-service.ts          # Service principal Runway ML
app/api/runway/generate/       # API de génération
app/api/runway/associate/      # Association avec posts
app/api/runway/delete/         # Suppression de contenu
```

### Frontend Components
```
components/ui/runway/RunwayGenerator.tsx  # Interface principale
app/runway-generator/page.tsx            # Page dédiée
```

### Base de Données
```prisma
model RunwayVideo {
  id              Int      @id @default(autoincrement())
  userId          Int
  runwayTaskId    String?  // ID de la tâche Runway ML
  status          String   // PENDING, PROCESSING, COMPLETED, FAILED
  progress        Int      @default(0)
  prompt          String
  enhancedPrompt  String?
  generationType  String   // text-to-video, image-to-video, video-to-video
  style           String
  format          String
  duration        Int
  fps             Int
  width           Int
  height          Int
  seed            Int?
  platform        String?
  contentType     String?
  videoUrl        String?
  thumbnailUrl    String?
  localPath       String?
  error           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model RunwayVideoStyle {
  id              Int      @id @default(autoincrement())
  name            String   @unique
  displayName     String
  description     String?
  category        String
  promptTemplate  String
  keywords        String?  // JSON array
  defaultDuration Int
  defaultFps      Int
  defaultWidth    Int
  defaultHeight   Int
}

model RunwayVideoPrompt {
  id              Int      @id @default(autoincrement())
  name            String   @unique
  displayName     String
  description     String?
  category        String
  basePrompt      String
  styleId         Int?
  defaultDuration Int
  defaultFps      Int
  defaultWidth    Int
  defaultHeight   Int
  style           RunwayVideoStyle? @relation(fields: [styleId], references: [id])
}
```

## 🔧 Configuration

### Variables d'Environnement
```env
# Runway ML API
RUNWAY_API_KEY=your_runway_api_key
RUNWAY_API_URL=https://api.runwayml.com

# Upload et Stockage
UPLOAD_DIR=./public/uploads
BASE_URL=http://localhost:3000

# OpenAI (pour l'amélioration des prompts)
OPENAI_API_KEY=your_openai_api_key
```

### Installation des Dépendances
```bash
npm install axios form-data fs path
```

## 🚀 Utilisation

### 1. Génération de Vidéo
```typescript
// Exemple d'utilisation du service
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

### 2. Vérification du Statut
```typescript
// Polling du statut de génération
const status = await runwayService.checkGenerationStatus(taskId);
// Retourne: { status, progress, videoUrl?, thumbnailUrl?, error? }
```

### 3. Récupération des Styles
```typescript
// Obtenir tous les styles disponibles
const styles = await runwayService.getRunwayVideoStyles();
```

## 🎨 Styles Vidéo Disponibles

### Cinematic
- **Description** : Style cinématographique professionnel
- **Utilisation** : Films, publicités, contenus premium
- **Durée** : 4-8 secondes
- **FPS** : 24-30

### Artistic
- **Description** : Style artistique et créatif
- **Utilisation** : Contenu Instagram, TikTok créatif
- **Durée** : 3-6 secondes
- **FPS** : 24

### Commercial
- **Description** : Style commercial et professionnel
- **Utilisation** : Publicités, présentations d'entreprise
- **Durée** : 5-10 secondes
- **FPS** : 30

### Social Media
- **Description** : Optimisé pour les réseaux sociaux
- **Utilisation** : Instagram, TikTok, YouTube Shorts
- **Durée** : 3-5 secondes
- **FPS** : 24-30

## 📱 Intégration par Plateforme

### TikTok
- **Format** : Portrait (1080x1920)
- **Durée** : 3-5 secondes
- **Style** : Social Media, Artistic
- **FPS** : 24-30

### Instagram
- **Format** : Portrait (1080x1920) ou Square (1080x1080)
- **Durée** : 3-5 secondes
- **Style** : Social Media, Artistic
- **FPS** : 24-30

### YouTube Shorts
- **Format** : Portrait (1080x1920)
- **Durée** : 5-10 secondes
- **Style** : Cinematic, Commercial
- **FPS** : 24-30

### LinkedIn
- **Format** : Landscape (1920x1080)
- **Durée** : 5-10 secondes
- **Style** : Commercial, Cinematic
- **FPS** : 30

## 🔄 Workflow de Génération

### 1. Saisie du Prompt
```typescript
// L'utilisateur saisit un prompt
const prompt = "Un drone survolant une ville futuriste au coucher du soleil";
```

### 2. Amélioration du Prompt (Optionnel)
```typescript
// Amélioration automatique avec GPT-4
const enhancedPrompt = await runwayService.enhancePromptWithGPT4(
  prompt,
  'cinematic',
  'tiktok',
  'short_video'
);
```

### 3. Génération Asynchrone
```typescript
// Création de la tâche de génération
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
// Vérification périodique du statut
const checkStatus = async () => {
  const status = await runwayService.checkGenerationStatus(result.runwayTaskId);
  
  if (status.status === 'COMPLETED') {
    // Téléchargement et stockage de la vidéo
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

## 🛡 Sécurité et Performance

### Limites et Quotas
- **Générations par utilisateur** : Selon le plan d'abonnement
- **Taille des fichiers** : Max 100MB pour les uploads
- **Durée des vidéos** : 3-10 secondes selon le style
- **Formats supportés** : JPEG, PNG, MP4

### Gestion d'Erreurs
```typescript
try {
  const result = await runwayService.generateVideo(request);
} catch (error) {
  if (error.code === 'INVALID_PROMPT') {
    // Prompt non conforme
  } else if (error.code === 'API_LIMIT_EXCEEDED') {
    // Limite API dépassée
  } else if (error.code === 'GENERATION_FAILED') {
    // Échec de génération
  }
}
```

### Optimisations
- **Cache des styles** : Mise en cache des styles prédéfinis
- **Compression** : Optimisation automatique des vidéos générées
- **CDN** : Distribution via CDN pour les assets
- **Cleanup** : Nettoyage automatique des fichiers temporaires

## 🔮 Fonctionnalités Futures

### Génération Avancée
- [ ] **Intros YouTube** : Génération automatique d'intros personnalisées
- [ ] **Effets Spéciaux** : Greenscreen, style transfer, motion tracking
- [ ] **Avatars Animés** : Création de présentateurs virtuels
- [ ] **Voix Off IA** : Intégration ElevenLabs pour vidéos complètes

### Workflow Editorial
- [ ] **Templates** : Modèles de vidéos par type de contenu
- [ ] **Batch Generation** : Génération en lot pour séries de posts
- [ ] **A/B Testing** : Test de différentes versions de vidéos
- [ ] **Analytics** : Métriques de performance des vidéos

### Intégrations Avancées
- [ ] **Webhooks** : Notifications en temps réel
- [ ] **API Publique** : Endpoints pour intégrations tierces
- [ ] **Export Multi-format** : Support de formats additionnels
- [ ] **Collaboration** : Partage et collaboration sur les projets

## 📊 Métriques et Analytics

### KPIs à Suivre
- **Taux de succès** : % de générations réussies
- **Temps de génération** : Durée moyenne par type
- **Utilisation par style** : Popularité des styles
- **Performance par plateforme** : Efficacité par réseau social

### Monitoring
```typescript
// Exemple de métriques
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

## 🎯 Bonnes Pratiques

### Prompts Optimisés
- **Spécificité** : Descriptions détaillées et précises
- **Style** : Mentionner le style visuel souhaité
- **Mouvement** : Décrire les mouvements et transitions
- **Ambiance** : Préciser l'atmosphère et l'éclairage

### Formats Recommandés
- **TikTok/Instagram** : Portrait, 3-5 secondes, 24 FPS
- **YouTube Shorts** : Portrait, 5-10 secondes, 24-30 FPS
- **LinkedIn** : Landscape, 5-10 secondes, 30 FPS
- **Publicité** : Selon plateforme, 5-15 secondes, 30 FPS

### Optimisation Performance
- **Cache** : Mise en cache des résultats fréquents
- **Compression** : Optimisation automatique des fichiers
- **CDN** : Distribution géographique des assets
- **Cleanup** : Nettoyage régulier des fichiers temporaires

## 🔗 Ressources Utiles

- **Documentation Runway ML** : https://docs.runwayml.com
- **API Reference** : https://api.runwayml.com/docs
- **Exemples de Prompts** : https://runwayml.com/examples
- **Communauté** : https://community.runwayml.com

---

*Cette intégration Runway ML offre une solution complète et professionnelle pour la génération de contenu vidéo dans votre SaaS de création de contenu intelligent.* 