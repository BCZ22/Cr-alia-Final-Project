# Documentation Technique - SearchBar & Sidebar Integration

## Vue d'ensemble

Cette documentation décrit l'intégration des composants SearchBar et Sidebar dans la HomePage de Créalia, créant une nouvelle UX moderne et accessible.

## Architecture

### Composants Principaux

1. **MainShell** (`components/Layout/MainShell.tsx`)
   - Layout principal avec Sidebar et Header
   - Gestion responsive (desktop/mobile)
   - Intégration SearchBar dans le header

2. **SearchBar** (`components/ui/SearchBar.tsx`)
   - Recherche avec debounce configurable
   - Dropdown de suggestions avec navigation clavier
   - Panel de filtres intégré
   - Support sticky behavior

3. **Sidebar** (`components/ui/Sidebar.tsx`)
   - Navigation latérale avec items imbriqués
   - Support collapse/expand
   - Tooltips en mode collapsed
   - Mobile drawer

4. **SkipLink** (`components/ui/SkipLink.tsx`)
   - Lien d'accessibilité pour navigation clavier

### Structure des Fichiers

```
/components
  /Layout
    MainShell.tsx          # Layout principal
  /ui
    SearchBar.tsx          # Barre de recherche
    Sidebar.tsx            # Navigation latérale
    SkipLink.tsx           # Lien d'accessibilité
    __tests__/
      SearchBar.test.tsx   # Tests unitaires SearchBar
      Sidebar.test.tsx     # Tests unitaires Sidebar
/stories
  SearchBar.stories.tsx    # Stories Storybook
  Sidebar.stories.tsx      # Stories Storybook
  HomePage.stories.tsx     # Stories HomePage
/e2e
  search-and-navigate.spec.ts  # Tests E2E recherche
  sidebar-navigation.spec.ts   # Tests E2E navigation
```

## APIs des Composants

### SearchBar Props

```typescript
interface SearchBarProps {
  placeholder?: string;                    // Placeholder text
  onSearch: (query: string) => void;      // Callback de recherche
  onSelectSuggestion?: (suggestion) => void; // Callback sélection
  suggestions?: Suggestion[];              // Liste de suggestions
  debounceMs?: number;                    // Délai debounce (défaut: 300ms)
  showFilterButton?: boolean;             // Afficher bouton filtre
  className?: string;                     // Classes CSS additionnelles
}

interface Suggestion {
  id: string;
  label: string;
  type: 'feature' | 'report' | 'idea' | 'activity';
  meta?: any;  // Données additionnelles (href, etc.)
}
```

### Sidebar Props

```typescript
interface SidebarProps {
  items?: SidebarItem[];                  // Items de navigation
  activeId?: string;                      // ID de l'item actif
  collapsed?: boolean;                    // État collapsed
  onToggleCollapse?: () => void;          // Callback toggle collapse
  className?: string;                     // Classes CSS additionnelles
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;                          // Lien de navigation
  badgeCount?: number;                    // Compteur de badge
  children?: SidebarItem[];               // Items enfants
  onClick?: () => void;                   // Callback click
}
```

## Fonctionnalités

### SearchBar

- **Recherche avec debounce** : Évite les appels API excessifs
- **Suggestions intelligentes** : Dropdown avec navigation clavier
- **Highlight du texte** : Mise en évidence des termes recherchés
- **Panel de filtres** : Filtrage par plateforme, module, date
- **Sticky behavior** : Devient sticky au scroll
- **Loading states** : Spinner et états de chargement
- **Accessibilité complète** : ARIA labels, navigation clavier

### Sidebar

- **Navigation hiérarchique** : Support des items imbriqués
- **Mode collapsed** : Affichage icônes uniquement avec tooltips
- **Badges de notification** : Compteurs pour items importants
- **Mobile drawer** : Navigation mobile optimisée
- **Navigation clavier** : Support complet du clavier
- **Auto-détection active** : Détection automatique de l'item actif

### Responsive Design

- **Desktop** : Sidebar fixe + SearchBar dans header
- **Tablet** : Sidebar collapsible + SearchBar responsive
- **Mobile** : Drawer + SearchBar full-width

## Accessibilité (WCAG 2.1 AA)

### SearchBar
- `role="searchbox"` sur l'input
- `aria-expanded` pour le dropdown
- `aria-activedescendant` pour la sélection
- Navigation clavier complète (↑↓ Enter Escape)
- Contraste de couleurs respecté

### Sidebar
- `role="navigation"` sur le container
- `aria-current="page"` sur l'item actif
- `aria-expanded` sur les items avec enfants
- Focus visible sur tous les éléments interactifs
- Support lecteurs d'écran

### Layout
- SkipLink pour navigation clavier
- Structure sémantique correcte
- Focus management approprié

## Performance

### Optimisations
- **Dynamic imports** : Chargement à la demande des composants lourds
- **Debounce** : Réduction des appels API
- **Memoization** : Mise en cache des suggestions
- **Lazy loading** : Chargement progressif
- **Code splitting** : Bundles optimisés

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **Time to Interactive** : < 3.5s

## Analytics & Tracking

### Événements Trackés

```typescript
// SearchBar
trackEvent('search.execute', { query, source: 'header' });
trackEvent('search.suggestion_click', { suggestionId, suggestionType });
trackEvent('header.filter_open', { filtersApplied });

// Sidebar
trackEvent('sidebar.nav_click', { id, label });
trackEvent('sidebar.toggle', { collapsed });
```

### Intégration
- Support Segment/GA4
- Fonction `trackEvent()` centralisée
- Payloads structurés pour analyse

## Tests

### Tests Unitaires (Jest + RTL)
- **SearchBar** : 15 tests couvrant tous les cas d'usage
- **Sidebar** : 12 tests pour navigation et états
- **Couverture** : > 90% pour les composants critiques

### Tests E2E (Playwright)
- **Scénarios de recherche** : Navigation et sélection
- **Scénarios de navigation** : Sidebar desktop/mobile
- **Tests d'accessibilité** : Navigation clavier et lecteurs d'écran

### Tests d'Accessibilité
- **axe-core** : Vérification automatique WCAG
- **Tests manuels** : Navigation clavier, lecteurs d'écran
- **Contraste** : Validation des couleurs

## Storybook

### Stories Disponibles
- **SearchBar** : Default, suggestions, empty state, mobile
- **Sidebar** : Full, collapsed, nested items, mobile
- **HomePage** : Desktop, tablet, mobile previews

### Utilisation
```bash
npm run storybook
# Ouvrir http://localhost:6006
```

## Déploiement

### Build Process
```bash
# Tests
npm run test
npm run test:e2e

# Build
npm run build

# Storybook
npm run build-storybook
```

### Checklist QA
- [ ] Tests unitaires passent
- [ ] Tests E2E passent
- [ ] Storybook stories ajoutées
- [ ] Accessibilité axe-core OK
- [ ] Performance Lighthouse >= 70
- [ ] Responsive design validé
- [ ] Analytics events trackés

## Maintenance

### Ajout de Nouvelles Suggestions
```typescript
// Dans HomePage
const newSuggestions = [
  ...existingSuggestions,
  {
    id: 'new-feature',
    label: 'Nouvelle Fonctionnalité',
    type: 'feature',
    meta: { href: '/new-feature' }
  }
];
```

### Ajout d'Items Sidebar
```typescript
// Dans Sidebar component
const newItems = [
  ...existingItems,
  {
    id: 'new-section',
    label: 'Nouvelle Section',
    icon: <NewIcon className="h-5 w-5" />,
    href: '/new-section',
    badgeCount: 1
  }
];
```

## Support & Debugging

### Logs de Debug
```typescript
// Activer en développement
localStorage.setItem('debug', 'searchbar,sidebar');
```

### Performance Monitoring
- Web Vitals tracking
- Bundle size analysis
- Runtime performance metrics

## Changelog

### v1.0.0 (Initial)
- Intégration SearchBar avec suggestions
- Sidebar avec navigation hiérarchique
- Support responsive complet
- Tests unitaires et E2E
- Documentation complète
- Accessibilité WCAG 2.1 AA
