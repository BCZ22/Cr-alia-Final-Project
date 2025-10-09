# Configuration d'environnement Copy.ai

## Variables d'environnement requises

### Fichier `.env.local` (développement)

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

# Configuration de l'API (optionnel)
COPYAI_BASE_URL=https://api.copy.ai
```

### Fichier `.env.production` (production)

```bash
# Clé API Copy.ai (obligatoire)
COPYAI_API_KEY=your_production_copyai_api_key

# Configuration optimisée pour la production
COPYAI_TIMEOUT=45000
COPYAI_MAX_RETRIES=5
COPYAI_RETRY_DELAY=2000

# Configuration des projets
COPYAI_DEFAULT_PROJECT_ID=your_production_project_id
COPYAI_DEFAULT_BRAND_VOICE_ID=your_production_brand_voice_id

# URL de l'API
COPYAI_BASE_URL=https://api.copy.ai
```

## Obtention de la clé API Copy.ai

### 1. Créer un compte Copy.ai
- Rendez-vous sur [copy.ai](https://copy.ai)
- Créez un compte ou connectez-vous
- Accédez à votre tableau de bord

### 2. Générer une clé API
- Dans votre tableau de bord, allez dans "Settings" > "API"
- Cliquez sur "Generate New API Key"
- Copiez la clé générée (elle ne sera plus visible après)

### 3. Vérifier les permissions
Assurez-vous que votre clé API a les permissions suivantes :
- ✅ Génération de contenu
- ✅ Lecture des projets
- ✅ Lecture des voix de marque
- ✅ Lecture de l'usage

## Configuration des projets et voix de marque

### 1. Créer un projet par défaut
```typescript
// Dans votre code d'initialisation
const copyAIService = new CopyAIService({
  apiKey: process.env.COPYAI_API_KEY!,
  defaultProjectId: 'your_project_id',
  defaultBrandVoiceId: 'your_brand_voice_id',
});

// Créer un projet
const project = await copyAIService.createProject({
  name: 'Mon Projet Marketing',
  description: 'Projet principal pour la génération de contenu marketing',
  industry: 'SaaS',
  targetAudience: 'Entrepreneurs et PME',
  brandVoice: 'Professionnel et amical',
});

console.log('Projet créé:', project.id);
```

### 2. Configurer une voix de marque
```typescript
// Créer une voix de marque personnalisée
const brandVoice = await copyAIService.createBrandVoice({
  name: 'Voix de Marque Crealia',
  description: 'Style professionnel et engageant pour Crealia',
  characteristics: ['professionnel', 'amical', 'persuasif', 'innovant'],
  examples: [
    'Transformez votre entreprise avec nos solutions innovantes',
    'Découvrez comment simplifier votre gestion quotidienne',
  ],
  industry: 'SaaS',
});

console.log('Voix de marque créée:', brandVoice.id);
```

## Vérification de la configuration

### 1. Test de connectivité
```bash
# Test de l'API
curl -X GET "http://localhost:3000/api/copy/generate" \
  -H "Content-Type: application/json"
```

### 2. Test de génération
```bash
# Test de génération de contenu
curl -X POST "http://localhost:3000/api/copy/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Une publicité pour un logiciel de gestion de projet",
    "format": "ad_copy",
    "tone": "persuasive",
    "length": "short"
  }'
```

## Sécurité et bonnes pratiques

### 1. Protection de la clé API
- ✅ Jamais exposer la clé API dans le code frontend
- ✅ Utiliser des variables d'environnement
- ✅ Chiffrer les clés en production
- ✅ Rotation régulière des clés

### 2. Gestion des quotas
```typescript
// Vérifier l'usage avant génération
const usage = await copyAIService.getUsage();
if (usage.remainingCredits < 100) {
  throw new Error('Quota insuffisant');
}
```

### 3. Rate limiting
```typescript
// Implémenter un rate limiting côté client
const rateLimiter = {
  lastRequest: 0,
  minInterval: 1000, // 1 seconde entre les requêtes
  
  async waitForNextRequest() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
  }
};
```

## Monitoring et alertes

### 1. Logs de l'API
```typescript
// Ajouter des logs détaillés
console.log('Copy.ai API Request:', {
  endpoint: '/v1/generate',
  params: request,
  timestamp: new Date().toISOString(),
  userId: request.userId, // si applicable
});
```

### 2. Métriques de performance
```typescript
// Mesurer les performances
const startTime = Date.now();
const result = await copyAIService.generateContent(request);
const processingTime = Date.now() - startTime;

console.log('Copy.ai Performance:', {
  processingTime,
  success: result.success,
  contentLength: result.content?.length || 0,
});
```

### 3. Alertes de quota
```typescript
// Vérifier régulièrement l'usage
setInterval(async () => {
  try {
    const usage = await copyAIService.getUsage();
    if (usage.remainingCredits < 500) {
      // Envoyer une alerte
      console.warn('Quota Copy.ai faible:', usage.remainingCredits);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du quota:', error);
  }
}, 60 * 60 * 1000); // Vérifier toutes les heures
```

## Dépannage

### Erreurs courantes

#### 1. "Service Copy.ai non disponible"
```bash
# Vérifier la variable d'environnement
echo $COPYAI_API_KEY

# Vérifier le fichier .env.local
cat .env.local | grep COPYAI
```

#### 2. "Limite de taux dépassée"
```typescript
// Implémenter un backoff exponentiel
const backoff = {
  delay: 1000,
  maxDelay: 30000,
  
  async wait() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    this.delay = Math.min(this.delay * 2, this.maxDelay);
  },
  
  reset() {
    this.delay = 1000;
  }
};
```

#### 3. "Quota API épuisé"
```typescript
// Vérifier l'usage et planifier la régénération
const usage = await copyAIService.getUsage();
const resetDate = new Date(usage.lastReset);
const now = new Date();

if (now > resetDate) {
  // Le quota a été réinitialisé
  console.log('Quota réinitialisé, prêt pour de nouvelles requêtes');
} else {
  // Attendre la réinitialisation
  const timeUntilReset = resetDate.getTime() - now.getTime();
  console.log(`Quota réinitialisé dans ${Math.ceil(timeUntilReset / 1000 / 60)} minutes`);
}
```

## Support et ressources

### Documentation officielle
- [Copy.ai API Documentation](https://docs.copy.ai/)
- [API Reference](https://docs.copy.ai/reference)
- [Best Practices](https://docs.copy.ai/best-practices)

### Support communautaire
- [Copy.ai Community](https://community.copy.ai/)
- [GitHub Issues](https://github.com/copy-ai/copy-ai-js/issues)

### Contact support
- Email: support@copy.ai
- Chat: Disponible sur copy.ai
- Téléphone: Selon votre plan
