# 🚀 Collaboration Avancée - Guide de Démarrage

## Vue d'ensemble

Le système de collaboration avancée de Crealia offre des fonctionnalités professionnelles de collaboration en temps réel pour l'édition vidéo, incluant :

- **WebSocket temps réel** avec synchronisation instantanée
- **Résolution de conflits par IA** pour une collaboration fluide
- **Streaming WebRTC** avec qualité adaptative
- **Monitoring de performance** en temps réel
- **Sécurité et audit** complets

## 🏃‍♂️ Démarrage Rapide

### 1. Installation des Dépendances

```bash
npm install
```

### 2. Configuration de l'Environnement

Créez un fichier `.env.local` :

```env
# Base de données
DATABASE_URL="postgresql://crealia:password@localhost:5432/crealia"

# Redis pour WebSocket
REDIS_URL="redis://localhost:6379"

# WebSocket
WEBSOCKET_URL="ws://localhost:3001"
WEBSOCKET_PORT=3001

# WebRTC
WEBRTC_STUN_SERVERS="stun:stun.l.google.com:19302"
WEBRTC_TURN_SERVERS="turn:turn.example.com:3478"
WEBRTC_TURN_USERNAME="username"
WEBRTC_TURN_CREDENTIAL="password"

# Performance
PERFORMANCE_MONITORING=true
METRICS_RETENTION_DAYS=30

# Sécurité
AUDIT_LOG_RETENTION_DAYS=90
SECURITY_ALERT_THRESHOLD=50
RATE_LIMIT_WINDOW_MS=60000

# Fonctionnalités
FEATURE_COLLABORATION=true
FEATURE_AI=true
FEATURE_STREAMING=true
COLLABORATION_ENABLE_WEBRTC=true
COLLABORATION_ENABLE_AI=true
```

### 3. Base de Données

```bash
# Générer le client Prisma
npm run db:generate

# Exécuter les migrations
npm run db:migrate

# (Optionnel) Peupler avec des données de test
npm run db:seed
```

### 4. Démarrage des Services

```bash
# Démarrer Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Démarrer le serveur principal
npm run server:dev
```

### 5. Tests

```bash
# Tests unitaires
npm run test:advanced-collaboration

# Tests E2E
npm run test:advanced-collaboration:e2e

# Script de test complet
npm run test:advanced-collaboration:script
```

## 🏗️ Architecture

### Services Principaux

```
src/
├── services/
│   ├── websocket/          # WebSocket temps réel
│   ├── ai/                 # Résolution de conflits par IA
│   ├── webrtc/             # Streaming WebRTC
│   ├── monitoring/         # Performance et métriques
│   └── security/           # Sécurité et audit
├── components/
│   └── ui/collaboration/   # Composants UI
├── hooks/
│   └── useAdvancedCollaboration.ts
└── servers/
    └── main.server.ts      # Serveur principal
```

### Flux de Données

```mermaid
graph TB
    A[Client 1] -->|WebSocket| B[WebSocket Service]
    C[Client 2] -->|WebSocket| B
    B -->|Redis Pub/Sub| D[Redis Cluster]
    B -->|Conflicts| E[AI Service]
    B -->|Streaming| F[WebRTC Service]
    B -->|Metrics| G[Performance Service]
    B -->|Audit| H[Security Service]
```

## 🎨 Utilisation

### Hook de Collaboration

```typescript
import { useAdvancedCollaboration } from '@/src/hooks/useAdvancedCollaboration';

function VideoEditor() {
  const {
    isConnected,
    users,
    conflicts,
    performanceMetrics,
    updateCursor,
    sendTimelineChanges,
    resolveConflict
  } = useAdvancedCollaboration(projectId, userId);

  return (
    <div>
      <WebSocketStatus 
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        latency={latency}
      />
      
      <ConflictResolution
        conflicts={conflicts}
        onResolve={resolveConflict}
        onDismiss={dismissConflict}
      />
      
      <PerformanceMonitor
        metrics={performanceMetrics}
        projectId={projectId}
      />
    </div>
  );
}
```

### Composants UI

#### WebSocketStatus
Affiche le statut de connexion WebSocket avec latence et détails.

```typescript
<WebSocketStatus
  isConnected={isConnected}
  connectionStatus="connected"
  latency={45}
  lastMessage={new Date()}
/>
```

#### ConflictResolution
Gère la résolution automatique et manuelle des conflits.

```typescript
<ConflictResolution
  conflicts={conflicts}
  onResolve={handleResolve}
  onDismiss={handleDismiss}
/>
```

#### WebRTCStreaming
Contrôles de streaming WebRTC avec qualité adaptative.

```typescript
<WebRTCStreaming
  sessionId={sessionId}
  isHost={true}
  onStartStream={handleStartStream}
  onStopStream={handleStopStream}
  onQualityChange={handleQualityChange}
/>
```

#### PerformanceMonitor
Monitoring en temps réel des métriques de performance.

```typescript
<PerformanceMonitor
  projectId={projectId}
  metrics={metrics}
  alerts={alerts}
/>
```

#### SecurityDashboard
Tableau de bord de sécurité avec alertes et logs d'audit.

```typescript
<SecurityDashboard
  projectId={projectId}
  alerts={alerts}
  auditLogs={auditLogs}
/>
```

## 🔧 Configuration Avancée

### WebSocket

```typescript
// Configuration personnalisée
const websocketConfig = {
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
};
```

### WebRTC

```typescript
// Configuration ICE servers
const webrtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
  ],
  sdpSemantics: 'unified-plan',
  bundlePolicy: 'max-bundle'
};
```

### Performance

```typescript
// Seuils d'alerte personnalisés
const performanceThresholds = {
  latency: { warning: 200, critical: 500 },
  memory: { warning: 80, critical: 90 },
  cpu: { warning: 70, critical: 90 },
  errorRate: { warning: 5, critical: 10 }
};
```

## 📊 Monitoring

### Métriques Disponibles

- **Utilisateurs actifs** : Nombre d'utilisateurs connectés
- **Connexions WebSocket** : Connexions actives
- **Streams WebRTC** : Streams vidéo actifs
- **Latence** : Temps de réponse moyen
- **Mémoire** : Utilisation de la mémoire
- **CPU** : Utilisation du processeur
- **Taux d'erreur** : Pourcentage d'erreurs
- **Taux de conflits** : Conflits détectés
- **Taux de résolution** : Conflits résolus

### Alertes

Le système génère automatiquement des alertes pour :

- Latence élevée (> 500ms)
- Utilisation mémoire élevée (> 90%)
- Taux d'erreur élevé (> 10%)
- Activité suspecte détectée
- Tentatives d'accès non autorisées

### Logs d'Audit

Tous les événements sont enregistrés avec :

- Timestamp précis
- Utilisateur et projet
- Action effectuée
- Adresse IP et User-Agent
- Score de risque
- Métadonnées contextuelles

## 🔒 Sécurité

### Permissions

```typescript
enum CollaborationRole {
  OWNER = 'owner',        // Pleins droits
  EDITOR = 'editor',      // Édition complète
  COMMENTER = 'commenter', // Commentaires seulement
  VIEWER = 'viewer'       // Lecture seule
}
```

### Rate Limiting

- **API calls** : 100 requêtes/minute
- **Login attempts** : 5 tentatives/15 minutes
- **Data export** : 3 exports/heure
- **WebSocket events** : 1000 événements/minute

### Audit

Tous les événements sensibles sont audités :

- Connexions/déconnexions
- Modifications de projet
- Changements de permissions
- Accès aux données
- Actions d'administration

## 🧪 Tests

### Tests Unitaires

```bash
# Tests WebSocket
npm run test:websocket

# Tests WebRTC
npm run test:webrtc

# Tests Performance
npm run test:performance

# Tests Sécurité
npm run test:security

# Tests IA
npm run test:ai
```

### Tests E2E

```bash
# Tests de collaboration avancée
npm run test:advanced-collaboration:e2e

# Tests de performance
npm run test:performance:e2e

# Tests de sécurité
npm run test:security:e2e
```

### Tests de Charge

```bash
# Simulation 50+ utilisateurs
npm run test:load -- --users=50 --duration=10m

# Test WebRTC
npm run test:webrtc -- --streams=10 --duration=5m
```

## 🚀 Déploiement

### Docker

```bash
# Build et démarrage
docker-compose up -d

# Logs
docker-compose logs -f

# Arrêt
docker-compose down
```

### Kubernetes

```bash
# Déploiement
kubectl apply -f k8s/

# Vérification
kubectl get pods
kubectl get services

# Logs
kubectl logs -f deployment/crealia-collaboration
```

### Variables d'Environnement de Production

```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db:5432/crealia
REDIS_URL=redis://redis:6379
WEBSOCKET_URL=wss://api.crealia.com
WEBRTC_TURN_SERVERS=turn:turn.crealia.com:3478
PERFORMANCE_MONITORING=true
SECURITY_ALERT_THRESHOLD=30
```

## 🔧 Dépannage

### Problèmes Courants

#### WebSocket déconnecté
```bash
# Vérifier Redis
redis-cli ping

# Vérifier les logs
docker-compose logs websocket

# Redémarrer le service
docker-compose restart websocket
```

#### Conflits non résolus
```bash
# Vérifier le service IA
npm run test:ai

# Vérifier les logs de conflits
grep "conflict" logs/app.log

# Redémarrer le service
docker-compose restart ai-service
```

#### Performance dégradée
```bash
# Vérifier les métriques
curl http://localhost:3000/api/collaboration/performance/metrics

# Vérifier les ressources
docker stats

# Optimiser la configuration
# Ajuster les limites dans server.config.ts
```

### Logs

```bash
# Logs en temps réel
tail -f logs/app.log

# Logs d'erreur
grep "ERROR" logs/app.log

# Logs de performance
grep "PERFORMANCE" logs/app.log

# Logs de sécurité
grep "SECURITY" logs/app.log
```

## 📚 API Reference

### WebSocket Events

#### Client → Server
```typescript
// Mise à jour du curseur
socket.emit('cursor_update', { position: { x: 100, y: 200 } });

// Élément actif
socket.emit('element_active', { elementId: 'clip1', elementType: 'clip' });

// Changements de timeline
socket.emit('timeline_change', { changes: [...] });

// Commentaire
socket.emit('comment_add', { content: 'Hello', elementId: 'clip1' });
```

#### Server → Client
```typescript
// Événement de collaboration
socket.on('collaboration_event', (message) => {
  console.log('Event:', message.type, message.data);
});

// Liste des utilisateurs
socket.on('users_list', (data) => {
  console.log('Users:', data.users);
});

// Conflit détecté
socket.on('conflict_detected', (data) => {
  console.log('Conflicts:', data.conflicts);
});
```

### REST API

#### Conflits
```bash
# Détecter des conflits
POST /api/collaboration/conflicts/detect
{
  "projectId": "proj1",
  "changes": [...]
}

# Résoudre un conflit
POST /api/collaboration/conflicts/:id/resolve
{
  "resolution": {...}
}
```

#### Performance
```bash
# Métriques
GET /api/collaboration/performance/metrics?projectId=proj1

# Rapport
POST /api/collaboration/performance/report
```

#### Sécurité
```bash
# Alertes
GET /api/collaboration/security/alerts

# Logs d'audit
GET /api/collaboration/audit?projectId=proj1&startDate=2023-01-01
```

## 🤝 Contribution

### Guidelines

1. **Code Style** : ESLint + Prettier
2. **Tests** : Coverage minimum 80%
3. **Documentation** : JSDoc pour toutes les fonctions
4. **Commits** : Convention Conventional Commits
5. **PR** : Description détaillée + tests

### Workflow

1. Fork du repository
2. Création d'une branche feature
3. Développement avec tests
4. Pull Request avec description
5. Review et merge

## 📞 Support

### Contact

- **Email** : support@crealia.com
- **Discord** : #collaboration-support
- **Documentation** : https://docs.crealia.com
- **Issues** : GitHub Issues

### Ressources

- **Guide utilisateur** : `/docs/user-guide.md`
- **API Reference** : `/docs/api-reference.md`
- **Troubleshooting** : `/docs/troubleshooting.md`
- **Changelog** : `/CHANGELOG.md`

---

## 🎉 Conclusion

Le système de collaboration avancée de Crealia offre une expérience professionnelle de collaboration en temps réel pour l'édition vidéo. Avec ses fonctionnalités WebSocket, IA, WebRTC, monitoring et sécurité, il est prêt pour les équipes de 50+ utilisateurs.

**Status** : ✅ **PRODUCTION READY**

Pour plus d'informations, consultez la [documentation complète](./PR10_ADVANCED_COLLABORATION.md).
