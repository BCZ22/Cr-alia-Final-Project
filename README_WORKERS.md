# 🚀 **Workers et Traitement Asynchrone - Documentation**

## 📋 **Vue d'ensemble**

Cette section documente l'implémentation des **Workers BullMQ** pour le traitement asynchrone des jobs vidéo et IA dans notre SaaS. Les workers permettent de traiter les tâches lourdes en arrière-plan, garantissant la scalabilité et la réactivité de l'API.

## 🏗️ **Architecture des Workers**

### **Structure des Workers**

```
src/workers/
├── index.ts                    # Point d'entrée principal
├── worker-orchestrator.ts      # Orchestrateur des workers
├── video-processing.worker.ts  # Worker de traitement vidéo
├── ai-processing.worker.ts     # Worker de traitement IA
└── scripts/
    └── start-workers.ts        # Script de démarrage
```

### **Flux de Traitement**

```
API Request → Job Queue → Worker → Processing → Result Storage
     ↓              ↓        ↓         ↓            ↓
  Validation   Redis Queue  BullMQ   Services    Database
```

## ⚙️ **Workers Implémentés**

### **1. VideoProcessingWorker**

**Responsabilités :**
- Traitement vidéo (transcodage, conversion)
- Génération de thumbnails
- Détection des highlights
- Création de shorts/reels
- Création de clips à partir de highlights

**Types de Jobs Supportés :**
- `VIDEO_PROCESSING`
- `THUMBNAIL_GENERATION`
- `HIGHLIGHT_DETECTION`
- `SHORT_CREATION`
- `HIGHLIGHT_CLIP_CREATION`

**Configuration :**
```typescript
{
  concurrency: 2,           // Nombre de jobs simultanés
  removeOnComplete: 24h,    // Suppression des jobs terminés
  removeOnFail: 24h         // Suppression des jobs échoués
}
```

### **2. AIProcessingWorker**

**Responsabilités :**
- Analyse IA des vidéos
- Génération de contenu
- Génération d'images
- Transcription audio
- Traduction multilingue
- Voice-over

**Types de Jobs Supportés :**
- `AI_ANALYSIS`
- `CONTENT_GENERATION`
- `IMAGE_GENERATION`
- `TRANSCRIPTION`
- `TRANSLATION`
- `VOICEOVER`

**Configuration :**
```typescript
{
  concurrency: 3,           // Nombre de jobs simultanés
  removeOnComplete: 24h,    // Suppression des jobs terminés
  removeOnFail: 24h         // Suppression des jobs échoués
}
```

## 🎯 **Orchestrateur des Workers**

### **WorkerOrchestrator**

**Fonctionnalités :**
- Gestion centralisée de tous les workers
- Arrêt gracieux et gestion des signaux
- Surveillance de santé des workers
- Redémarrage automatique des workers défaillants
- Métriques et statistiques

**Méthodes Principales :**
```typescript
// Démarrage/arrêt
start(): void
stop(): Promise<void>

// Surveillance
getWorkersStatus(): Record<string, any>
getWorkersStats(): Record<string, any>
healthCheck(): Promise<Record<string, any>>

// Gestion
restartWorker(workerName: string): Promise<boolean>
```

## 🔄 **Gestion des Workflows**

### **WorkflowService**

**Fonctionnalités :**
- Exécution de workflows complexes
- Gestion des dépendances entre étapes
- Politique de retry automatique
- Suivi du progrès en temps réel
- Templates de workflow prédéfinis

**Workflows Disponibles :**

#### **1. Transformation Vidéo de Base**
```typescript
{
  id: 'video_transformation_basic',
  steps: [
    'Traitement vidéo de base',
    'Génération de thumbnails'
  ],
  estimatedDuration: 420, // 7 minutes
  stepCount: 2
}
```

#### **2. Transformation Vidéo Avancée**
```typescript
{
  id: 'video_transformation_advanced',
  steps: [
    'Traitement vidéo de base',
    'Génération de thumbnails',
    'Détection des highlights',
    'Création de shorts',
    'Transcription audio'
  ],
  estimatedDuration: 1440, // 24 minutes
  stepCount: 5
}
```

## 🚀 **Démarrage des Workers**

### **Scripts Disponibles**

```bash
# Démarrage simple
npm run workers

# Démarrage en mode développement (avec rechargement)
npm run workers:dev

# Build et démarrage
npm run workers:build

# Démarrage direct des workers
npm run worker:start
```

### **Variables d'Environnement Requises**

```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/video_ai_saas"

# API Keys
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_huggingface_key

# Configuration des workers
WORKER_VIDEO_PROCESSING_CONCURRENCY=2
WORKER_AI_PROCESSING_CONCURRENCY=3
WORKER_MEMORY_THRESHOLD=1073741824
WORKER_UPTIME_THRESHOLD=86400
```

## 📊 **Surveillance et Métriques**

### **Vérification de Santé**

```bash
# Vérification du statut des workers
GET /api/jobs/queues/status

# Vérification de santé des workers
GET /api/health/workers

# Statistiques des workers
GET /api/jobs/statistics
```

### **Logs et Monitoring**

Les workers génèrent des logs structurés avec Winston :
- **Niveau INFO** : Opérations normales
- **Niveau WARN** : Avertissements et retries
- **Niveau ERROR** : Erreurs et échecs

**Format des Logs :**
```json
{
  "level": "info",
  "message": "Job traité avec succès",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "jobId": "job_123",
  "jobType": "VIDEO_PROCESSING",
  "processingTime": 15000,
  "result": true
}
```

## 🔧 **Configuration et Optimisation**

### **Paramètres de Performance**

```typescript
// Configuration des workers
workers: {
  videoProcessing: {
    concurrency: 2,        // Nombre de jobs simultanés
    memoryThreshold: 1GB,  // Limite mémoire par worker
    uptimeThreshold: 24h   // Limite de temps de fonctionnement
  },
  aiProcessing: {
    concurrency: 3,
    memoryThreshold: 1GB,
    uptimeThreshold: 24h
  }
}
```

### **Optimisations Recommandées**

1. **Concurrence** : Ajuster selon les ressources CPU/mémoire
2. **Mémoire** : Surveiller l'utilisation et ajuster les seuils
3. **Uptime** : Redémarrer périodiquement pour éviter les fuites mémoire
4. **Retry** : Configurer une politique de retry appropriée

## 🚨 **Gestion des Erreurs**

### **Types d'Erreurs**

1. **Erreurs de Job** : Traitées par le worker avec retry
2. **Erreurs de Worker** : Gérées par l'orchestrateur
3. **Erreurs Système** : Arrêt gracieux et redémarrage

### **Politique de Retry**

```typescript
retryPolicy: {
  maxRetries: 3,           // Nombre maximum de tentatives
  retryDelay: 5000,        // Délai entre tentatives (ms)
  backoffMultiplier: 2     // Multiplicateur de délai
}
```

## 📈 **Scaling et Performance**

### **Scaling Horizontal**

1. **Multiples Instances** : Lancer plusieurs processus de workers
2. **Load Balancing** : Redis distribue automatiquement les jobs
3. **Monitoring** : Surveiller la charge et ajuster le nombre d'instances

### **Métriques de Performance**

- **Throughput** : Jobs traités par minute
- **Latence** : Temps de traitement moyen
- **Utilisation CPU/Mémoire** : Par worker
- **Taux d'échec** : Pourcentage de jobs échoués

## 🧪 **Tests et Développement**

### **Tests Unitaires**

```bash
# Tests des workers
npm test -- --testPathPattern=workers

# Tests avec couverture
npm run test:coverage
```

### **Tests d'Intégration**

```bash
# Tests des workflows
npm test -- --testPathPattern=workflows

# Tests des API
npm test -- --testPathPattern=api
```

## 🔍 **Débogage et Troubleshooting**

### **Problèmes Courants**

1. **Worker ne démarre pas**
   - Vérifier la connectivité Redis
   - Vérifier les variables d'environnement
   - Consulter les logs d'erreur

2. **Jobs bloqués**
   - Vérifier le statut des queues
   - Redémarrer les workers
   - Vérifier les dépendances

3. **Performance dégradée**
   - Surveiller l'utilisation des ressources
   - Ajuster la concurrence
   - Vérifier les timeouts

### **Commandes de Débogage**

```bash
# Vérifier le statut des workers
npm run workers -- --status

# Vérifier la santé des workers
npm run workers -- --health

# Mode debug
DEBUG=* npm run workers
```

## 📚 **Ressources et Références**

### **Documentation BullMQ**
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Configuration](https://redis.io/documentation)
- [Node.js Workers](https://nodejs.org/api/worker_threads.html)

### **Monitoring et Observabilité**
- [Prometheus Metrics](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/docs/)
- [Winston Logging](https://github.com/winstonjs/winston)

---

## 🎯 **Prochaines Étapes**

1. **Tests Unitaires** : Implémenter les tests pour tous les services
2. **Monitoring Avancé** : Dashboards Grafana et alertes
3. **Auto-scaling** : Ajustement automatique du nombre de workers
4. **Workflows Avancés** : Plus de templates et de personnalisation

---

*Cette documentation sera mise à jour au fur et à mesure de l'évolution du système.*

