# 🎯 Intégration Monday.com - Guide Complet

## 📋 Vue d'ensemble

L'intégration Monday.com fournit une couche d'abstraction complète et robuste pour interagir avec l'API GraphQL de Monday.com. Elle est conçue selon les principes de Clean Architecture et offre une interface métier unifiée pour la gestion de projets.

### 🏗️ Architecture

```
lib/monday/
├── types.ts          # Types et interfaces TypeScript
├── config.ts         # Configuration et validation
├── errors.ts         # Gestion d'erreurs robuste
├── graphql.ts        # Templates GraphQL
├── http-client.ts    # Client HTTP avec retry
├── transformer.ts    # Transformation de données
├── service.ts        # Service principal
├── adapter.ts        # Adaptateur métier avancé
├── examples.ts       # Exemples d'utilisation
└── index.ts          # Exports unifiés
```

## 🔧 Configuration

### Variables d'environnement requises

```bash
# Configuration obligatoire
MONDAY_API_KEY=your_monday_api_key_here

# Configuration optionnelle
MONDAY_BASE_URL=https://api.monday.com/v2
MONDAY_TIMEOUT=30000
MONDAY_MAX_RETRIES=3
MONDAY_RETRY_DELAY=1000
MONDAY_CACHE_ENABLED=true
MONDAY_CACHE_TTL=3600
MONDAY_CACHE_PREFIX=monday:
MONDAY_LOGGING_ENABLED=true
MONDAY_LOGGING_LEVEL=info
MONDAY_BOARD_TEMPLATE_ID=optional_board_template_id
```

### Obtenir une clé API Monday.com

1. Connectez-vous à votre compte Monday.com
2. Allez dans **Settings** > **Admin** > **API**
3. Cliquez sur **Generate API Key**
4. Copiez la clé générée dans votre fichier `.env`

## 🚀 Utilisation de base

### Initialisation

```typescript
import { MondayAdapter } from './lib/monday';

const monday = new MondayAdapter();
```

### Créer un projet

```typescript
const project = await monday.createProjectWithDefaultSections({
  name: 'Mon Projet Marketing',
  description: 'Campagne Q1 2024',
  status: 'active',
  visibility: 'private',
});

if (project.success) {
  console.log('Projet créé:', project.data?.name);
}
```

### Créer des tâches

```typescript
const task = await monday.createTask(projectId, {
  title: 'Analyser la concurrence',
  description: 'Étudier les stratégies des concurrents',
  priority: 'high',
  status: 'todo',
  dueDate: new Date('2024-03-15'),
});

if (task.success) {
  console.log('Tâche créée:', task.data?.title);
}
```

### Créer des tâches en lot

```typescript
const tasks = [
  { title: 'Tâche 1', description: 'Description 1', projectId },
  { title: 'Tâche 2', description: 'Description 2', projectId },
];

const result = await monday.batchCreateTasks(projectId, tasks);
console.log(`${result.data?.length} tâches créées`);
```

## 🔄 Workflows avancés

### Déplacer une tâche avec workflow

```typescript
const result = await monday.moveTaskWithWorkflow(
  taskId, 
  'To Do', 
  'In Progress'
);

if (result.success) {
  console.log('Tâche déplacée avec succès');
}
```

### Récupérer la structure complète d'un projet

```typescript
const structure = await monday.getProjectStructure(projectId);

console.log('Projet:', structure.project.name);
console.log('Sections:', structure.sections.length);
console.log('Tâches:', structure.tasks.length);
console.log('Membres:', structure.members.length);
```

### Analytics de projet

```typescript
const analytics = await monday.getProjectAnalytics(projectId);

console.log('Total des tâches:', analytics.totalTasks);
console.log('Tâches terminées:', analytics.completedTasks);
console.log('Tâches en retard:', analytics.overdueTasks);
console.log('Distribution par stage:', analytics.stageDistribution);
```

## 🛠️ Fonctionnalités avancées

### Templates de projets

```typescript
// Enregistrer un template
monday.registerProjectTemplate({
  id: 'agile-template',
  name: 'Template Agile',
  description: 'Template pour projets Agile',
  defaultSections: ['Backlog', 'Sprint Planning', 'Development', 'Testing', 'Done'],
  defaultColumns: {
    priority: 'dropdown',
    storyPoints: 'number',
    assignee: 'people',
  },
  settings: {
    autoAssignSprint: true,
  },
});

// Créer un projet avec template
const project = await monday.createProjectFromTemplate(
  { name: 'Mon Projet Agile', description: 'Description' },
  'agile-template'
);
```

### Workflows personnalisés

```typescript
// Enregistrer un workflow
monday.registerWorkflow({
  id: 'dev-workflow',
  name: 'Workflow de Développement',
  stages: [
    { id: 'backlog', name: 'Backlog', sectionId: 'backlog', color: '#ff6b6b' },
    { id: 'development', name: 'Development', sectionId: 'development', color: '#45b7d1' },
    { id: 'testing', name: 'Testing', sectionId: 'testing', color: '#f9ca24' },
    { id: 'done', name: 'Done', sectionId: 'done', color: '#6c5ce7' },
  ],
  transitions: [
    {
      fromStage: 'Backlog',
      toStage: 'Development',
      autoActions: [
        { type: 'assign', target: 'dev-team', value: '' },
        { type: 'add_comment', target: '', value: 'Développement en cours' },
      ],
    },
  ],
  autoAssignments: [
    { stageId: 'development', memberId: 'dev-team', priority: 'high' },
  ],
});
```

## 🔒 Gestion d'erreurs

### Gestion automatique

L'intégration gère automatiquement les erreurs courantes :

- **Rate limiting** : Retry automatique avec backoff exponentiel
- **Erreurs d'authentification** : Messages clairs et suggestions
- **Erreurs réseau** : Retry automatique pour les erreurs transitoires
- **Erreurs GraphQL** : Parsing et normalisation des erreurs Monday.com

### Gestion manuelle

```typescript
try {
  const result = await monday.createProject(projectData);
  
  if (!result.success) {
    console.error('Erreur:', result.error);
    // Gérer l'erreur selon le contexte
  }
} catch (error) {
  if (error instanceof MondayRateLimitError) {
    console.log('Rate limit atteint, retry automatique en cours...');
  } else if (error instanceof MondayAuthenticationError) {
    console.error('Erreur d\'authentification, vérifiez votre clé API');
  }
}
```

## 📊 Monitoring et logs

### Configuration des logs

```typescript
import { createLoggingConfig } from './lib/monday';

const loggingConfig = createLoggingConfig();
loggingConfig.level = 'debug'; // 'debug' | 'info' | 'warn' | 'error'
loggingConfig.includeRequestData = true;
loggingConfig.includeResponseData = false;
```

### Métriques de performance

```typescript
const stats = monday.getUsageStats();
console.log('Templates enregistrés:', stats.templatesCount);
console.log('Workflows enregistrés:', stats.workflowsCount);
console.log('Configuration:', stats.serviceConfig);
```

## 🧪 Tests et validation

### Validation de configuration

```typescript
import { validateMondaySetup } from './lib/monday/examples';

if (!validateMondaySetup()) {
  console.error('Configuration Monday.com invalide');
  process.exit(1);
}
```

### Test de connexion

```typescript
import { runDemo } from './lib/monday/examples';

// Exécuter la démonstration complète
await runDemo();
```

## 🔧 Configuration avancée

### Configuration personnalisée

```typescript
import { createMondayConfig, createRetryConfig } from './lib/monday';

const config = createMondayConfig();
config.timeout = 60000; // 60 secondes
config.maxRetries = 5;

const retryConfig = createRetryConfig();
retryConfig.baseDelay = 2000; // 2 secondes
retryConfig.maxDelay = 60000; // 60 secondes
```

### Mapping personnalisé

```typescript
import { createMappingConfig } from './lib/monday';

const mappingConfig = createMappingConfig();
mappingConfig.columnMapping = {
  name: 'name',
  description: 'text',
  status: 'status',
  priority: 'priority',
  dueDate: 'date4',
  assignee: 'people',
};

mappingConfig.statusMapping = {
  todo: 'todo',
  inProgress: 'in_progress',
  done: 'done',
  archived: 'archived',
};
```

## 🚨 Limitations et contraintes

### Limitations Monday.com

- **Pièces jointes** : Non supportées via l'API GraphQL
- **Mouvement d'items** : Limité par les contraintes de Monday.com
- **Rate limiting** : 1000 requêtes par minute par défaut
- **Colonnes personnalisées** : Nécessitent une configuration préalable

### Bonnes pratiques

1. **Gestion des erreurs** : Toujours vérifier `result.success`
2. **Rate limiting** : Utiliser les opérations en lot quand possible
3. **Validation** : Valider les données avant envoi
4. **Logging** : Activer les logs en développement
5. **Retry** : Laisser le système gérer les retries automatiques

## 📚 Exemples complets

### Workflow complet de projet

```typescript
import { MondayAdapter } from './lib/monday';

async function createAndManageProject() {
  const monday = new MondayAdapter();
  
  // 1. Créer un projet avec sections par défaut
  const project = await monday.createProjectWithDefaultSections({
    name: 'Application Mobile',
    description: 'Développement d\'une application mobile',
    status: 'active',
    visibility: 'private',
  });
  
  if (!project.success) {
    throw new Error(`Erreur création projet: ${project.error}`);
  }
  
  const projectId = project.data!.id!;
  
  // 2. Créer des tâches en lot
  const tasks = await monday.batchCreateTasks(projectId, [
    { title: 'Design UI/UX', description: 'Créer les maquettes', projectId },
    { title: 'Développement Frontend', description: 'Implémenter l\'interface', projectId },
    { title: 'Développement Backend', description: 'Créer l\'API', projectId },
    { title: 'Tests', description: 'Tests unitaires et intégration', projectId },
  ]);
  
  if (tasks.success && tasks.data) {
    // 3. Déplacer les tâches dans le workflow
    for (const task of tasks.data) {
      await monday.moveTaskWithWorkflow(task.id!, 'To Do', 'In Progress');
    }
  }
  
  // 4. Récupérer les analytics
  const analytics = await monday.getProjectAnalytics(projectId);
  console.log('Analytics:', analytics);
  
  return project.data;
}
```

### Synchronisation avec système externe

```typescript
async function syncWithExternalSystem(projectId: string, externalData: any[]) {
  const monday = new MondayAdapter();
  
  // Transformer les données externes
  const tasks = externalData.map(item => ({
    title: item.name,
    description: item.description,
    projectId: projectId,
    priority: item.priority || 'medium',
    status: 'todo',
  }));
  
  // Synchroniser en lot
  const syncResult = await monday.syncProject(projectId, { tasks });
  
  console.log(`Synchronisation terminée: ${syncResult.created} créés, ${syncResult.errors.length} erreurs`);
  
  return syncResult;
}
```

## 🔄 Migration depuis d'autres systèmes

L'intégration Monday.com implémente l'interface `ProjectManagementProvider`, ce qui permet une migration facile depuis d'autres systèmes :

```typescript
// Avant : Asana
const projectManager = new AsanaAdapter();

// Après : Monday.com
const projectManager = new MondayAdapter();

// Le reste du code reste identique !
const project = await projectManager.createProject(projectData);
```

## 📞 Support et maintenance

### Dépannage courant

1. **Erreur d'authentification** : Vérifiez `MONDAY_API_KEY`
2. **Rate limiting** : Réduisez la fréquence des appels
3. **Erreurs GraphQL** : Vérifiez la syntaxe des requêtes
4. **Timeouts** : Augmentez `MONDAY_TIMEOUT`

### Logs et debugging

```typescript
// Activer les logs détaillés
process.env.MONDAY_LOGGING_LEVEL = 'debug';
process.env.MONDAY_LOGGING_ENABLED = 'true';

// Les logs apparaîtront dans la console
```

### Mise à jour

L'intégration suit le versioning sémantique. Pour les mises à jour :

1. Vérifiez les changements dans le changelog
2. Testez en environnement de développement
3. Mettez à jour progressivement en production

---

**🎯 L'intégration Monday.com est prête pour la production !**

Pour toute question ou support, consultez la documentation complète ou contactez l'équipe de développement. 