# Configuration des Variables d'Environnement

## Variables d'Environnement Requises

### Base de Données
```env
DATABASE_URL="file:./dev.db"
```

### OpenAI (pour l'IA)
```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

### LinkedIn API
```env
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
LINKEDIN_REDIRECT_URI="http://localhost:3000/api/linkedin/auth/callback"
```

### Stripe (pour les paiements)
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### NextAuth (pour l'authentification)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Redis (pour le cache)
```env
REDIS_URL="redis://localhost:6379"
```

## Configuration LinkedIn

### 1. Créer une application LinkedIn
1. Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Cliquez sur "Create App"
3. Remplissez les informations :
   - App Name: Crealia LinkedIn Integration
   - LinkedIn Page: Votre page LinkedIn
   - App Logo: Logo de votre application

### 2. Configurer les permissions OAuth2
Dans votre application LinkedIn, ajoutez les permissions suivantes :
- `r_liteprofile` - Accès au profil de base
- `r_emailaddress` - Accès à l'email
- `w_member_social` - Publier du contenu
- `r_organization_social` - Accès aux posts d'entreprise
- `w_organization_social` - Publier du contenu d'entreprise

### 3. Configurer les URLs de redirection
Dans les paramètres OAuth2 de votre application LinkedIn :
- Redirect URLs: `http://localhost:3000/api/linkedin/auth/callback`
- Pour la production: `https://votre-domaine.com/api/linkedin/auth/callback`

### 4. Récupérer les identifiants
- Client ID: Copié depuis la page de votre application
- Client Secret: Généré dans les paramètres OAuth2

## Configuration de la Base de Données

### 1. Initialiser Prisma
```bash
npx prisma generate
npx prisma db push
```

### 2. Vérifier la connexion
```bash
npx prisma studio
```

## Configuration du Développement

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

### 3. Vérifier les routes LinkedIn
- `/api/linkedin/auth` - Authentification
- `/api/linkedin/profile` - Profil utilisateur
- `/api/linkedin/posts` - Posts récents
- `/api/linkedin/trends` - Tendances
- `/api/linkedin/generate` - Génération IA

## Sécurité

### Variables sensibles
- Ne jamais commiter les clés API dans le code
- Utiliser des variables d'environnement
- Changer les clés en production

### LinkedIn API
- Respecter les rate limits LinkedIn
- Implémenter la gestion des tokens expirés
- Valider les données reçues

## Production

### Variables de production
```env
NEXTAUTH_URL="https://votre-domaine.com"
LINKEDIN_REDIRECT_URI="https://votre-domaine.com/api/linkedin/auth/callback"
DATABASE_URL="postgresql://..."
```

### Sécurité supplémentaire
- HTTPS obligatoire
- Validation des tokens CSRF
- Rate limiting
- Monitoring des erreurs 