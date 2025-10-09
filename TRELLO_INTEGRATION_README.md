# 🎯 Intégration Trello - Documentation Complète

## 📋 Vue d'ensemble

Cette intégration Trello de niveau entreprise fournit une **couche d'abstraction complète** pour la gestion de projet, permettant à votre SaaS d'utiliser Trello comme backend distant sans jamais exposer l'interface Trello aux utilisateurs finaux.

### 🏗️ Architecture

L'intégration suit les principes de **Clean Architecture** et **Hexagonal Architecture** :

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   API Routes    │  │  Use Cases      │  │  Controllers│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Interfaces    │  │   Types         │  │   Entities  │ │
│  │ProjectManagement│  │  ProjectData    │  │   Project   │ │
│  │   Provider      │  │  TaskData       │  │    Task     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  TrelloService  │  │ TrelloHttpClient│  │ TrelloData  │ │
│  │                 │  │                 │  │Transformer  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL LAYER                         │
│                    Trello API                             │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Fonctionnalités principales

- ✅ **Gestion complète des projets** (boards Trello)
- ✅ **Gestion des tâches** (cards) avec assignation
- ✅ **Gestion des étapes** (lists) avec workflow
- ✅ **Gestion des membres** et permissions
- ✅ **Gestion des commentaires** et pièces jointes
- ✅ **Opérations en lot** pour performance
- ✅ **Cache intelligent** avec Redis
- ✅ **Retry avec backoff exponentiel**
- ✅ **Gestion d'erreurs typées** et robuste
- ✅ **Validation de données** complète
- ✅ **Transformation bidirectionnelle** des données

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Créez un fichier `.env` avec les variables suivantes :

```bash
# Configuration Trello (requis)
TRELLO_API_KEY=your_trello_api_key_here
TRELLO_TOKEN=your_trello_token_here

# Configuration optionnelle
TRELLO_ORGANIZATION_ID=your_organization_id_here
TRELLO_MEMBER_ID=your_member_id_here
TRELLO_BASE_URL=https://api.trello.com/1
TRELLO_TIMEOUT=30000
TRELLO_MAX_RETRIES=3
TRELLO_RETRY_DELAY=1000

# Configuration cache (optionnel)
TRELLO_CACHE_ENABLED=true
TRELLO_CACHE_TTL=3600
TRELLO_CACHE_PREFIX=trello:

# Configuration logging (optionnel)
TRELLO_LOGGING_ENABLED=true
TRELLO_LOGGING_LEVEL=info
```

### 2. Obtention des credentials Trello

#### Clé API Trello
1. Allez sur https://trello.com/app-key
2. Connectez-vous à votre compte Trello
3. Copiez la clé API affichée

#### Token Trello
1. Allez sur https://trello.com/1/authorize
2. Ajoutez vos paramètres :
   - `key`: Votre clé API
   - `name`: Nom de votre application
   - `scope`: `read,write`
   - `expiration`: `never`
   - `response_type`: `token`
3. Autorisez l'application
4. Copiez le token généré

### 3. Validation de la configuration

```typescript
import { isProductionReady, getConfigSummary } from '@/lib/trello';

// Vérifier si la configuration est prête pour la production
if (!isProductionReady()) {
  console.error('Configuration Trello incomplète');
  process.exit(1);
}

// Afficher un résumé de la configuration
console.log('Configuration Trello:', getConfigSummary());
```

## 📚 Utilisation de base

### 1. Création du service

```typescript
import { createTrelloService } from '@/lib/trello';

// Service avec configuration automatique depuis les variables d'environnement
const trelloService = createTrelloService();

// Service avec configuration personnalisée
const trelloService = createTrelloServiceWithConfig({
  apiKey: 'your_api_key',
  token: 'your_token',
  organizationId: 'your_org_id',
  timeout: 30000,
});
```

### 2. Gestion des projets

```typescript
// Créer un projet
const project = await trelloService.createProject({
  name: 'Mon Projet',
  description: 'Description du projet',
  visibility: 'private',
});

// Récupérer un projet
const project = await trelloService.getProject('board_id');

// Lister les projets
const projects = await trelloService.listProjects({
  status: 'active',
  limit: 50,
});

// Mettre à jour un projet
const updatedProject = await trelloService.updateProject('board_id', {
  name: 'Nouveau nom',
  description: 'Nouvelle description',
});

// Supprimer un projet (archiver)
await trelloService.deleteProject('board_id');
```

### 3. Gestion des tâches

```typescript
// Créer une tâche
const task = await trelloService.createTask('board_id', {
  title: 'Ma tâche',
  description: 'Description de la tâche',
  dueDate: new Date('2024-12-31'),
  priority: 'high',
});

// Récupérer une tâche
const task = await trelloService.getTask('card_id');

// Lister les tâches d'un projet
const tasks = await trelloService.listTasks('board_id', {
  stageId: 'list_id',
  status: 'todo',
  priority: 'high',
});

// Mettre à jour une tâche
const updatedTask = await trelloService.updateTask('card_id', {
  title: 'Nouveau titre',
  description: 'Nouvelle description',
  dueDate: new Date('2024-12-31'),
});

// Déplacer une tâche vers une autre étape
await trelloService.moveTask('card_id', 'target_list_id');

// Supprimer une tâche
await trelloService.deleteTask('card_id');
```

### 4. Gestion des étapes

```typescript
// Créer une étape
const stage = await trelloService.createStage('board_id', {
  name: 'En cours',
  position: 2,
});

// Récupérer une étape
const stage = await trelloService.getStage('list_id');

// Lister les étapes d'un projet
const stages = await trelloService.listStages('board_id');

// Mettre à jour une étape
const updatedStage = await trelloService.updateStage('list_id', {
  name: 'Nouvelle étape',
  position: 3,
});

// Supprimer une étape
await trelloService.deleteStage('list_id');
```

### 5. Gestion des membres

```typescript
// Lister les membres d'un projet
const members = await trelloService.listMembers('board_id');

// Assigner un membre à une tâche
await trelloService.assignMember('card_id', 'member_id');

// Désassigner un membre d'une tâche
await trelloService.unassignMember('card_id', 'member_id');
```

### 6. Gestion des commentaires

```typescript
// Ajouter un commentaire
const comment = await trelloService.addComment('card_id', {
  text: 'Mon commentaire',
});

// Récupérer les commentaires d'une tâche
const comments = await trelloService.getComments('card_id');

// Mettre à jour un commentaire
const updatedComment = await trelloService.updateComment('comment_id', {
  text: 'Commentaire mis à jour',
});

// Supprimer un commentaire
await trelloService.deleteComment('comment_id');
```

### 7. Gestion des pièces jointes

```typescript
// Ajouter une pièce jointe
const attachment = await trelloService.addAttachment('card_id', {
  name: 'Document.pdf',
  url: 'https://example.com/document.pdf',
  type: 'document',
});

// Récupérer les pièces jointes d'une tâche
const attachments = await trelloService.getAttachments('card_id');

// Supprimer une pièce jointe
await trelloService.deleteAttachment('attachment_id');
```

## 🔄 Opérations avancées

### 1. Opérations en lot

```typescript
// Créer plusieurs tâches en lot
const tasks = [
  { title: 'Tâche 1', description: 'Description 1' },
  { title: 'Tâche 2', description: 'Description 2' },
  { title: 'Tâche 3', description: 'Description 3' },
];

const batchResult = await trelloService.batchCreateTasks('board_id', tasks);

// Mettre à jour plusieurs tâches en lot
const updates = [
  { taskId: 'card_1', updates: { title: 'Nouveau titre 1' } },
  { taskId: 'card_2', updates: { title: 'Nouveau titre 2' } },
];

const batchResult = await trelloService.batchUpdateTasks(updates);

// Déplacer plusieurs tâches en lot
const moves = [
  { taskId: 'card_1', targetStageId: 'list_1' },
  { taskId: 'card_2', targetStageId: 'list_2' },
];

const batchResult = await trelloService.batchMoveTasks(moves);
```

### 2. Configuration avancée

```typescript
// Configurer le mapping des étapes par défaut
trelloService.configure({
  defaultStages: {
    todo: 'À faire',
    inProgress: 'En cours',
    done: 'Terminé',
  },
  priorityMapping: {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red',
  },
});

// Mettre à jour la configuration de cache
trelloService.updateCacheConfig(true, 7200); // 2 heures

// Vider le cache
await trelloService.clearCache();

// Récupérer les statistiques
const stats = trelloService.getStats();
```

## 🛡️ Gestion d'erreurs

### 1. Types d'erreurs

```typescript
import {
  TrelloRateLimitError,
  TrelloAuthenticationError,
  TrelloPermissionError,
  TrelloNotFoundError,
  TrelloServerError,
  TrelloNetworkError,
} from '@/lib/trello';

try {
  const result = await trelloService.createProject(projectData);
  // Traitement du succès
} catch (error) {
  if (error instanceof TrelloRateLimitError) {
    // Gérer le rate limit
    console.log('Rate limit atteint, retry plus tard');
  } else if (error instanceof TrelloAuthenticationError) {
    // Gérer l'erreur d'authentification
    console.log('Credentials invalides');
  } else if (error instanceof TrelloPermissionError) {
    // Gérer l'erreur de permission
    console.log('Permissions insuffisantes');
  } else if (error instanceof TrelloNotFoundError) {
    // Gérer la ressource non trouvée
    console.log('Ressource non trouvée');
  } else if (error instanceof TrelloServerError) {
    // Gérer l'erreur serveur
    console.log('Erreur serveur Trello');
  } else if (error instanceof TrelloNetworkError) {
    // Gérer l'erreur réseau
    console.log('Erreur réseau');
  } else {
    // Erreur inconnue
    console.log('Erreur inconnue:', error.message);
  }
}
```

### 2. Vérification des erreurs

```typescript
import { isRetryableError, isRateLimitError } from '@/lib/trello';

if (isRetryableError(error)) {
  // L'erreur peut être retentée
  console.log('Erreur retryable');
}

if (isRateLimitError(error)) {
  // Erreur de rate limit
  console.log('Rate limit atteint');
}
```

## 🧪 Tests

### 1. Tests unitaires

```typescript
// tests/trello-service.test.ts
import { TrelloService } from '@/lib/trello';

describe('TrelloService', () => {
  let service: TrelloService;

  beforeEach(() => {
    service = new TrelloService();
  });

  test('should create project successfully', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'Test Description',
    };

    const result = await service.createProject(projectData);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe(projectData.name);
  });

  test('should handle validation errors', async () => {
    const invalidProjectData = {
      name: '', // Nom vide
    };

    const result = await service.createProject(invalidProjectData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Validation failed');
  });
});
```

### 2. Tests d'intégration

```typescript
// tests/trello-integration.test.ts
import { createTrelloService } from '@/lib/trello';

describe('Trello Integration', () => {
  let service: TrelloService;

  beforeAll(() => {
    service = createTrelloService();
  });

  test('should perform full project lifecycle', async () => {
    // 1. Créer un projet
    const project = await service.createProject({
      name: 'Integration Test Project',
      description: 'Test project for integration',
    });
    expect(project.success).toBe(true);

    const projectId = project.data?.id;
    expect(projectId).toBeDefined();

    // 2. Créer une étape
    const stage = await service.createStage(projectId!, {
      name: 'Test Stage',
    });
    expect(stage.success).toBe(true);

    const stageId = stage.data?.id;
    expect(stageId).toBeDefined();

    // 3. Créer une tâche
    const task = await service.createTask(projectId!, {
      title: 'Test Task',
      description: 'Test task description',
    });
    expect(task.success).toBe(true);

    // 4. Nettoyer
    await service.deleteProject(projectId!);
  });
});
```

## 📊 Monitoring et Logs

### 1. Logs structurés

```typescript
import { logTrelloErrorSafely } from '@/lib/trello';

try {
  const result = await trelloService.createProject(projectData);
} catch (error) {
  logTrelloErrorSafely(error, {
    operation: 'createProject',
    projectName: projectData.name,
  });
}
```

### 2. Métriques de performance

```typescript
// Récupérer les statistiques du service
const stats = trelloService.getStats();
console.log('Service stats:', stats);

// Monitoring des rate limits
const rateLimitInfo = httpClient.extractRateLimitInfo(response);
if (rateLimitInfo) {
  console.log('Rate limit remaining:', rateLimitInfo.remaining);
  console.log('Rate limit reset:', rateLimitInfo.reset);
}
```

## 🔧 Configuration avancée

### 1. Mapping personnalisé

```typescript
// Configuration du mapping des étapes
const mappingConfig = {
  defaultStages: {
    todo: 'À faire',
    inProgress: 'En cours',
    done: 'Terminé',
    review: 'En révision',
  },
  priorityMapping: {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red',
  },
  statusMapping: {
    todo: 'todo',
    inProgress: 'in_progress',
    done: 'done',
    archived: 'archived',
  },
};

trelloService.configure(mappingConfig);
```

### 2. Validation personnalisée

```typescript
import { TrelloDataTransformer } from '@/lib/trello';

const transformer = new TrelloDataTransformer(mappingConfig);

// Ajouter des règles de validation personnalisées
transformer.addValidationRule({
  field: 'email',
  required: true,
  type: 'email',
  custom: (value) => {
    // Validation personnalisée
    return value.includes('@company.com') || 'Email doit être un email corporate';
  },
});

// Valider des données
const validation = transformer.validate(data);
if (!validation.valid) {
  console.log('Erreurs de validation:', validation.errors);
}
```

## 🚀 Déploiement

### 1. Variables d'environnement de production

```bash
# Production
TRELLO_API_KEY=prod_api_key
TRELLO_TOKEN=prod_token
TRELLO_ORGANIZATION_ID=prod_org_id
TRELLO_CACHE_ENABLED=true
TRELLO_CACHE_TTL=3600
TRELLO_LOGGING_LEVEL=warn
TRELLO_TIMEOUT=60000
TRELLO_MAX_RETRIES=5
```

### 2. Health checks

```typescript
// health-check.ts
import { createTrelloService, isProductionReady } from '@/lib/trello';

export async function trelloHealthCheck() {
  try {
    // Vérifier la configuration
    if (!isProductionReady()) {
      return { status: 'error', message: 'Configuration invalide' };
    }

    // Tester la connexion
    const service = createTrelloService();
    const result = await service.listProjects({ limit: 1 });
    
    if (result.success) {
      return { status: 'healthy', message: 'Trello API accessible' };
    } else {
      return { status: 'error', message: result.error };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

## 🔄 Migration et Extensibilité

### 1. Interface interchangeable

L'intégration implémente l'interface `ProjectManagementProvider`, permettant de changer facilement de backend :

```typescript
// Interface commune
interface ProjectManagementProvider {
  createProject(project: ProjectData): Promise<ProjectResult>;
  getProject(projectId: string): Promise<ProjectResult>;
  // ... autres méthodes
}

// Implémentation Trello
class TrelloService implements ProjectManagementProvider {
  // ...
}

// Implémentation Jira (future)
class JiraService implements ProjectManagementProvider {
  // ...
}

// Factory pour choisir le provider
function createProjectService(provider: 'trello' | 'jira'): ProjectManagementProvider {
  switch (provider) {
    case 'trello':
      return new TrelloService();
    case 'jira':
      return new JiraService();
    default:
      throw new Error('Provider non supporté');
  }
}
```

### 2. Migration vers un autre provider

```typescript
// Configuration pour migration
const USE_TRELLO = process.env.USE_TRELLO === 'true';
const USE_JIRA = process.env.USE_JIRA === 'true';

const projectService = USE_TRELLO 
  ? new TrelloService() 
  : new JiraService();

// L'interface reste la même
const result = await projectService.createProject(projectData);
```

## 📋 Limites et Bonnes pratiques

### 1. Limites Trello

- **Rate limits** : 100 requêtes/heure, 10 requêtes/10 secondes
- **Cards par liste** : 1000 maximum
- **Listes par board** : 100 maximum
- **Membres par board** : 1000 maximum
- **Pièces jointes par carte** : 100 maximum
- **Commentaires par carte** : 1000 maximum

### 2. Bonnes pratiques

```typescript
// ✅ Utiliser le cache pour les lectures fréquentes
const cachedProject = await cacheService.get(`project:${id}`);
if (cachedProject) {
  return cachedProject;
}

// ✅ Gérer les rate limits
if (isNearRateLimit(response)) {
  console.log('Rate limit approche, ralentir les requêtes');
}

// ✅ Valider les données avant envoi
const validation = transformer.validate(data);
if (!validation.valid) {
  throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
}

// ✅ Utiliser les opérations en lot pour les gros volumes
const batchResult = await service.batchCreateTasks(projectId, tasks);

// ✅ Gérer les erreurs de manière appropriée
try {
  const result = await service.createProject(data);
} catch (error) {
  if (isRetryableError(error)) {
    // Retry avec backoff
  } else {
    // Erreur fatale
  }
}
```

## 🆘 Dépannage

### 1. Erreurs communes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `TRELLO_API_KEY ne peut pas être vide` | Variable d'environnement manquante | Vérifier `.env` |
| `Authentication failed` | Clé API ou token invalide | Régénérer les credentials |
| `Rate limit exceeded` | Trop de requêtes | Implémenter du throttling |
| `Resource not found` | ID invalide | Vérifier l'existence de la ressource |
| `Permission denied` | Droits insuffisants | Vérifier les permissions Trello |

### 2. Debug

```typescript
// Activer les logs détaillés
process.env.TRELLO_LOGGING_LEVEL = 'debug';

// Vérifier la configuration
console.log('Config summary:', getConfigSummary());

// Tester la connexion
const service = createTrelloService();
const testResult = await service.listProjects({ limit: 1 });
console.log('Test connection:', testResult);
```

## 📚 Références

- **Documentation Trello API** : https://developer.atlassian.com/cloud/trello/rest/
- **Exemple de route API** : `app/api/trello/projects/route.ts`
- **Tests complets** : `tests/trello-service.test.ts`
- **Types TypeScript** : `lib/trello/types.ts`

---

**Version** : 1.0.0  
**Architecture** : Clean Architecture / Hexagonal  
**Production Ready** : ✅  
**Test Coverage** : ✅  
**Documentation** : ✅ 