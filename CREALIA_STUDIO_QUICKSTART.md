# 🎬 Créalia Studio - Guide de démarrage rapide

## ✅ Ce qui a été créé

### Composants UI
- ✅ `components/crealia-studio-interface-v2.tsx` - Interface complète orchestrée
- ✅ Layout professionnel (header, sidebar, panneau central, panneau droit)
- ✅ Grille d'outils avec cartes interactives
- ✅ Panneau de détails dynamique avec formulaire paramétrable
- ✅ Upload drag & drop
- ✅ Système de presets
- ✅ Affichage des résultats et téléchargement

### Types & Configuration
- ✅ `lib/studio/types.ts` - Tous les types TypeScript
- ✅ `lib/studio/tools-config.ts` - Configuration complète des 20+ outils

### API Endpoints
- ✅ `POST /api/crealia/upload` - Upload de médias
- ✅ `POST /api/crealia/analyze` - Analyse IA
- ✅ `POST /api/crealia/generate` - Génération de contenu
- ✅ `GET /api/crealia/jobs/[jobId]` - Statut des jobs
- ✅ `POST /api/crealia/captions` - Sous-titres
- ✅ `GET /api/crealia/presets` - Presets/templates
- ✅ `GET/PUT /api/crealia/brand` - Brand kit

### Services Backend
- ✅ `backend/services/crealia-studio.service.ts` - Logique métier complète

### Tests
- ✅ `e2e/crealia-studio.spec.ts` - Tests E2E Playwright

### Documentation
- ✅ `docs/FEATURE-CREALIA-STUDIO.md` - Documentation exhaustive
- ✅ `env.example` - Variables d'environnement mises à jour

---

## 🚀 Démarrage rapide

### 1. Configuration

Copiez les variables d'environnement dans votre `.env.local` :

```bash
# Mode MOCK pour développement
CREALIA_MOCK=true

# Upload config
UPLOAD_MAX_SIZE_MB=2048
STORAGE_PROVIDER=local

# Analytics (optionnel)
ANALYTICS_ENABLED=true
```

### 2. Intégration dans votre app

#### Option A : Utiliser le composant existant

```tsx
import { CrealiaStudioInterfaceV2 } from '@/components/crealia-studio-interface-v2'

function App() {
  const [isStudioOpen, setIsStudioOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsStudioOpen(true)}>
        Ouvrir Créalia Studio
      </button>
      
      <CrealiaStudioInterfaceV2
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />
    </>
  )
}
```

#### Option B : Créer une page dédiée

Créez `app/studio/page.tsx` :

```tsx
'use client'

import { CrealiaStudioInterfaceV2 } from '@/components/crealia-studio-interface-v2'
import { useState } from 'react'

export default function StudioPage() {
  return (
    <CrealiaStudioInterfaceV2
      isOpen={true}
      onClose={() => window.location.href = '/'}
    />
  )
}
```

### 3. Créer les répertoires uploads

```bash
mkdir -p public/uploads/crealia
mkdir -p public/uploads/brand
```

### 4. Lancer le dev server

```bash
npm run dev
```

Ouvrez `http://localhost:3000` et cliquez sur "Créalia Studio" !

---

## 🎨 Utilisation de base

### Flow standard

1. **Ouvrir Créalia Studio**
   - Cliquez sur le bouton/lien Créalia Studio
   - L'interface s'affiche instantanément

2. **Sélectionner un outil**
   - Catégorie "Recommandé" active par défaut
   - Cliquez sur "Générateur de Reels IA"

3. **Uploader un média**
   - Drag & drop ou clic sur la zone d'upload
   - Formats acceptés : MP4, MOV, WEBM, JPG, PNG
   - Max 2GB

4. **Configurer les paramètres**
   - Appliquez un preset (ex: "Viral & Fun")
   - Ou configurez manuellement
   - Tous les champs ont des valeurs par défaut

5. **Générer**
   - Cliquez sur "Générer"
   - Progression affichée en temps réel
   - En mode MOCK : résultats en ~5 secondes

6. **Télécharger**
   - Résultats affichés avec thumbnails
   - Titres et hashtags générés
   - Clic sur "Télécharger"

---

## 🧪 Tests

### Lancer les tests E2E

```bash
npm run test:e2e -- crealia-studio
```

### Tests unitaires (à implémenter)

```bash
npm test -- crealia-studio.service
```

---

## 🔧 Personnalisation

### Ajouter un nouvel outil

Éditez `lib/studio/tools-config.ts` :

```typescript
export const STUDIO_TOOLS: Tool[] = [
  // ... outils existants
  {
    id: 'mon-outil',
    name: 'Mon Outil Custom',
    category: 'Vidéo',
    icon: '🔥',
    shortDescription: 'Description courte',
    description: 'Description complète',
    tag: 'Nouveau',
    endpoint: '/api/crealia/mon-outil',
    params: [
      {
        name: 'mon_param',
        type: 'select',
        label: 'Mon Paramètre',
        required: true,
        options: [
          { value: 'opt1', label: 'Option 1' },
        ],
      },
    ],
  },
]
```

### Créer l'endpoint API

Créez `app/api/crealia/mon-outil/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  // Logique de votre outil

  return NextResponse.json({ success: true })
}
```

### Ajouter un preset

Dans `tools-config.ts`, ajoutez dans la propriété `presets` de l'outil :

```typescript
presets: [
  {
    id: 'mon-preset',
    name: 'Mon Preset',
    description: 'Description',
    params: {
      mon_param: 'opt1',
      // ... autres params
    },
  },
]
```

---

## 🐛 Debugging

### Mode verbose

Ajoutez dans votre console navigateur :

```javascript
localStorage.setItem('CREALIA_DEBUG', 'true')
```

### Vérifier les jobs

En mode MOCK, les jobs sont stockés en mémoire. Inspectez :

```javascript
// Dans la console browser
console.log(window.crealiaJobStore)
```

### Logs serveur

```bash
# Filtrer les logs Créalia Studio
npm run dev | grep "\[Créalia Studio\]"
```

---

## 📊 Analytics

Les events suivants sont automatiquement trackés :

- `tool_opened` - Outil sélectionné
- `upload_started` / `upload_completed` - Upload
- `analyze_started` / `analyze_completed` - Analyse
- `generate_started` / `generate_completed` / `generate_failed` - Génération
- `preset_applied` - Preset appliqué
- `download_clicked` - Téléchargement

Endpoint : `POST /api/analytics/event`

---

## 🚀 Passage en production

### 1. Désactiver le mode MOCK

```bash
CREALIA_MOCK=false
```

### 2. Configurer les services externes

```bash
# Whisper pour sous-titres
WHISPER_API_KEY=sk-xxx

# ElevenLabs pour voice cloning (optionnel)
ELEVENLABS_API_KEY=xxx

# Storage S3
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=crealia-media

# Queue Redis
REDIS_URL=redis://prod-redis:6379
```

### 3. Installer FFmpeg

```bash
# Ubuntu/Debian
apt-get install ffmpeg

# macOS
brew install ffmpeg

# Docker
FROM node:18
RUN apt-get update && apt-get install -y ffmpeg
```

### 4. Worker pour jobs

Créez `workers/crealia-worker.ts` :

```typescript
import { Queue, Worker } from 'bullmq'
import { crealiaStudioService } from '@/backend/services/crealia-studio.service'

const queue = new Queue('crealia-jobs', {
  connection: { url: process.env.REDIS_URL },
})

const worker = new Worker('crealia-jobs', async (job) => {
  // Process job
  const { mediaId, tool, params } = job.data
  // ...
}, {
  connection: { url: process.env.REDIS_URL },
  concurrency: 5,
})
```

---

## 📦 Déploiement

### Vercel

```bash
vercel --prod
```

Variables d'environnement à configurer dans Vercel dashboard.

### Docker

```bash
docker-compose -f docker-compose.production.yml up -d
```

---

## 🆘 Support

- **Documentation complète :** `docs/FEATURE-CREALIA-STUDIO.md`
- **Issues :** Créer une issue GitHub
- **Email :** support@crealia.com

---

## ✅ Checklist d'intégration

- [ ] Variables d'environnement configurées
- [ ] Répertoires uploads créés
- [ ] Composant intégré dans l'app
- [ ] Tests E2E passent
- [ ] Mode MOCK fonctionne
- [ ] Upload de fichiers fonctionne
- [ ] Génération produit des résultats
- [ ] Analytics trackent les events
- [ ] Documentation lue

---

## 🎉 Prêt à créer !

Créalia Studio est maintenant **100% fonctionnel** en mode MOCK.

**Prochaines étapes recommandées :**
1. Tester tous les flows en mode MOCK
2. Intégrer dans votre navigation principale
3. Customiser les outils selon vos besoins
4. Préparer la production (APIs externes, worker, S3)

**Bon développement ! 🚀**

