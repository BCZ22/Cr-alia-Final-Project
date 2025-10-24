# FEATURE - Créalia Studio

## 📋 Vue d'ensemble

**Créalia Studio** est l'interface centrale de création multimédia de la plateforme Créalia. C'est un studio IA tout-en-un qui permet aux utilisateurs de créer, éditer et optimiser du contenu vidéo, image et audio pour les réseaux sociaux.

### Objectif principal

Permettre aux créateurs de transformer n'importe quel média en contenu viral optimisé pour Instagram Reels, TikTok, YouTube Shorts et autres plateformes sociales, en quelques clics, avec l'assistance de l'IA.

---

## 🎯 Fonctionnalités principales

### 1. Générateur de Reels IA
- **Analyse automatique** de vidéos longues
- **Détection de scènes** optimales
- **Génération de 1-3 Reels** optimisés
- **Sous-titres automatiques** synchronisés
- **Musique automatique** ou manuelle
- **Branding automatique** (logo, couleurs)
- **Étalonnage couleur** IA
- **Hooks d'accroche** générés par IA

### 2. Outils Vidéo
- Redimensionnement intelligent
- Découpe vidéo automatique
- Améliorateur de qualité (upscale 4K, stabilisation)
- Transitions IA
- Effets visuels
- Picture-in-Picture
- Suppression d'arrière-plan vidéo

### 3. Outils Image
- Génération texte-en-image
- Améliorateur d'images
- Suppression d'arrière-plan
- Création d'avatars IA
- Miniatures YouTube
- Bannières sociales
- Logos personnalisés

### 4. Outils Audio
- Text-to-Speech (voix naturelles)
- Clonage de voix
- Bibliothèque musicale
- Effets sonores
- Traduction vocale
- Narration automatique

---

## 🏗️ Architecture

### Structure des composants

```
components/
  crealia-studio-interface-v2.tsx    # Interface principale
  
lib/studio/
  types.ts                            # Types TypeScript
  tools-config.ts                     # Configuration des outils
  
app/api/crealia/
  upload/route.ts                     # Upload de médias
  analyze/route.ts                    # Analyse IA
  generate/route.ts                   # Génération de contenu
  jobs/[jobId]/route.ts              # Statut des jobs
  captions/route.ts                   # Sous-titres
  presets/route.ts                    # Presets/templates
  brand/route.ts                      # Brand kit
  
backend/services/
  crealia-studio.service.ts           # Logique métier
  
e2e/
  crealia-studio.spec.ts              # Tests E2E
```

### Layout de l'interface

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  🎬 Créalia Studio  |  [?] [⚙️] [✕]                         │
├─────────┬─────────────────────────────────┬─────────────────┤
│ SIDEBAR │      PANNEAU CENTRAL            │   PANNEAU DROIT │
│         │                                 │                 │
│ • Rec.  │  ┌────┐ ┌────┐ ┌────┐          │  📤 Upload      │
│ • Vidéo │  │Tool│ │Tool│ │Tool│          │                 │
│ • Image │  └────┘ └────┘ └────┘          │  ⚙️ Params      │
│ • Audio │  ┌────┐ ┌────┐ ┌────┐          │                 │
│ • Proj. │  │Tool│ │Tool│ │Tool│          │  ⚡ Presets     │
│ • Hist. │  └────┘ └────┘ └────┘          │                 │
│         │                                 │  🎬 Generate    │
│         │                                 │                 │
│         │                                 │  ✨ Results     │
├─────────┴─────────────────────────────────┴─────────────────┤
│  FOOTER: Conditions | Aide | v2.0                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. POST /api/crealia/upload

Upload de fichiers média (vidéo/image).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
file: File (required)
project_id: string (optional)
```

**Response:**
```json
{
  "status": "success",
  "media_url": "/uploads/crealia/user_123/media_xyz.mp4",
  "media_id": "media_xyz",
  "metadata": {
    "duration": 120,
    "format": "mp4",
    "resolution": { "width": 1920, "height": 1080 },
    "size": 52428800,
    "thumbnail": "/uploads/crealia/user_123/media_xyz_thumb.jpg"
  }
}
```

**Limites:**
- Taille max: 2GB
- Formats vidéo: mp4, mov, webm
- Formats image: jpg, png, webp

**Erreurs:**
- `400` - Invalid file type / File too large
- `401` - Unauthorized
- `500` - Upload failed

---

### 2. POST /api/crealia/analyze

Analyse IA du média (détection de scènes, objets, suggestions de clips).

**Body:**
```json
{
  "media_url": "/uploads/...",
  "analyze_options": {
    "detect_scenes": true,
    "detect_objects": true,
    "suggest_clips": true
  }
}
```

**Response:**
```json
{
  "status": "success",
  "scenes": [
    {
      "start": 0,
      "end": 5,
      "score": 0.95,
      "thumbnail": "/path/to/thumb.jpg",
      "description": "Plan d'ouverture dynamique"
    }
  ],
  "objects": [
    { "type": "person", "confidence": 0.95 },
    { "type": "car", "confidence": 0.88 }
  ],
  "suggested_clips": [
    {
      "start": 5,
      "end": 20,
      "reason": "Moment le plus dynamique et engageant"
    }
  ],
  "dominantColors": ["#1a73e8", "#34a853", "#fbbc04"],
  "mood": "energetic"
}
```

---

### 3. POST /api/crealia/generate

Génération de contenu avec un outil spécifique.

**Body:**
```json
{
  "media_id": "media_xyz",
  "tool": "reels-generator",
  "params": {
    "aspect_ratio": "9:16",
    "duration_target": 30,
    "tone": "viral",
    "music_mode": "auto",
    "subtitles": true,
    "brand_overlay": true,
    "color_grade": "vibrant",
    "hooks": "Découvrez le secret pour..."
  },
  "auto_branding": true
}
```

**Response (immediate):**
```json
{
  "job_id": "job_abc123",
  "status": "queued",
  "estimated_time_sec": 120,
  "message": "Job créé avec succès"
}
```

**Outils disponibles:**
- `reels-generator` - Générateur de Reels IA
- `text-to-speech` - Voix off IA
- `voice-changer` - Modification de voix
- `product-ads` - Publicités produit
- `background-remover` - Suppression d'arrière-plan
- `video-splitter` - Découpe vidéo
- `avatar-creator` - Avatar parlant IA
- `auto-subtitles` - Sous-titres automatiques
- `video-resizer` - Redimensionnement
- `video-enhancer` - Amélioration qualité
- `transitions-ai` - Transitions automatiques
- `text-to-image` - Génération d'images
- `music-library` - Bibliothèque musicale

---

### 4. GET /api/crealia/jobs/[jobId]

Récupération du statut et des résultats d'un job.

**Response:**
```json
{
  "job_id": "job_abc123",
  "status": "success",
  "progress": 100,
  "logs": [
    "Job créé",
    "Analyse en cours...",
    "Génération terminée avec succès"
  ],
  "outputs": [
    {
      "id": "output_1",
      "type": "reel",
      "url": "/uploads/reel-1.mp4",
      "thumbnail": "/uploads/reel-1-thumb.jpg",
      "meta": {
        "duration": 30,
        "aspect_ratio": "9:16",
        "format": "mp4",
        "size": 5242880
      },
      "caption": {
        "title": "Incroyable transformation ! 🔥",
        "text": "Découvrez comment...",
        "hashtags": ["#crealia", "#reels", "#viral", "#ai"]
      }
    }
  ],
  "created_at": "2025-10-23T10:00:00Z",
  "updated_at": "2025-10-23T10:02:00Z"
}
```

**Statuts possibles:**
- `queued` - En attente
- `running` - En cours
- `success` - Terminé avec succès
- `failed` - Échec

---

### 5. POST /api/crealia/captions

Génération de sous-titres pour vidéo.

**Body:**
```json
{
  "media_id": "media_xyz",
  "lang": "fr",
  "format": "json"
}
```

**Response:**
```json
{
  "status": "success",
  "subtitles_url": "/uploads/captions/media_xyz.srt",
  "transcript": "Bienvenue sur Créalia Studio...",
  "subtitles": [
    { "start": 0, "end": 3, "text": "Bienvenue sur Créalia Studio !" },
    { "start": 3, "end": 7, "text": "La plateforme de création..." }
  ]
}
```

---

### 6. GET /api/crealia/presets

Récupération des presets/templates disponibles.

**Query params:**
- `tool` (optional) - Filtrer par outil

**Response:**
```json
{
  "success": true,
  "presets": [
    {
      "id": "marketing-auto",
      "tool_id": "reels-generator",
      "tool_name": "Générateur de Reels IA",
      "name": "Marketing Auto - Sportif",
      "description": "Parfait pour agences de location de voiture",
      "params": {
        "aspect_ratio": "9:16",
        "duration_target": 30,
        "tone": "sportif",
        "music_mode": "auto",
        "subtitles": true,
        "brand_overlay": true,
        "color_grade": "vibrant"
      }
    }
  ],
  "count": 12
}
```

---

### 7. GET /api/crealia/brand

Récupération du brand kit de l'utilisateur.

**Response:**
```json
{
  "success": true,
  "brand_kit": {
    "logo_url": "/uploads/brand/logo.png",
    "colors": ["#1a73e8", "#34a853", "#fbbc04", "#ea4335"],
    "fonts": ["Inter", "Montserrat"],
    "tagline": "Créez. Innovez. Partagez.",
    "assets": [
      { "type": "logo", "url": "/uploads/brand/logo.png" },
      { "type": "watermark", "url": "/uploads/brand/watermark.png" }
    ]
  }
}
```

---

## ⚙️ Configuration

### Variables d'environnement

```bash
# Mode MOCK (développement)
CREALIA_MOCK=true

# Storage (production)
STORAGE_PROVIDER=s3  # ou 'local'
S3_BUCKET=crealia-media
S3_REGION=eu-west-1
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx

# Upload limits
UPLOAD_MAX_SIZE_MB=2048

# API keys (production)
OPENAI_API_KEY=sk-xxx          # Pour TTS, captions
WHISPER_API_KEY=xxx            # Pour sous-titres
ELEVENLABS_API_KEY=xxx         # Pour clonage de voix (optionnel)
STABILITY_API_KEY=xxx          # Pour génération d'images (optionnel)

# Queue (production)
REDIS_URL=redis://localhost:6379
QUEUE_CONCURRENCY=5

# Analytics
ANALYTICS_ENABLED=true
```

---

## 🎨 User Flows

### Flow 1 : Upload + Génération de Reels

1. **Utilisateur ouvre Créalia Studio**
   - Interface s'affiche instantanément
   - Catégorie "Recommandé" active par défaut
   - Outils visibles immédiatement

2. **Sélection de l'outil "Générateur de Reels IA"**
   - Panneau droit s'ouvre avec détails
   - Zone d'upload visible
   - Paramètres affichés avec valeurs par défaut

3. **Upload du média**
   - Drag & drop ou clic
   - Validation du format et taille
   - Progress bar
   - Message : "Fichier reçu ✅"
   - Analyse automatique démarre

4. **Analyse automatique**
   - Message : "J'analyse maintenant la vidéo..."
   - Détection de scènes
   - Affichage des thumbnails
   - Suggestions de clips

5. **Configuration des paramètres**
   - Application d'un preset (optionnel) : "Viral & Fun"
   - Ajustement manuel (optionnel)
   - Validation automatique

6. **Génération**
   - Clic sur "Générer"
   - Message : "Génération lancée — job #XYZ"
   - Barre de progression
   - Estimation : "2 min"

7. **Polling du statut**
   - Mise à jour toutes les 2 secondes
   - Logs affichés en temps réel

8. **Résultats**
   - 1-3 Reels générés
   - Thumbnails affichés
   - Titres et hashtags optimisés
   - Boutons "Télécharger" et "Partager"

9. **Téléchargement**
   - Clic sur "Télécharger"
   - Fichier MP4 téléchargé
   - Event analytics : `download_clicked`

### Flow 2 : Brief textuel → Génération automatique

**Scénario:** Utilisateur : "Je veux 3 Reels marketing pour agence de location de voiture"

1. Détection d'un brief textuel
2. Système suggère preset "Marketing Auto - Sportif"
3. Si média présent : lance analyse → génération
4. Si média absent : CTA "Uploader la vidéo" (une seule fois)
5. Auto-génération si Auto-run activé

---

## 🧪 Tests

### Tests E2E (Playwright)

**Fichier:** `e2e/crealia-studio.spec.ts`

**Scénarios couverts:**
- ✅ Ouverture de l'interface
- ✅ Navigation entre catégories
- ✅ Sélection d'un outil
- ✅ Affichage des presets
- ✅ Application d'un preset
- ✅ Upload de fichier (drag & drop)
- ✅ Validation de formulaire
- ✅ Génération de contenu
- ✅ Affichage des résultats
- ✅ Téléchargement d'output
- ✅ Toggle Auto-run
- ✅ Gestion d'erreurs (format invalide, taille)
- ✅ Aide rapide
- ✅ Tracking analytics

**Commande:**
```bash
npm run test:e2e -- crealia-studio
```

### Tests unitaires

À implémenter pour les services backend :
- `crealia-studio.service.test.ts`
- Validation des paramètres
- Génération de mock outputs
- Gestion des jobs

---

## 📊 Analytics & KPIs

### Events trackés

```typescript
type StudioEventType =
  | 'tool_opened'           // Outil sélectionné
  | 'upload_started'        // Upload démarré
  | 'upload_completed'      // Upload terminé
  | 'analyze_started'       // Analyse démarrée
  | 'analyze_completed'     // Analyse terminée
  | 'generate_started'      // Génération démarrée
  | 'generate_completed'    // Génération terminée
  | 'generate_failed'       // Génération échouée
  | 'preset_applied'        // Preset appliqué
  | 'download_clicked'      // Téléchargement
```

### KPIs à monitorer

- **Time to first output** : Temps moyen jusqu'au premier résultat
- **Success rate** : % de générations réussies
- **Average generation time** : Temps moyen de génération
- **User dropoff point** : Où les utilisateurs abandonnent
- **Most used tools** : Outils les plus populaires
- **Preset usage rate** : % d'utilisation des presets

---

## 🔒 Sécurité

### Authentification
- Toutes les routes `/api/crealia/*` requièrent un JWT token
- Vérification via `getServerSession(authOptions)`

### Validation
- Types de fichiers strictement validés
- Taille max 2GB configurée
- Sanitization des noms de fichiers
- Vérification de propriété des jobs

### Storage
- Fichiers stockés dans `/public/uploads/crealia/{userId}/`
- En production : S3 avec SSE (Server-Side Encryption)
- Signed URLs time-limited pour les downloads

### Rate Limiting
- À implémenter : limite de générations par user/période
- Protection contre abus

---

## 🚀 Mode MOCK vs Production

### Mode MOCK (`CREALIA_MOCK=true`)

**Utilisé pour :**
- Développement local
- Tests
- Démo

**Comportement :**
- Upload : sauvegarde locale simple
- Analyse : retourne données mockées immédiatement
- Génération : simule processing (5 secondes)
- Outputs : fichiers placeholders
- Pas d'appels externes

### Mode Production (`CREALIA_MOCK=false`)

**Technologies utilisées :**
- **FFmpeg** : traitement vidéo, scene detection
- **Whisper API** : sous-titres
- **OpenAI/Anthropic** : captions, hooks
- **Stability AI / DALL-E** : génération d'images
- **ElevenLabs** : clonage de voix
- **S3** : storage
- **Redis + Bull** : queue de jobs
- **TensorFlow/PyTorch** : object detection

---

## 📦 Déploiement

### Pre-requis
- Node.js 18+
- Redis (pour queue en production)
- S3 bucket (pour storage en production)
- API keys (OpenAI, Whisper, etc.)

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

### Docker
```bash
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Upload échoue
- Vérifier format et taille du fichier
- Vérifier permissions du dossier `public/uploads/`
- Vérifier configuration S3 si en production

### Génération bloquée sur "queued"
- Vérifier connexion Redis
- Vérifier workers actifs
- Vérifier logs : `docker logs crealia-worker`

### Analyse ne retourne pas de scènes
- En mode MOCK : vérifier `CREALIA_MOCK=true`
- En production : vérifier FFmpeg installé

### Erreur "Job not found"
- Job expiré (TTL dépassé)
- Job supprimé
- Mauvais jobId

---

## 🔮 Roadmap

### Phase 1 (✅ Complété)
- Interface complète
- Upload & analyse
- Générateur de Reels de base
- Mode MOCK
- Tests E2E

### Phase 2 (En cours)
- Intégration FFmpeg production
- Whisper pour sous-titres
- Queue Redis + Bull
- Storage S3

### Phase 3 (Prévu)
- Tous les outils vidéo/image/audio
- Templates avancés
- Collaboration temps réel
- Export direct vers plateformes sociales
- Scheduler de publication

### Phase 4 (Futur)
- IA générative custom (fine-tuned models)
- Brand kit avancé
- Analytics approfondies
- API publique pour développeurs

---

## 📞 Support

**Documentation :** `/help/crealia-studio`  
**Email :** support@crealia.com  
**Discord :** #crealia-studio

---

## ✅ Critères d'acceptation

### Interface
- [x] Layout complet (header, sidebar, panneau central, panneau droit)
- [x] Navigation fluide entre catégories
- [x] Cartes d'outils avec icônes, descriptions, tags
- [x] Panneau droit dynamique avec détails outil

### Upload
- [x] Drag & drop fonctionnel
- [x] Validation format et taille
- [x] Progress bar
- [x] Messages de succès/erreur clairs

### Génération
- [x] Tous les endpoints API créés
- [x] Job system avec polling
- [x] Mode MOCK complet
- [x] Outputs avec captions et hashtags

### UX
- [x] Aucune question répétée à l'utilisateur
- [x] Auto-run fonctionnel
- [x] Presets applicables en un clic
- [x] Aide contextuelle

### Tests
- [x] Tests E2E pour flows principaux
- [x] Tous les scénarios critiques couverts

### Documentation
- [x] FEATURE-CREALIA-STUDIO.md complet
- [x] API endpoints documentés
- [x] Flows utilisateur décrits
- [x] Configuration expliquée

---

**Version :** 2.0  
**Date :** 23 octobre 2025  
**Auteur :** Équipe Créalia / Cursor AI Assistant  
**Statut :** ✅ Implémentation complète

