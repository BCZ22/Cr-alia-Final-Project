# Intégration Airtable - Documentation Complète

## 🎯 Vue d'ensemble

Cette intégration Airtable de niveau entreprise fournit une **couche d'abstraction de données plug-and-play** totalement découplée du frontend, extensible, testable, et prête à supporter des volumes croissants sans jamais exposer Airtable à l'utilisateur final.

## 🏗️ Architecture

### Structure des modules

```
lib/airtable/
├── types.ts          # Types et interfaces TypeScript
├── config.ts         # Configuration et validation
├── errors.ts         # Gestion d'erreurs typées
├── http-client.ts    # Client HTTP robuste avec retry
├── transformer.ts    # Transformation de données
├── service.ts        # Service principal
└── index.ts          # Exports et utilitaires
```

### Principes architecturaux

- **Architecture hexagonale** : Séparation claire entre domaine, infrastructure et adaptateurs
- **Framework agnostique** : Aucune dépendance au framework principal
- **Interchangeabilité** : Interface `DataProviderInterface` pour changer de backend
- **Testabilité** : Chaque composant isolé et testable unitairement
- **Extensibilité** : Design modulaire pour ajouter de nouvelles fonctionnalités

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```bash
# Configuration Airtable (obligatoire)
AIRTABLE_API_KEY=pat_your_airtable_api_key_here
AIRTABLE_BASE_ID=appYourBaseIdHere

# Configuration optionnelle
AIRTABLE_BASE_URL=https://api.airtable.com/v0
AIRTABLE_TIMEOUT=30000
AIRTABLE_MAX_RETRIES=3
AIRTABLE_RETRY_DELAY=1000

# Configuration cache (optionnel)
AIRTABLE_CACHE_ENABLED=true
AIRTABLE_CACHE_TTL=3600
AIRTABLE_CACHE_PREFIX=airtable:

# Configuration logging (optionnel)
AIRTABLE_LOGGING_ENABLED=true
AIRTABLE_LOGGING_LEVEL=info
```

### 2. Obtention des clés Airtable

1. **Clé API** : Allez sur https://airtable.com/account → API → Generate API key
2. **ID de base** : Dans l'URL de votre base Airtable : `https://airtable.com/appXXXXXXXXXXXXXX`

### 3. Validation de la configuration

```typescript
import { isProductionReady, getConfigSummary } from '../lib/airtable';

// Vérifier si la configuration est prête
if (isProductionReady()) {
  console.log('✅ Configuration Airtable valide');
} else {
  console.log('❌ Configuration Airtable manquante');
}

// Afficher un résumé de la configuration
console.log(getConfigSummary());
```

## 📚 Utilisation

### Service de base

```typescript
import { createAirtableService } from '../lib/airtable';

// Création du service
const service = createAirtableService();

// Opérations CRUD de base
const result = await service.createRecord('Clients', {
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active'
});

const records = await service.getRecords('Clients', {
  pageSize: 10,
  sort: [{ field: 'name', direction: 'asc' }]
});

const record = await service.getRecordById('Clients', 'rec123456789');

const updated = await service.updateRecord('Clients', 'rec123456789', {
  status: 'inactive'
});

const deleted = await service.deleteRecord('Clients', 'rec123456789');
```

### Configuration avancée

```typescript
import { createAirtableServiceWithConfig } from '../lib/airtable';

// Service avec configuration personnalisée
const service = createAirtableServiceWithConfig({
  apiKey: 'pat_custom_key',
  baseId: 'appCustomBase',
  timeout: 60000,
  maxRetries: 5,
  retryDelay: 2000,
}, {
  fieldMapping: {
    internalField: 'airtable_field',
    createdAt: 'Date de création',
    updatedAt: 'Date de modification',
  },
  transformOutgoing: (data) => {
    // Transformation avant envoi à Airtable
    return data;
  },
  transformIncoming: (data) => {
    // Transformation depuis Airtable
    return data;
  },
});
```

### Opérations avancées

```typescript
// Recherche avec filtres
const activeClients = await service.findRecords('Clients', {
  field: 'status',
  operator: 'equals',
  value: 'active'
});

// Opérations en lot
const batchResult = await service.batchCreate('Clients', [
  { name: 'Client 1', email: 'client1@example.com' },
  { name: 'Client 2', email: 'client2@example.com' },
]);

const updateResult = await service.batchUpdate('Clients', [
  { id: 'rec1', data: { status: 'updated' } },
  { id: 'rec2', data: { status: 'updated' } },
]);

const deleteResult = await service.batchDelete('Clients', ['rec1', 'rec2']);
```

## 🔧 Fonctionnalités Avancées

### 1. Validation de données

```typescript
import { ValidationRule } from '../lib/airtable';

const validationRules: ValidationRule[] = [
  {
    field: 'name',
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
  },
  {
    field: 'email',
    required: true,
    type: 'email',
  },
  {
    field: 'status',
    type: 'string',
    custom: (value) => {
      const validStatuses = ['active', 'inactive', 'pending'];
      return validStatuses.includes(value) || 'Status invalide';
    },
  },
];

// Ajouter les règles au service
service['transformer'].addValidationRules(validationRules);
```

### 2. Mapping de champs

```typescript
const fieldMapping = {
  // Champs internes → Champs Airtable
  id: 'ID',
  name: 'Nom',
  email: 'Email',
  phone: 'Téléphone',
  company: 'Entreprise',
  status: 'Statut',
  createdAt: 'Date de création',
  updatedAt: 'Date de modification',
};

service.configure({ fieldMapping });
```

### 3. Transformation de données

```typescript
service.configure({
  transformOutgoing: (data) => {
    // Avant envoi à Airtable
    const transformed = { ...data };
    
    // Formatage des dates
    if (transformed.createdAt) {
      transformed.createdAt = new Date(transformed.createdAt).toISOString();
    }
    
    // Nettoyage des valeurs undefined
    Object.keys(transformed).forEach(key => {
      if (transformed[key] === undefined) {
        delete transformed[key];
      }
    });
    
    return transformed;
  },
  transformIncoming: (data) => {
    // Depuis Airtable
    const transformed = { ...data };
    
    // Conversion des dates
    if (transformed.createdAt) {
      transformed.createdAt = new Date(transformed.createdAt);
    }
    
    return transformed;
  },
});
```

### 4. Gestion du cache

```typescript
// Configuration du cache
service.updateCacheConfig(true, 1800); // Cache activé, TTL 30 minutes

// Vider le cache
await service.clearCache(); // Tout le cache
await service.clearCache('Clients'); // Cache d'une table spécifique
```

## 🛡️ Gestion d'erreurs

### Types d'erreurs

```typescript
import {
  AirtableRateLimitError,
  AirtableAuthenticationError,
  AirtablePermissionError,
  AirtableNotFoundError,
  AirtableServerError,
  AirtableNetworkError,
} from '../lib/airtable';

try {
  const result = await service.createRecord('Clients', data);
  if (!result.success) {
    console.error('Erreur:', result.error);
  }
} catch (error) {
  if (error instanceof AirtableRateLimitError) {
    // Gérer les limites de taux
    console.log('Rate limit atteint, retry automatique en cours...');
  } else if (error instanceof AirtableAuthenticationError) {
    // Erreur d'authentification
    console.error('Clé API invalide');
  } else if (error instanceof AirtableNotFoundError) {
    // Ressource non trouvée
    console.error('Record non trouvé');
  }
}
```

### Retry automatique

Le service gère automatiquement :
- **Backoff exponentiel** sur les erreurs 429 (rate limit)
- **Retry** sur les erreurs 5xx (serveur)
- **Logging** structuré des erreurs
- **Fallback** en cas d'erreur réseau

## 🧪 Tests

### Tests unitaires

```bash
# Lancer les tests Airtable
npm run test:airtable

# Tests spécifiques
npm run test:airtable:service
npm run test:airtable:transformer
npm run test:airtable:http-client
```

### Tests d'intégration

```typescript
// Exemple de test d'intégration
describe('Airtable Integration', () => {
  it('should create and retrieve a client', async () => {
    const service = createAirtableService();
    
    // Créer un client
    const createResult = await service.createRecord('Clients', {
      name: 'Test Client',
      email: 'test@example.com',
    });
    
    expect(createResult.success).toBe(true);
    expect(createResult.data?.name).toBe('Test Client');
    
    // Récupérer le client
    const getResult = await service.getRecordById('Clients', createResult.metadata!.id!);
    
    expect(getResult.success).toBe(true);
    expect(getResult.data?.email).toBe('test@example.com');
  });
});
```

## 📊 Monitoring et Performance

### Métriques disponibles

```typescript
// Statistiques du service
const stats = service.getStats();
console.log('Cache enabled:', stats.cacheEnabled);
console.log('Cache TTL:', stats.cacheTTL);
console.log('Field mappings:', stats.transformer.fieldMapping);
console.log('Validation rules:', stats.transformer.validationRules);
```

### Logs structurés

Le service génère automatiquement des logs pour :
- ✅ Requêtes réussies
- ⚠️ Rate limits
- ❌ Erreurs d'authentification
- 🚫 Erreurs de permission
- 🔍 Ressources non trouvées
- 🚨 Erreurs serveur
- 🌐 Erreurs réseau

## 🔄 Migration et Extensibilité

### Interface DataProviderInterface

L'intégration respecte l'interface `DataProviderInterface` pour permettre le changement de backend :

```typescript
interface DataProviderInterface {
  createRecord<T>(table: string, data: T): Promise<RecordResult<T>>;
  getRecords<T>(table: string, options?: QueryOptions): Promise<RecordsResult<T>>;
  getRecordById<T>(table: string, id: string): Promise<RecordResult<T>>;
  updateRecord<T>(table: string, id: string, data: Partial<T>): Promise<RecordResult<T>>;
  deleteRecord(table: string, id: string): Promise<DeleteResult>;
  // ... autres méthodes
}
```

### Migration vers PostgreSQL

```typescript
// Exemple de migration vers PostgreSQL
class PostgreSQLService implements DataProviderInterface {
  async createRecord<T>(table: string, data: T): Promise<RecordResult<T>> {
    // Implémentation PostgreSQL
  }
  // ... autres méthodes
}

// Changement de backend
const dataProvider = process.env.USE_POSTGRES 
  ? new PostgreSQLService() 
  : new AirtableService();
```

## 🚀 Déploiement

### Variables d'environnement de production

```bash
# Production
NODE_ENV=production
AIRTABLE_API_KEY=pat_production_key
AIRTABLE_BASE_ID=app_production_base
AIRTABLE_CACHE_ENABLED=true
AIRTABLE_LOGGING_LEVEL=warn
```

### Vérification de la configuration

```typescript
import { isProductionReady } from '../lib/airtable';

if (!isProductionReady()) {
  throw new Error('Configuration Airtable invalide pour la production');
}
```

## 📈 Limites et Bonnes Pratiques

### Limites Airtable

- **100 records max** par requête
- **100,000 records max** par base
- **100 champs max** par table
- **1,000 tables max** par base
- **5 requests/second** par base (rate limit)

### Bonnes pratiques

1. **Utilisez le cache** pour les lectures fréquentes
2. **Validez les données** avant envoi
3. **Gérez les erreurs** de manière appropriée
4. **Utilisez les opérations en lot** pour de gros volumes
5. **Monitorer les rate limits**
6. **Testez en environnement de développement**

## 🔧 Dépannage

### Problèmes courants

1. **Erreur d'authentification**
   - Vérifiez votre clé API Airtable
   - Assurez-vous que la clé commence par `pat_`

2. **Erreur de base non trouvée**
   - Vérifiez l'ID de base dans l'URL Airtable
   - Assurez-vous que la clé API a accès à cette base

3. **Rate limit atteint**
   - Le service retry automatiquement
   - Augmentez `AIRTABLE_RETRY_DELAY` si nécessaire

4. **Erreur de validation**
   - Vérifiez les règles de validation
   - Assurez-vous que les données respectent les contraintes

### Logs de debug

```bash
# Activer les logs détaillés
AIRTABLE_LOGGING_LEVEL=debug
DEBUG=airtable:*
```

## 📚 Exemples Complets

### Route API Next.js

Voir `app/api/airtable/clients/route.ts` pour un exemple complet d'utilisation dans une route API.

### Tests complets

Voir `tests/airtable-service.test.ts` pour des exemples de tests unitaires et d'intégration.

## 🤝 Contribution

### Structure du code

- **Types** : Définis dans `types.ts`
- **Configuration** : Gérée dans `config.ts`
- **Erreurs** : Typées dans `errors.ts`
- **HTTP** : Client robuste dans `http-client.ts`
- **Transformation** : Logique dans `transformer.ts`
- **Service** : Interface principale dans `service.ts`

### Ajout de fonctionnalités

1. Définir les types dans `types.ts`
2. Implémenter la logique dans le module approprié
3. Ajouter les tests dans `tests/`
4. Documenter dans ce fichier

## 📄 Licence

Cette intégration fait partie du projet Crealia et suit les mêmes conditions de licence.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024  
**Maintenu par** : Équipe Crealia 