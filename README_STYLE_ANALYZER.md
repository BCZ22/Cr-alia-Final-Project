# 🎯 Analyseur de Style et Lisibilité - Crealia

Un outil intelligent d'analyse de style et de lisibilité intégré dans votre SaaS, conçu pour améliorer la clarté et l'impact de vos textes.

## ✨ Fonctionnalités Principales

### 🔍 Analyse Automatique
- **Détection de la voix passive** : Identifie et suggère des alternatives actives
- **Phrases longues** : Repère les phrases complexes et propose des divisions
- **Mots complexes** : Détecte le vocabulaire difficile et suggère des synonymes
- **Adverbes inutiles** : Identifie les adverbes qui n'ajoutent pas de valeur
- **Verbes faibles** : Repère les verbes peu expressifs et suggère des alternatives

### 📊 Métriques de Lisibilité
- **Score Flesch-Kincaid** : Indice de lisibilité standard
- **Indice Gunning Fog** : Mesure de la complexité du texte
- **Score Coleman-Liau** : Évaluation du niveau de lecture
- **Indice SMOG** : Mesure de la lisibilité pour la santé
- **Score ARI** : Indice de lisibilité automatisé

### 🎨 Interface Visuelle
- **Surlignages colorés** : Chaque type de problème a sa couleur
- **Score global** : Évaluation générale du style (0-100)
- **Statistiques détaillées** : Compteurs de mots, phrases, paragraphes
- **Suggestions cliquables** : Recommandations d'amélioration avec exemples

## 🚀 Installation et Configuration

### 1. Dépendances

```bash
npm install zod
```

### 2. Variables d'Environnement

Créez un fichier `.env.local` :

```bash
# Configuration de base
HEMINGWAY_API_URL=https://api.hemingwayapp.com
HEMINGWAY_API_KEY=your_api_key_here

# Limites et performance
STYLE_ANALYZER_RATE_LIMIT=100
STYLE_ANALYZER_CACHE_SIZE=1000
STYLE_ANALYZER_TIMEOUT=10000
STYLE_ANALYZER_MAX_RETRIES=3

# Sécurité
STYLE_ANALYZER_SECRET_KEY=your_secret_key_here
```

### 3. Structure des Fichiers

```
├── lib/services/
│   └── styleService.ts          # Service principal d'analyse
├── app/api/style/
│   └── analyze/
│       └── route.ts             # Route API Next.js
├── components/
│   └── StyleAnalyzer.tsx        # Composant React principal
├── app/style-analyzer/
│   └── page.tsx                 # Page de démonstration
└── tests/
    └── style-service.test.ts    # Tests unitaires
```

## 🔧 Utilisation

### API Backend

```typescript
import { styleService } from '@/lib/services/styleService';

// Analyse basique
const result = await styleService.analyzeStyle({
  text: 'Votre texte à analyser...',
  language: 'fr'
});

// Analyse avec options personnalisées
const result = await styleService.analyzeStyle({
  text: 'Votre texte...',
  language: 'fr',
  options: {
    includePassive: true,
    includeAdverbs: true,
    includeComplexWords: true,
    includeLongSentences: true,
    includeWordiness: true,
    includeWeakVerbs: true
  }
});
```

### Route API

```bash
POST /api/style/analyze
Content-Type: application/json

{
  "text": "Votre texte à analyser...",
  "language": "fr",
  "options": {
    "includePassive": true,
    "includeAdverbs": true,
    "includeComplexWords": true,
    "includeLongSentences": true,
    "includeWordiness": true,
    "includeWeakVerbs": true
  }
}
```

### Composant React

```tsx
import StyleAnalyzer from '@/components/StyleAnalyzer';

export default function MyPage() {
  return (
    <div>
      <StyleAnalyzer />
    </div>
  );
}
```

## 📊 Format des Résultats

### StyleAnalysisResult

```typescript
interface StyleAnalysisResult {
  score: number;                    // Score global (0-100)
  readability: ReadabilityScore;    // Scores de lisibilité
  issues: StyleIssue[];            // Problèmes détectés
  suggestions: StyleSuggestion[];   // Suggestions d'amélioration
  statistics: TextStatistics;      // Statistiques du texte
  highlights: TextHighlight[];     // Surlignages visuels
}
```

### Exemple de Réponse

```json
{
  "success": true,
  "data": {
    "score": 75,
    "readability": {
      "fleschKincaid": 78.5,
      "gunningFog": 12.3,
      "colemanLiau": 8.9,
      "smog": 6.2,
      "automatedReadability": 7.1,
      "average": 22.8,
      "grade": "8ème-9ème année"
    },
    "issues": [
      {
        "type": "passive",
        "severity": "medium",
        "message": "Voix passive détectée",
        "position": {
          "start": 0,
          "end": 35,
          "line": 1
        },
        "suggestion": "Transformez en voix active pour plus de clarté."
      }
    ],
    "suggestions": [
      {
        "category": "Voix passive",
        "description": "Transformez les phrases passives en phrases actives...",
        "examples": [
          "Passif: \"Le rapport a été rédigé\" → Actif: \"L'équipe a rédigé le rapport\""
        ],
        "priority": "medium"
      }
    ],
    "statistics": {
      "wordCount": 150,
      "sentenceCount": 8,
      "paragraphCount": 3,
      "averageWordsPerSentence": 18.75,
      "averageSyllablesPerWord": 1.8,
      "complexWords": 12,
      "passiveSentences": 2,
      "adverbCount": 5
    },
    "highlights": [
      {
        "type": "passive",
        "text": "Le rapport a été rédigé",
        "start": 0,
        "end": 35,
        "color": "#FF6B6B",
        "tooltip": "Voix passive détectée"
      }
    ]
  },
  "metadata": {
    "processingTime": "45ms",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "textLength": 150,
    "language": "fr"
  }
}
```

## 🎨 Personnalisation

### Couleurs des Surlignages

```typescript
// Personnalisez les couleurs dans le composant
const highlightColors = {
  passive: '#FF6B6B',        // Rouge pour la voix passive
  adverb: '#FFD93D',         // Jaune pour les adverbes
  complex: '#6BCF7F',        // Vert pour les mots complexes
  'long-sentence': '#4ECDC4', // Cyan pour les phrases longues
  wordy: '#45B7D1',          // Bleu pour la verbosité
  'weak-verb': '#96CEB4'     // Vert clair pour les verbes faibles
};
```

### Options d'Analyse

```typescript
const analysisOptions = {
  includePassive: true,        // Détecter la voix passive
  includeAdverbs: true,        // Détecter les adverbes
  includeComplexWords: true,   // Détecter les mots complexes
  includeLongSentences: true,  // Détecter les phrases longues
  includeWordiness: true,      // Détecter la verbosité
  includeWeakVerbs: true       // Détecter les verbes faibles
};
```

## 🧪 Tests

### Exécution des Tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm run test:style

# Tests avec couverture
npm run test:style:coverage

# Tests en mode watch
npm run test:style:watch
```

### Tests Disponibles

- ✅ Analyse de base
- ✅ Détection de la voix passive
- ✅ Détection des phrases longues
- ✅ Détection des mots complexes
- ✅ Détection des adverbes
- ✅ Calcul des scores de lisibilité
- ✅ Gestion des options d'analyse
- ✅ Validation des paramètres
- ✅ Gestion des limites de taux
- ✅ Performance et cache
- ✅ Suggestions d'amélioration

## 🔒 Sécurité

### Protection des Données

- **Validation stricte** : Tous les paramètres sont validés avec Zod
- **Limites de taux** : Protection contre l'abus de l'API
- **Cache sécurisé** : Les données sensibles ne sont pas stockées
- **Variables d'environnement** : Clés API jamais exposées au frontend

### Bonnes Pratiques

- Utilisez HTTPS en production
- Configurez des limites de taux appropriées
- Surveillez l'utilisation de l'API
- Implémentez une authentification si nécessaire

## 📈 Performance

### Optimisations

- **Cache intelligent** : Mise en cache des résultats d'analyse
- **Analyse locale** : Pas de dépendance externe pour l'analyse de base
- **Limites de taux** : Protection contre la surcharge
- **Traitement asynchrone** : Non-bloquant pour l'interface utilisateur

### Métriques

- **Temps de réponse** : < 100ms pour les textes courts
- **Throughput** : Jusqu'à 100 requêtes par minute
- **Mémoire** : Cache configurable selon les besoins
- **Scalabilité** : Architecture extensible

## 🔧 Maintenance

### Surveillance

```typescript
// Obtenir les statistiques d'utilisation
const stats = styleService.getUsageStats();
console.log('Requêtes:', stats.requestCount);
console.log('Taille du cache:', stats.cacheSize);

// Nettoyer le cache
styleService.clearCache();
```

### Logs et Debug

```bash
# Activer les logs détaillés
STYLE_ANALYZER_DEBUG=true

# Surveiller les performances
npm run dev
# Regardez la console pour les métriques
```

## 🚀 Déploiement

### Production

```bash
# Build de production
npm run build

# Démarrage
npm start

# Variables d'environnement
NODE_ENV=production
HEMINGWAY_API_KEY=your_production_key
STYLE_ANALYZER_RATE_LIMIT=100
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  style-analyzer:
    build: .
    environment:
      - NODE_ENV=production
      - HEMINGWAY_API_KEY=${HEMINGWAY_API_KEY}
    ports:
      - "3000:3000"
```

## 🔮 Extensibilité

### Support d'Autres Outils

L'architecture est conçue pour supporter facilement d'autres outils d'écriture :

```typescript
// Interface pour les analyseurs externes
interface ExternalAnalyzer {
  analyze(text: string): Promise<AnalysisResult>;
  getCapabilities(): AnalyzerCapabilities;
}

// Implémentation pour Grammarly
class GrammarlyAnalyzer implements ExternalAnalyzer {
  // Implémentation spécifique
}

// Implémentation pour ProWritingAid
class ProWritingAidAnalyzer implements ExternalAnalyzer {
  // Implémentation spécifique
}
```

### Plugins et Extensions

```typescript
// Système de plugins
class StyleAnalyzerPlugin {
  name: string;
  version: string;
  analyze(text: string, context: AnalysisContext): Promise<PluginResult>;
}

// Enregistrement des plugins
styleService.registerPlugin(new CustomAnalyzerPlugin());
```

## 📚 Ressources

### Documentation

- [Guide de configuration](STYLE_ANALYZER_ENV_SETUP.md)
- [Tests unitaires](tests/style-service.test.ts)
- [API Reference](app/api/style/analyze/route.ts)

### Outils Similaires

- [Hemingway Editor](https://hemingwayapp.com/)
- [Grammarly](https://www.grammarly.com/)
- [ProWritingAid](https://prowritingaid.com/)
- [Readable](https://readable.com/)

### Standards de Lisibilité

- [Flesch-Kincaid](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests)
- [Gunning Fog](https://en.wikipedia.org/wiki/Gunning_fog_index)
- [Coleman-Liau](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index)
- [SMOG](https://en.wikipedia.org/wiki/SMOG)

## 🤝 Contribution

### Développement

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Standards de Code

- **TypeScript strict** : Utilisez le mode strict
- **ESLint** : Respectez les règles de linting
- **Tests** : Ajoutez des tests pour les nouvelles fonctionnalités
- **Documentation** : Mettez à jour la documentation

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

### Problèmes Courants

1. **Variables d'environnement non chargées**
   - Vérifiez que `.env.local` existe
   - Redémarrez le serveur de développement

2. **Limites de taux dépassées**
   - Augmentez `STYLE_ANALYZER_RATE_LIMIT`
   - Implémentez un système de backoff

3. **Performance lente**
   - Vérifiez la taille du cache
   - Optimisez les textes longs

### Contact

- **Issues** : [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation** : [Wiki](https://github.com/your-repo/wiki)
- **Email** : support@yourcompany.com

---

**🎉 Félicitations !** Votre analyseur de style est maintenant prêt à améliorer la qualité de vos textes et à offrir une meilleure expérience utilisateur à vos clients.
