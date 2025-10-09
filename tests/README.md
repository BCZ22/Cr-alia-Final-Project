# 🧪 TESTS UNITAIRES - SaaS Video AI

## 📋 Vue d'ensemble

Ce répertoire contient tous les tests unitaires et d'intégration pour le SaaS Video AI. L'approche de test suit le principe **"implémenter chaque module avec des tests avant de passer au suivant"** pour garantir la fiabilité et la stabilité du code.

## 🏗️ Structure des tests

```
tests/
├── unit/                          # Tests unitaires
│   ├── services/                  # Tests des services
│   │   ├── database/             # Tests du service base de données
│   │   ├── storage/              # Tests du service de stockage
│   │   └── utils/                # Tests des services utilitaires
│   ├── workers/                   # Tests des workers
│   └── api/                      # Tests des routes API
├── integration/                    # Tests d'intégration
├── fixtures/                      # Données de test
├── mocks/                         # Mocks et stubs
├── utils/                         # Utilitaires de test
├── setup.ts                       # Configuration globale des tests
└── README.md                      # Cette documentation
```

## 🎯 Ordre d'implémentation des tests

### **PHASE 1 : Services de base** ✅ (Priorité haute)
- [x] **Logger Service** - Service de logging centralisé
- [x] **Database Service** - Service de base de données avec Prisma
- [x] **Validator Service** - Service de validation avec Zod
- [x] **File Utils Service** - Service d'utilitaires de fichiers
- [x] **Crypto Service** - Service de cryptographie (bcrypt, JWT)
- [x] **Date Utils Service** - Service d'utilitaires de dates

### **PHASE 2 : Services métier** 🔄 (Priorité moyenne)
- [ ] **Storage Service** - Service de stockage S3/R2
- [ ] **FFmpeg Service** - Service de traitement vidéo
- [ ] **AI Services** - Services OpenAI et HuggingFace
- [ ] **Queue Service** - Service de gestion des queues BullMQ

### **PHASE 3 : Workers et API** ⏳ (Priorité basse)
- [ ] **Video Processing Worker** - Worker de traitement vidéo
- [ ] **AI Processing Worker** - Worker de traitement IA
- [ ] **API Routes** - Tests des endpoints API

## 🚀 Exécution des tests

### **Installation des dépendances**
```bash
npm install --save-dev jest ts-jest @types/jest jest-junit
```

### **Lancer tous les tests**
```bash
npm test
```

### **Lancer les tests avec couverture**
```bash
npm run test:coverage
```

### **Lancer les tests en mode watch**
```bash
npm run test:watch
```

### **Lancer les tests unitaires uniquement**
```bash
npm run test:unit
```

### **Lancer les tests d'intégration uniquement**
```bash
npm run test:integration
```

### **Lancer un fichier de test spécifique**
```bash
npm test -- tests/unit/services/utils/logger.service.test.ts
```

### **Lancer les tests avec un pattern**
```bash
npm test -- --testNamePattern="Logger Service"
```

## 📊 Couverture des tests

### **Seuils de couverture**
- **Branches** : 80%
- **Functions** : 80%
- **Lines** : 80%
- **Statements** : 80%

### **Rapports de couverture**
Les rapports de couverture sont générés dans le répertoire `coverage/` :
- `coverage/lcov-report/index.html` - Rapport HTML interactif
- `coverage/coverage-final.json` - Rapport JSON
- `coverage/junit.xml` - Rapport JUnit pour CI/CD

## 🔧 Configuration Jest

### **Fichier de configuration**
- `jest.config.js` - Configuration principale de Jest
- `tests/setup.ts` - Configuration globale des tests

### **Mappage des modules**
```javascript
moduleNameMapping: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@tests/(.*)$': '<rootDir>/tests/$1',
  '^@config/(.*)$': '<rootDir>/src/config/$1',
  '^@services/(.*)$': '<rootDir>/src/services/$1',
  '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
  '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
}
```

### **Variables d'environnement de test**
```bash
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/video_ai_saas_test
REDIS_HOST=localhost
REDIS_PORT=6379
AWS_ACCESS_KEY_ID=test-access-key
OPENAI_API_KEY=test-openai-key
JWT_SECRET=test-jwt-secret-key-for-testing-only
```

## 🎭 Mocks et stubs

### **Mocks globaux configurés**
- **Winston** - Service de logging
- **Prisma** - Client de base de données
- **bcryptjs** - Hachage de mots de passe
- **jsonwebtoken** - JWT
- **AWS SDK** - Services AWS
- **FFmpeg** - Traitement vidéo
- **BullMQ** - Queues et workers
- **Redis** - Cache et sessions

### **Utilitaires de test**
```typescript
import { testUtils, testHelpers, TEST_CONSTANTS } from '../setup';

// Créer des objets de test
const testUser = testUtils.createTestUser();
const testVideo = testUtils.createTestVideo();
const testContext = testHelpers.createTestContext();

// Valider les réponses API
testHelpers.validateApiResponse(response, {
  id: 'uuid',
  name: 'string',
  createdAt: 'date',
  status: 'required'
});
```

## 📝 Écriture de tests

### **Structure d'un test**
```typescript
describe('Service Name', () => {
  let service: ServiceName;
  let mockDependency: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDependency = createMockDependency();
    service = new ServiceName(mockDependency);
  });

  describe('Method Name', () => {
    it('should perform action successfully', async () => {
      // Arrange
      const input = 'test input';
      mockDependency.method.mockResolvedValue('expected result');

      // Act
      const result = await service.method(input);

      // Assert
      expect(result).toBe('expected result');
      expect(mockDependency.method).toHaveBeenCalledWith(input);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const error = new Error('Test error');
      mockDependency.method.mockRejectedValue(error);

      // Act & Assert
      await expect(service.method('input')).rejects.toThrow('Test error');
    });
  });
});
```

### **Bonnes pratiques**
1. **Nommage clair** : Les noms de tests doivent décrire le comportement attendu
2. **Structure AAA** : Arrange, Act, Assert
3. **Mocks isolés** : Chaque test doit avoir ses propres mocks
4. **Tests indépendants** : Les tests ne doivent pas dépendre les uns des autres
5. **Couverture complète** : Tester les cas de succès et d'échec
6. **Performance** : Les tests doivent s'exécuter rapidement (< 1s par test)

### **Types de tests**
- **Tests unitaires** : Test d'une fonction/méthode isolée
- **Tests d'intégration** : Test de l'interaction entre composants
- **Tests de performance** : Vérification des performances
- **Tests de sécurité** : Validation des aspects de sécurité
- **Tests d'erreur** : Gestion des cas d'erreur

## 🐛 Débogage des tests

### **Mode debug**
```bash
npm test -- --verbose --detectOpenHandles
```

### **Logs détaillés**
```bash
npm test -- --verbose --silent=false
```

### **Tests en isolation**
```bash
npm test -- --runInBand --verbose
```

### **Inspection des mocks**
```typescript
// Vérifier les appels aux mocks
expect(mockService.method).toHaveBeenCalledTimes(1);
expect(mockService.method).toHaveBeenCalledWith('expected', 'parameters');
expect(mockService.method).toHaveBeenLastCalledWith('last', 'call');

// Inspecter l'état des mocks
console.log('Mock calls:', mockService.method.mock.calls);
console.log('Mock results:', mockService.method.mock.results);
```

## 🔄 Intégration continue

### **Scripts package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### **Configuration CI/CD**
```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: npm run test:ci
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 📚 Ressources

### **Documentation Jest**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest TypeScript](https://jestjs.io/docs/getting-started#using-typescript)
- [Jest Mocking](https://jestjs.io/docs/mock-functions)

### **Outils de test**
- **ts-jest** : Support TypeScript pour Jest
- **jest-junit** : Reporter JUnit pour CI/CD
- **@types/jest** : Types TypeScript pour Jest

### **Patterns de test**
- **AAA Pattern** : Arrange, Act, Assert
- **Given-When-Then** : Structure BDD
- **Test Doubles** : Mocks, Stubs, Spies

## 🎯 Prochaines étapes

1. **Compléter les tests des services de base** ✅
2. **Implémenter les tests des services métier**
3. **Ajouter les tests des workers**
4. **Créer les tests d'intégration**
5. **Configurer la CI/CD avec les tests**

## 🤝 Contribution

### **Ajouter de nouveaux tests**
1. Créer le fichier de test dans le bon répertoire
2. Suivre la structure et les conventions établies
3. Ajouter les mocks nécessaires
4. Tester les cas de succès et d'échec
5. Vérifier la couverture des tests

### **Maintenir les tests existants**
1. Mettre à jour les mocks lors des changements d'API
2. Ajouter des tests pour les nouvelles fonctionnalités
3. Refactoriser les tests pour améliorer la lisibilité
4. Maintenir la couverture de code au-dessus de 80%

---

**Note** : Cette approche de test incrémentale garantit que chaque module est stable et testé avant de passer au suivant, évitant ainsi l'accumulation d'erreurs et de bugs.





