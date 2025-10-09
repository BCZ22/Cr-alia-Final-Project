# 🚀 Intégration Copy.ai API - Guide Complet

## 📋 Vue d'ensemble

Cette intégration Copy.ai offre une solution complète pour la génération de contenu marketing via l'API Copy.ai. Elle inclut un service backend robuste, une route API Next.js, une interface utilisateur moderne, et des services de cache et de gestion d'erreurs.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   API Route      │    │  Copy.ai API    │
│   (React)       │◄──►│   /api/copy/     │◄──►│   (External)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  CopyAI Service  │
                       │  (Backend)       │
                       └──────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            ┌──────────────┐    ┌──────────────────┐
            │ Cache Service│    │ Error Handler    │
            │ (Local)      │    │ (Retry Logic)    │
            └──────────────┘    └──────────────────┘
```

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Clé API Copy.ai (obligatoire)
COPYAI_API_KEY=your_copyai_api_key_here

# Configuration du service (optionnel)
COPYAI_TIMEOUT=30000
COPYAI_MAX_RETRIES=3
COPYAI_RETRY_DELAY=1000

# Configuration des projets (optionnel)
COPYAI_DEFAULT_PROJECT_ID=your_default_project_id
COPYAI_DEFAULT_BRAND_VOICE_ID=your_default_brand_voice_id
```

### 2. Obtention de la clé API

1. Créez un compte sur [copy.ai](https://copy.ai)
2. Accédez à "Settings" > "API"
3. Générez une nouvelle clé API
4. Copiez la clé dans votre fichier `.env.local`

## 📁 Structure des fichiers

```
lib/
├── services/
│   ├── copyai-service.ts          # Service principal Copy.ai
│   ├── copyai-cache-service.ts    # Service de cache intelligent
│   └── copyai-error-handler.ts    # Gestionnaire d'erreurs
app/
├── api/
│   └── copy/
│       └── generate/
│           └── route.ts           # Route API Next.js
└── copy-generator/
    └── page.tsx                   # Interface utilisateur
```

## 🔧 Utilisation

### 1. Service Backend

```typescript
import { CopyAIService } from '@/lib/services/copyai-service';

// Initialisation du service
const copyAIService = new CopyAIService({
  apiKey: process.env.COPYAI_API_KEY!,
  timeout: 30000,
  maxRetries: 3,
});

// Génération de contenu publicitaire
const adCopy = await copyAIService.generateAdCopy(
  "Une publicité pour un logiciel de gestion de projet",
  {
    tone: 'persuasive',
    targetAudience: 'Entrepreneurs et PME',
    industry: 'SaaS',
  }
);

// Génération de page de destination
const landingPage = await copyAIService.generateLandingPage(
  "Page d'accueil pour une application de fitness",
  {
    tone: 'conversational',
    length: 'long',
    style: 'modern',
  }
);

// Génération de séquence d'emails
const emailSequence = await copyAIService.generateEmailSequence(
  "Séquence de bienvenue pour nouveaux clients",
  5, // 5 emails
  {
    tone: 'friendly',
    length: 'medium',
  }
);
```

### 2. Route API

```typescript
// POST /api/copy/generate
const response = await fetch('/api/copy/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "Une publicité pour un logiciel de gestion de projet",
    format: "ad_copy",
    tone: "persuasive",
    length: "short",
    targetAudience: "Entrepreneurs et PME",
    industry: "SaaS",
    temperature: 0.8,
    includeVariations: true,
    numberOfVariations: 3,
  }),
});

const result = await response.json();
```

### 3. Interface Utilisateur

L'interface utilisateur est accessible à l'adresse `/copy-generator` et offre :

- Formulaire de configuration complet
- Sélection du format de contenu
- Choix de la tonalité et du style
- Paramètres avancés (température, tokens)
- Affichage du contenu généré
- Gestion des variations
- Copie en un clic

## 🎯 Formats de contenu supportés

| Format | Description | Utilisation |
|--------|-------------|-------------|
| `ad_copy` | Publicité | Bannières, annonces, spots |
| `landing_page` | Page de destination | Pages d'accueil, présentation |
| `cold_email` | Email de prospection | Outreach, networking |
| `social_post` | Post réseaux sociaux | LinkedIn, Twitter, Facebook |
| `video_script` | Script vidéo | YouTube, TikTok, Instagram |
| `blog_post` | Article de blog | Content marketing |
| `product_description` | Description produit | E-commerce, catalogues |
| `email_sequence` | Séquence d'emails | Nurturing, onboarding |

## 🎨 Tonalités disponibles

| Tonalité | Description | Cas d'usage |
|----------|-------------|-------------|
| `professional` | Professionnel | B2B, corporate |
| `casual` | Décontracté | Réseaux sociaux, jeunes |
| `friendly` | Amical | Service client, communauté |
| `formal` | Formel | Documents officiels |
| `conversational` | Conversationnel | Blogs, newsletters |
| `persuasive` | Persuasif | Ventes, marketing |
| `storytelling` | Narratif | Branding, engagement |
| `direct-response` | Direct | CTA, conversions |

## ⚙️ Paramètres avancés

### Température (créativité)
- **0.0-0.3** : Très précis, cohérent
- **0.4-0.7** : Équilibré (recommandé)
- **0.8-1.0** : Très créatif, varié

### Longueur
- **short** : 50-150 mots
- **medium** : 150-300 mots
- **long** : 300-600 mots
- **very-long** : 600+ mots

### Mots-clés
```typescript
const request = {
  prompt: "Description d'un logiciel de gestion",
  keywords: ["productivité", "collaboration", "efficacité", "organisation"],
  // L'IA intégrera ces mots-clés naturellement
};
```

## 🗄️ Service de Cache

Le service de cache intelligent optimise les performances et réduit les coûts API :

```typescript
import { CopyAICacheService } from '@/lib/services/copyai-cache-service';

const cacheService = new CopyAICacheService({
  maxSize: 1000,           // 1000 entrées maximum
  ttl: 24 * 60 * 60 * 1000, // 24 heures
  similarityThreshold: 0.85,  // 85% de similarité
  enableCompression: true,    // Compression des données
  persistToStorage: true,     // Persistance locale
});

// Utilisation automatique dans le service principal
const cachedContent = await cacheService.get(request);
if (cachedContent) {
  return cachedContent; // Retour immédiat
}

// Sinon, générer et mettre en cache
const newContent = await copyAIService.generateContent(request);
await cacheService.set(request, newContent);
```

### Fonctionnalités du cache

- **Similarité intelligente** : Trouve du contenu similaire
- **Compression** : Optimise l'espace de stockage
- **Persistance** : Survit aux rechargements de page
- **Nettoyage automatique** : Supprime les entrées expirées
- **Statistiques** : Suivi de l'efficacité du cache

## 🛡️ Gestion des erreurs

Le gestionnaire d'erreurs robuste gère automatiquement :

```typescript
import { CopyAIErrorHandler } from '@/lib/services/copyai-error-handler';

const errorHandler = new CopyAIErrorHandler({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
});

// Gestion automatique avec retry
const result = await errorHandler.handleWithRetry(
  () => copyAIService.generateContent(request),
  request,
  (error, attempt, delay) => {
    console.log(`Tentative ${attempt} échouée, retry dans ${delay}ms`);
  }
);
```

### Types d'erreurs gérées

- **API_KEY_INVALID** : Clé API invalide
- **RATE_LIMIT_EXCEEDED** : Limite de taux dépassée
- **QUOTA_EXCEEDED** : Quota API épuisé
- **TIMEOUT** : Délai d'attente dépassé
- **NETWORK_ERROR** : Erreur de connexion
- **VALIDATION_ERROR** : Paramètres invalides
- **SERVER_ERROR** : Erreur serveur Copy.ai

## 📊 Monitoring et Analytics

### Statistiques du cache

```typescript
const stats = cacheService.getStats();
console.log('Cache Stats:', {
  size: stats.size,
  hitRate: stats.hitRate,
  totalHits: stats.totalHits,
  oldestEntry: new Date(stats.oldestEntry),
  newestEntry: new Date(stats.newestEntry),
});
```

### Statistiques d'erreurs

```typescript
const errorStats = errorHandler.getErrorStats();
console.log('Error Stats:', {
  totalErrors: errorStats.totalErrors,
  errorRate: errorStats.errorRate,
  mostCommonError: errorStats.mostCommonError,
});
```

## 🔒 Sécurité

### Bonnes pratiques

- ✅ Clé API jamais exposée au frontend
- ✅ Validation stricte des paramètres
- ✅ Rate limiting côté serveur
- ✅ Gestion sécurisée des erreurs
- ✅ Logs sans données sensibles

### Rate Limiting

```typescript
// Configuration du rate limiting
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requêtes par heure
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 heure

// Headers de réponse
'X-RateLimit-Limit': '100',
'X-RateLimit-Remaining': '95',
'X-RateLimit-Reset': '2024-01-01T12:00:00Z',
```

## 🧪 Tests

### Test de l'API

```bash
# Test de connectivité
curl -X GET "http://localhost:3000/api/copy/generate"

# Test de génération
curl -X POST "http://localhost:3000/api/copy/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Une publicité pour un logiciel de gestion de projet",
    "format": "ad_copy",
    "tone": "persuasive",
    "length": "short"
  }'
```

### Test du service

```typescript
import { CopyAIService } from '@/lib/services/copyai-service';

describe('CopyAI Service', () => {
  it('should generate ad copy successfully', async () => {
    const service = new CopyAIService({
      apiKey: 'test-key',
    });

    const result = await service.generateAdCopy(
      'Test prompt',
      { tone: 'persuasive' }
    );

    expect(result.success).toBe(true);
    expect(result.content).toBeDefined();
  });
});
```

## 🚀 Déploiement

### Production

```bash
# Variables d'environnement de production
COPYAI_API_KEY=your_production_key
COPYAI_TIMEOUT=45000
COPYAI_MAX_RETRIES=5
COPYAI_RETRY_DELAY=2000

# Build et déploiement
npm run build
npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔄 Extensibilité

### Ajout de nouveaux formats

```typescript
// Dans copyai-service.ts
async generateCustomFormat(prompt: string, options: any) {
  return this.generateContent({
    prompt,
    format: 'custom_format',
    ...options,
  });
}
```

### Intégration d'autres providers

```typescript
// Interface commune pour tous les providers
interface AIProvider {
  generateContent(request: ContentRequest): Promise<ContentResponse>;
  isAvailable(): boolean;
}

// Factory pour choisir le provider
class AIProviderFactory {
  static createProvider(type: 'copyai' | 'jasper' | 'claude'): AIProvider {
    switch (type) {
      case 'copyai':
        return new CopyAIService(config);
      case 'jasper':
        return new JasperService(config);
      case 'claude':
        return new ClaudeService(config);
    }
  }
}
```

## 📚 Ressources additionnelles

### Documentation officielle
- [Copy.ai API Documentation](https://docs.copy.ai/)
- [API Reference](https://docs.copy.ai/reference)
- [Best Practices](https://docs.copy.ai/best-practices)

### Support
- [Copy.ai Community](https://community.copy.ai/)
- [GitHub Issues](https://github.com/copy-ai/copy-ai-js/issues)
- Email: support@copy.ai

### Exemples d'utilisation
- [Exemples de prompts](https://docs.copy.ai/examples)
- [Templates de contenu](https://docs.copy.ai/templates)
- [Cas d'usage](https://docs.copy.ai/use-cases)

## 🎉 Conclusion

Cette intégration Copy.ai offre une solution complète et robuste pour la génération de contenu marketing. Elle combine :

- **Performance** : Cache intelligent et gestion d'erreurs
- **Flexibilité** : Support de tous les formats Copy.ai
- **Sécurité** : Gestion sécurisée des clés API
- **UX** : Interface utilisateur moderne et intuitive
- **Maintenance** : Architecture modulaire et extensible

L'intégration est prête pour la production et peut être facilement étendue pour supporter d'autres fournisseurs d'IA.
