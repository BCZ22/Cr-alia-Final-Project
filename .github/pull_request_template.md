# Pull Request

## Description
<!-- Décrivez clairement les changements apportés -->

## Type de changement
<!-- Cochez les cases appropriées -->

- [ ] 🐛 Bug fix (correction de bug)
- [ ] ✨ New feature (nouvelle fonctionnalité)
- [ ] 💥 Breaking change (modification incompatible avec les versions précédentes)
- [ ] 📝 Documentation update (mise à jour de documentation)
- [ ] 🎨 UI/UX improvement (amélioration de l'interface)
- [ ] ⚡ Performance improvement (optimisation de performance)
- [ ] ♿ Accessibility improvement (amélioration de l'accessibilité)
- [ ] 🔒 Security fix (correction de sécurité)
- [ ] 🧪 Test (ajout ou modification de tests)
- [ ] 🔧 Configuration change (modification de configuration)

## Fonctionnalités / Endpoints créés
<!-- Listez les nouvelles routes, API endpoints, ou fonctionnalités -->

### API Endpoints
```
POST /api/example/endpoint
GET /api/example/endpoint/:id
```

### Pages créées
- `/nouvelle-page` - Description de la page
- `/autre-page` - Description de l'autre page

## Checklist de développement

### Code Quality
- [ ] Le code suit les conventions TypeScript/React
- [ ] Les composants sont bien typés (TypeScript strict mode)
- [ ] Le code est DRY (Don't Repeat Yourself)
- [ ] Les fonctions complexes sont commentées
- [ ] Aucun `console.log` oublié
- [ ] Pas de variables inutilisées
- [ ] ESLint passe sans erreur
- [ ] TypeScript type-check passe sans erreur

### Tests
- [ ] Tests unitaires ajoutés/mis à jour (Jest + RTL)
- [ ] Tests E2E ajoutés si nécessaire (Playwright)
- [ ] Tous les tests passent localement
- [ ] Couverture de code >= 80% pour le code critique
- [ ] Tests d'edge cases inclus

### UI/UX
- [ ] L'UI respecte la direction artistique existante
- [ ] Responsive (mobile, tablette, desktop)
- [ ] Dark mode fonctionnel (si applicable)
- [ ] Animations fluides et performantes
- [ ] Pas de régression visuelle
- [ ] Screenshots before/after joints (si modification UI)

### Accessibilité
- [ ] Tous les éléments interactifs sont accessibles au clavier
- [ ] Aria-labels appropriés
- [ ] Contraste de couleurs >= 4.5:1
- [ ] Images ont des attributs alt
- [ ] Formulaires ont des labels
- [ ] Testé avec lecteur d'écran (si possible)

### Performance
- [ ] Images optimisées (format WebP/AVIF si possible)
- [ ] Code splitting utilisé si pertinent
- [ ] Lazy loading implémenté si applicable
- [ ] Pas de re-renders inutiles
- [ ] Lighthouse score > 90 (desktop)

### Sécurité
- [ ] Pas de secrets/tokens en clair
- [ ] Validation côté serveur pour toutes les entrées
- [ ] Protection CSRF pour les formulaires sensibles
- [ ] Rate limiting sur les endpoints sensibles
- [ ] Authentification/autorisation vérifiée

### API & Backend
- [ ] Endpoints documentés (commentaires TypeScript)
- [ ] Validation des inputs (Zod ou similaire)
- [ ] Gestion d'erreurs appropriée
- [ ] Logs structurés
- [ ] Rate limiting si applicable
- [ ] Mock mode fonctionnel (MOCK=true)

### Base de données
- [ ] Migrations créées (si modifications DB)
- [ ] Seed data fourni (si applicable)
- [ ] Indexes appropriés
- [ ] Pas de N+1 queries

### Documentation
- [ ] README.md mis à jour
- [ ] FEATURE-<name>.md créé (si nouvelle feature majeure)
- [ ] .env.example mis à jour avec nouvelles variables
- [ ] API endpoints documentés
- [ ] Instructions de test incluses

### Variables d'environnement
<!-- Listez toutes les nouvelles variables d'environnement -->

```bash
# Nouvelles variables à ajouter
NEW_API_KEY=your_api_key_here
NEW_SERVICE_URL=https://example.com
```

### Déploiement
- [ ] Build réussit localement (`npm run build`)
- [ ] Déploiement preview Vercel créé
- [ ] Testé sur l'environnement de preview
- [ ] Pas de breaking changes non documentés
- [ ] Instructions de migration incluses (si applicable)

### Mock & Fallbacks
- [ ] Services externes mockables via MOCK=true
- [ ] Fallbacks appropriés si services indisponibles
- [ ] Documentation des mocks fournie

## Comment tester

### Setup
```bash
# Étapes pour setup l'environnement
npm install
cp .env.example .env.local
# Ajouter les variables d'environnement nécessaires
npm run dev
```

### Tests manuels
1. Étape 1
2. Étape 2
3. Étape 3

### Tests automatisés
```bash
# Tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

## Screenshots / Vidéos
<!-- Si modification UI, joindre des screenshots ou vidéos -->

### Before
<!-- Screenshot/vidéo avant -->

### After
<!-- Screenshot/vidéo après -->

## Impact sur les performances
<!-- Décrivez l'impact sur les performances, ou indiquez N/A -->

- [ ] Lighthouse score vérifié
- [ ] Pas de dégradation de performance
- [ ] Bundle size acceptable

## Migration / Breaking Changes
<!-- Si breaking changes, décrivez les étapes de migration -->

### Breaking changes
- [ ] Aucun breaking change
- [ ] Breaking changes documentés ci-dessous

### Instructions de migration
```bash
# Si applicable
```

## Dépendances
<!-- Listez les nouvelles dépendances ajoutées -->

### Packages ajoutés
```json
{
  "new-package": "^1.0.0"
}
```

### Justification
<!-- Pourquoi ces packages sont nécessaires -->

## Issues liées
<!-- Référencez les issues GitHub liées -->

Closes #
Related to #

## Checklist de review
<!-- Pour les reviewers -->

- [ ] Code review effectué
- [ ] Tests passent dans CI
- [ ] Documentation claire
- [ ] Pas de questions non résolues
- [ ] Approuvé pour merge

## Notes additionnelles
<!-- Toute information supplémentaire pertinente -->

---

**Auteur:** @username
**Reviewers:** @reviewer1 @reviewer2
**Date:** YYYY-MM-DD

