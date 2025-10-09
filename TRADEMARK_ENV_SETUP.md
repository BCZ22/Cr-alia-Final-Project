# 🔐 Configuration des Variables d'Environnement - Trademark API

Ce document détaille la configuration nécessaire pour l'intégration de l'API Trademark dans votre SaaS Crealia.

## 📋 Variables Requises

### 🔑 Clés API Principales

```bash
# Clé API principale pour l'accès aux services de marques déposées
TRADEMARK_API_KEY=your_trademark_api_key_here

# URL de base de l'API (peut varier selon le fournisseur)
TRADEMARK_API_BASE_URL=https://api.trademark-search.com/v1

# Clé API publique pour le frontend (optionnel, pour la démo)
NEXT_PUBLIC_TRADEMARK_API_KEY=demo-key
```

### ⚙️ Configuration Technique

```bash
# Timeout des requêtes API en millisecondes
TRADEMARK_API_TIMEOUT=30000

# Nombre maximum de tentatives en cas d'échec
TRADEMARK_API_MAX_RETRIES=3

# Limite de taux par minute
TRADEMARK_API_RATE_LIMIT_PER_MIN=60

# Limite de taux par heure
TRADEMARK_API_RATE_LIMIT_PER_HOUR=1000
```

## 🚀 Fournisseurs d'API Recommandés

### 1. **USPTO (United States Patent and Trademark Office)**
- **URL API**: `https://api.uspto.gov`
- **Documentation**: [USPTO API Documentation](https://developer.uspto.gov/)
- **Avantages**: Gratuit, données officielles US, couverture complète
- **Limitations**: Rate limiting strict, données US uniquement

### 2. **EUIPO (European Union Intellectual Property Office)**
- **URL API**: `https://api.euipo.europa.eu`
- **Documentation**: [EUIPO API Documentation](https://euipo.europa.eu/ohimportal/en/web/guest/api)
- **Avantages**: Données officielles UE, couverture européenne
- **Limitations**: Accès restreint, authentification complexe

### 3. **WIPO (World Intellectual Property Organization)**
- **URL API**: `https://api.wipo.int`
- **Documentation**: [WIPO API Documentation](https://www.wipo.int/portal/en/index.html)
- **Avantages**: Couverture internationale, données multilatérales
- **Limitations**: Accès payant, quotas limités

### 4. **Services Privés (Alternatives)**
- **Trademarkia**: API commerciale avec couverture mondiale
- **CompuMark**: Service premium pour entreprises
- **Thomson Reuters**: Solutions professionnelles complètes

## 🔧 Configuration par Environnement

### 🟢 Développement Local

```bash
# .env.local
TRADEMARK_API_KEY=dev_trademark_key
TRADEMARK_API_BASE_URL=https://api-dev.trademark-search.com/v1
TRADEMARK_API_TIMEOUT=60000
TRADEMARK_API_MAX_RETRIES=5
TRADEMARK_API_RATE_LIMIT_PER_MIN=120
TRADEMARK_API_RATE_LIMIT_PER_HOUR=2000
NEXT_PUBLIC_TRADEMARK_API_KEY=dev-demo-key
```

### 🟡 Staging/Test

```bash
# .env.staging
TRADEMARK_API_KEY=staging_trademark_key
TRADEMARK_API_BASE_URL=https://api-staging.trademark-search.com/v1
TRADEMARK_API_TIMEOUT=45000
TRADEMARK_API_MAX_RETRIES=3
TRADEMARK_API_RATE_LIMIT_PER_MIN=80
TRADEMARK_API_RATE_LIMIT_PER_HOUR=1500
NEXT_PUBLIC_TRADEMARK_API_KEY=staging-demo-key
```

### 🔴 Production

```bash
# .env.production
TRADEMARK_API_KEY=prod_trademark_key
TRADEMARK_API_BASE_URL=https://api.trademark-search.com/v1
TRADEMARK_API_TIMEOUT=30000
TRADEMARK_API_MAX_RETRIES=3
TRADEMARK_API_RATE_LIMIT_PER_MIN=60
TRADEMARK_API_RATE_LIMIT_PER_HOUR=1000
NEXT_PUBLIC_TRADEMARK_API_KEY=prod-demo-key
```

## 🛡️ Sécurité et Bonnes Pratiques

### 🔐 Gestion des Clés API

```bash
# ✅ CORRECT - Utilisation de variables d'environnement
TRADEMARK_API_KEY=${TRADEMARK_API_KEY}

# ❌ INCORRECT - Clés en dur dans le code
TRADEMARK_API_KEY=sk-1234567890abcdef
```

### 🔒 Sécurisation des Variables

```bash
# Ajouter aux fichiers .gitignore
.env
.env.local
.env.production
.env.staging

# Utiliser des secrets dans les déploiements
# Vercel, Netlify, Docker, Kubernetes, etc.
```

### 🚫 Variables à Ne Jamais Exposer

```bash
# ❌ JAMAIS dans le code source ou les commits
TRADEMARK_API_KEY=sk-...
TRADEMARK_API_SECRET=...
TRADEMARK_ACCESS_TOKEN=...
```

## 🔍 Test de la Configuration

### 1. **Vérification des Variables**

```bash
# Vérifier que les variables sont chargées
echo $TRADEMARK_API_KEY
echo $TRADEMARK_API_BASE_URL
```

### 2. **Test de Connexion API**

```bash
# Test simple avec curl
curl -H "Authorization: Bearer $TRADEMARK_API_KEY" \
     -H "Content-Type: application/json" \
     "$TRADEMARK_API_BASE_URL/health"
```

### 3. **Test via l'Interface**

```bash
# Démarrer l'application
npm run dev

# Naviguer vers /trademark-checker
# Effectuer une recherche de test
```

## 📊 Monitoring et Logs

### 🔍 Logs de Debug

```bash
# Activer les logs détaillés en développement
DEBUG=trademark:*
NODE_ENV=development
```

### 📈 Métriques de Performance

```bash
# Variables pour le monitoring
TRADEMARK_API_METRICS=true
TRADEMARK_API_LOGGING=verbose
TRADEMARK_API_PERFORMANCE_TRACKING=true
```

## 🚨 Dépannage

### ❌ Erreurs Communes

1. **"TRADEMARK_API_KEY is required"**
   - Vérifier que la variable est définie dans `.env.local`
   - Redémarrer le serveur de développement

2. **"Rate limit exceeded"**
   - Augmenter `TRADEMARK_API_RATE_LIMIT_PER_MIN`
   - Implémenter un système de cache

3. **"Timeout exceeded"**
   - Augmenter `TRADEMARK_API_TIMEOUT`
   - Vérifier la connectivité réseau

### 🔧 Solutions

```bash
# Redémarrer le serveur
npm run dev

# Vérifier les variables
cat .env.local

# Test de connectivité
ping api.trademark-search.com
```

## 📚 Ressources Supplémentaires

### 🔗 Documentation Officielle

- [USPTO Developer Portal](https://developer.uspto.gov/)
- [EUIPO API Documentation](https://euipo.europa.eu/ohimportal/en/web/guest/api)
- [WIPO API Reference](https://www.wipo.int/portal/en/index.html)

### 📖 Guides d'Intégration

- [Trademark API Integration Guide](https://docs.trademark-api.com/)
- [Best Practices for IP APIs](https://ip-api-best-practices.com/)
- [Rate Limiting Strategies](https://rate-limiting-guide.com/)

### 🛠️ Outils de Test

- [Postman Collection](https://www.postman.com/collection/trademark-api)
- [API Testing Tools](https://apitestingtools.com/)
- [Rate Limit Simulator](https://ratelimit-simulator.com/)

## ✅ Checklist de Configuration

- [ ] Variables d'environnement configurées
- [ ] Clés API obtenues et sécurisées
- [ ] Tests de connexion réussis
- [ ] Rate limiting configuré
- [ ] Logs et monitoring activés
- [ ] Documentation équipe mise à jour
- [ ] Tests de sécurité effectués
- [ ] Plan de rollback préparé

---

**⚠️ Important**: Remplacez toutes les valeurs d'exemple par vos vraies clés API et URLs. Ne committez jamais de vraies clés API dans votre code source.
