# 🚀 Intégration Google Cloud Translation API

## 📋 Vue d'ensemble

Cette intégration fournit une solution complète de traduction multilingue utilisant Google Cloud Translation API, avec une interface moderne et des fonctionnalités avancées.

## 🎯 Fonctionnalités

- ✅ **Traduction en temps réel** dans 100+ langues
- ✅ **Détection automatique** de la langue source
- ✅ **Traduction par lots** pour de gros volumes
- ✅ **Support HTML** et texte brut
- ✅ **Modèles NMT** (Neural Machine Translation)
- ✅ **Système de cache** intelligent
- ✅ **Gestion des erreurs** robuste avec retry
- ✅ **Interface utilisateur** moderne et responsive
- ✅ **Historique des traductions** avec recherche
- ✅ **Statistiques détaillées** et insights
- ✅ **Sélecteur de langues** organisé par catégories

## 🛠️ Installation et Configuration

### 1. Prérequis

- Node.js 18+ et npm/yarn
- Compte Google Cloud Platform
- Projet Google Cloud avec Translation API activée
- Clé API Google Cloud

### 2. Variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Google Cloud Translation API Configuration
GOOGLE_TRANSLATE_API_KEY=your_google_cloud_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id_here
GOOGLE_CLOUD_LOCATION=global

# Google Translate Service Configuration
GOOGLE_TRANSLATE_TIMEOUT=30000
GOOGLE_TRANSLATE_MAX_RETRIES=3
GOOGLE_TRANSLATE_RETRY_DELAY=1000
GOOGLE_TRANSLATE_ENABLE_CACHE=true
GOOGLE_TRANSLATE_CACHE_TTL=86400000
GOOGLE_TRANSLATE_MAX_BATCH_SIZE=100
GOOGLE_TRANSLATE_ENABLE_GLOSSARY=false
```

### 3. Configuration Google Cloud

1. **Créer un projet Google Cloud** :
   ```bash
   gcloud projects create [PROJECT_ID]
   gcloud config set project [PROJECT_ID]
   ```

2. **Activer l'API Translation** :
   ```bash
   gcloud services enable translate.googleapis.com
   ```

3. **Créer une clé API** :
   ```bash
   gcloud auth application-default login
   gcloud iam service-accounts create translate-service
   gcloud projects add-iam-policy-binding [PROJECT_ID] \
     --member="serviceAccount:translate-service@[PROJECT_ID].iam.gserviceaccount.com" \
     --role="roles/cloudtranslate.user"
   ```

4. **Générer la clé** :
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=translate-service@[PROJECT_ID].iam.gserviceaccount.com
   ```

## 🏗️ Architecture

### Structure des fichiers

```
├── lib/services/
│   └── gtranslate-service.ts          # Service principal Google Translate
├── app/api/
│   └── gtranslate/
│       └── route.ts                   # Route API Next.js
├── app/translation/
│   └── page.tsx                       # Page principale de traduction
└── components/ui/translation/
    ├── GoogleTranslateWidget.tsx      # Widget principal de traduction
    ├── TranslationHistory.tsx         # Historique des traductions
    ├── TranslationStats.tsx           # Statistiques et métriques
    └── LanguageSelector.tsx           # Sélecteur de langues
```

### Flux de données

```
Frontend → API Route → Google Translate Service → Google Cloud API
    ↓
Cache ← Réponse ← Parsing ← Validation
```

## 🔧 Utilisation

### 1. Service Backend

```typescript
import { GoogleTranslateService } from '@/lib/services/gtranslate-service';

const service = new GoogleTranslateService({
  apiKey: process.env.GOOGLE_TRANSLATE_API_KEY!,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  enableCache: true,
  maxBatchSize: 100
});

// Traduction simple
const result = await service.translate({
  text: "Hello world",
  targetLang: "fr"
});

// Détection de langue
const detection = await service.detectLanguage("Bonjour le monde");
```

### 2. API Endpoints

#### POST `/api/gtranslate` - Traduction
```json
{
  "text": "Hello world",
  "sourceLang": "auto",
  "targetLang": "fr",
  "format": "text",
  "model": "nmt"
}
```

#### GET `/api/gtranslate?action=detect&text=Hello` - Détection
#### GET `/api/gtranslate?action=languages` - Langues supportées
#### GET `/api/gtranslate?action=glossaries` - Glossaires

### 3. Composant Frontend

```typescript
import { GoogleTranslateWidget } from '@/components/ui/translation/GoogleTranslateWidget';

export default function TranslationPage() {
  const handleTranslationComplete = (result) => {
    console.log('Traduction terminée:', result);
  };

  return (
    <GoogleTranslateWidget onTranslationComplete={handleTranslationComplete} />
  );
}
```

## 📊 Fonctionnalités avancées

### Cache intelligent
- TTL configurable (24h par défaut)
- Nettoyage automatique
- Statistiques de performance

### Gestion des erreurs
- Retry automatique avec backoff exponentiel
- Gestion des quotas et timeouts
- Logs détaillés pour le debugging

### Traduction par lots
- Découpage automatique des gros textes
- Limite configurable (100 par défaut)
- Gestion de la mémoire optimisée

### Glossaires personnalisés
- Support des glossaires Google Cloud
- Création et gestion via API
- Intégration transparente

## 🎨 Interface utilisateur

### Widget principal
- Interface en deux colonnes (source/traduction)
- Détection automatique de langue
- Options avancées (format, modèle)
- Traduction instantanée avec délai

### Historique
- Recherche et filtrage
- Tri par date, caractères, temps
- Export et partage
- Statistiques détaillées

### Sélecteur de langues
- Catégorisation par région
- Indicateurs de difficulté
- Recherche avancée
- Informations sur les locuteurs

## 🔒 Sécurité

- Clés API stockées côté serveur uniquement
- Validation des entrées utilisateur
- Limites de caractères (5000 par défaut)
- Rate limiting via Google Cloud
- CORS configuré pour la production

## 📈 Performance

- Cache intelligent avec TTL configurable
- Traduction par lots pour gros volumes
- Lazy loading des composants
- Optimisation des requêtes API
- Monitoring des temps de réponse

## 🧪 Tests

```bash
# Tests unitaires
npm run test:gtranslate

# Tests d'intégration
npm run test:integration

# Tests de charge
npm run test:load
```

## 🚀 Déploiement

### Vercel
```bash
vercel --env GOOGLE_TRANSLATE_API_KEY=your_key
vercel --env GOOGLE_CLOUD_PROJECT_ID=your_project
```

### Docker
```dockerfile
FROM node:18-alpine
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Maintenance

### Monitoring
- Logs des erreurs de traduction
- Métriques de performance
- Utilisation des quotas API
- Santé du service

### Mise à jour
- Vérification des nouvelles langues
- Mise à jour des modèles NMT
- Optimisation des paramètres
- Rotation des clés API

## 📚 Ressources

- [Google Cloud Translation API Documentation](https://cloud.google.com/translate/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🆘 Support

- Issues GitHub pour les bugs
- Discussions pour les questions
- Wiki pour la documentation
- Email pour le support commercial

---

**Développé avec ❤️ par l'équipe Crealia**
