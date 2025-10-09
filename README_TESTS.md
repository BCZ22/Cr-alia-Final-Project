# 🧪 **Tests Unitaires et d'Intégration - Documentation**

## 📋 **Vue d'ensemble**

Cette section documente l'implémentation complète des **tests unitaires et d'intégration** pour notre SaaS de création de contenu vidéo assisté par IA. Les tests garantissent la qualité, la fiabilité et la maintenabilité du code.

## 🏗️ **Architecture des Tests**

### **Structure des Tests**

```
tests/
├── workers/                           # Tests des workers
│   ├── workers.test.ts               # Tests d'intégration des workers
│   ├── video-processing.worker.test.ts # Tests du VideoProcessingWorker
│   ├── ai-processing.worker.test.ts  # Tests de l'AIProcessingWorker
│   └── worker-orchestrator.test.ts   # Tests de l'orchestrateur
├── services/                         # Tests des services
│   └── workflow.service.test.ts      # Tests du WorkflowService
├── api/                             # Tests des API routes
│   └── workflows.test.ts            # Tests des routes de workflows
└── setup.ts                         # Configuration globale des tests
```

### **Types de Tests Implémentés**

1. **Tests Unitaires** : Testent les composants individuels
2. **Tests d'Intégration** : Testent l'interaction entre composants
3. **Tests des API** : Testent les endpoints HTTP
4. **Tests des Workers** : Testent le traitement asynchrone

## ⚙️ **Configuration Jest**

### **Configuration Principale**

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### **Seuils de Couverture**

- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

## 🚀 **Scripts de Test Disponibles**

### **Tests Généraux**

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tous les tests avec couverture et verbose
npm run test:all
```

### **Tests Spécifiques**

```bash
# Tests des workers uniquement
npm run test:workers

# Tests des workflows uniquement
npm run test:workflows

# Tests des API uniquement
npm run test:api

# Tests des services uniquement
npm run test:unit

# Tests d'intégration uniquement
npm run test:integration
```

## 🧪 **Tests des Workers**

### **VideoProcessingWorker**

**Tests Implémentés :**
- Traitement vidéo avec succès
- Génération de thumbnails
- Détection des highlights
- Création de shorts/reels
- Création de clips à partir de highlights
- Gestion des erreurs
- Mise à jour du statut des jobs

**Exemple de Test :**
```typescript
describe('processVideoProcessing', () => {
  it('devrait traiter un job de traitement vidéo avec succès', async () => {
    const jobData: VideoProcessingJob = {
      type: JobType.VIDEO_PROCESSING,
      videoId: 'test-video-id',
      userId: 'test-user-id',
      inputPath: 's3://bucket/input-video.mp4',
      outputFormat: 'mp4',
      quality: 'high',
    };

    const result = await worker.processVideoProcessing(mockJob);
    
    expect(result.success).toBe(true);
    expect(result.outputPath).toBeDefined();
  });
});
```

### **AIProcessingWorker**

**Tests Implémentés :**
- Analyse IA des vidéos
- Génération de contenu
- Génération d'images
- Transcription audio
- Traduction multilingue
- Voice-over
- Gestion des erreurs

### **WorkerOrchestrator**

**Tests Implémentés :**
- Initialisation des workers
- Gestion des workers (démarrage/arrêt)
- Surveillance et métriques
- Vérification de santé
- Gestion des signaux système
- Gestion des erreurs non capturées

## 🔄 **Tests des Workflows**

### **WorkflowService**

**Tests Implémentés :**
- Création de workflows
- Exécution de workflows
- Gestion des dépendances
- Politique de retry
- Callbacks d'étape
- Gestion des timeouts
- Validation des workflows

**Exemple de Test :**
```typescript
describe('Exécution de workflows', () => {
  it('devrait exécuter un workflow simple avec succès', async () => {
    const workflowDefinition: WorkflowDefinition = {
      id: 'test-workflow',
      name: 'Test Workflow',
      steps: [
        {
          id: 'step1',
          jobType: JobType.VIDEO_PROCESSING,
          jobData: { videoId: 'test-video' },
          dependencies: [],
          estimatedDuration: 60,
          retryCount: 0,
          maxRetries: 2,
        },
      ],
      estimatedTotalDuration: 60,
      maxConcurrentSteps: 1,
      retryPolicy: { maxRetries: 3, retryDelay: 1000 },
    };

    const result = await workflowService.executeWorkflow(
      workflowDefinition,
      'test-user-id'
    );

    expect(result.success).toBe(true);
    expect(result.executionId).toBeDefined();
  });
});
```

## 🌐 **Tests des API Routes**

### **Workflows API**

**Tests Implémentés :**
- Exécution de workflows
- Création de workflows de transformation vidéo
- Vérification du statut des workflows
- Annulation de workflows
- Liste des workflows actifs
- Templates de workflows
- Statistiques des workflows
- Gestion des erreurs
- Authentification et autorisation

**Exemple de Test :**
```typescript
describe('POST /api/workflows/execute', () => {
  it('devrait exécuter un workflow avec succès', async () => {
    const workflowDefinition = {
      id: 'test-workflow',
      name: 'Test Workflow',
      steps: [
        {
          id: 'step1',
          jobType: 'VIDEO_PROCESSING',
          jobData: { videoId: 'test-video' },
        },
      ],
    };

    const response = await request(app)
      .post('/api/workflows/execute')
      .send({ workflowDefinition })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.executionId).toBeDefined();
  });
});
```

## 🔧 **Mocks et Stubs**

### **Services Mockés**

```typescript
// Mocks des services
jest.mock('../../src/services/video/ffmpeg.service');
jest.mock('../../src/services/storage/s3.service');
jest.mock('../../src/services/ai/openai.service');
jest.mock('../../src/services/ai/huggingface.service');
jest.mock('../../src/services/queue/job.service');
```

### **Configuration des Mocks**

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock des méthodes
  mockJobService.updateJobStatus = jest.fn().mockResolvedValue(undefined);
  mockStorageService.downloadFile = jest.fn().mockResolvedValue('/tmp/test-video.mp4');
  mockFFmpegService.processVideo = jest.fn().mockResolvedValue({
    outputPath: '/tmp/processed-video.mp4',
    duration: 120,
    size: 1024000,
  });
});
```

## 📊 **Couverture de Code**

### **Rapports de Couverture**

```bash
# Générer un rapport de couverture
npm run test:coverage

# Rapport HTML dans coverage/lcov-report/index.html
# Rapport LCOV dans coverage/lcov.info
```

### **Métriques de Couverture**

- **Statements** : Pourcentage de lignes exécutées
- **Branches** : Pourcentage de branches conditionnelles testées
- **Functions** : Pourcentage de fonctions appelées
- **Lines** : Pourcentage de lignes couvertes

## 🚨 **Gestion des Erreurs dans les Tests**

### **Tests d'Erreurs**

```typescript
it('devrait gérer les erreurs lors du traitement vidéo', async () => {
  // Simuler une erreur FFmpeg
  mockFFmpegService.processVideo.mockRejectedValue(
    new Error('Erreur FFmpeg')
  );

  await expect(
    worker.processVideoProcessing(mockJob)
  ).rejects.toThrow('Erreur FFmpeg');
});
```

### **Tests de Validation**

```typescript
it('devrait retourner une erreur 400 pour un workflow invalide', async () => {
  const invalidWorkflow = {
    id: 'test-workflow',
    // steps manquant
  };

  const response = await request(app)
    .post('/api/workflows/execute')
    .send({ workflowDefinition: invalidWorkflow })
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error).toBe('Définition de workflow invalide');
});
```

## 🔍 **Tests d'Intégration**

### **Tests des Workers**

```typescript
describe('Workers Integration Tests', () => {
  it('devrait gérer le cycle de vie complet des workers', async () => {
    expect(() => startWorkers()).not.toThrow();
    
    const status = getWorkersStatus();
    expect(status).toBeDefined();
    
    expect(async () => await stopWorkers()).not.toThrow();
  });
});
```

### **Tests des API**

```typescript
describe('Workflows API Routes', () => {
  it('devrait exécuter un workflow avec succès', async () => {
    const response = await request(app)
      .post('/api/workflows/execute')
      .send({ workflowDefinition })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## 📈 **Performance des Tests**

### **Timeouts et Limites**

```typescript
// Configuration des timeouts
testTimeout: 30000, // 30 secondes par test

// Tests de performance
it('devrait maintenir les performances sous charge', async () => {
  const startTime = Date.now();
  await healthCheck();
  const duration = Date.now() - startTime;
  
  expect(duration).toBeLessThan(5000); // Moins de 5 secondes
});
```

### **Tests Parallèles**

```typescript
// Jest exécute les tests en parallèle par défaut
// Configuration pour optimiser la performance
module.exports = {
  maxWorkers: '50%', // Utiliser 50% des CPU disponibles
  workerIdleMemoryLimit: '512MB', // Limite mémoire par worker
};
```

## 🧹 **Nettoyage et Maintenance**

### **Hooks de Test**

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### **Nettoyage des Ressources**

```typescript
afterAll(async () => {
  // Nettoyer les ressources après tous les tests
  await cleanup();
});
```

## 🔧 **Débogage des Tests**

### **Mode Debug**

```bash
# Mode debug avec Jest
DEBUG=* npm test

# Tests avec plus de détails
npm test -- --verbose

# Tests d'un fichier spécifique
npm test -- tests/workers/video-processing.worker.test.ts
```

### **Tests en Mode Watch**

```bash
# Mode watch pour le développement
npm run test:watch

# Mode watch avec couverture
npm run test:watch -- --coverage
```

## 📚 **Bonnes Pratiques**

### **Nommage des Tests**

```typescript
// Utiliser des noms descriptifs
it('devrait traiter un job de traitement vidéo avec succès', async () => {
  // Test implementation
});

it('devrait gérer les erreurs de téléchargement de fichier', async () => {
  // Test implementation
});
```

### **Structure des Tests**

```typescript
describe('NomDuService', () => {
  describe('NomDeLaMéthode', () => {
    it('devrait faire quelque chose dans un contexte spécifique', async () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = await service.method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### **Isolation des Tests**

```typescript
// Chaque test doit être indépendant
beforeEach(() => {
  // Réinitialiser l'état avant chaque test
  jest.clearAllMocks();
  setupTestData();
});

afterEach(() => {
  // Nettoyer après chaque test
  cleanupTestData();
});
```

## 🎯 **Prochaines Étapes**

1. **Tests E2E** : Tests de bout en bout avec Playwright ou Cypress
2. **Tests de Performance** : Tests de charge et de stress
3. **Tests de Sécurité** : Tests de vulnérabilités et d'injection
4. **Tests de Base de Données** : Tests avec une base de test réelle
5. **Tests de CI/CD** : Intégration continue et déploiement continu

---

## 📊 **Résumé des Tests**

- **Tests Unitaires** : ✅ Implémentés
- **Tests d'Intégration** : ✅ Implémentés
- **Tests des Workers** : ✅ Implémentés
- **Tests des API** : ✅ Implémentés
- **Tests des Workflows** : ✅ Implémentés
- **Couverture de Code** : ✅ Configurée (70% minimum)
- **Scripts de Test** : ✅ Configurés
- **Documentation** : ✅ Complète

---

*Cette documentation sera mise à jour au fur et à mesure de l'évolution des tests.*

