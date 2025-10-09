# 🚀 Intégration Google PaLM API - Guide Rapide

## ⚡ Démarrage en 5 minutes

### 1. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Google PaLM API - OBLIGATOIRE
GOOGLE_PALM_API_KEY=your_api_key_here
GOOGLE_PALM_PROJECT_ID=your_project_id_here

# Configuration optionnelle
GOOGLE_PALM_REGION=us-central1
GOOGLE_PALM_TIMEOUT=30000
GOOGLE_PALM_MAX_RETRIES=3
```

### 2. Obtenir vos clés API

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez un projet ou sélectionnez un existant
3. Générez une clé API
4. Notez votre Project ID

### 3. Installation des dépendances

```bash
npm install uuid
npm install --save-dev @types/uuid
```

### 4. Test de l'intégration

```bash
# Test unitaire
npm run test:palm

# Test avec couverture
npm run test:ai:coverage

# Test en mode watch
npm run test:ai:watch
```

### 5. Accéder à l'interface

Lancez votre serveur de développement et allez sur :
```
http://localhost:3000/ai-content-generator
```

## 🎯 Fonctionnalités principales

- ✅ **Génération de contenu** : Articles, descriptions produits, posts réseaux sociaux
- ✅ **Interface intuitive** : Formulaire avec options avancées
- ✅ **Gestion des erreurs** : Retry automatique, fallback providers
- ✅ **Cache intelligent** : Mise en cache des requêtes répétées
- ✅ **Rate limiting** : Protection contre la surcharge API
- ✅ **Architecture modulaire** : Extension facile vers d'autres providers AI

## 🔧 Utilisation rapide

### Génération simple

```typescript
import { ContentService } from '@/lib/services/content-service';

const contentService = new ContentService(config);

const result = await contentService.generateContent({
  prompt: "Écrivez un article sur l'IA",
  options: {
    contentType: 'article',
    tone: 'professional',
    language: 'fr',
    maxLength: 1000
  }
});
```

### Méthodes spécialisées

```typescript
// Article
const article = await contentService.generateArticle("L'IA en 2024");

// Description produit
const desc = await contentService.generateProductDescription(
  "Smartphone XYZ", 
  ["Écran 6.7", "Appareil photo 108MP"]
);

// Post réseaux sociaux
const post = await contentService.generateSocialPost(
  "Nouvelle fonctionnalité", 
  'linkedin'
);
```

## 📡 API Endpoints

- `POST /api/ai/content` - Génération de contenu
- `GET /api/ai/content?action=health` - État du service
- `GET /api/ai/content?action=models` - Modèles disponibles
- `GET /api/ai/content?action=cache-stats` - Statistiques du cache

## 🏗️ Architecture

```
Frontend (React) → API Route → ContentService → PaLMService → Google PaLM API
```

## 🚀 Extension vers d'autres providers

L'architecture permet d'ajouter facilement :

- **Claude (Anthropic)**
- **OpenAI (GPT)**
- **Mistral AI**
- **Gemini (Google)**

## 📊 Monitoring

- Métriques de performance
- Statistiques d'usage
- Gestion des erreurs
- Logs détaillés

## 🔒 Sécurité

- Clés API côté serveur uniquement
- Validation des entrées
- Rate limiting
- Sanitisation des contenus

## 🐛 Dépannage

### Erreur "API key not configured"
- Vérifiez votre fichier `.env.local`
- Redémarrez le serveur après modification

### Erreur "Rate limit exceeded"
- Attendez la fin de la période de limitation
- Vérifiez vos quotas Google Cloud

### Erreur "Model not found"
- Utilisez un modèle de fallback
- Vérifiez la disponibilité dans votre région

## 📚 Documentation complète

Consultez `docs/PALM_INTEGRATION.md` pour la documentation détaillée.

## 🤝 Support

- Vérifiez cette documentation
- Consultez les logs du serveur
- Testez avec `/api/ai/content?action=health`
- Contactez l'équipe technique

---

**Prêt à générer du contenu avec l'IA ?** 🎉

Démarrez maintenant avec les étapes ci-dessus !
