# Module d'Édition Vidéo - Documentation Technique

## Vue d'ensemble

Le module d'édition vidéo est un système complet inspiré de CapCut, intégré dans le SaaS Crealia. Il permet aux utilisateurs de créer, éditer et exporter des vidéos directement dans leur navigateur.

## Architecture

### Frontend
- **Framework**: Next.js 14 avec App Router
- **UI**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Composants**: Radix UI + Lucide React
- **Tests**: Jest + React Testing Library + Playwright

### Backend
- **API**: Next.js API Routes
- **Base de données**: PostgreSQL avec Prisma ORM
- **Queue**: BullMQ avec Redis
- **Stockage**: AWS S3 (compatible S3)
- **Workers**: Docker + FFmpeg

### Pipeline Vidéo
- **Rendu**: FFmpeg avec support GPU
- **Formats**: MP4, MOV, WebM, HEVC, VP9
- **Résolutions**: 720p, 1080p, 4K
- **Qualité**: LOW, MEDIUM, HIGH, ULTRA

## Fonctionnalités

### 1. Gestion des Projets
- Création, édition, suppression de projets
- Sauvegarde automatique
- Duplication de projets
- Collaboration en temps réel

### 2. Éditeur Timeline
- Multi-pistes (vidéo, audio, overlays)
- Opérations de base : cut, trim, split, crop, resize
- Drag & drop avec snapping intelligent
- Zoom et navigation temporelle

### 3. Gestion des Médias
- Upload sécurisé via URLs signées S3
- Génération automatique de vignettes
- Support multi-formats
- Bibliothèque de médias

### 4. Effets et Transitions
- Filtres de couleur (luminosité, contraste, saturation)
- Effets de flou (gaussian, motion, radial)
- Transitions (fondu, slide, glitch, zoom)
- Animations de texte

### 5. Audio
- Ajout de musiques
- Ajustement du volume
- Fade in/out
- Ducking automatique
- Bibliothèque de sons libres

### 6. Export et Rendu
- Formats multiples (MP4, MOV, WebM)
- Qualités variables
- Watermark automatique
- Export direct vers réseaux sociaux

## API Endpoints

### Projets
```
GET    /api/video-editor/projects           # Liste des projets
POST   /api/video-editor/projects           # Créer un projet
GET    /api/video-editor/projects/[id]      # Récupérer un projet
PUT    /api/video-editor/projects/[id]      # Mettre à jour un projet
DELETE /api/video-editor/projects/[id]      # Supprimer un projet
POST   /api/video-editor/projects/[id]/duplicate # Dupliquer un projet
```

### Pistes
```
POST   /api/video-editor/tracks             # Ajouter une piste
PUT    /api/video-editor/tracks/[id]        # Mettre à jour une piste
DELETE /api/video-editor/tracks/[id]        # Supprimer une piste
```

### Clips
```
POST   /api/video-editor/clips              # Ajouter un clip
PUT    /api/video-editor/clips/[id]         # Mettre à jour un clip
DELETE /api/video-editor/clips/[id]         # Supprimer un clip
```

### Médias
```
GET    /api/video-editor/media              # Liste des médias
POST   /api/video-editor/media              # Créer un média
GET    /api/video-editor/media/[id]         # Récupérer un média
PUT    /api/video-editor/media/[id]         # Mettre à jour un média
DELETE /api/video-editor/media/[id]         # Supprimer un média
POST   /api/video-editor/media/upload       # Upload de fichier
GET    /api/video-editor/media/[id]/signed-url # URL signée
```

### Export
```
POST   /api/video-editor/export             # Lancer un export
GET    /api/video-editor/export/[id]        # Statut de l'export
```

## Base de Données

### Modèles Principaux

#### VideoProject
```prisma
model VideoProject {
  id          String            @id @default(cuid())
  name        String
  status      VideoProjectStatus
  duration    Float
  resolution  String
  fps         Int
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Relations
  user        User              @relation(fields: [userId], references: [id])
  userId      String
  tracks      VideoTrack[]
  exports     VideoExport[]
  collaborations VideoCollaboration[]
}
```

#### VideoTrack
```prisma
model VideoTrack {
  id        String    @id @default(cuid())
  projectId String
  type      TrackType
  name      String
  order     Int
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  // Relations
  project   VideoProject @relation(fields: [projectId], references: [id])
  clips     VideoClip[]
}
```

#### VideoClip
```prisma
model VideoClip {
  id        String   @id @default(cuid())
  trackId   String
  type      ClipType
  name      String
  startTime Float
  duration  Float
  sourceUrl String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  track     VideoTrack @relation(fields: [trackId], references: [id])
}
```

## Services

### VideoEditorService
Gestion des projets vidéo, pistes et clips.

### MediaAssetService
Gestion des fichiers média, upload et métadonnées.

### VideoRenderService
Orchestration du rendu vidéo et gestion des jobs.

### QueueService
Abstraction des opérations de queue BullMQ.

## Workers

### VideoRenderWorker
Worker principal pour le rendu vidéo avec FFmpeg.

```typescript
// Exemple de job de rendu
const renderJob = {
  type: 'VIDEO_RENDER',
  data: {
    projectId: 'project-123',
    timeline: {
      tracks: [
        {
          type: 'VIDEO',
          clips: [
            {
              startTime: 0,
              duration: 10,
              sourceUrl: 'https://s3.../video.mp4',
              effects: ['brightness:0.2', 'contrast:1.1']
            }
          ]
        }
      ]
    },
    export: {
      format: 'MP4',
      resolution: '1920x1080',
      quality: 'HIGH'
    }
  }
};
```

## Tests

### Tests Unitaires
```bash
npm run test:unit
```

### Tests d'Intégration
```bash
npm run test:integration
```

### Tests E2E
```bash
npm run test:e2e
```

### Tests de Performance
```bash
npm run test:performance
```

### Tests de Sécurité
```bash
npm run test:security
```

## Déploiement

### Développement
```bash
# Démarrer l'environnement complet
docker-compose up -d

# Démarrer l'application
npm run dev

# Démarrer les workers
npm run start:workers
```

### Production
```bash
# Build de l'application
npm run build

# Build des workers
docker build -f Dockerfile.workers -t crealia-video-workers .

# Déploiement avec Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

### Métriques
- Temps de rendu vidéo
- Taux d'erreur des jobs
- Utilisation des ressources
- Performance des API

### Dashboards
- Grafana pour la visualisation
- Prometheus pour la collecte
- Alertes automatiques

## Sécurité

### Authentification
- JWT + OAuth 2.0
- Multi-tenant
- Permissions granulaires

### Protection
- Rate limiting
- Validation des entrées
- URLs signées S3
- Chiffrement des données

### Conformité
- RGPD
- Audit de sécurité
- Tests de pénétration

## Performance

### Optimisations
- Lazy loading des composants
- Mise en cache des médias
- Compression des assets
- CDN pour les fichiers statiques

### Scalabilité
- Auto-scaling des workers
- Load balancing
- Base de données répliquée
- Cache Redis distribué

## Troubleshooting

### Problèmes Courants

#### Rendu vidéo échoue
1. Vérifier les logs des workers
2. Contrôler l'espace disque
3. Valider les formats de fichiers
4. Tester la connectivité S3

#### Performance lente
1. Analyser les métriques de performance
2. Vérifier la charge des workers
3. Optimiser les requêtes base de données
4. Contrôler la mémoire disponible

#### Erreurs d'upload
1. Vérifier les permissions S3
2. Contrôler la taille des fichiers
3. Valider les types MIME
4. Tester la connectivité réseau

## Support

Pour toute question ou problème :
- Documentation : `/docs`
- Issues : GitHub Issues
- Support : support@crealia.com
