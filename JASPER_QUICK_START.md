# 🚀 Démarrage Rapide - Intégration Jasper AI

## ⚡ Installation en 5 Minutes

### 1. Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Configuration Jasper AI
JASPER_API_KEY=your_jasper_api_key_here
JASPER_TIMEOUT=30000
JASPER_MAX_RETRIES=3
JASPER_RETRY_DELAY=1000

# Cache et Rate Limiting
JASPER_CACHE_ENABLED=true
JASPER_RATE_LIMIT_ENABLED=true
```

### 2. Test de l'Intégration

```bash
# Test complet de l'intégration
npm run test:jasper

# Ou directement avec tsx
tsx scripts/test-jasper-integration.ts
```

### 3. Démarrage de l'Application

```bash
# Démarrage en mode développement
npm run dev

# Accédez à la démo Jasper
# http://localhost:3000/jasper-demo
```

## 🎯 Utilisation Rapide

### Génération de Contenu Simple

```typescript
import JasperService from '@/lib/services/jasper-service';

const jasper = new JasperService({
  apiKey: process.env.JASPER_API_KEY!,
});

// Génération d'un post LinkedIn
const result = await jasper.generateSocialMediaContent({
  platform: 'linkedin',
  prompt: 'Crée un post sur l\'innovation en entreprise',
  tone: 'professional',
  style: 'informative',
  length: 'medium',
});
```

### Utilisation de l'API

```bash
# Test de l'endpoint
curl -X POST http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un post LinkedIn sur l\'IA en marketing",
    "format": "social_post",
    "tone": "professional",
    "style": "informative",
    "length": "medium"
  }'
```

## 🔧 Configuration Avancée

### Cache Redis (Optionnel)

```bash
# Installation
npm install redis ioredis

# Configuration
JASPER_CACHE_ENABLED=true
JASPER_CACHE_TTL=3600000
REDIS_URL=redis://localhost:6379
```

### Rate Limiting Personnalisé

```bash
# Limites strictes pour la production
JASPER_REQUESTS_PER_MINUTE=30
JASPER_TOKENS_PER_MINUTE=5000
JASPER_BURST_LIMIT=5
```

## 📱 Interface Utilisateur

L'interface utilisateur est accessible à `/jasper-demo` et inclut :

- ✅ Formulaire de génération complet
- ✅ Sélection du format, ton, style
- ✅ Personnalisation de la longueur
- ✅ Mots-clés et audience cible
- ✅ Affichage des métadonnées
- ✅ Statistiques d'utilisation
- ✅ Export et copie du contenu

## 🚨 Dépannage Rapide

### Erreur "JASPER_API_KEY non configurée"

```bash
# Vérifiez votre fichier .env.local
echo $JASPER_API_KEY

# Ou redémarrez votre serveur
npm run dev
```

### Erreur de Connexion

```bash
# Test de la connexion
npm run test:jasper

# Vérifiez votre clé API
# Assurez-vous qu'elle est valide et active
```

### Performance Lente

```bash
# Activez le cache
JASPER_CACHE_ENABLED=true

# Ajustez les timeouts
JASPER_TIMEOUT=60000
JASPER_MAX_RETRIES=5
```

## 📚 Prochaines Étapes

1. **Personnalisation** : Ajustez les prompts et paramètres
2. **Intégration** : Intégrez dans vos workflows existants
3. **Monitoring** : Configurez les alertes et métriques
4. **Extension** : Ajoutez d'autres LLMs (Claude, Cohere)

## 🆘 Support

- **Documentation complète** : `docs/JASPER_INTEGRATION.md`
- **Configuration** : `JASPER_ENV_SETUP.md`
- **Tests** : `scripts/test-jasper-integration.ts`
- **Démo** : `/jasper-demo`

---

**Temps estimé** : 5 minutes  
**Niveau** : Débutant  
**Prérequis** : Clé API Jasper valide
