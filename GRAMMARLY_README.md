# 🚀 Intégration Grammarly API - Crealia SaaS

Une intégration complète et professionnelle de l'API Grammarly pour la correction grammaticale et stylistique avancée dans votre SaaS.

## ✨ Fonctionnalités

- 🔍 **Vérification grammaticale en temps réel** avec l'API Grammarly
- ✏️ **Corrections d'orthographe et de ponctuation** avec suggestions contextuelles
- 💡 **Suggestions de style** pour améliorer la clarté et la concision
- 🌍 **Support multi-langues** (EN, FR, ES, DE)
- 🎯 **Niveaux d'analyse** : Basique, Avancé, Expert
- ⚡ **Interface utilisateur moderne** avec React/Next.js
- 🔒 **Sécurité maximale** : clés API jamais exposées côté frontend
- 📊 **Métriques et analytics** intégrés
- 🚀 **Architecture extensible** pour d'autres providers NLP

## 🏗️ Architecture

```
Frontend (React) → API Route → Grammar Service → Grammarly API
     ↓                ↓            ↓              ↓
Interface UI    Validation    Business Logic   External API
```

## 🚀 Installation Rapide

### 1. Variables d'environnement

Créez un fichier `.env.local` :

```bash
# Grammarly API Configuration
GRAMMARLY_API_KEY=your_grammarly_api_key_here
GRAMMARLY_BASE_URL=https://api.grammarly.com/v1
GRAMMARLY_TIMEOUT=30000
GRAMMARLY_MAX_RETRIES=3
GRAMMARLY_RETRY_DELAY=1000
GRAMMARLY_LANGUAGE=en-US
GRAMMARLY_DIALECT=american
GRAMMARLY_STYLE=business
```

### 2. Installation des dépendances

```bash
npm install
# ou
yarn install
```

### 3. Démarrage du serveur

```bash
npm run dev
# ou
yarn dev
```

### 4. Test de l'intégration

Visitez `http://localhost:3000/grammar-checker` pour tester le composant.

## 📖 Utilisation

### Composant React

```tsx
import { GrammarChecker } from '@/components/ui/grammar-checker';

function MyPage() {
  return (
    <GrammarChecker
      initialText="Votre texte initial..."
      onTextChange={(text) => console.log('Texte modifié:', text)}
      onCorrectionsApplied={(correctedText) => console.log('Corrections appliquées:', correctedText)}
    />
  );
}
```

### Service Backend

```typescript
import { GrammarServiceFactory } from '@/lib/services/grammar-service';

const grammarService = GrammarServiceFactory.createGrammarlyService({
  apiKey: process.env.GRAMMARLY_API_KEY!,
  language: 'fr-FR',
  style: 'business',
});

const result = await grammarService.checkGrammar({
  text: "Votre texte à vérifier",
  includeExplanations: true,
  includeSuggestions: true,
});
```

### API REST

```bash
# Vérification grammaticale
POST /api/grammar/check
Content-Type: application/json

{
  "text": "Votre texte à vérifier",
  "language": "fr-FR",
  "style": "business",
  "level": "advanced",
  "includeExplanations": true,
  "includeSuggestions": true,
  "autoCorrect": false
}

# Informations sur le service
GET /api/grammar/check
```

## 🎨 Interface Utilisateur

Le composant `GrammarChecker` offre une interface moderne et intuitive :

- **Zone de saisie** avec compteur de caractères et mots
- **Panneau de résultats** avec corrections et suggestions
- **Scores de qualité** (global et lisibilité)
- **Application des corrections** individuelle ou en lot
- **Personnalisation** : langue, style, niveau d'analyse
- **Vérification automatique** avec debouncing (2s)

## 🔧 Configuration Avancée

### Styles de rédaction

```typescript
type WritingStyle = 'academic' | 'business' | 'technical' | 'creative' | 'casual';
```

### Niveaux d'analyse

```typescript
type AnalysisLevel = 'basic' | 'advanced' | 'expert';
```

### Langues supportées

- 🇺🇸 `en-US` - Anglais (US)
- 🇬🇧 `en-GB` - Anglais (UK)
- 🇫🇷 `fr-FR` - Français
- 🇪🇸 `es-ES` - Espagnol
- 🇩🇪 `de-DE` - Allemand

## 🧪 Tests

### Tests unitaires

```bash
npm test grammar-service.test.ts
```

### Tests d'intégration

```bash
npm run test:integration
```

## 📊 Monitoring et Métriques

### Métriques collectées

- Temps de traitement des requêtes
- Nombre de corrections trouvées
- Taux d'erreur et de succès
- Utilisation des tokens API
- Performance et latence

### Logs

```typescript
// Exemple de log
console.log('Grammar check completed:', {
  textLength: text.length,
  issuesFound: result.summary.totalIssues,
  processingTime: result.metadata?.processingTime,
  provider: 'grammarly',
});
```

## 🔒 Sécurité

- **Clés API** stockées dans les variables d'environnement
- **Validation stricte** des entrées utilisateur
- **Sanitisation** des données
- **Rate limiting** configurable
- **HTTPS** obligatoire en production

## 🚀 Déploiement

### Production

```bash
# Build
npm run build

# Démarrage
npm start
```

### Variables d'environnement de production

```bash
NODE_ENV=production
GRAMMARLY_API_KEY=prod_key_here
GRAMMARLY_TIMEOUT=60000
GRAMMARLY_MAX_RETRIES=5
```

## 🔄 Extensibilité

L'architecture modulaire permet d'ajouter facilement d'autres providers :

```typescript
// Exemple avec Cohere
class CohereGrammarService implements GrammarProvider {
  async checkGrammar(request: GrammarCheckRequest): Promise<GrammarCheckResponse> {
    // Implémentation Cohere
  }
}

// Enregistrement
unifiedService.registerProvider('cohere', new CohereGrammarService());
```

## 📚 Documentation Complète

Pour une documentation technique détaillée, consultez :
- [Documentation technique](./docs/GRAMMARLY_INTEGRATION.md)
- [Tests unitaires](./tests/grammar-service.test.ts)
- [Composant UI](./components/ui/grammar-checker.tsx)

## 🤝 Support

### Problèmes courants

1. **Clé API invalide** : Vérifiez `GRAMMARLY_API_KEY` dans `.env.local`
2. **Timeout** : Augmentez `GRAMMARLY_TIMEOUT` si nécessaire
3. **Quota dépassé** : Vérifiez vos limites API Grammarly

### Contact

- 📧 Support technique : [votre-email@domaine.com]
- 📖 Documentation : [lien-vers-docs]
- 🐛 Issues : [lien-vers-github]

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Grammarly](https://grammarly.com) pour leur API de qualité
- [Next.js](https://nextjs.org) pour le framework
- [React](https://reactjs.org) pour l'interface utilisateur
- [Tailwind CSS](https://tailwindcss.com) pour le styling

---

**⭐ N'oubliez pas de mettre une étoile si ce projet vous a été utile !**
