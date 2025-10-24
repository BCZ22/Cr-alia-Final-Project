# 🚀 Content Reactor - Quick Start Guide

> Assistant IA conversationnel pour générer automatiquement des Reels/Shorts/TikToks optimisés

---

## ⚡ Démarrage rapide (5 minutes)

### 1. Installation

```bash
# Cloner le projet (si ce n'est pas déjà fait)
git clone <repository-url>
cd crealia

# Installer les dépendances
npm install
```

### 2. Configuration

Créer un fichier `.env.local`:

```bash
# MINIMUM REQUIRED (Mode Mock - Pas besoin d'OpenAI)
CONTENT_REACTOR_MOCK=true
NEXTAUTH_SECRET=your-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/crealia

# OPTIONAL (Production avec vraie IA)
OPENAI_API_KEY=sk-proj-your-key-here
CONTENT_REACTOR_MOCK=false
```

### 3. Lancer l'application

```bash
# Mode développement
npm run dev

# Ouvrir dans le navigateur
open http://localhost:3000/content-reactor
```

---

## 🎯 Utilisation

### Interface Web

1. **Ouvrir** `http://localhost:3000/content-reactor`
2. **Uploader** une vidéo ou image (MP4, MOV, JPG, PNG)
3. **Décrire** le contenu souhaité :
   ```
   "Je veux 3 Reels marketing luxe pour mon agence de location de voiture"
   ```
4. **Sélectionner** le ton : viral, luxury, fun, educational...
5. **Générer** → Recevoir 3 versions optimisées avec titres, captions et hashtags !

### Exemple de prompt

```
📎 Upload: luxury-car-video.mp4

💬 Prompt: "Crée 3 Reels marketing percutants pour promouvoir 
ma flotte de voitures de luxe. Cible: entrepreneurs et cadres supérieurs."

🎨 Ton: luxury
🏢 Secteur: Location de voiture

→ Résultat: 3 Reels prêts avec captions et hashtags optimisés !
```

---

## 🧪 Tests

### Tests unitaires

```bash
npm test -- __tests__/content-reactor.test.ts
```

### Tests E2E

```bash
npm run test:e2e -- e2e/content-reactor.spec.ts
```

---

## 📡 API Usage (Developers)

### 1. Analyser un média

```typescript
const response = await fetch('/api/content-reactor/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mediaUrl: '/uploads/video.mp4',
    mediaType: 'video',
  }),
});

const { analysis } = await response.json();
console.log('Scènes détectées:', analysis.scenes.length);
console.log('Mood:', analysis.mood);
```

### 2. Générer des Reels

```typescript
const response = await fetch('/api/content-reactor/generate-reels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mediaUrl: '/uploads/video.mp4',
    prompt: '3 Reels marketing pour agence immobilière',
    tone: 'luxury',
    industry: 'Immobilier',
    duration: 30,
  }),
});

const { reels } = await response.json();
reels.forEach(reel => {
  console.log('Titre:', reel.title);
  console.log('Caption:', reel.caption);
  console.log('Hashtags:', reel.hashtags);
});
```

### 3. Chat avec l'assistant

```typescript
const response = await fetch('/api/content-reactor/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session_123',
    message: 'Comment créer un Reel viral ?',
  }),
});

const data = await response.json();
console.log('IA:', data.response);
console.log('Actions:', data.actions);
```

---

## 🔧 Modes de fonctionnement

### Mode Mock (Development)

✅ **Avantages:**
- Pas besoin de clé OpenAI
- Réponses instantanées
- Données prévisibles pour tests
- Gratuit et illimité

```bash
CONTENT_REACTOR_MOCK=true npm run dev
```

**Données mockées:**
- 3 Reels générés
- Analyses réalistes
- Captions et hashtags pertinents

### Mode Production (Real AI)

🚀 **Avantages:**
- Vraie IA GPT-4
- Analyses intelligentes
- Contenu unique et personnalisé
- Quality supérieure

```bash
OPENAI_API_KEY=sk-xxx npm run build
npm start
```

**Prérequis:**
- Clé OpenAI API
- Crédits API disponibles

---

## 📊 Exemples de résultats

### Input:
```json
{
  "mediaUrl": "/uploads/luxury-car.mp4",
  "prompt": "3 Reels marketing pour location voiture luxe",
  "tone": "luxury",
  "industry": "Location de voiture",
  "duration": 30
}
```

### Output (Version 1):
```json
{
  "id": "reel-1",
  "title": "Location de Luxe | Excellence Premium",
  "caption": "Élévez votre expérience avec nos services premium. Excellence et raffinement à chaque instant.",
  "hashtags": [
    "#contentcreator",
    "#digitalmarketing",
    "#locationvoiture",
    "#luxury",
    "#professional"
  ],
  "duration": 30,
  "musicSuggestion": "Elegant Piano & Strings",
  "metadata": {
    "transitions": ["fade", "slide", "zoom"],
    "effects": ["color_grade", "motion_blur"]
  }
}
```

---

## 🎨 Features principales

| Feature | Description | Status |
|---------|-------------|--------|
| **Upload Média** | Vidéos/Images (MP4, MOV, JPG, PNG) | ✅ |
| **Analyse IA** | Détection scènes, objets, mood | ✅ |
| **Génération Reels** | 3 versions optimisées | ✅ |
| **Captions automatiques** | Titres et légendes SEO | ✅ |
| **Hashtags intelligents** | Jusqu'à 10 hashtags pertinents | ✅ |
| **Suggestions musicales** | Recommandations par ton | ✅ |
| **Chat conversationnel** | Interface naturelle | ✅ |
| **Mode Mock** | Dev sans API key | ✅ |
| **Dark Mode** | Support complet | ✅ |
| **Responsive** | Mobile, Tablet, Desktop | ✅ |

---

## 🔐 Sécurité

- ✅ Authentification NextAuth requise
- ✅ Rate limiting par utilisateur
- ✅ Validation stricte des inputs
- ✅ Uploads dans dossiers user-specific
- ✅ File type whitelist
- ✅ Size limits (100MB)

---

## 💡 Tips & Best Practices

### Pour de meilleurs résultats:

1. **Prompts clairs et détaillés**
   ```
   ✅ "3 Reels marketing luxe pour location voiture, cible cadres sup, style élégant"
   ❌ "Fais un reel"
   ```

2. **Choisir le bon ton**
   - `luxury`: Services premium, produits haut de gamme
   - `viral`: Contenu TikTok, jeune audience
   - `fun`: Divertissement, humour
   - `educational`: Tutoriels, how-to
   - `emotional`: Storytelling, connexion émotionnelle
   - `promotional`: Ventes, promotions, offres

3. **Spécifier le secteur**
   - Ajoute contexte et pertinence
   - Améliore les hashtags
   - Adapte le vocabulaire

4. **Durée optimale**
   - **15-20s**: TikTok, attention rapide
   - **30s**: Instagram Reels (recommandé)
   - **45-60s**: YouTube Shorts, contenu éducatif

---

## ⚠️ Troubleshooting

### "Unauthorized (401)"
→ Assurez-vous d'être connecté avec NextAuth

### "Upload failed"
→ Vérifiez format (MP4, MOV, JPG, PNG) et taille (<100MB)

### "OpenAI API error"
→ Vérifiez `OPENAI_API_KEY` dans `.env.local` ou activez mode mock

### "Rate limit exceeded"
→ Attendez 1 minute entre les générations multiples

---

## 📚 Documentation complète

Pour plus de détails, consultez:

- 📖 [Documentation complète](docs/FEATURE-CONTENT-REACTOR.md)
- 🔗 [API Reference](docs/API_REFERENCE.md)
- 🧪 [Testing Guide](docs/TESTING_GUIDE.md)

---

## 🤝 Support

- **Issues GitHub:** [Créer une issue](https://github.com/...)
- **Documentation:** `docs/FEATURE-CONTENT-REACTOR.md`
- **Email:** support@crealia.app

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2024-10-23

