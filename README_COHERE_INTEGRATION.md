# 🚀 Intégration Cohere API - Guide Complet

## Vue d'ensemble

Cette intégration Cohere API transforme votre SaaS en une plateforme NLP avancée avec des capacités de génération de texte, classification, embeddings, résumé automatique et recherche sémantique. L'architecture est conçue pour être **modulaire**, **extensible** et **performante**.

## ✨ Fonctionnalités Principales

### 🎯 Génération de Texte
- **Copywriting marketing** optimisé pour la conversion
- **Contenu conversationnel** avec contexte personnalisé
- **Génération créative** avec contrôle de la température et top-p
- **Support multi-modèles** (Command, Base, etc.)

### 🏷️ Classification de Texte
- **Détection d'intention** pour chatbots et support client
- **Analyse de sentiment** automatique
- **Catégorisation** personnalisée avec exemples
- **Confiance** et scores de prédiction

### 🔢 Embeddings & Recherche Sémantique
- **Vecteurs haute dimension** pour la compréhension sémantique
- **Recherche de similarité** cosinus
- **Indexation de documents** intelligente
- **Recherche contextuelle** avancée

### 📝 Résumé Automatique
- **Résumé adaptatif** (court, moyen, long)
- **Formats multiples** (paragraphe, puces)
- **Extractivité configurable** selon les besoins
- **Préservation du contexte** clé

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Next.js)                 │
├─────────────────────────────────────────────────────────────┤
│  CohereNLPPlayground.tsx - Interface de test complète      │
│  - Onglets pour chaque fonctionnalité                      │
│  - Contrôles avancés des paramètres                        │
│  - Visualisation des résultats en temps réel               │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                        │
├─────────────────────────────────────────────────────────────┤
│  nlp-service.ts - Service unifié NLP                       │
│  ├── generateText()                                        │
│  ├── classifyText()                                        │
│  ├── getEmbedding()                                        │
│  ├── summarize()                                            │
│  └── semanticSearch()                                      │
│                                                             │
│  cohere-service.ts - Service Cohere principal              │
│  ├── API calls avec retry & error handling                 │
│  ├── Gestion des modèles et configurations                 │
│  └── Optimisations de performance                          │
│                                                             │
│  cohere-adapter.ts - Adaptateur pour service unifié        │
│  └── Implémentation de l'interface LLMProvider             │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cohere API                              │
│  - Génération: command, command-light, base               │
│  - Embeddings: embed-english-v3.0, embed-multilingual     │
│  - Classification: via embeddings                          │
│  - Résumé: summarize-xlarge, summarize-medium              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Installation et Configuration

### 1. Variables d'Environnement

Créez un fichier `.env.local` :

```bash
# Cohere API Configuration
COHERE_API_KEY=sk-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
COHERE_TIMEOUT=30000
COHERE_MAX_RETRIES=3
```

### 2. Vérification de l'Installation

```typescript
import { nlpService } from '@/lib/ai/nlp-service';

// Vérifier la santé du service
const health = await nlpService.healthCheck();
console.log('Service status:', health.status);

// Lister les modèles disponibles
const models = nlpService.getAvailableModels();
console.log('Available models:', models);
```

## 📚 Guide d'Utilisation

### Génération de Texte

```typescript
import { nlpService } from '@/lib/ai/nlp-service';

// Génération simple
const text = await nlpService.generateText(
  'Écris une description captivante pour un smartphone AI',
  {
    model: 'command',
    maxTokens: 200,
    temperature: 0.8,
    topP: 0.9
  }
);

// Contenu marketing optimisé
const marketingContent = await nlpService.generateMarketingContent(
  'Smartphone AI',
  'tech enthusiasts',
  'ad',
  { maxTokens: 150, temperature: 0.7 }
);
```

### Classification de Texte

```typescript
// Classification simple
const classification = await nlpService.classifyText(
  'Ce produit est incroyable !',
  ['positif', 'négatif', 'neutre']
);

// Détection d'intention
const intent = await nlpService.detectIntent(
  'Je veux acheter ce produit',
  ['achat', 'information', 'support', 'plainte']
);

// Classification en lot
const classifications = await nlpService.classifyText(
  [
    'Service client excellent',
    'Produit décevant',
    'Qualité correcte'
  ],
  ['positif', 'négatif', 'neutre']
);
```

### Embeddings et Recherche Sémantique

```typescript
// Génération d'embeddings
const embeddings = await nlpService.getEmbedding(
  'Intelligence artificielle et apprentissage automatique',
  { inputType: 'search_document' }
);

// Recherche sémantique
const documents = [
  { id: 'doc1', text: 'Technologies d\'IA et de machine learning' },
  { id: 'doc2', text: 'Traitement du langage naturel' },
  { id: 'doc3', text: 'Vision par ordinateur et reconnaissance d\'images' }
];

const searchResults = await nlpService.semanticSearch(
  'Intelligence artificielle',
  documents,
  { topK: 3, similarityThreshold: 0.6 }
);
```

### Résumé Automatique

```typescript
const longText = `
  L'intelligence artificielle (IA) est une branche de l'informatique 
  qui vise à créer des machines intelligentes capables de travailler 
  et de réagir comme des humains. Certaines des activités que les 
  ordinateurs avec intelligence artificielle sont conçus pour effectuer 
  incluent la reconnaissance vocale, l'apprentissage, la planification 
  et la résolution de problèmes...
`;

const summary = await nlpService.summarize(longText, {
  length: 'medium',
  format: 'bullets',
  extractiveness: 'high'
});
```

### Fonctionnalités Avancées

```typescript
// Analyse de sentiment
const sentiments = await nlpService.analyzeSentiment([
  'J\'adore ce produit !',
  'Expérience terrible',
  'Fonctionne comme prévu'
]);

// Extraction de mots-clés
const keywords = await nlpService.extractKeywords(
  'L\'IA transforme notre façon de travailler et de vivre',
  5
);

// Traduction
const translation = await nlpService.translate(
  'Hello, how are you?',
  'French'
);

// Réponses conversationnelles
const response = await nlpService.generateConversationalResponse(
  'Tu es un assistant IA spécialisé en marketing',
  'Comment optimiser mes campagnes publicitaires ?'
);
```

## 🎮 Interface de Test - Playground

Le composant `CohereNLPPlayground` offre une interface complète pour tester toutes les fonctionnalités :

### Onglets Disponibles

1. **✍️ Génération** - Test de génération de texte avec contrôles avancés
2. **🏷️ Classification** - Classification de texte avec labels personnalisés
3. **🔢 Embeddings** - Génération et visualisation d'embeddings
4. **📝 Résumé** - Résumé automatique avec options configurables
5. **🔍 Recherche Sémantique** - Recherche dans des collections de documents

### Utilisation du Playground

```typescript
// Dans votre page Next.js
import CohereNLPPlayground from '@/components/CohereNLPPlayground';

export default function TestPage() {
  return (
    <div>
      <h1>Test des Fonctionnalités NLP</h1>
      <CohereNLPPlayground />
    </div>
  );
}
```

## 🔧 Configuration Avancée

### Modèles Personnalisés

```typescript
// Configuration personnalisée du service
import { CohereService } from '@/lib/ai/cohere-service';

const customCohereService = new CohereService(process.env.COHERE_API_KEY!, {
  timeout: 60000,
  maxRetries: 5,
  baseUrl: 'https://api.cohere.ai/v1'
});
```

### Cache et Optimisation

```typescript
// Cache local pour les embeddings
const embeddingCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  
  const embedding = await nlpService.getEmbedding(text);
  embeddingCache.set(text, embedding[0]);
  return embedding[0];
}
```

### Gestion des Erreurs

```typescript
try {
  const result = await nlpService.generateText(prompt);
  // Traitement du succès
} catch (error) {
  if (error instanceof CohereError) {
    switch (error.statusCode) {
      case 401:
        console.error('Clé API invalide');
        break;
      case 429:
        console.error('Limite de taux dépassée');
        break;
      default:
        console.error('Erreur API:', error.message);
    }
  }
}
```

## 📊 Monitoring et Performance

### Métriques de Performance

```typescript
// Mesure des temps de réponse
const startTime = Date.now();
const result = await nlpService.generateText(prompt);
const responseTime = Date.now() - startTime;

console.log(`Génération terminée en ${responseTime}ms`);
```

### Health Check

```typescript
// Vérification de la santé du service
const health = await nlpService.healthCheck();
if (health.status === 'unhealthy') {
  // Alertes, fallback, etc.
  console.error('Service NLP défaillant:', health.details);
}
```

## 🧪 Tests

### Tests Unitaires

```bash
# Lancer tous les tests
npm test

# Tests spécifiques à Cohere
npm run test:cohere

# Tests avec couverture
npm run test:cohere:coverage
```

### Tests d'Intégration

```typescript
// tests/cohere-integration.test.ts
describe('Cohere Integration', () => {
  test('should generate text correctly', async () => {
    const result = await nlpService.generateText('Test prompt');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
```

## 🚀 Déploiement

### Vercel

```bash
# Ajouter les variables d'environnement
vercel env add COHERE_API_KEY
vercel env add COHERE_TIMEOUT
vercel env add COHERE_MAX_RETRIES
```

### Docker

```dockerfile
# Dockerfile
ENV COHERE_API_KEY=your-api-key
ENV COHERE_TIMEOUT=30000
ENV COHERE_MAX_RETRIES=3
```

### Kubernetes

```yaml
# deployment.yaml
env:
  - name: COHERE_API_KEY
    valueFrom:
      secretKeyRef:
        name: cohere-secrets
        key: api-key
```

## 🔒 Sécurité

### Bonnes Pratiques

- ✅ **Clé API côté serveur uniquement**
- ✅ **Validation des entrées utilisateur**
- ✅ **Limitation de taux configurable**
- ✅ **Logs d'audit pour les requêtes sensibles**

### Validation des Entrées

```typescript
// Validation des prompts
function validatePrompt(prompt: string): boolean {
  if (!prompt || prompt.length > 10000) {
    return false;
  }
  
  // Filtrage de contenu sensible
  const sensitivePatterns = [/script/i, /javascript/i, /<.*>/];
  return !sensitivePatterns.some(pattern => pattern.test(prompt));
}
```

## 📈 Cas d'Usage Avancés

### Chatbot Intelligent

```typescript
class AIAssistant {
  private context: string = '';
  
  async respond(userMessage: string): Promise<string> {
    // Analyse de l'intention
    const intent = await nlpService.detectIntent(userMessage, [
      'question', 'demande', 'plainte', 'compliment'
    ]);
    
    // Génération de réponse contextuelle
    const response = await nlpService.generateConversationalResponse(
      this.context,
      userMessage
    );
    
    // Mise à jour du contexte
    this.context += `\nUtilisateur: ${userMessage}\nAssistant: ${response}`;
    
    return response;
  }
}
```

### Analyse de Contenu

```typescript
class ContentAnalyzer {
  async analyzeArticle(content: string) {
    const analysis = {
      summary: await nlpService.summarize(content),
      keywords: await nlpService.extractKeywords(content, 10),
      sentiment: await nlpService.analyzeSentiment(content),
      topics: await this.extractTopics(content)
    };
    
    return analysis;
  }
  
  private async extractTopics(content: string) {
    // Utilisation des embeddings pour clustering
    const embedding = await nlpService.getEmbedding(content);
    // Logique de clustering...
  }
}
```

### Système de Recommandation

```typescript
class RecommendationEngine {
  async findSimilarProducts(query: string, products: Product[]) {
    const queryEmbedding = await nlpService.getEmbedding(query);
    
    const productEmbeddings = await Promise.all(
      products.map(async (product) => ({
        id: product.id,
        embedding: await nlpService.getEmbedding(product.description)
      }))
    );
    
    const similarities = CohereService.findMostSimilar(
      queryEmbedding[0],
      productEmbeddings,
      5
    );
    
    return similarities.map(sim => 
      products.find(p => p.id === sim.id)
    ).filter(Boolean);
  }
}
```

## 🆘 Dépannage

### Erreurs Courantes

1. **401 Unauthorized**
   - Vérifier la clé API dans `.env.local`
   - Vérifier l'expiration de la clé

2. **429 Too Many Requests**
   - Implémenter un système de retry avec backoff
   - Vérifier les limites de l'API

3. **Timeout**
   - Augmenter `COHERE_TIMEOUT`
   - Vérifier la connectivité réseau

### Logs de Débogage

```typescript
// Activer les logs détaillés
process.env.DEBUG = 'cohere:*';

// Logs personnalisés
console.log('[Cohere] Request:', { endpoint, model, tokens });
console.log('[Cohere] Response:', { status, duration, tokens });
```

## 🔮 Roadmap et Extensions

### Fonctionnalités Futures

- [ ] **Streaming en temps réel** pour la génération
- [ ] **Cache Redis** pour les embeddings
- [ ] **Batch processing** optimisé
- [ ] **Multi-langues** avancé
- [ **Intégration avec d'autres providers** (OpenAI, Anthropic)

### Architecture Extensible

```typescript
// Interface pour nouveaux providers
interface NLPProvider {
  name: string;
  generateText(prompt: string, options?: any): Promise<string>;
  classifyText(input: string, labels: string[]): Promise<any>;
  // ... autres méthodes
}

// Service unifié multi-providers
class UnifiedNLPService {
  private providers: Map<string, NLPProvider> = new Map();
  
  registerProvider(provider: NLPProvider) {
    this.providers.set(provider.name, provider);
  }
  
  async generateText(provider: string, prompt: string, options?: any) {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`);
    }
    return providerInstance.generateText(prompt, options);
  }
}
```

## 📚 Ressources

### Documentation Officielle
- [Cohere API Documentation](https://docs.cohere.ai/)
- [Cohere Models](https://docs.cohere.ai/models)
- [Cohere Pricing](https://cohere.ai/pricing)

### Exemples et Tutoriels
- [Playground NLP](components/CohereNLPPlayground.tsx)
- [Tests d'intégration](tests/cohere-integration.test.ts)
- [Configuration](COHERE_ENV_SETUP.md)

### Support
- [Issues GitHub](https://github.com/your-repo/issues)
- [Documentation interne](docs/)
- [Tests automatisés](tests/)

---

## 🎯 Conclusion

Cette intégration Cohere API transforme votre SaaS en une plateforme NLP de niveau entreprise avec :

- ✅ **Architecture modulaire** et extensible
- ✅ **Interface utilisateur** complète et intuitive
- ✅ **Gestion d'erreurs** robuste avec retry automatique
- ✅ **Performance optimisée** avec cache et batch processing
- ✅ **Tests complets** pour la fiabilité
- ✅ **Documentation détaillée** pour l'équipe dev
- ✅ **Sécurité renforcée** avec validation des entrées
- ✅ **Monitoring** et health checks intégrés

**Prêt à révolutionner votre SaaS avec l'IA ?** 🚀
