# 🤝 Guide de Contribution - Créalia

Merci de votre intérêt pour contribuer à Créalia ! Ce guide vous aidera à démarrer.

---

## 📋 Table des Matières

1. [Code of Conduct](#code-of-conduct)
2. [Comment Contribuer](#comment-contribuer)
3. [Process de Développement](#process-de-développement)
4. [Standards de Code](#standards-de-code)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

### Notre Engagement

Nous nous engageons à faire de la participation à notre projet une expérience exempte de harcèlement pour tout le monde.

### Standards

**Comportements encouragés:**
- Utiliser un langage accueillant et inclusif
- Respecter les points de vue différents
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté

**Comportements inacceptables:**
- Langage ou images sexualisés
- Trolling, insultes ou commentaires désobligeants
- Harcèlement public ou privé
- Publication d'informations privées sans permission

---

## 🚀 Comment Contribuer

### Types de Contributions

Nous acceptons les contributions suivantes :

1. **🐛 Bug Fixes** - Corrections de bugs
2. **✨ Features** - Nouvelles fonctionnalités
3. **📝 Documentation** - Améliorations de la documentation
4. **🎨 UI/UX** - Améliorations de l'interface
5. **🧪 Tests** - Ajout ou amélioration de tests
6. **♻️ Refactoring** - Amélioration du code existant
7. **⚡ Performance** - Optimisations

---

## 🔄 Process de Développement

### 1. Fork & Clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/Cr-alia-Final-Project.git
cd Cr-alia-Final-Project

# Ajoutez le remote upstream
git remote add upstream https://github.com/BCZ22/Cr-alia-Final-Project.git
```

### 2. Créer une Branche

```bash
# Créez une branche depuis main
git checkout -b feature/ma-nouvelle-feature

# Ou pour un bug
git checkout -b fix/correction-du-bug
```

**Noms de branches:**
- `feature/` - Nouvelles fonctionnalités
- `fix/` - Corrections de bugs
- `docs/` - Documentation
- `refactor/` - Refactoring
- `test/` - Tests
- `chore/` - Tâches de maintenance

### 3. Installer les Dépendances

```bash
npm install
cp env.example .env.local
# Configurer .env.local
npm run dev
```

### 4. Faire vos Changements

- Écrivez du code propre et lisible
- Suivez les standards de code (voir ci-dessous)
- Ajoutez des tests si nécessaire
- Mettez à jour la documentation

### 5. Tester vos Changements

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Build
npm run build
```

### 6. Commit & Push

```bash
git add .
git commit -m "feat: ajout de la fonctionnalité X"
git push origin feature/ma-nouvelle-feature
```

### 7. Créer une Pull Request

1. Allez sur GitHub
2. Cliquez sur "New Pull Request"
3. Sélectionnez votre branche
4. Remplissez le template de PR
5. Attendez la review

---

## 📏 Standards de Code

### TypeScript

**Utilisez TypeScript strict:**
```typescript
// ✅ Bon
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Mauvais
function getUser(id: any): any {
  // ...
}
```

### Naming Conventions

- **Variables**: camelCase (`userName`, `isActive`)
- **Functions**: camelCase (`getUserById`, `handleSubmit`)
- **Components**: PascalCase (`UserCard`, `NavigationMenu`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`User`, `ApiResponse`)

### File Structure

```typescript
// ✅ Bon - Ordre des imports
import { useState } from 'react'              // React
import { useRouter } from 'next/navigation'   // Next.js
import { prisma } from '@/lib/db/client'      // Internal libs
import { Button } from '@/components/ui/button' // Components
import type { User } from '@/types'           // Types
```

### React Components

```tsx
// ✅ Bon - Composant fonctionnel avec types
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  )
}
```

### API Routes

```typescript
// ✅ Bon - Structure API route
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validation
    // ...

    // 3. Business logic
    // ...

    // 4. Response
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Styling

**Utilisez Tailwind CSS:**
```tsx
// ✅ Bon
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// ❌ Évitez les styles inline
<div style={{ display: 'flex', padding: '24px' }}>
</div>
```

---

## 📝 Commit Guidelines

Nous suivons [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
type(scope): subject

body

footer
```

### Types

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatting (pas de changement de code)
- `refactor`: Refactoring
- `test`: Ajout de tests
- `chore`: Maintenance

### Exemples

```bash
# Feature
git commit -m "feat(chat): add message history pagination"

# Fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs: update setup guide with Stripe config"

# Refactoring
git commit -m "refactor(api): extract Stripe logic to separate service"

# Breaking change
git commit -m "feat(api): change response format

BREAKING CHANGE: API now returns data in a different format"
```

---

## 🔍 Pull Request Process

### Checklist PR

Avant de soumettre votre PR, vérifiez :

- [ ] Le code compile sans erreurs
- [ ] Tous les tests passent
- [ ] Le linter ne remonte pas d'erreurs
- [ ] La documentation est à jour
- [ ] Les commits suivent les conventions
- [ ] Le code respecte les standards
- [ ] Les nouveaux fichiers ont des headers appropriés
- [ ] Aucune information sensible (clés API, etc.)

### Template PR

```markdown
## Description

[Décrivez vos changements]

## Type de changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests

[Comment avez-vous testé ?]

## Screenshots

[Si applicable]

## Checklist

- [ ] Mon code respecte les standards
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests
- [ ] Tous les tests passent
```

### Review Process

1. **Automatic Checks**: CI/CD s'exécute automatiquement
2. **Code Review**: Un mainteneur review votre code
3. **Feedback**: Des changements peuvent être demandés
4. **Approval**: Une fois approuvée, votre PR sera mergée

---

## 🐛 Reporting Bugs

### Avant de Créer un Issue

1. Vérifiez si le bug n'existe pas déjà
2. Utilisez la dernière version
3. Testez en mode incognito (cache/cookies)

### Template Bug Report

```markdown
**Describe the bug**
[Description claire du bug]

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
[Ce qui devrait se passer]

**Screenshots**
[Si applicable]

**Environment:**
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
[Informations supplémentaires]
```

---

## 💡 Suggesting Features

### Template Feature Request

```markdown
**Is your feature request related to a problem?**
[Description du problème]

**Describe the solution you'd like**
[Solution proposée]

**Describe alternatives you've considered**
[Alternatives envisagées]

**Additional context**
[Screenshots, mockups, etc.]
```

---

## 🎯 Areas to Contribute

### High Priority

- 🐛 Bug fixes
- 📝 Documentation improvements
- 🧪 Test coverage
- ♿ Accessibility improvements

### Medium Priority

- ✨ New features (after discussion)
- 🎨 UI/UX improvements
- ⚡ Performance optimizations

### Low Priority

- 🔧 Code refactoring
- 🌐 Translations
- 📱 Mobile responsiveness

---

## 📚 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Tools

- [VS Code](https://code.visualstudio.com/)
- [Prisma Studio](https://www.prisma.io/studio)
- [Postman](https://www.postman.com/)

---

## 💬 Questions ?

- **Discord**: [discord.gg/crealia](https://discord.gg/crealia)
- **Email**: dev@crealia.com
- **GitHub Discussions**: [Discussions](https://github.com/BCZ22/Cr-alia-Final-Project/discussions)

---

## 🏆 Recognition

Les contributeurs réguliers seront ajoutés à la liste des Contributors dans le README.

Merci pour votre contribution ! 🙏

