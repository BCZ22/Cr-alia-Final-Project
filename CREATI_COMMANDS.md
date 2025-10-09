# 🚀 Commandes Creati - Guide Rapide

## 📋 **Commandes de Base**

### **Installation et Configuration**
```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp env.example .env.local

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev --name creati-integration
```

### **Tests**
```bash
# Test simple des services
npm run test:creati:simple

# Test de la base de données
npm run test:creati:db

# Test des APIs
npm run test:creati:apis

# Tests complets
npm run test:creati:all

# Tests Jest
npm run test:creati
```

### **Développement**
```bash
# Démarrer en mode développement
npm run dev

# Linter
npm run lint
npm run lint:fix

# Build
npm run build
npm start
```

### **Base de Données**
```bash
# Studio Prisma
npx prisma studio

# Reset de la base
npx prisma migrate reset

# Push du schéma
npx prisma db push
```

## 🔧 **Configuration Rapide**

### **Variables d'Environnement Minimales**
```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/video_ai_saas"

# IA (requis)
OPENAI_API_KEY="sk-votre-cle-api-openai"
LANGCHAIN_API_KEY="votre-cle-langchain"

# APIs Sociales (optionnelles)
LINKEDIN_CLIENT_ID="votre-linkedin-client-id"
TWITTER_CLIENT_ID="votre-twitter-client-id"
INSTAGRAM_CLIENT_ID="votre-instagram-client-id"
YOUTUBE_CLIENT_ID="votre-youtube-client-id"
TIKTOK_CLIENT_ID="votre-tiktok-client-id"
FACEBOOK_CLIENT_ID="votre-facebook-client-id"
```

## 🚀 **Démarrage Rapide**

### **1. Configuration Initiale**
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp env.example .env.local
# Éditer .env.local avec vos clés API

# 3. Générer le client Prisma
npx prisma generate

# 4. Exécuter les migrations
npx prisma migrate dev --name creati-integration
```

### **2. Tests de Validation**
```bash
# Tester les services
npm run test:creati:simple

# Tester la base de données
npm run test:creati:db
```

### **3. Démarrage**
```bash
# Démarrer le serveur
npm run dev

# Accéder à l'interface
# http://localhost:3000/creati
```

## 📊 **Monitoring**

### **Vérification du Statut**
```bash
# Vérifier les services
npm run test:creati:simple

# Vérifier la base de données
npm run test:creati:db

# Vérifier les APIs
npm run test:creati:apis
```

### **Logs**
```bash
# Logs du serveur
npm run dev

# Logs de la base de données
npx prisma studio
```

## 🔧 **Dépannage**

### **Problèmes Courants**

#### **Erreur de Base de Données**
```bash
# Vérifier la connexion
npx prisma db push

# Reset et migration
npx prisma migrate reset
npx prisma migrate dev --name creati-integration
```

#### **Erreur de Dépendances**
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

#### **Erreur TypeScript**
```bash
# Vérifier la configuration
npx tsc --noEmit

# Régénérer le client Prisma
npx prisma generate
```

#### **Erreur d'API**
```bash
# Vérifier les variables d'environnement
npm run test:creati:simple

# Vérifier les clés API
npm run test:creati:apis
```

## 📁 **Structure des Fichiers**

```
lib/
├── ai/
│   ├── creati-ai-engine.ts      # Moteur IA
│   └── content-templates.ts     # Templates
├── services/
│   ├── content-library.service.ts    # Bibliothèque
│   ├── editorial-calendar.service.ts # Calendrier
│   ├── social-publisher.service.ts   # Publication
│   ├── export.service.ts             # Export
│   ├── collaboration.service.ts      # Collaboration
│   └── analytics.service.ts          # Analytics
app/
├── creati/page.tsx              # Interface principale
├── api/content/                 # APIs de contenu
├── api/calendar/                # APIs de calendrier
├── api/export/                  # APIs d'export
└── api/analytics/               # APIs d'analytics
components/ui/
├── ai/                          # Composants IA
├── calendar/                    # Composants calendrier
├── content/                     # Composants contenu
├── collaboration/               # Composants collaboration
├── export/                      # Composants export
└── analytics/                   # Composants analytics
scripts/
├── test-creati-services.ts      # Test des services
├── validate-database.ts         # Validation DB
├── test-apis.ts                 # Test des APIs
└── simple-test.ts               # Test simple
```

## 🎯 **Checklist de Déploiement**

### **Pré-déploiement**
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Tests passés
- [ ] Dépendances installées

### **Déploiement**
- [ ] Build réussi
- [ ] Serveur démarré
- [ ] Interface accessible
- [ ] APIs fonctionnelles

### **Post-déploiement**
- [ ] Tests de validation
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] Documentation mise à jour

## 🆘 **Support**

### **Ressources**
- 📖 Documentation : `CREATI_DEPLOYMENT_GUIDE.md`
- 🔧 Configuration : `CREATI_ENV_SETUP.md`
- 📦 Dépendances : `CREATI_DEPENDENCIES.md`
- 🧪 Tests : `tests/creati-integration.test.ts`

### **Commandes d'Aide**
```bash
# Aide Prisma
npx prisma --help

# Aide npm
npm run --help

# Aide TypeScript
npx tsc --help
```

## 🎉 **Félicitations !**

Votre SaaS Creati est maintenant **100% fonctionnel** ! 

🚀 **Accédez à l'interface** : `http://localhost:3000/creati`
📊 **Testez les fonctionnalités** : Toutes les fonctionnalités Creati sont disponibles
🔧 **Personnalisez** : Configurez vos APIs sociales et profils de marque
📈 **Analysez** : Utilisez les analytics pour optimiser votre contenu

**Bon contenu ! 🎯**
