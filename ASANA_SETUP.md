# 🎯 Intégration Asana - Guide de Configuration et Utilisation

## 📋 Vue d'ensemble

Cette intégration Asana fournit une **couche d'abstraction complète et robuste** pour gérer les projets, tâches, sections et workflows dans votre SaaS. L'architecture suit les principes de **Clean Architecture** et permet l'interchangeabilité avec d'autres providers de gestion de projet.

## 🏗️ Architecture

```
lib/asana/
├── adapter.ts          # Couche d'abstraction métier
├── service.ts          # Service principal Asana
├── http-client.ts      # Client HTTP robuste
├── transformer.ts      # Transformation des données
├── config.ts           # Configuration et validation
├── types.ts            # Types et interfaces
├── errors.ts           # Gestion d'erreurs
└── examples.ts         # Exemples d'utilisation
```

## ⚙️ Configuration

### 1. Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` :

```bash
# Token d'accès Asana (obligatoire)
ASANA_ACCESS_TOKEN=your_asana_access_token_here

# ID du workspace Asana (optionnel)
ASANA_WORKSPACE_ID=your_workspace_id_here

# Configuration avancée (optionnel)
ASANA_BASE_URL=https://app.asana.com/api/1.0
ASANA_TIMEOUT=30000
ASANA_MAX_RETRIES=3
ASANA_RETRY_DELAY=1000
ASANA_CACHE_ENABLED=true
ASANA_CACHE_TTL=3600
ASANA_CACHE_PREFIX=asana:
ASANA_LOGGING_ENABLED=true
ASANA_LOGGING_LEVEL=info
```

### 2. Obtenir un Personal Access Token

1. Allez sur [Asana Developer Console](https://app.asana.com/0/my-apps)
2. Créez une nouvelle application
3. Générez un Personal Access Token
4. Copiez le token dans votre fichier `.env`

### 3. Obtenir l'ID du Workspace

1. Ouvrez Asana dans votre navigateur
2. L'ID du workspace se trouve dans l'URL : `https://app.asana.com/0/{workspace_id}/...`
3. Copiez cet ID dans votre fichier `.env`

## 🚀 Utilisation

### Import et initialisation

```typescript
import { AsanaAdapter } from './lib/asana/adapter';

const asana = new AsanaAdapter();
```

### Création d'un projet avec sections par défaut

```typescript
const project = await asana.createProjectWithDefaultSections({
  name: 'Mon Projet Marketing',
  description: 'Campagne Q1 2024',
  status: 'active',
  visibility: 'private',
});

if (project.success) {
  console.log('Projet créé:', project.data?.id);
}
```

### Création de tâches

```typescript
const task = await asana.createTask(projectId, {
  title: 'Analyser la concurrence',
  description: 'Étudier les stratégies des concurrents',
  priority: 'high',
  dueDate: new Date('2024-03-15'),
});
```

### Opérations en lot

```typescript
const tasks = [
  { title: 'Tâche 1', priority: 'high' },
  { title: 'Tâche 2', priority: 'medium' },
  { title: 'Tâche 3', priority: 'low' },
];

const result = await asana.batchCreateTasks(projectId, tasks);
```

### Gestion des workflows

```typescript
// Enregistrer un workflow
asana.registerProjectWorkflow(projectId, {
  projectId,
  autoAssignEnabled: true,
  defaultAssignee: 'user123',
  steps: [
    {
      fromSection: 'Backlog',
      toSection: 'En cours',
      autoAssign: 'user123',
    },
    {
      fromSection: 'En cours',
      toSection: 'Terminé',
      conditions: { priority: 'high' },
    },
  ],
});

// Déplacer une tâche selon le workflow
await asana.moveTaskWithWorkflow(taskId, 'Backlog', 'En cours');
```

### Templates de projets

```typescript
// Enregistrer un template
asana.registerProjectTemplate('agile-sprint', {
  name: 'Sprint Template',
  description: 'Template pour un sprint Agile',
  sections: ['Sprint Backlog', 'En cours', 'Code Review', 'Testing', 'Done'],
  defaultAssignee: 'user123',
});

// Créer un projet à partir du template
const project = await asana.createProjectFromTemplate('agile-sprint', {
  name: 'Sprint 1 - Fonctionnalité X',
});
```

## 🔧 Fonctionnalités avancées

### 1. Gestion des commentaires

```typescript
// Ajouter un commentaire
await asana.addComment(taskId, {
  text: 'J\'ai commencé le développement...',
});

// Récupérer les commentaires
const comments = await asana.getComments(taskId);
```

### 2. Gestion des pièces jointes

```typescript
// Ajouter une pièce jointe
await asana.addAttachment(taskId, {
  name: 'Maquette UI',
  url: 'https://example.com/maquette.pdf',
  type: 'document',
});

// Récupérer les pièces jointes
const attachments = await asana.getAttachments(taskId);
```

### 3. Gestion des membres

```typescript
// Lister les membres
const members = await asana.listMembers(projectId);

// Assigner un membre
await asana.assignMember(taskId, memberId);

// Retirer un membre
await asana.unassignMember(taskId, memberId);
```

### 4. Structure complète d'un projet

```typescript
const structure = await asana.getProjectStructure(projectId);

console.log('Projet:', structure.project.name);
console.log('Sections:', structure.sections.length);
console.log('Tâches:', structure.tasks.length);
console.log('Membres:', structure.members.length);
```

## 🧪 Tests

### Exécuter les tests d'intégration

```bash
npm run test:asana
```

### Tests disponibles

- ✅ Création et gestion des projets
- ✅ Création et gestion des sections
- ✅ Création et gestion des tâches
- ✅ Opérations en lot
- ✅ Gestion des commentaires et pièces jointes
- ✅ Gestion des membres
- ✅ Templates et workflows
- ✅ Gestion d'erreurs
- ✅ Tests de performance

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais exposer les tokens dans le frontend**
2. **Utiliser des variables d'environnement**
3. **Valider toutes les entrées utilisateur**
4. **Logger les erreurs de manière sécurisée**
5. **Implémenter des timeouts appropriés**

### Validation de la configuration

```typescript
import { validateAsanaSetup } from './lib/asana/examples';

if (!validateAsanaSetup()) {
  console.error('Configuration Asana invalide');
  process.exit(1);
}
```

## 📊 Monitoring et Logging

### Configuration du logging

```typescript
// Activer le logging détaillé
asana.updateConfig({
  logging: {
    enabled: true,
    level: 'debug',
    includeRequestData: true,
    includeResponseData: false,
  },
});
```

### Métriques importantes

- Taux de succès des requêtes
- Temps de réponse moyen
- Nombre de retries
- Erreurs par type
- Utilisation du cache

## 🔄 Migration et Extensibilité

### Interface standardisée

L'intégration implémente l'interface `ProjectManagementProvider`, permettant de remplacer Asana par d'autres providers :

```typescript
interface ProjectManagementProvider {
  createProject(project: ProjectData): Promise<ProjectResult>;
  createTask(projectId: string, task: TaskData): Promise<TaskResult>;
  // ... autres méthodes
}
```

### Exemple avec un autre provider

```typescript
// Remplacer Asana par Jira
import { JiraAdapter } from './lib/jira/adapter';

const projectManager: ProjectManagementProvider = new JiraAdapter();
// Le reste du code reste identique
```

## 🚨 Gestion d'erreurs

### Types d'erreurs

- `AsanaRateLimitError` - Limite de taux dépassée
- `AsanaAuthenticationError` - Erreur d'authentification
- `AsanaPermissionError` - Erreur de permission
- `AsanaNotFoundError` - Ressource non trouvée
- `AsanaServerError` - Erreur serveur
- `AsanaNetworkError` - Erreur réseau

### Gestion automatique des retries

```typescript
// Configuration des retries
asana.updateRetryConfig({
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
});
```

## 📈 Performance

### Optimisations incluses

- ✅ Retry intelligent avec backoff exponentiel
- ✅ Cache configurable avec TTL
- ✅ Opérations en lot
- ✅ Gestion des rate limits
- ✅ Timeouts configurables
- ✅ Logging conditionnel

### Benchmarks

- Création de projet : < 2s
- Création de tâche : < 1s
- Opération en lot (10 tâches) : < 5s
- Récupération de structure : < 3s

## 🔧 Maintenance

### Mise à jour de la configuration

```typescript
// Mettre à jour la configuration en runtime
asana.updateConfig({
  timeout: 60000,
  maxRetries: 5,
});

// Mettre à jour la configuration de mapping
asana.updateMappingConfig({
  defaultSections: {
    todo: 'À faire',
    inProgress: 'En cours',
    done: 'Terminé',
  },
});
```

### Nettoyage des données

```typescript
import { cleanupTestData } from './lib/asana/examples';

// Nettoyer les données de test
await cleanupTestData(projectId);
```

## 📚 Exemples complets

Voir le fichier `lib/asana/examples.ts` pour des exemples détaillés :

- Création de projets avec templates
- Gestion de workflows Kanban
- Opérations en lot
- Gestion des collaborateurs
- Synchronisation de données

## 🤝 Support

### Dépannage courant

1. **Erreur d'authentification** : Vérifiez `ASANA_ACCESS_TOKEN`
2. **Erreur de workspace** : Vérifiez `ASANA_WORKSPACE_ID`
3. **Timeouts** : Augmentez `ASANA_TIMEOUT`
4. **Rate limits** : Augmentez `ASANA_MAX_RETRIES`

### Logs utiles

```bash
# Activer les logs détaillés
ASANA_LOGGING_LEVEL=debug npm run test:asana
```

## 📄 Licence

Cette intégration est fournie sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**🎯 Objectif atteint** : Intégration Asana robuste, scalable et maintenable pour votre SaaS ! 