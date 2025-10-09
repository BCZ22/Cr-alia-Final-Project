# 🚀 Configuration de l'Assistant Virtuel

## 📋 Prérequis

### 1. Variables d'Environnement
Copiez le fichier `env.virtual-assistant.example` vers `.env.local` et configurez les variables :

```bash
cp env.virtual-assistant.example .env.local
```

### 2. Variables Essentielles

#### OpenAI (Obligatoire pour l'IA)
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### AWS S3 (Pour le stockage des médias)
```bash
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=crealia-media
```

#### Base de Données
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/crealia"
```

## 🔧 Configuration Rapide

### Option 1: Configuration Minimale (Test)
```bash
# Copiez ces variables dans .env.local
OPENAI_API_KEY=sk-test-key
DATABASE_URL="postgresql://test:test@localhost:5432/crealia"
REDIS_URL="redis://localhost:6379"
```

### Option 2: Configuration Complète (Production)
1. **OpenAI** : Obtenez une clé API sur https://platform.openai.com/
2. **AWS S3** : Créez un bucket S3 et obtenez les clés d'accès
3. **PostgreSQL** : Installez et configurez PostgreSQL
4. **Redis** : Installez Redis pour les queues

## 🚀 Démarrage

### 1. Installation des Dépendances
```bash
npm install
```

### 2. Configuration de la Base de Données
```bash
npm run db:migrate
npm run db:generate
```

### 3. Démarrage du Serveur
```bash
npm run dev
```

### 4. Test de l'Assistant
```bash
npm run test:virtual-assistant
```

## 🎯 Accès à l'Assistant

- **URL** : http://localhost:3000/virtual-assistant
- **Interface** : Dashboard moderne avec upload drag-and-drop
- **APIs** : Endpoints REST pour l'intégration

## 🧪 Tests

### Test Complet
```bash
npm run test:virtual-assistant
```

### Test Manuel
1. Ouvrez http://localhost:3000/virtual-assistant
2. Uploadez un fichier vidéo ou image
3. Cliquez sur "Analyser avec l'IA"
4. Sélectionnez un workflow recommandé
5. Lancez l'exécution

## 🔍 Dépannage

### Erreur 500 sur les APIs
- Vérifiez que `OPENAI_API_KEY` est configurée
- Vérifiez que la base de données est accessible
- Consultez les logs du serveur

### Erreur d'Upload
- Vérifiez la configuration AWS S3
- Vérifiez les permissions du bucket
- Testez avec un fichier plus petit

### Erreur d'Analyse IA
- Vérifiez votre quota OpenAI
- Vérifiez la clé API OpenAI
- Testez avec un contenu plus simple

## 📊 Monitoring

### Logs
```bash
# Logs du serveur
npm run dev

# Logs Docker (si utilisé)
docker-compose logs -f
```

### Métriques
- **Performance** : Temps de réponse des APIs
- **IA** : Taux de réussite des analyses
- **Upload** : Vitesse d'upload des médias

## 🎉 Utilisation

Une fois configuré, l'Assistant Virtuel permet de :

1. **Importer** des médias depuis fichiers ou URLs
2. **Analyser** le contenu avec l'IA
3. **Recommander** des workflows optimisés
4. **Exécuter** des workflows automatisés
5. **Exporter** du contenu optimisé pour les réseaux sociaux

**L'objectif de surpasser CapCut, Premiere Pro, After Effects, Descript et Canva est maintenant à portée de main !** 🚀

