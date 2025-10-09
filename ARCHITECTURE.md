# 🏗️ Architecture Crealia - SaaS Complet de Création et Analyse de Contenu

## 📋 Vue d'ensemble

Crealia est une plateforme SaaS complète qui regroupe toutes les fonctionnalités de Hypic, Photoroom, FaceApp, Lightroom et Picstrat, avec des capacités d'analyse avancées et d'intégration sociale.

## 🎯 Objectifs Architecturaux

- **Scalabilité** : Architecture microservices avec support GPU pour l'IA
- **Sécurité** : Conformité RGPD/CCPA, chiffrement end-to-end
- **Performance** : Pipeline média optimisé, cache intelligent
- **Évolutivité** : Support multi-tenant, mode agence
- **Fiabilité** : Monitoring complet, observabilité

## 🏛️ Architecture Générale

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 + React 18 + TypeScript + Tailwind CSS + shadcn/ui │
│  • Photo Editor (Canvas API + WebGL)                          │
│  • Video Editor (WebCodecs + WebRTC)                          │
│  • Face Editor (MediaPipe.js + TensorFlow.js)                 │
│  • AI Art Generator (Stable Diffusion API)                    │
│  • Analytics Dashboard (Recharts + D3.js)                     │
│  • Social Integration UI                                       │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes + Express.js + Helmet + Rate Limiting     │
│  • Authentication & Authorization (JWT + OAuth2)              │
│  • Request Validation (Zod + class-validator)                 │
│  • API Versioning (v1, v2)                                    │
│  • CORS & Security Headers                                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Microservices Architecture                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ Auth Service│ │Media Service│ │Editor Service│ │ ML Service  ││
│  │             │ │             │ │             │ │             ││
│  │ • OAuth2    │ │ • Upload    │ │ • Photo Edit│ │ • Face AI   ││
│  │ • JWT       │ │ • Transcode │ │ • Video Edit│ │ • Style Xfer││
│  │ • RBAC      │ │ • Thumbnail │ │ • Timeline  │ │ • Upscale   ││
│  │ • Sessions  │ │ • Metadata  │ │ • Effects   │ │ • Generate  ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │Analytics    │ │Scheduler    │ │Social       │ │Notification││
│  │Service      │ │Service      │ │Integration  │ │Service      ││
│  │             │ │             │ │Service      │ │             ││
│  │ • Metrics   │ │ • Calendar  │ │ • OAuth2    │ │ • Email     ││
│  │ • Reports   │ │ • Cron Jobs │ │ • Publish   │ │ • Push      ││
│  │ • Insights  │ │ • Queues    │ │ • Webhooks  │ │ • SMS       ││
│  │ • Trends    │ │ • Approval  │ │ • Analytics │ │ • Slack     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ PostgreSQL  │ │    Redis    │ │ ClickHouse  │ │    S3       ││
│  │             │ │             │ │             │ │             ││
│  │ • Users     │ │ • Cache     │ │ • Analytics │ │ • Assets    ││
│  │ • Projects  │ │ • Sessions  │ │ • Metrics   │ │ • Exports   ││
│  │ • Jobs      │ │ • Queues    │ │ • Events    │ │ • Backups   ││
│  │ • Metadata  │ │ • Rate Lim  │ │ • Reports   │ │ • CDN       ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  Docker + Kubernetes + Terraform                               │
│  • Auto-scaling GPU nodes (ML workloads)                      │
│  • Load balancing (NGINX)                                      │
│  • Service mesh (Istio)                                        │
│  • Monitoring (Prometheus + Grafana)                           │
│  • Logging (ELK Stack)                                         │
│  • CI/CD (GitHub Actions)                                      │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Services Détaillés

### 1. Auth Service
```typescript
interface AuthService {
  // OAuth2 flows
  oauth2Connect(platform: string): Promise<string>
  oauth2Callback(platform: string, code: string): Promise<TokenSet>
  
  // JWT management
  generateToken(user: User): string
  validateToken(token: string): User
  
  // RBAC
  checkPermission(user: User, resource: string, action: string): boolean
  assignRole(userId: string, role: Role): Promise<void>
}
```

### 2. Media Service
```typescript
interface MediaService {
  // Upload & processing
  presignUpload(filename: string, contentType: string): Promise<PresignedUrl>
  processUpload(file: Buffer, metadata: FileMetadata): Promise<Asset>
  
  // Transcoding
  generateThumbnails(assetId: string): Promise<Thumbnail[]>
  transcodeVideo(assetId: string, format: VideoFormat): Promise<Asset>
  
  // Metadata extraction
  extractMetadata(file: Buffer): Promise<MediaMetadata>
  generateProxies(assetId: string): Promise<ProxyAsset[]>
}
```

### 3. Editor Service
```typescript
interface EditorService {
  // Photo editing
  applyPhotoEdit(assetId: string, operations: PhotoOperation[]): Promise<Job>
  backgroundRemoval(assetId: string): Promise<Job>
  faceDetection(assetId: string): Promise<FaceData[]>
  
  // Video editing
  createVideoProject(name: string): Promise<VideoProject>
  addClipToTimeline(projectId: string, clip: VideoClip): Promise<void>
  applyVideoEffect(clipId: string, effect: VideoEffect): Promise<void>
  
  // Timeline operations
  trimClip(clipId: string, start: number, end: number): Promise<void>
  splitClip(clipId: string, time: number): Promise<VideoClip[]>
  addTransition(clip1Id: string, clip2Id: string, transition: Transition): Promise<void>
}
```

### 4. ML Service
```typescript
interface MLService {
  // Face processing
  faceLandmarks(image: Buffer): Promise<Landmark[]>
  faceBeautify(image: Buffer, params: BeautifyParams): Promise<Buffer>
  faceSwap(source: Buffer, target: Buffer): Promise<Buffer>
  
  // Style transfer
  styleTransfer(image: Buffer, style: string): Promise<Buffer>
  artisticFilter(image: Buffer, filter: string): Promise<Buffer>
  
  // AI generation
  generateImage(prompt: string, params: GenerateParams): Promise<Job>
  upscaleImage(image: Buffer, factor: number): Promise<Buffer>
  
  // Video AI
  autoSubtitles(videoId: string): Promise<Subtitle[]>
  beatDetection(audioId: string): Promise<Beat[]>
}
```

### 5. Analytics Service
```typescript
interface AnalyticsService {
  // Data collection
  trackEvent(event: AnalyticsEvent): Promise<void>
  collectSocialMetrics(platform: string, accountId: string): Promise<Metrics>
  
  // Analysis
  generateInsights(userId: string, period: DateRange): Promise<Insight[]>
  detectTrends(platform: string, hashtags: string[]): Promise<Trend[]>
  
  // Reports
  createReport(params: ReportParams): Promise<Report>
  scheduleReport(reportId: string, schedule: CronSchedule): Promise<void>
}
```

### 6. Social Integration Service
```typescript
interface SocialIntegrationService {
  // OAuth2 connections
  connectAccount(platform: string, userId: string): Promise<OAuthFlow>
  refreshToken(platform: string, accountId: string): Promise<TokenSet>
  
  // Publishing
  publishContent(content: Content, platforms: Platform[]): Promise<PublishJob[]>
  schedulePublish(content: Content, platforms: Platform[], publishAt: Date): Promise<void>
  
  // Analytics
  fetchMetrics(platform: string, accountId: string, period: DateRange): Promise<Metrics>
  webhookHandler(platform: string, payload: any): Promise<void>
}
```

## 🗄️ Modèles de Données

### Core Models
```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  username          String   @unique
  role              UserRole @default(USER)
  subscription      Subscription?
  projects          Project[]
  assets            Asset[]
  socialAccounts    SocialAccount[]
  analytics         AnalyticsData[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Project {
  id                String   @id @default(cuid())
  name              String
  type              ProjectType
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  assets            Asset[]
  exports           Export[]
  collaborations    ProjectCollaboration[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Asset {
  id                String   @id @default(cuid())
  filename          String
  originalFilename  String
  mimeType          String
  size              Int
  width             Int?
  height            Int?
  duration          Float?
  storageKey        String
  metadata          Json
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  projectId         String?
  project           Project? @relation(fields: [projectId], references: [id])
  thumbnails        Thumbnail[]
  jobs              Job[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Job {
  id                String   @id @default(cuid())
  type              JobType
  status            JobStatus @default(PENDING)
  progress          Int      @default(0)
  payload           Json
  result            Json?
  error             String?
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  assetId           String?
  asset             Asset?   @relation(fields: [assetId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Media Processing Models
```prisma
model VideoProject {
  id                String   @id @default(cuid())
  name              String
  duration          Float
  fps               Int
  resolution        String
  tracks            VideoTrack[]
  effects           VideoEffect[]
  transitions       VideoTransition[]
  exports           VideoExport[]
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model VideoTrack {
  id                String   @id @default(cuid())
  type              TrackType
  name              String
  muted             Boolean  @default(false)
  locked            Boolean  @default(false)
  clips             VideoClip[]
  videoProjectId    String
  videoProject      VideoProject @relation(fields: [videoProjectId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model VideoClip {
  id                String   @id @default(cuid())
  startTime         Float
  endTime           Float
  trimStart         Float    @default(0)
  trimEnd           Float    @default(0)
  assetId           String
  asset             Asset    @relation(fields: [assetId], references: [id])
  trackId           String
  track             VideoTrack @relation(fields: [trackId], references: [id])
  effects           ClipEffect[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Social Integration Models
```prisma
model SocialAccount {
  id                String   @id @default(cuid())
  platform          String
  platformUserId    String
  username          String
  accessToken       String
  refreshToken      String?
  tokenExpiresAt    DateTime?
  isActive          Boolean  @default(true)
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  publishes         Publish[]
  analytics         SocialAnalytics[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Publish {
  id                String   @id @default(cuid())
  platform          String
  content           Json
  status            PublishStatus @default(SCHEDULED)
  publishedAt       DateTime?
  scheduledAt       DateTime
  socialAccountId   String
  socialAccount     SocialAccount @relation(fields: [socialAccountId], references: [id])
  analytics         PublishAnalytics[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## 🔄 Pipeline de Traitement

### Photo Processing Pipeline
```
1. Upload → Validate → Extract Metadata → Generate Thumbnails
2. Auto Enhance → Background Removal → Face Detection
3. Apply Edits → Style Transfer → Export → Store Result
```

### Video Processing Pipeline
```
1. Upload → Validate → Extract Metadata → Generate Proxies
2. Timeline Assembly → Apply Effects → Render Preview
3. Final Render → Export → Upload to CDN → Notify User
```

### AI Processing Pipeline
```
1. Request → Queue Job → Load Model → Process → Cache Result
2. Generate Thumbnail → Store → Update Job Status → Notify
```

## 🚀 Déploiement et Infrastructure

### Docker Services
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - S3_BUCKET=${S3_BUCKET}
  
  workers:
    build: .
    command: npm run workers
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=crealia
      - POSTGRES_USER=crealia
      - POSTGRES_PASSWORD=${DB_PASSWORD}
```

### Kubernetes Manifests
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: crealia-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: crealia-app
  template:
    metadata:
      labels:
        app: crealia-app
    spec:
      containers:
      - name: app
        image: crealia:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: crealia-secrets
              key: database-url
```

## 📊 Monitoring et Observabilité

### Metrics (Prometheus)
- Request latency and throughput
- Job queue length and processing time
- GPU utilization for ML workloads
- Storage usage and costs
- User engagement metrics

### Logging (ELK Stack)
- Structured logging with Winston
- Request tracing with correlation IDs
- Error tracking with Sentry
- Performance profiling

### Alerting
- High error rates
- Job queue backlog
- Storage quota exceeded
- GPU node failures
- Security incidents

## 🔒 Sécurité

### Authentication & Authorization
- JWT tokens with short expiration
- OAuth2 for social integrations
- Role-based access control (RBAC)
- API rate limiting

### Data Protection
- Encryption at rest (S3 SSE)
- Encryption in transit (TLS 1.3)
- PII data anonymization
- GDPR compliance tools

### Infrastructure Security
- VPC with private subnets
- WAF for DDoS protection
- Secrets management (AWS KMS)
- Container image scanning

## 📈 Scalabilité

### Horizontal Scaling
- Auto-scaling groups for web servers
- GPU node pools for ML workloads
- Database read replicas
- CDN for static assets

### Performance Optimization
- Redis caching layer
- Database query optimization
- Asset compression and optimization
- Lazy loading and pagination

### Cost Optimization
- Spot instances for batch jobs
- Auto-shutdown for dev environments
- Storage lifecycle policies
- Resource tagging and monitoring
