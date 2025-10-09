# 🔒 Intégration GDPR API - Guide Rapide

## 🎯 Vue d'ensemble

Intégration complète de GDPR API pour assurer la conformité RGPD de votre SaaS. Gestion des consentements, export des données, suppression et anonymisation avec audit complet.

## ✨ Fonctionnalités

- **Gestion des consentements** : Collecte, modification et retrait
- **Droit à la portabilité** : Export des données en multiples formats
- **Droit à l'oubli** : Suppression avec vérifications légales
- **Anonymisation** : Alternative à la suppression
- **Audit complet** : Journalisation de toutes les actions
- **Support multi-standards** : RGPD, CCPA, HIPAA, LGPD, PIPEDA
- **Chiffrement** : Protection AES-256-GCM des données sensibles
- **Middleware de conformité** : Vérification automatique

## 🚀 Installation Rapide

### 1. Configuration
```bash
# Copier la configuration
cp config/gdpr.env.example .env.local

# Remplir les variables obligatoires
GDPR_API_KEY=your_gdpr_api_key_here
GDPR_ORGANIZATION_ID=your_organization_id_here
```

### 2. Test de l'intégration
```bash
# Test rapide
npm run test:gdpr:quick

# Tests complets
npm run test:gdpr

# Tests avec couverture
npm run test:gdpr:coverage
```

### 3. Accéder à l'interface
```
http://localhost:3000/gdpr
```

## 🔌 API Endpoints

### Consentements
- **`POST /api/gdpr/consent`** - Accorder un consentement
- **`GET /api/gdpr/consent?userId=123`** - Récupérer les consentements
- **`PUT /api/gdpr/consent`** - Mettre à jour un consentement
- **`DELETE /api/gdpr/consent?consentId=456`** - Révoquer un consentement

### Export des données
- **`POST /api/gdpr/export`** - Créer une demande d'export
- **`GET /api/gdpr/export?userId=123`** - Statut des exports

### Suppression des données
- **`POST /api/gdpr/delete`** - Demander la suppression
- **`GET /api/gdpr/delete?userId=123`** - Statut des suppressions

## 💻 Utilisation Frontend

### Bannière de consentement
```tsx
import { ConsentBanner } from './components/ConsentBanner';

function App() {
  const handleConsentChange = (consents) => {
    fetch('/api/gdpr/consent', {
      method: 'POST',
      body: JSON.stringify(consents)
    });
  };

  return (
    <div>
      <ConsentBanner onConsentChange={handleConsentChange} />
      {/* Votre application */}
    </div>
  );
}
```

### Gestion des données utilisateur
```tsx
// Export des données
const exportData = async (format) => {
  const response = await fetch('/api/gdpr/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      format: format,
      dataCategories: ['personal_info', 'contact_info']
    })
  });
  return response.json();
};

// Suppression des données
const deleteData = async (reason) => {
  const response = await fetch('/api/gdpr/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      reason: reason,
      confirmationRequired: true
    })
  });
  return response.json();
};
```

## 🔧 Backend

### Service GDPR
```typescript
import { GdprService } from './lib/gdpr-service';

const gdprService = new GdprService({
  apiKey: process.env.GDPR_API_KEY!,
  organizationId: process.env.GDPR_ORGANIZATION_ID!,
  complianceStandards: ['GDPR', 'CCPA'],
  encryptionEnabled: true,
  auditLogging: true
});

// Gestion des consentements
const consent = await gdprService.grantConsent({
  userId: 'user123',
  consentLevel: 'analytics',
  dataCategories: ['usage_analytics'],
  granted: true,
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  source: 'api',
  version: '1.0'
});

// Export des données
const exportData = await gdprService.exportUserData({
  userId: 'user123',
  format: 'json',
  dataCategories: ['personal_info'],
  includeMetadata: true
});

// Suppression des données
const deletion = await gdprService.deleteUserData({
  userId: 'user123',
  dataCategories: ['personal_info'],
  reason: 'User request'
});
```

### Middleware de conformité
```typescript
// middleware.ts
import { GdprComplianceMiddleware } from './lib/middleware/gdpr-compliance';

export const gdprMiddleware = GdprComplianceMiddleware.createMiddleware(gdprService);

export function middleware(request: NextRequest) {
  // Appliquer le middleware GDPR
  const gdprResponse = await gdprMiddleware(request);
  if (gdprResponse) return gdprResponse;
  
  // Continuer avec les autres middlewares
  return NextResponse.next();
}
```

## 🔒 Sécurité

### Chiffrement
- **Algorithme** : AES-256-GCM
- **Dérivation de clé** : PBKDF2 avec salt de 32 octets
- **Vecteur d'initialisation** : 16 octets aléatoires

### Validation des webhooks
```typescript
const isValid = gdprService.validateWebhook(payload, signature);
if (!isValid) {
  throw new Error('Invalid webhook signature');
}
```

### Variables d'environnement sécurisées
```bash
# Ne jamais exposer ces clés côté frontend
GDPR_API_KEY=your_very_secure_api_key
GDPR_ENCRYPTION_KEY=your_32_character_encryption_key
GDPR_WEBHOOK_SECRET=your_webhook_secret
```

## 📊 Monitoring et Métriques

### Statistiques du cache
```typescript
const cacheStats = gdprService.getCacheStats();
console.log('Cache:', {
  hits: cacheStats.hits,
  misses: cacheStats.misses,
  size: cacheStats.size
});
```

### Métriques GDPR
```typescript
const metrics = await gdprService.getMetrics();
console.log('GDPR Metrics:', {
  totalUsers: metrics.totalUsers,
  activeConsents: metrics.activeConsents,
  consentRate: metrics.consentRate,
  complianceScore: metrics.complianceScore
});
```

## 🧪 Tests

### Tests rapides
```bash
# Test de base
npm run test:gdpr:quick

# Test avec performance
npm run test:gdpr:quick -- --performance
```

### Tests complets
```bash
# Tests unitaires et d'intégration
npm run test:gdpr

# Tests en mode watch
npm run test:gdpr:watch

# Tests avec couverture
npm run test:gdpr:coverage
```

## 🚀 Déploiement

### Variables de production
```bash
NODE_ENV=production
GDPR_ENCRYPTION_ENABLED=true
GDPR_AUDIT_LOGGING=true
GDPR_TIMEOUT=60000
GDPR_MAX_RETRIES=5
GDPR_CACHE_TTL=600000
GDPR_MAX_CACHE_SIZE=2000
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Documentation Complète

- **Documentation détaillée** : `docs/GDPR_INTEGRATION.md`
- **Types TypeScript** : `types/gdpr.ts`
- **Tests d'intégration** : `tests/gdpr-integration.test.ts`
- **Script de test rapide** : `scripts/test-gdpr-integration.ts`

## 🔧 Configuration Avancée

### Standards de conformité multiples
```typescript
const gdprService = new GdprService({
  complianceStandards: ['GDPR', 'CCPA', 'HIPAA'],
  dataRetentionDays: 2555, // 7 ans
  encryptionEnabled: true,
  auditLogging: true
});
```

### Cache personnalisé
```typescript
const gdprService = new GdprService({
  // Cache TTL en millisecondes (5 minutes)
  cacheTtl: 5 * 60 * 1000,
  // Taille maximale du cache
  maxCacheSize: 1000
});
```

### Timeouts et retry
```typescript
const gdprService = new GdprService({
  timeout: 30000,        // 30 secondes
  maxRetries: 3,         // 3 tentatives
  retryDelay: 1000       // 1 seconde entre tentatives
});
```

## 🐛 Troubleshooting

### Problèmes courants

#### Service non configuré
```bash
Error: GDPR service not configured
```
**Solution** : Vérifier les variables d'environnement dans `.env.local`

#### Erreur d'authentification
```bash
Error: HTTP 401: Unauthorized
```
**Solution** : Vérifier la validité de `GDPR_API_KEY`

#### Erreur de chiffrement
```bash
Error: Encryption failed
```
**Solution** : Vérifier `GDPR_ENCRYPTION_KEY` (32 caractères)

### Logs de debug
```typescript
// Activer le debug
process.env.DEBUG = 'gdpr:*';

// Logs détaillés
console.log('[GDPR DEBUG] Service config:', {
  apiKey: gdprService.config.apiKey ? '***' : 'missing',
  organizationId: gdprService.config.organizationId
});
```

## 📞 Support

- **Documentation** : `docs/GDPR_INTEGRATION.md`
- **Tests** : `npm run test:gdpr:quick`
- **Issues** : [Votre repo]/issues
- **Support** : support@votreentreprise.com
- **DPO** : dpo@votreentreprise.com

---

## 🎉 Félicitations !

Votre intégration GDPR API est maintenant configurée et prête à assurer la conformité de votre SaaS aux réglementations de protection des données !

### Prochaines étapes recommandées :

1. **Tester l'intégration** : `npm run test:gdpr:quick`
2. **Configurer les webhooks** dans votre dashboard GDPR
3. **Intégrer la bannière de consentement** dans votre frontend
4. **Former votre équipe** sur les bonnes pratiques RGPD
5. **Planifier des audits** réguliers de conformité

*Développé avec ❤️ pour une conformité RGPD sans friction*
