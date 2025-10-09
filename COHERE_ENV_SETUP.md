# Configuration des Variables d'Environnement pour Cohere API

## Variables Requises

### COHERE_API_KEY
**Description:** Clé API Cohere pour l'authentification
**Type:** String
**Exemple:** `sk-1234567890abcdef...`
**Obtention:** [Dashboard Cohere](https://dashboard.cohere.ai/api-keys)

### Variables Optionnelles

#### COHERE_TIMEOUT
**Description:** Timeout des requêtes API en millisecondes
**Type:** Number
**Défaut:** 30000 (30 secondes)
**Exemple:** `60000`

#### COHERE_MAX_RETRIES
**Description:** Nombre maximum de tentatives en cas d'échec
**Type:** Number
**Défaut:** 3
**Exemple:** `5`

## Configuration dans .env.local

```bash
# Cohere API Configuration
COHERE_API_KEY=sk-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
COHERE_TIMEOUT=30000
COHERE_MAX_RETRIES=3
```

## Configuration dans .env.production

```bash
# Cohere API Configuration (Production)
COHERE_API_KEY=sk-prod-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
COHERE_TIMEOUT=60000
COHERE_MAX_RETRIES=5
```

## Vérification de la Configuration

### Test de Connexion
```typescript
import { nlpService } from '@/lib/ai/nlp-service';

// Vérifier la santé du service
const health = await nlpService.healthCheck();
console.log('Service status:', health.status);
```

### Test des Modèles Disponibles
```typescript
import { nlpService } from '@/lib/ai/nlp-service';

// Lister les modèles disponibles
const models = nlpService.getAvailableModels();
console.log('Available models:', models);
```

## Sécurité

### ⚠️ IMPORTANT: Ne jamais exposer la clé API côté client

- La clé API est **UNIQUEMENT** utilisée côté serveur
- Toutes les requêtes passent par le backend
- Le frontend n'a jamais accès à la clé API

### Validation de la Configuration

```typescript
// Vérifier que la clé API est configurée
if (!process.env.COHERE_API_KEY) {
  throw new Error('COHERE_API_KEY is required');
}

// Vérifier le format de la clé API
if (!process.env.COHERE_API_KEY.startsWith('sk-')) {
  throw new Error('Invalid COHERE_API_KEY format');
}
```

## Gestion des Erreurs

### Erreurs Courantes

1. **401 Unauthorized**
   - Clé API invalide ou expirée
   - Vérifier la clé dans le dashboard Cohere

2. **429 Too Many Requests**
   - Limite de taux dépassée
   - Implémenter un système de retry avec backoff exponentiel

3. **500 Internal Server Error**
   - Erreur côté Cohere
   - Retry automatique configuré

### Logs et Monitoring

```typescript
// Log des requêtes
console.log(`[Cohere] Request to ${endpoint}:`, { model, tokens: estimatedTokens });

// Log des erreurs
console.error(`[Cohere] Error:`, { 
  endpoint, 
  statusCode: error.statusCode, 
  message: error.message 
});
```

## Performance et Optimisation

### Cache des Embeddings
```typescript
// Cache local pour éviter de régénérer les mêmes embeddings
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

### Batch Processing
```typescript
// Traitement en lot pour optimiser les appels API
const texts = ['text1', 'text2', 'text3'];
const embeddings = await nlpService.getEmbedding(texts); // Un seul appel API
```

## Tests

### Test Unitaire
```typescript
// tests/cohere-service.test.ts
import { nlpService } from '@/lib/ai/nlp-service';

describe('Cohere NLP Service', () => {
  test('should generate text', async () => {
    const result = await nlpService.generateText('Hello world');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
```

### Test d'Intégration
```typescript
// tests/cohere-integration.test.ts
import { nlpService } from '@/lib/ai/nlp-service';

describe('Cohere Integration', () => {
  test('should classify text correctly', async () => {
    const result = await nlpService.classifyText(
      'This is a positive message',
      ['positive', 'negative', 'neutral']
    );
    
    expect(result[0].prediction).toBe('positive');
    expect(result[0].confidence).toBeGreaterThan(0.5);
  });
});
```

## Déploiement

### Vercel
```bash
# Ajouter les variables d'environnement dans Vercel
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

## Support et Dépannage

### Vérification de la Connexion
```bash
# Test rapide avec curl
curl -X POST "https://api.cohere.ai/v1/generate" \
  -H "Authorization: Bearer $COHERE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "command", "prompt": "Hello", "max_tokens": 10}'
```

### Logs de Débogage
```typescript
// Activer les logs détaillés
process.env.DEBUG = 'cohere:*';

// Ou dans le code
console.log('[Cohere Debug] Request details:', { endpoint, data, headers });
```

## Ressources Utiles

- [Documentation Cohere API](https://docs.cohere.ai/)
- [Dashboard Cohere](https://dashboard.cohere.ai/)
- [Modèles Disponibles](https://docs.cohere.ai/models)
- [Limites et Tarifs](https://cohere.ai/pricing)
