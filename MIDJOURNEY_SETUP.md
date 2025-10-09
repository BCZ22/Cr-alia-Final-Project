# 🎨 Intégration Midjourney Complète pour Crealia

## 📋 Vue d'ensemble

Cette intégration Midjourney permet de :
- ✅ **Générer** des visuels artistiques automatiquement à partir d'un brief textuel
- 🎨 **Personnaliser** les styles artistiques (réaliste, cyberpunk, 3D, pictural, etc.)
- 🤖 **Enrichir** les prompts avec GPT-4 pour de meilleurs résultats
- 📱 **Adapter** les images aux formats des réseaux sociaux
- 💾 **Stocker** les images générées sur le serveur
- 📥 **Télécharger** ou réutiliser les images dans le planificateur

## 🏗️ Architecture

### Services principaux
```
lib/
├── midjourney-service.ts         # Service principal Midjourney
└── cache-service.ts             # Cache pour optimiser les appels

app/api/midjourney/
├── generate/                    # Génération d'images
├── associate/                   # Association aux posts
└── delete/                     # Suppression d'images
```

### Composants UI
```
components/ui/midjourney/
├── MidjourneyGenerator.tsx      # Générateur principal
└── MidjourneyGallery.tsx       # Galerie d'images
```

## 🔧 Configuration

### 1. Variables d'environnement
```env
# Midjourney API
MIDJOURNEY_API_URL="https://api.midjourney.com"
MIDJOURNEY_API_KEY="your-midjourney-api-key"

# OpenAI pour l'enrichissement des prompts
OPENAI_API_KEY="sk-your-openai-api-key"

# Stockage des images
UPLOAD_DIR="./public/uploads"
BASE_URL="http://localhost:3000"

# Base de données
DATABASE_URL="file:./dev.db"
```

### 2. Configurer l'API Midjourney
1. **Option 1 - Midjourney Proxy** :
   - Déployer [Midjourney Proxy](https://github.com/novicezk/midjourney-proxy)
   - Configurer les tokens Discord
   - Utiliser l'endpoint `/imagine`

2. **Option 2 - Service tiers** :
   - Utiliser [MJ API](https://mj-api.com) ou similaire
   - Configurer l'authentification API
   - Adapter les endpoints selon le service

3. **Option 3 - Discord Bot** :
   - Créer un bot Discord avec accès Midjourney
   - Configurer les webhooks pour les réponses
   - Gérer les interactions via Discord API

### 3. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
```

## 🚀 Utilisation

### 1. Génération d'image simple
```typescript
const response = await fetch('/api/midjourney/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    prompt: "post Instagram sur les bienfaits du jeûne intermittent",
    style: "realistic",
    aspectRatio: "4:5",
    enhancePrompt: true
  })
});
```

### 2. Vérifier le statut d'une génération
```typescript
const response = await fetch('/api/midjourney/generate?userId=1&type=status&jobId=job_id');
const data = await response.json();
console.log(data.status);
```

### 3. Récupérer les styles disponibles
```typescript
const response = await fetch('/api/midjourney/generate?userId=1&type=styles');
const data = await response.json();
console.log(data.styles);
```

## 📊 Fonctionnalités

### 🎨 Styles artistiques disponibles
- **Réaliste** : Rendu photoréaliste et détaillé
- **Artistique** : Style créatif et expressif
- **Cyberpunk** : Style futuriste et néon
- **3D** : Rendu tridimensionnel moderne
- **Cinématique** : Éclairage dramatique et épique
- **Minimaliste** : Design simple et élégant
- **Vintage** : Style rétro et nostalgique
- **Cartoon** : Style dessin animé coloré
- **Abstrait** : Art abstrait géométrique
- **Fantasy** : Art fantastique et mystique

### 📱 Formats adaptés aux réseaux sociaux
- **Instagram Post** : 1080x1080 (carré)
- **Instagram Story** : 1080x1920 (vertical)
- **Facebook Post** : 1200x630 (paysage)
- **LinkedIn Post** : 1200x627 (professionnel)
- **YouTube Thumbnail** : 1280x720 (paysage)
- **Pinterest Pin** : 1000x1500 (vertical)

### 🤖 Enrichissement IA avec GPT-4
- **Analyse du contexte** : Comprend le sujet et l'intention
- **Optimisation par plateforme** : Adapte le style selon le réseau
- **Amélioration des prompts** : Transforme un brief en description visuelle détaillée
- **Gestion des contraintes** : Respecte les limites de Midjourney

### 📋 Prompts prédéfinis
- **Succès Business** : Représentation du succès entrepreneurial
- **Motivation Matinale** : Énergie positive pour commencer la journée
- **Innovation Technologique** : Technologies du futur et innovation
- **Méditation et Pleine Conscience** : Calme et sérénité intérieure
- **Espace de Travail Créatif** : Bureau inspirant pour la créativité

## 🎯 API Endpoints

### Génération d'images
```
POST /api/midjourney/generate
{
  "userId": 1,
  "prompt": "description de l'image",
  "style": "realistic",
  "aspectRatio": "4:5",
  "enhancePrompt": true
}
```

### Récupération des données
```
GET /api/midjourney/generate?userId=1&type=styles
GET /api/midjourney/generate?userId=1&type=prompts
GET /api/midjourney/generate?userId=1&type=user_images&limit=20
GET /api/midjourney/generate?userId=1&type=status&jobId=job_id
```

### Gestion des images
```
POST /api/midjourney/associate
{
  "imageId": 123,
  "scheduledPostId": 456
}

DELETE /api/midjourney/delete?imageId=123&userId=1
```

## 🎨 Interface utilisateur

### Générateur principal
- 📝 **Formulaire intuitif** : Saisie du prompt et sélection des options
- 🎨 **Sélecteur de styles** : Choix parmi les styles artistiques disponibles
- 📱 **Sélecteur de formats** : Adaptation aux réseaux sociaux
- ⚙️ **Options avancées** : Ratio d'aspect, amélioration IA
- 🔄 **Polling automatique** : Vérification du statut en temps réel
- 📋 **Prompts prédéfinis** : Suggestions pour démarrer rapidement

### Galerie d'images
- 📊 **Vue grille/liste** : Deux modes d'affichage
- 🔍 **Recherche et filtres** : Par prompt, style, statut
- 📈 **Statistiques** : Nombre de générations, téléchargements, utilisations
- 📥 **Téléchargement** : Export des images en PNG
- 🗑️ **Gestion** : Suppression des générations

## 🔒 Sécurité

### Gestion des clés API
- 🔐 **Clé sécurisée** : Stockage en variables d'environnement
- 📊 **Monitoring** : Suivi des utilisations et coûts
- 🛡️ **Rate limiting** : Protection contre les abus
- 🔄 **Rotation** : Gestion de plusieurs clés si nécessaire

### Stockage des images
- 💾 **Stockage local** : Images téléchargées sur le serveur
- 🔗 **URLs sécurisées** : Accès contrôlé aux images
- 🗑️ **Nettoyage** : Suppression automatique des anciennes images
- 📁 **Organisation** : Structure de dossiers par utilisateur

## 🚀 Déploiement

### Variables de production
```env
MIDJOURNEY_API_URL="https://your-midjourney-proxy.com"
MIDJOURNEY_API_KEY="your-production-key"
UPLOAD_DIR="/var/www/uploads"
BASE_URL="https://votre-domaine.com"
DATABASE_URL="postgresql://..."
```

### Optimisations production
- 🖼️ **CDN** : Utilisation d'un CDN pour les images
- 💾 **Stockage cloud** : AWS S3, Cloudinary, ou Supabase Storage
- 🔄 **Cache Redis** : Mise en cache des styles et prompts
- 📊 **Monitoring** : Suivi des performances et coûts

## 🧪 Tests

### Tests unitaires
```bash
npm run test:midjourney
```

### Tests d'intégration
```bash
# Tester la génération
curl -X POST http://localhost:3000/api/midjourney/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"prompt":"test image"}'

# Tester la récupération des styles
curl http://localhost:3000/api/midjourney/generate?userId=1&type=styles
```

## 📈 Monitoring

### Métriques importantes
- 🎨 **Images générées** : Nombre total par utilisateur
- 💰 **Coût Midjourney** : Suivi des dépenses API
- ⏱️ **Temps de génération** : Performance moyenne
- 📊 **Qualité** : Taux de satisfaction utilisateur
- 🔄 **Échecs** : Fréquence des générations échouées

### Logs à surveiller
```
✅ Midjourney generation started
🤖 Prompt enhanced with GPT-4
📊 Generation status: PROCESSING
✅ Image generated successfully
📥 Image downloaded and stored
🗑️ Generation deleted successfully
❌ Generation failed: rate limit exceeded
```

## 🐛 Dépannage

### Erreurs courantes

1. **"Midjourney API key not found"**
   - Vérifiez `MIDJOURNEY_API_KEY` dans `.env`
   - Assurez-vous que la clé est valide

2. **"Rate limit exceeded"**
   - Midjourney limite les appels API
   - Implémentez du cache et de la file d'attente

3. **"Generation failed"**
   - Vérifiez le prompt (pas de contenu inapproprié)
   - Vérifiez les crédits Midjourney

4. **"Status check failed"**
   - Vérifiez la connectivité avec l'API Midjourney
   - Vérifiez les permissions du bot Discord

## 🔄 Mise à jour

### Nouvelles fonctionnalités
- 🎨 **Styles personnalisés** : Création de styles par utilisateur
- 📱 **Formats dynamiques** : Adaptation automatique aux nouvelles plateformes
- 🤖 **IA améliorée** : Prompts plus intelligents et contextuels
- 📊 **Analytics avancées** : Insights sur les performances des images

### Maintenance
- 🧹 **Nettoyage automatique** : Suppression des anciennes générations
- 📈 **Optimisation coûts** : Gestion intelligente des appels API
- 🔄 **Mise à jour styles** : Ajout de nouveaux styles artistiques
- 🔒 **Sécurité** : Audits réguliers des permissions

## 📞 Support

### Documentation
- 📖 **API Reference** : Endpoints détaillés
- 🎯 **Guides utilisateur** : Tutoriels pas à pas
- 🔧 **Configuration** : Setup complet
- 🐛 **Dépannage** : Solutions courantes

### Contact
- 📧 **Email** : support@crealia.com
- 💬 **Discord** : communauté développeurs
- 📚 **Documentation** : docs.crealia.com

---

**🎉 Félicitations !** Votre intégration Midjourney est maintenant opérationnelle et prête à créer des visuels artistiques uniques et engageants pour vos utilisateurs ! 