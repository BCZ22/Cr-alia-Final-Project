# 🚀 Commandes Utiles - Intégration Patreon

## 📋 Commandes de Test

### Test Simple
```bash
# Tester l'intégration complète
node scripts/test-patreon.js

# Tester avec sortie détaillée
DEBUG=patreon:* node scripts/test-patreon.js
```

### Tests Complets (avec Vitest)
```bash
# Installer Vitest
npm install -D vitest

# Lancer tous les tests
npm run test:patreon

# Lancer les tests en mode watch
npm run test:patreon -- --watch

# Lancer les tests avec couverture
npm run test:patreon -- --coverage
```

## 🗄️ Base de Données

### Prisma
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Créer une migration
npx prisma migrate dev --name add-patreon-integration

# Ouvrir Prisma Studio
npx prisma studio

# Reset de la base (⚠️ DANGEREUX)
npx prisma db push --force-reset
```

### Vérification des Tables
```sql
-- Vérifier que les tables Patreon existent
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'Patreon%';

-- Vérifier la structure d'une table
\d "PatreonConnection"
```

## 🔧 Déploiement

### Script Automatisé
```bash
# Rendre le script exécutable (première fois)
chmod +x scripts/deploy-patreon.sh

# Déploiement complet
./scripts/deploy-patreon.sh

# Aide du script
./scripts/deploy-patreon.sh --help
```

### Déploiement Manuel
```bash
# 1. Installer les dépendances
npm install axios crypto
npm install -D @types/node

# 2. Générer Prisma
npx prisma generate

# 3. Appliquer les migrations
npx prisma db push

# 4. Build de l'application
npm run build

# 5. Tester
node scripts/test-patreon.js
```

## 🌐 Serveur de Développement

### Next.js
```bash
# Démarrer en mode développement
npm run dev

# Build de production
npm run build

# Démarrer en mode production
npm start

# Linter
npm run lint

# Type checking
npm run type-check
```

## 📊 Monitoring et Debug

### Logs
```bash
# Activer les logs détaillés
DEBUG=patreon:* npm run dev

# Vérifier les webhooks reçus
curl "http://localhost:3000/api/webhooks/patreon?limit=10"

# Tester la connectivité Patreon
curl "http://localhost:3000/api/auth/patreon/connect"
```

### Vérification des Variables d'Environnement
```bash
# Vérifier les variables requises
node -e "
const required = ['PATREON_CLIENT_ID', 'PATREON_CLIENT_SECRET', 'ENCRYPTION_KEY'];
required.forEach(key => {
  const value = process.env[key];
  if (!value || value.includes('your_')) {
    console.log('❌', key, 'non configuré');
  } else {
    console.log('✅', key, 'configuré');
  }
});
"
```

## 🔐 Configuration Patreon

### Portail Développeur
```bash
# URLs à configurer dans le portail Patreon
# Redirect URI: http://localhost:3000/api/auth/patreon/callback
# Webhook URL: http://localhost:3000/api/webhooks/patreon

# Scopes requis
# - identity
# - campaigns  
# - w:campaigns.webhook
```

### Test OAuth
```bash
# 1. Aller sur la page d'authentification
open http://localhost:3000/patreon-auth

# 2. Cliquer sur "Connect with Patreon"
# 3. Autoriser l'application
# 4. Vérifier la redirection vers le dashboard
```

## 🧹 Maintenance

### Nettoyage
```bash
# Nettoyer les composants UI non utilisés
rm -rf components/ui/button.tsx components/ui/card.tsx

# Nettoyer les tests
rm -rf tests/patreon-integration.test.ts

# Nettoyer les scripts
rm -rf scripts/test-patreon.js scripts/deploy-patreon.sh
```

### Mise à Jour
```bash
# Mettre à jour les dépendances
npm update

# Mettre à jour Prisma
npm update @prisma/client prisma

# Régénérer le client Prisma
npx prisma generate
```

## 🚨 Dépannage

### Erreurs Communes
```bash
# Erreur de token expiré
curl -X POST "http://localhost:3000/api/auth/patreon/refresh" \
  -H "Content-Type: application/json" \
  -d '{"connectionId": 1}'

# Erreur de webhook
curl -X POST "http://localhost:3000/api/webhooks/patreon" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Erreur de synchronisation
curl -X POST "http://localhost:3000/api/patreon/campaigns" \
  -H "Content-Type: application/json" \
  -d '{"connectionId": 1}'
```

### Vérification de la Base
```bash
# Vérifier les connexions actives
npx prisma studio

# Requête directe
npx prisma db execute --stdin <<< "
SELECT 
  pc.id,
  pc.patreonId,
  pc.isActive,
  pc.lastSyncAt,
  COUNT(pc2.id) as campaignCount
FROM PatreonConnection pc
LEFT JOIN PatreonCampaign pc2 ON pc.id = pc2.patreonConnectionId
GROUP BY pc.id, pc.patreonId, pc.isActive, pc.lastSyncAt;
"
```

## 📱 Interface Utilisateur

### Pages Disponibles
```bash
# Page d'authentification
open http://localhost:3000/patreon-auth

# Dashboard principal
open http://localhost:3000/patreon-dashboard

# Interface créateur
open http://localhost:3000/patreon-creator

# Interface patron
open http://localhost:3000/patreon-patron
```

### Composants
```bash
# Lister tous les composants Patreon
ls -la components/patreon/

# Lister tous les composants UI
ls -la components/ui/
```

## 🔍 Debugging

### Mode Développement
```bash
# Activer tous les logs
DEBUG=* npm run dev

# Logs spécifiques à Patreon
DEBUG=patreon:* npm run dev

# Logs de base de données
DEBUG=prisma:* npm run dev
```

### Inspection des Fichiers
```bash
# Vérifier la structure des fichiers
tree app/patreon* components/patreon lib/patreon

# Vérifier les imports
grep -r "import.*patreon" app/ components/ lib/

# Vérifier les routes API
grep -r "export.*function" app/api/patreon/
```

## 📚 Documentation

### Fichiers de Documentation
```bash
# Ouvrir la documentation
open README_PATREON.md
open PATREON_INTEGRATION_SUMMARY.md
open docs/PATREON_SETUP.md

# Ouvrir ce fichier de commandes
open COMMANDS.md
```

### Génération de Documentation
```bash
# Générer la documentation TypeScript
npx typedoc lib/patreon/ --out docs/api

# Générer la documentation des composants
npx storybook build --quiet
```

---

**💡 Conseil** : Gardez ce fichier à portée de main pendant le développement et le déploiement de l'intégration Patreon ! 