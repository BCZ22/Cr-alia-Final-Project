# 🚀 Automatisation de Création de Contenu

Ce module d'automatisation de création de contenu utilise l'intelligence artificielle pour révolutionner votre processus de création de contenu sur les réseaux sociaux.

## ✨ Fonctionnalités Principales

### 1. 🔍 Analyse des Tendances
- **Analyse en temps réel** des sujets populaires sur toutes les plateformes
- **Intégration Google Trends** pour identifier les mots-clés tendance
- **Analyse Twitter** pour capturer les conversations virales
- **Insights BuzzSumo** pour le contenu viral
- **Génération automatique de scripts** basés sur les tendances

### 2. 📝 Reformatage et Amélioration de Contenu
- **Conversion multi-format** : article → post → carousel → story → thread
- **Amélioration automatique** du contenu existant
- **Création de variations** créatives
- **Adaptation par plateforme** (Instagram, TikTok, LinkedIn, Twitter, YouTube)
- **Optimisation du ton et du style** selon votre audience

### 3. 🎨 Génération d'Images IA
- **DALL-E 3** : Images haute qualité et réalistes
- **Midjourney** : Art créatif et stylisé
- **Stable Diffusion** : Génération locale et personnalisable
- **Prompts optimisés** par l'IA
- **Génération automatique** d'images pour accompagner le contenu

### 4. ⚙️ Workflows Automatisés
- **Workflows prédéfinis** pour différents types de contenu
- **Automatisation complète** du processus de création
- **Suivi en temps réel** de l'exécution
- **Gestion des erreurs** et reprise automatique

## 🏗️ Architecture Technique

```
lib/ai/
├── trend-analyzer.ts          # Analyse des tendances
├── content-reformatter.ts     # Reformatage de contenu
├── image-generator-service.ts # Génération d'images IA
└── content-automation-service.ts # Orchestrateur principal

app/api/automation/
├── trends/route.ts            # API analyse des tendances
├── reformat/route.ts          # API reformatage
├── images/route.ts            # API génération d'images
└── workflow/route.ts          # API workflows

app/automation/
└── page.tsx                   # Interface utilisateur
```

## 🚀 Démarrage Rapide

### 1. Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine de votre projet :

```bash
# OpenAI - Obligatoire
OPENAI_API_KEY=sk-your-openai-api-key-here

# Twitter API - Optionnel
TWITTER_BEARER_TOKEN=your-twitter-bearer-token-here

# Midjourney - Optionnel
MIDJOURNEY_TOKEN=your-midjourney-token-here

# Stable Diffusion - Optionnel
STABLE_DIFFUSION_API_URL=http://localhost:7860
```

### 2. Installation des Dépendances

```bash
npm install
# ou
yarn install
```

### 3. Lancement de l'Application

```bash
npm run dev
# ou
yarn dev
```

### 4. Accès à l'Automatisation

Naviguez vers `/automation` dans votre application.

## 📖 Guide d'Utilisation

### Analyse des Tendances

1. **Sélectionnez les plateformes** à analyser (Instagram, TikTok, LinkedIn, etc.)
2. **Cliquez sur "Analyser les tendances"**
3. **Explorez les sujets populaires** avec leurs métriques
4. **Générez des scripts** automatiquement pour chaque tendance

```typescript
// Exemple d'utilisation programmatique
const trendAnalyzer = new TrendAnalyzerService();
const trends = await trendAnalyzer.analyzeTrends(["instagram", "tiktok"]);
const script = await trendAnalyzer.generateScriptFromTrend({
  trend: "Intelligence Artificielle",
  platform: "instagram",
  duration: "medium",
  style: "informative"
});
```

### Reformatage de Contenu

1. **Collez votre contenu original** dans la zone de texte
2. **Sélectionnez les formats cibles** (post, carousel, story, thread)
3. **Cliquez sur "Reformater le contenu"**
4. **Récupérez le contenu adapté** à chaque format

```typescript
// Exemple d'utilisation programmatique
const reformatter = new ContentReformatterService();
const reformatted = await reformatter.reformatContent({
  originalContent: "Votre contenu ici...",
  sourceFormat: "post",
  targetFormats: ["carousel", "story", "thread"],
  platform: "instagram",
  style: "informative"
});
```

### Génération d'Images IA

1. **Décrivez l'image** que vous voulez générer
2. **Choisissez le provider** (DALL-E, Midjourney, Stable Diffusion)
3. **Sélectionnez le style** (artistique, réaliste, cartoon, etc.)
4. **Générez l'image** et téléchargez-la

```typescript
// Exemple d'utilisation programmatique
const imageGenerator = new ImageGeneratorService();
const image = await imageGenerator.generateImage({
  prompt: "Une image moderne représentant l'innovation technologique",
  provider: "dalle",
  style: "artistic",
  aspectRatio: "1:1",
  size: "medium",
  quality: "hd"
});
```

### Workflows Automatisés

1. **Choisissez le type de workflow** :
   - **Tendances** : Analyse + génération de contenu
   - **Amélioration** : Reformatage + images
   - **Complet** : Tout le processus automatisé

2. **Configurez les paramètres** selon vos besoins
3. **Lancez l'exécution** et suivez le progrès
4. **Récupérez les résultats** finaux

```typescript
// Exemple d'utilisation programmatique
const automation = new ContentAutomationService();
const workflow = await automation.createAutomationWorkflow({
  workflowType: "full_automation",
  parameters: {
    platforms: ["instagram", "tiktok"],
    targetFormats: ["post", "carousel", "story"],
    imageProvider: "dalle"
  }
});

const executedWorkflow = await automation.executeWorkflow(workflow);
```

## 🔧 Personnalisation

### Ajout de Nouveaux Providers d'Images

1. Créez une nouvelle classe de service dans `lib/ai/`
2. Implémentez l'interface `ImageGeneratorService`
3. Ajoutez le provider dans `image-generator-service.ts`

### Ajout de Nouvelles Sources de Tendances

1. Créez un nouveau service dans `lib/ai/`
2. Implémentez les méthodes d'analyse
3. Intégrez-le dans `trend-analyzer.ts`

### Personnalisation des Workflows

1. Modifiez `content-automation-service.ts`
2. Ajoutez de nouveaux types de workflows
3. Définissez les étapes personnalisées

## 📊 Métriques et Analytics

Le système collecte automatiquement :
- **Temps de génération** pour chaque type de contenu
- **Taux de succès** des générations
- **Utilisation des différents providers**
- **Performance des workflows**

## 🔒 Sécurité

- **Authentification requise** pour toutes les fonctionnalités
- **Validation des entrées** utilisateur
- **Limitation de débit** pour éviter l'abus
- **Chiffrement** des clés API sensibles

## 🚨 Limitations et Considérations

### Coûts
- **OpenAI** : ~$0.04 par image DALL-E 3
- **Midjourney** : Selon votre plan d'abonnement
- **Stable Diffusion** : Gratuit en local, coûts cloud variables

### Quotas
- **OpenAI** : Limites selon votre plan
- **Twitter API** : Limites selon votre niveau d'accès
- **Rate limiting** automatique pour éviter les dépassements

### Qualité
- **Contenu généré** : Toujours vérifier et éditer
- **Images IA** : Peuvent nécessiter des ajustements
- **Tendances** : Basées sur des données publiques

## 🆘 Dépannage

### Problèmes Courants

1. **"OPENAI_API_KEY is not defined"**
   - Vérifiez votre fichier `.env.local`
   - Redémarrez le serveur

2. **"Rate limit exceeded"**
   - Attendez quelques minutes
   - Vérifiez vos quotas OpenAI

3. **Images non générées**
   - Vérifiez votre clé OpenAI
   - Consultez les logs du serveur

### Logs et Debug

Activez le mode debug en ajoutant dans `.env.local` :

```bash
DEBUG=automation:*
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créez une branche** pour votre fonctionnalité
3. **Commitez** vos changements
4. **Poussez** vers la branche
5. **Ouvrez une Pull Request**

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Documentation** : Consultez ce README et les fichiers de configuration
- **Issues** : Créez une issue sur GitHub pour les bugs
- **Discussions** : Utilisez les discussions GitHub pour les questions
- **Email** : [votre-email@example.com]

---

**Développé avec ❤️ par l'équipe Crealia**

*Transformez votre création de contenu avec l'IA !*

