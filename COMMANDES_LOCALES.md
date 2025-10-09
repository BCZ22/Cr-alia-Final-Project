# Commandes pour Reproduire Localement - Créalia

## Installation et Démarrage

### 1. Installation des dépendances
```bash
# Installer les dépendances (résout les conflits de peer dependencies)
npm install --legacy-peer-deps

# Alternative si problème persistant
npm ci --legacy-peer-deps
```

### 2. Configuration de l'environnement
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer les variables d'environnement (optionnel)
# Les valeurs par défaut fonctionnent en mode mock
```

### 3. Démarrage du serveur de développement
```bash
# Démarrer le serveur de développement
npm run dev

# Le serveur sera accessible sur http://localhost:3000
```

## Tests et Validation

### 1. Tests de build
```bash
# Vérifier que le projet se compile
npm run build

# Démarrer le serveur de production
npm run start
```

### 2. Tests de linting
```bash
# Vérifier le code avec ESLint
npm run lint

# Vérifier les types TypeScript
npm run type-check
```

### 3. Tests unitaires (si configurés)
```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests avec couverture
npm run test:coverage
```

### 4. Tests E2E (si configurés)
```bash
# Lancer les tests E2E
npm run test:e2e

# Lancer les tests E2E avec interface
npm run test:e2e:ui
```

## Pages à Tester

### Pages Principales
- **Accueil :** http://localhost:3000/
- **Pricing :** http://localhost:3000/pricing
- **Connexion :** http://localhost:3000/login
- **Inscription :** http://localhost:3000/register

### Pages Protégées
- **Dashboard :** http://localhost:3000/dashboard (redirige vers login si non connecté)

### Pages Légales
- **Politique de confidentialité :** http://localhost:3000/privacy
- **Conditions d'utilisation :** http://localhost:3000/terms

### Pages Placeholder
- **Studio :** http://localhost:3000/studio
- **Inspiration :** http://localhost:3000/inspiration
- **FAQ :** http://localhost:3000/faq
- **Analytics :** http://localhost:3000/analytics

## Fonctionnalités à Tester

### 1. Navigation
- ✅ Tous les liens de navigation fonctionnent
- ✅ Menu mobile responsive
- ✅ Redirection correcte entre les pages

### 2. Authentification
- ✅ Formulaires de connexion et inscription
- ✅ Validation des champs
- ✅ Gestion des erreurs
- ✅ Redirection après authentification

### 3. Interface Utilisateur
- ✅ Design responsive (mobile/desktop)
- ✅ Composants shadcn/ui fonctionnels
- ✅ Notifications toast
- ✅ Animations et transitions

### 4. Performance
- ✅ Chargement rapide des pages
- ✅ Pas d'erreurs dans la console
- ✅ Build réussi sans erreur

## Dépannage

### Problèmes Courants

#### 1. Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 2. Port déjà utilisé
```bash
# Changer le port
npm run dev -- -p 3001
```

#### 3. Erreurs de build
```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run build
```

#### 4. Erreurs TypeScript
```bash
# Vérifier les types
npm run type-check
```

## Variables d'Environnement

### Configuration Minimale
```env
# Mode mock (recommandé pour le développement)
NEXT_PUBLIC_MOCK_AI=true
MOCK=true

# API Configuration
NEXT_PUBLIC_API_URL=/api

# Clés API (optionnelles en mode mock)
HUGGINGFACE_API_KEY=your-key
REPLICATE_API_KEY=your-key
STABILITY_API_KEY=your-key
OPENAI_API_KEY=your-key

# Stripe (optionnel)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Structure du Projet

```
crealia/
├── app/                    # Pages Next.js
├── components/             # Composants UI
├── lib/                    # Logique métier
├── tests/                  # Tests E2E
├── .github/workflows/      # CI/CD
├── public/                 # Assets statiques
├── .env.example           # Variables d'environnement
├── package.json           # Dépendances
├── tailwind.config.js     # Configuration Tailwind
├── tsconfig.json          # Configuration TypeScript
└── README.md              # Documentation
```

## Support

En cas de problème, vérifier :
1. ✅ Node.js version 18+ installé
2. ✅ npm install --legacy-peer-deps exécuté
3. ✅ Port 3000 disponible
4. ✅ Pas d'erreurs dans la console
5. ✅ Fichiers .env.local configurés

---

*Documentation générée le 28 septembre 2025*

