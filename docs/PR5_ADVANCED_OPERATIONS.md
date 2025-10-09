# PR 5: Advanced clip operations (ripple, slip, slide, roll), snapping, groups

## 🎯 Objectif

Développer des opérations avancées sur les clips de timeline inspirées des logiciels professionnels (CapCut, Premiere Pro, Final Cut), permettant aux créateurs de contenu d'affiner leurs montages avec une précision maximale.

## ✨ Fonctionnalités Implémentées

### A. Opérations Avancées sur les Clips

- **Ripple Delete** : Suppression d'un clip avec déplacement automatique des clips suivants
- **Slip Edit** : Décalage des points in/out sans changer la position ni la durée
- **Slide Edit** : Déplacement d'un clip avec ajustement automatique des voisins
- **Roll Edit** : Ajustement de la frontière entre deux clips contigus
- **Trim History** : Historique des modifications pour undo/redo

### B. Snapping Configurable

- **Frame Snapping** : Alignement au frame près (basé sur framerate)
- **Second Snapping** : Alignement sur secondes entières
- **Marker Snapping** : Alignement sur marqueurs personnalisés
- **Feedback visuel** : Lignes guides et highlight au point de snap

### C. Multi-select et Grouping

- **Sélection multiple** : Ctrl+clic et drag selection box
- **Grouping logique** : Création de groupes de clips manipulables ensemble
- **Transformations groupées** : Déplacement, redimensionnement, duplication
- **Gestion des groupes** : Création, suppression, dégroupement

### D. Marqueurs et Annotations

- **Marqueurs temporels** : Placement précis sur la timeline
- **Labels personnalisés** : Nom et couleur pour chaque marqueur
- **Snapping sur marqueurs** : Alignement automatique
- **Gestion des marqueurs** : Ajout, suppression, édition

## 🏗️ Architecture

### Store Zustand Étendu

```typescript
interface TimelineStore {
  // État étendu
  snappingMode: 'frame' | 'second' | 'marker';
  frameRate: number;
  markers: Array<{ id: string; time: number; label?: string; color?: string }>;

  // Opérations avancées
  rippleDelete: (clipId: string) => void;
  slipEdit: (clipId: string, delta: number) => void;
  slideEdit: (clipId: string, newStartTime: number) => void;
  rollEdit: (trackId: string, boundaryTime: number, delta: number) => void;

  // Snapping et marqueurs
  setSnappingMode: (mode: 'frame' | 'second' | 'marker') => void;
  addMarker: (time: number, label?: string, color?: string) => void;
  removeMarker: (markerId: string) => void;

  // Grouping
  createGroup: (clipIds: string[]) => string;
  ungroup: (groupId: string) => void;
  moveGroup: (groupId: string, deltaTime: number) => void;
  deleteGroup: (groupId: string) => void;
}
```

### Modèle de Données Étendu

```typescript
interface TimelineClip {
  // Propriétés existantes...
  groupId?: string;
  trimHistory?: Array<{ inPoint: number; outPoint: number; at: string }>;
  linkedMarkers?: string[];
}
```

### API Endpoints

```typescript
// Trim d'un clip
PATCH /api/video-editor/projects/[id]/timeline/clip/[clipId]/trim
{
  "inPoint": 2.5,
  "outPoint": 8.5
}

// Opérations avancées
PATCH /api/video-editor/projects/[id]/timeline/clip/[clipId]/operation
{
  "operation": "ripple" | "slip" | "slide" | "roll",
  "delta": 1.5,
  "newStartTime": 5.0,
  "boundaryTime": 10.0,
  "trackId": "track-1"
}

// Gestion des groupes
POST /api/video-editor/projects/[id]/timeline/group
{
  "clipIds": ["clip-1", "clip-2"]
}

PATCH /api/video-editor/projects/[id]/timeline/group
{
  "groupId": "group-123",
  "operation": "move" | "ungroup" | "delete",
  "deltaTime": 2.0
}
```

## 🎨 Design & UX

### Interface Professionnelle
- **Outils dédiés** : Barre d'outils avec icônes Ripple, Slip, Slide, Roll
- **Raccourcis clavier** : R (Roll), S (Slip), U (Slide), Delete (Ripple)
- **Feedback visuel** : Indicateurs distincts pour chaque opération
- **Preview frames** : Affichage des frames lors des trims

### Interactions Avancées
- **Drag selection** : Sélection par zone avec rectangle
- **Multi-select** : Ctrl+clic pour sélection multiple
- **Context menus** : Menus contextuels avec opérations
- **Keyboard shortcuts** : Raccourcis configurables

### Snapping Visuel
- **Lignes guides** : Lignes verticales pour alignement
- **Highlight** : Mise en surbrillance du point de snap
- **Indicateurs** : Icônes pour différents modes de snapping

## 🔧 Fonctionnalités Techniques

### Ripple Delete

```typescript
const rippleDelete = (clipId: string) => {
  // 1. Trouver le clip à supprimer
  // 2. Calculer sa durée
  // 3. Supprimer le clip
  // 4. Déplacer tous les clips suivants de -durée
  // 5. Mettre à jour les positions
};
```

### Slip Edit

```typescript
const slipEdit = (clipId: string, delta: number) => {
  // 1. Trouver le clip
  // 2. Décaler inPoint et outPoint de delta
  // 3. Conserver startTime et duration
  // 4. Ajouter à l'historique trim
  // 5. Valider les limites de l'asset
};
```

### Slide Edit

```typescript
const slideEdit = (clipId: string, newStartTime: number) => {
  // 1. Calculer le delta de déplacement
  // 2. Déplacer le clip principal
  // 3. Ajuster le clip précédent (étendre)
  // 4. Ajuster le clip suivant (raccourcir)
  // 5. Maintenir la continuité temporelle
};
```

### Roll Edit

```typescript
const rollEdit = (trackId: string, boundaryTime: number, delta: number) => {
  // 1. Trouver les clips adjacents à la frontière
  // 2. Ajuster la durée du clip gauche
  // 3. Ajuster la position et durée du clip droit
  // 4. Maintenir la durée globale
  // 5. Valider les limites des assets
};
```

### Snapping Intelligent

```typescript
const applySnapping = (time: number, mode: SnappingMode) => {
  switch (mode) {
    case 'frame':
      return Math.round(time * frameRate) / frameRate;
    case 'second':
      return Math.round(time);
    case 'marker':
      return findNearestMarker(time);
  }
};
```

### Grouping

```typescript
const createGroup = (clipIds: string[]) => {
  const groupId = generateId();
  // 1. Assigner groupId à tous les clips
  // 2. Créer une référence de groupe
  // 3. Permettre les opérations groupées
  return groupId;
};

const moveGroup = (groupId: string, deltaTime: number) => {
  // 1. Trouver tous les clips du groupe
  // 2. Déplacer chaque clip de deltaTime
  // 3. Maintenir les relations internes
  // 4. Valider les positions finales
};
```

## 📱 Responsive Design

### Adaptations par Écran
- **Desktop** : Tous les outils et raccourcis disponibles
- **Tablet** : Interface simplifiée avec outils essentiels
- **Mobile** : Version tactile avec gestes simplifiés

### Optimisations Tactiles
- **Gestes** : Swipe pour sélection, pinch pour zoom
- **Contrôles** : Boutons plus grands, zones de touch étendues
- **Feedback** : Vibrations et animations pour confirmation

## 🧪 Tests

### Tests Unitaires
```typescript
describe('Advanced Operations', () => {
  it('devrait effectuer un ripple delete correctement', () => {
    // Test de suppression avec déplacement des suivants
  });
  
  it('devrait effectuer un slip edit sans changer la position', () => {
    // Test de décalage in/out points
  });
  
  it('devrait effectuer un slide edit avec ajustement des voisins', () => {
    // Test de déplacement avec continuité
  });
});
```

### Tests E2E
```typescript
test('scénario complet d\'édition avancée', async ({ page }) => {
  // 1. Importer des clips
  // 2. Effectuer ripple delete
  // 3. Créer un groupe
  // 4. Déplacer le groupe
  // 5. Ajouter des marqueurs
  // 6. Sauvegarder et recharger
});
```

### Tests de Performance
- **Opérations groupées** : Performance avec 100+ clips
- **Snapping** : Fluidité avec différents modes
- **Undo/Redo** : Gestion de l'historique volumineux

## 🚀 Performance

### Optimisations
- **Batch operations** : Regroupement des opérations multiples
- **Virtual scrolling** : Rendu optimisé pour grandes timelines
- **Debouncing** : Limitation des recalculs fréquents
- **Memoization** : Cache des calculs coûteux

### Métriques Cibles
- **Ripple delete** : < 50ms pour 100 clips
- **Slip edit** : < 16ms (60fps)
- **Group operations** : < 100ms pour 50 clips
- **Snapping** : < 8ms pour feedback visuel

## 🔒 Sécurité

### Validation
```typescript
const validateOperation = (operation: Operation) => {
  // Vérifier les timecodes
  if (operation.startTime < 0) throw new Error('Invalid start time');
  if (operation.duration <= 0) throw new Error('Invalid duration');
  
  // Vérifier les limites d'asset
  if (operation.inPoint < 0) throw new Error('Invalid in point');
  if (operation.outPoint > assetDuration) throw new Error('Invalid out point');
  
  // Vérifier les permissions
  if (!canEditProject(projectId)) throw new Error('No permission');
};
```

### Gestion d'Erreurs
- **Rollback automatique** : Annulation en cas d'erreur
- **Validation côté serveur** : Double vérification des opérations
- **Logging** : Traçabilité des modifications

## 📊 Monitoring

### Métriques d'Usage
- **Opérations populaires** : Ripple, slip, slide, roll
- **Modes de snapping** : Frame vs second vs marker
- **Groupes créés** : Taille moyenne, durée de vie
- **Erreurs** : Taux d'échec par opération

### Analytics
- **Patterns d'édition** : Séquences d'opérations courantes
- **Performance** : Temps d'exécution par opération
- **UX** : Abandons et retry rates

## 🎯 Critères d'Acceptation

✅ **Opérations avancées** : Ripple, slip, slide, roll fonctionnels
✅ **Snapping configurable** : Frame, second, marker avec feedback
✅ **Multi-select** : Sélection multiple et transformations groupées
✅ **Grouping** : Création, manipulation et suppression de groupes
✅ **Marqueurs** : Ajout, édition et snapping sur marqueurs
✅ **Persistance** : Sauvegarde et rechargement des opérations
✅ **Tests complets** : Unitaires, E2E et performance
✅ **Documentation** : Guide utilisateur et tutoriels

## 🔮 Prochaines Étapes

- **PR 6** : Preview player avec synchronisation timeline
- **PR 7** : Text layers et subtitles
- **PR 8** : Effects et transitions
- **PR 9** : Render worker et export

---

**Status** : ✅ **TERMINÉ** - Opérations avancées professionnelles avec snapping et grouping
