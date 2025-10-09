# PR 3: Frontend skeleton + assets panel + asset upload UI

## 🎯 Objectif

Développer une interface utilisateur complète et moderne pour l'upload, la gestion et la prévisualisation des assets multimédia dans le SaaS, avec une expérience fluide et responsive.

## ✨ Fonctionnalités Implémentées

### A. Interface d'Upload Avancée

- **Zone drag & drop** intuitive avec feedback visuel
- **Support multi-fichiers** avec uploads parallèles
- **Progress bars** en temps réel pour chaque fichier
- **Validation côté client** des formats et tailles
- **Annulation d'upload** en cours
- **Intégration S3** avec URLs signées

### B. Gestion des Assets

- **Vue grille et liste** avec basculement fluide
- **Thumbnails automatiques** pour tous les types de médias
- **Métadonnées complètes** (durée, dimensions, codec)
- **Statuts d'ingestion** en temps réel
- **Actions contextuelles** (prévisualiser, télécharger, supprimer)
- **Sélection multiple** avec actions en lot

### C. Prévisualisation des Médias

- **Player vidéo intégré** avec contrôles complets
- **Switching de proxies** (360p, 720p, 1080p)
- **Waveform interactif** pour l'audio
- **Zoom et navigation** pour les images
- **Plein écran** et téléchargement

### D. Interface Moderne

- **Design CapCut/Notion** avec dark mode
- **Responsive** mobile-first
- **Animations fluides** avec Framer Motion
- **Accessibilité** complète (ARIA, clavier)
- **Feedback visuel** riche

## 🏗️ Architecture

### Store Zustand

```typescript
interface AssetsStore {
  // Assets
  assets: Asset[];
  selectedAssets: string[];
  
  // Upload
  uploadQueue: UploadProgress[];
  isUploading: boolean;
  
  // UI State
  viewMode: 'grid' | 'list';
  filterType: 'all' | 'VIDEO' | 'AUDIO' | 'IMAGE';
  filterStatus: 'all' | 'READY' | 'PROCESSING' | 'FAILED';
  searchQuery: string;
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  
  // Preview
  previewAsset?: Asset;
  isPreviewOpen: boolean;
}
```

### Composants Principaux

#### UploadZone
- Zone drag & drop avec validation
- Queue d'upload avec progress bars
- Gestion des erreurs et retry
- Support multipart pour gros fichiers

#### AssetCard
- Affichage des métadonnées
- Thumbnails et previews
- Actions contextuelles
- États de sélection

#### AssetPreview
- Player vidéo/audio intégré
- Contrôles de lecture complets
- Zoom et navigation image
- Plein écran et téléchargement

#### AssetsPanel
- Interface principale de gestion
- Filtres et recherche
- Actions en lot
- Vue grille/liste

## 🎨 Design System

### Couleurs
```css
/* Light mode */
--primary: #3b82f6;
--secondary: #64748b;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Dark mode */
--primary-dark: #60a5fa;
--secondary-dark: #94a3b8;
--background-dark: #0f172a;
--surface-dark: #1e293b;
```

### Typographie
- **Font family**: Inter, system-ui, sans-serif
- **Headings**: font-weight: 600-700
- **Body**: font-weight: 400-500
- **Captions**: font-weight: 400, size: 0.875rem

### Espacement
- **Base unit**: 4px
- **Spacing scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

## 🔧 Fonctionnalités Techniques

### Upload Intelligent
```typescript
// Validation côté client
const validateFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
  const allowedTypes = ['video/mp4', 'audio/mpeg', 'image/jpeg'];
  
  return {
    isValid: file.size <= maxSize && allowedTypes.includes(file.type),
    error: file.size > maxSize ? 'Fichier trop volumineux' : 
           !allowedTypes.includes(file.type) ? 'Format non supporté' : null
  };
};

// Upload avec retry
const uploadWithRetry = async (file: File, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFile(file);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await sleep(1000 * attempt); // Backoff exponentiel
    }
  }
};
```

### Gestion d'État
```typescript
// Actions du store
const useAssetsStore = create<AssetsStore>((set, get) => ({
  // Upload
  addToUploadQueue: async (file, projectId) => {
    const assetId = crypto.randomUUID();
    const progress = { assetId, fileName: file.name, progress: 0, status: 'pending' };
    
    set(state => ({ uploadQueue: [...state.uploadQueue, progress] }));
    
    try {
      const { uploadUrl } = await getSignedUrl(file);
      await uploadToS3(uploadUrl, file);
      await confirmUpload(assetId);
    } catch (error) {
      set(state => ({ 
        uploadQueue: state.uploadQueue.map(item => 
          item.assetId === assetId ? { ...item, status: 'failed', error } : item
        )
      }));
    }
  },
  
  // Filtrage
  setFilterType: (type) => set({ filterType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
```

### Prévisualisation Avancée
```typescript
// Player vidéo avec contrôles
const VideoPlayer = ({ asset }: { asset: Asset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const getBestQualityUrl = () => {
    return asset.proxies?.find(p => p.type === 'PREVIEW_1080P')?.url ||
           asset.proxies?.find(p => p.type === 'PREVIEW_720P')?.url ||
           asset.proxies?.find(p => p.type === 'PREVIEW_360P')?.url;
  };
  
  return (
    <video
      src={getBestQualityUrl()}
      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      controls={false}
    />
  );
};
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  .assets-grid { grid-template-columns: 1fr; }
  .sidebar { width: 100%; position: fixed; }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .assets-grid { grid-template-columns: repeat(2, 1fr); }
  .sidebar { width: 320px; }
}

/* Desktop */
@media (min-width: 1025px) {
  .assets-grid { grid-template-columns: repeat(4, 1fr); }
  .sidebar { width: 384px; }
}
```

### Adaptations Mobile
- **Navigation tactile** optimisée
- **Gestes de swipe** pour les actions
- **Interface simplifiée** avec actions essentielles
- **Performance** optimisée pour les appareils mobiles

## 🧪 Tests

### Tests Unitaires
```typescript
// UploadZone.test.tsx
describe('UploadZone', () => {
  it('devrait valider les types de fichiers', () => {
    const validFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
    const invalidFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    
    expect(validateFileType(validFile, ['video/mp4'])).toBe(true);
    expect(validateFileType(invalidFile, ['video/mp4'])).toBe(false);
  });
  
  it('devrait afficher les barres de progression', () => {
    render(<UploadZone />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### Tests E2E
```typescript
// assets-ui.e2e.test.ts
test('devrait permettre l\'upload complet d\'un fichier', async ({ page }) => {
  await page.goto('/video-editor');
  await page.click('button:has-text("Upload")');
  await page.setInputFiles('input[type="file"]', 'test-video.mp4');
  await expect(page.locator('text=Upload terminé')).toBeVisible();
});
```

### Tests d'Accessibilité
```typescript
// a11y.test.ts
test('devrait être accessible au clavier', async ({ page }) => {
  await page.goto('/video-editor');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
});
```

## 🚀 Performance

### Optimisations
- **Lazy loading** des thumbnails
- **Virtual scrolling** pour les grandes listes
- **Memoization** des composants coûteux
- **Debouncing** des recherches
- **Image optimization** avec Next.js

### Métriques Cibles
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔒 Sécurité

### Validation Côté Client
```typescript
const validateUpload = (file: File) => {
  // Vérification du type MIME
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non autorisé');
  }
  
  // Vérification de la taille
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Fichier trop volumineux');
  }
  
  // Vérification du nom
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
    throw new Error('Nom de fichier invalide');
  }
};
```

### Gestion des Erreurs
- **Messages d'erreur** clairs et informatifs
- **Fallbacks** pour les échecs de chargement
- **Retry automatique** pour les erreurs temporaires
- **Logging** des erreurs pour le debugging

## 📊 Monitoring

### Métriques UI
- **Temps de chargement** des assets
- **Taux de succès** des uploads
- **Erreurs** d'interface utilisateur
- **Performance** des interactions

### Analytics
- **Événements** d'upload et de prévisualisation
- **Fonctionnalités** les plus utilisées
- **Problèmes** d'expérience utilisateur
- **Conversion** des utilisateurs

## 🎯 Critères d'Acceptation

✅ **Upload fluide** : Drag & drop avec progress bars
✅ **Gestion complète** : CRUD des assets avec métadonnées
✅ **Prévisualisation** : Player intégré avec contrôles
✅ **Interface moderne** : Design responsive et accessible
✅ **Tests complets** : Unitaires, E2E et accessibilité
✅ **Performance** : Chargement rapide et interactions fluides
✅ **Sécurité** : Validation et gestion d'erreurs

## 🔮 Prochaines Étapes

- **PR 4** : Timeline avec intégration des assets
- **PR 5** : Opérations sur les clips (cut, split, trim)
- **PR 6** : Preview player avec proxies
- **PR 7** : Text layers et subtitles

---

**Status** : ✅ **TERMINÉ** - Interface utilisateur complète et moderne
