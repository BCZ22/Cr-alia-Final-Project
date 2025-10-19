# 📖 API Reference - Créalia

Documentation complète de toutes les API REST de Créalia.

---

## 📋 Table des Matières

1. [Authentication](#authentication)
2. [Stripe & Paiements](#stripe--paiements)
3. [AI Chat](#ai-chat)
4. [AI Generation](#ai-generation)
5. [Studio](#studio)
6. [Forum](#forum)
7. [GDPR](#gdpr)
8. [Health & Monitoring](#health--monitoring)
9. [Cron Jobs](#cron-jobs)

---

## 🔐 Authentication

Toutes les routes protégées nécessitent une session NextAuth valide.

### **POST /api/auth/signin**

Connexion utilisateur (NextAuth).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (302):**
Redirection vers la page de callback.

---

### **POST /api/auth/signup**

Inscription utilisateur (custom endpoint).

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "userId": "user_123"
}
```

---

## 💳 Stripe & Paiements

### **POST /api/checkout/create-session**

Créer une session de paiement Stripe.

**Auth:** Required

**Request:**
```json
{
  "planId": "viral",
  "billingCycle": "monthly",
  "affiliateCode": "PROMO10"
}
```

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Errors:**
- `401`: Non authentifié
- `400`: Plan invalide
- `500`: Erreur Stripe

---

### **GET /api/checkout/session-info**

Récupérer les informations d'une session Stripe.

**Auth:** Required

**Query:**
- `session_id`: ID de la session Stripe

**Response (200):**
```json
{
  "sessionId": "cs_test_...",
  "status": "complete",
  "customerEmail": "user@example.com",
  "amountTotal": 3900,
  "currency": "usd",
  "planId": "viral",
  "billingCycle": "monthly"
}
```

---

### **POST /api/billing/portal**

Créer une session du portail client Stripe.

**Auth:** Required

**Response (200):**
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

---

### **POST /api/stripe-webhook**

Webhook Stripe (événements de paiement).

**Auth:** Stripe signature

**Events:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Response (200):**
```json
{
  "received": true
}
```

---

## 💬 AI Chat

### **POST /api/chat/create-session**

Créer une nouvelle session de chat.

**Auth:** Required

**Response (201):**
```json
{
  "sessionId": "session_123",
  "message": "Bonjour ! Comment puis-je vous aider ?"
}
```

---

### **POST /api/chat/message**

Envoyer un message au chatbot.

**Auth:** Required

**Request:**
```json
{
  "sessionId": "session_123",
  "message": "Comment créer une vidéo ?"
}
```

**Response (200):**
```json
{
  "messageId": "msg_456",
  "content": "Pour créer une vidéo, allez dans Créalia Studio...",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

### **GET /api/chat/history**

Récupérer l'historique d'une session de chat.

**Auth:** Required

**Query:**
- `sessionId`: ID de la session

**Response (200):**
```json
{
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "Bonjour",
      "createdAt": "2024-01-20T10:00:00Z"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "content": "Bonjour ! Comment puis-je vous aider ?",
      "createdAt": "2024-01-20T10:00:01Z"
    }
  ]
}
```

---

### **GET /api/chat/sessions**

Récupérer toutes les sessions de chat d'un utilisateur.

**Auth:** Required

**Response (200):**
```json
{
  "sessions": [
    {
      "id": "session_1",
      "createdAt": "2024-01-20T10:00:00Z",
      "messageCount": 5,
      "isActive": true
    }
  ]
}
```

---

## 🤖 AI Generation

### **POST /api/ai/images**

Générer une image avec DALL-E 3.

**Auth:** Required

**Request:**
```json
{
  "prompt": "A futuristic city at sunset",
  "size": "1024x1024",
  "quality": "standard"
}
```

**Response (200):**
```json
{
  "jobId": "job_123",
  "status": "COMPLETED",
  "output": {
    "urls": [
      "https://oaidalleapiprodscus.blob.core.windows.net/..."
    ]
  }
}
```

**Errors:**
- `400`: Prompt invalide
- `429`: Rate limit dépassé
- `500`: Erreur OpenAI

---

### **POST /api/ai/voice**

Générer une voix-off avec TTS.

**Auth:** Required

**Request:**
```json
{
  "text": "Bonjour, bienvenue sur Créalia",
  "voice": "alloy",
  "speed": 1.0
}
```

**Response (200):**
```json
{
  "jobId": "job_456",
  "status": "COMPLETED",
  "output": {
    "audioUrl": "/api/ai/voice/job_456/audio.mp3"
  }
}
```

---

### **POST /api/ai/subtitles**

Générer des sous-titres avec Whisper.

**Auth:** Required

**Request:**
```json
{
  "audioUrl": "https://example.com/audio.mp3",
  "language": "fr"
}
```

**Response (200):**
```json
{
  "jobId": "job_789",
  "status": "COMPLETED",
  "output": {
    "subtitles": [
      {
        "start": 0.0,
        "end": 2.5,
        "text": "Bonjour, bienvenue sur Créalia"
      }
    ]
  }
}
```

---

## 🎬 Studio

### **POST /api/studio/upload**

Uploader un fichier média.

**Auth:** Required

**Request:** `multipart/form-data`
- `file`: Fichier à uploader (max 100MB)

**Response (200):**
```json
{
  "fileId": "file_123",
  "url": "/uploads/users/user_123/file_123.mp4",
  "size": 15728640,
  "mimeType": "video/mp4"
}
```

**Errors:**
- `400`: Fichier trop volumineux
- `415`: Type de fichier non supporté

---

### **POST /api/studio/video/compose**

Composer/éditer une vidéo.

**Auth:** Required

**Request:**
```json
{
  "clips": [
    {
      "url": "/uploads/users/user_123/clip1.mp4",
      "startTime": 0,
      "endTime": 10
    }
  ],
  "transitions": ["fade"],
  "music": "/uploads/users/user_123/music.mp3",
  "outputFormat": "mp4"
}
```

**Response (200):**
```json
{
  "jobId": "job_999",
  "status": "PENDING",
  "estimatedTime": 60
}
```

---

### **GET /api/studio/jobs/:jobId**

Récupérer le statut d'un job Studio.

**Auth:** Required

**Response (200):**
```json
{
  "jobId": "job_999",
  "status": "COMPLETED",
  "progress": 100,
  "output": {
    "videoUrl": "/outputs/user_123/video_final.mp4"
  }
}
```

**Status:**
- `PENDING`: En attente
- `PROCESSING`: En cours
- `COMPLETED`: Terminé
- `FAILED`: Échoué

---

## 💭 Forum

### **GET /api/forum/topics**

Lister les topics du forum.

**Query:**
- `category`: Filtrer par catégorie
- `search`: Recherche textuelle
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre par page (défaut: 20)

**Response (200):**
```json
{
  "topics": [
    {
      "id": "topic_1",
      "title": "Comment créer une vidéo virale ?",
      "category": "questions",
      "userId": "user_123",
      "userName": "John Doe",
      "views": 145,
      "commentCount": 12,
      "isPinned": false,
      "isLocked": false,
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### **POST /api/forum/topics**

Créer un nouveau topic.

**Auth:** Required

**Request:**
```json
{
  "title": "Ma question",
  "content": "Contenu du topic...",
  "category": "questions"
}
```

**Response (201):**
```json
{
  "topicId": "topic_123",
  "title": "Ma question",
  "createdAt": "2024-01-20T10:30:00Z"
}
```

---

### **GET /api/forum/topics/:id**

Récupérer un topic spécifique.

**Response (200):**
```json
{
  "topic": {
    "id": "topic_1",
    "title": "...",
    "content": "...",
    "category": "questions",
    "userId": "user_123",
    "userName": "John Doe",
    "views": 146,
    "isPinned": false,
    "isLocked": false,
    "createdAt": "2024-01-20T10:00:00Z"
  },
  "comments": [
    {
      "id": "comment_1",
      "content": "Réponse...",
      "userId": "user_456",
      "userName": "Jane Smith",
      "createdAt": "2024-01-20T10:05:00Z"
    }
  ]
}
```

---

### **POST /api/forum/topics/:id/comments**

Ajouter un commentaire à un topic.

**Auth:** Required

**Request:**
```json
{
  "content": "Mon commentaire..."
}
```

**Response (201):**
```json
{
  "commentId": "comment_123",
  "content": "Mon commentaire...",
  "createdAt": "2024-01-20T10:30:00Z"
}
```

---

## 🔒 GDPR

### **POST /api/gdpr/export**

Exporter toutes les données utilisateur.

**Auth:** Required

**Response (200):**
Téléchargement d'un fichier JSON contenant toutes les données.

**Filename:** `crealia-data-export-{userId}-{timestamp}.json`

---

### **POST /api/gdpr/delete**

Supprimer toutes les données utilisateur.

**Auth:** Required

**Request:**
```json
{
  "confirmation": "DELETE_MY_DATA"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "All your data has been permanently deleted"
}
```

⚠️ **Attention:** Cette action est irréversible !

---

### **GET /api/gdpr/consent**

Récupérer les préférences de consentement.

**Auth:** Required

**Response (200):**
```json
{
  "consent": {
    "necessary": true,
    "analytics": true,
    "marketing": false,
    "preferences": true
  }
}
```

---

### **POST /api/gdpr/consent**

Mettre à jour les préférences de consentement.

**Auth:** Required

**Request:**
```json
{
  "analytics": true,
  "marketing": false,
  "preferences": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Consent preferences updated"
}
```

---

## ❤️ Health & Monitoring

### **GET /api/health**

Vérifier la santé de l'application.

**Response (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "memory": {
    "used": 256,
    "total": 1024,
    "percentage": 25
  },
  "uptime": 3600
}
```

**Status:**
- `healthy`: Tout fonctionne
- `degraded`: Problèmes mineurs
- `unhealthy`: Problèmes critiques

---

## ⏰ Cron Jobs

### **GET /api/cron/cleanup**

Nettoyage quotidien.

**Auth:** Bearer token (CRON_SECRET)

**Response (200):**
```json
{
  "success": true,
  "cleaned": 156,
  "timestamp": "2024-01-20T00:00:00Z"
}
```

---

### **GET /api/cron/metrics**

Collecte de métriques.

**Auth:** Bearer token (CRON_SECRET)

**Response (200):**
```json
{
  "success": true,
  "metrics": {
    "totalUsers": 1250,
    "activeUsers": 345,
    "totalPayments": 450,
    "activeChatSessions": 23,
    "pendingJobs": 5
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## 🔐 Authentication

Toutes les routes protégées utilisent NextAuth.js avec sessions HTTP-only cookies.

**Headers:**
```
Cookie: next-auth.session-token=xxx
```

**Erreurs d'authentification:**
- `401 Unauthorized`: Session invalide ou expirée
- `403 Forbidden`: Permissions insuffisantes

---

## 🚦 Rate Limiting

| Endpoint | Limite |
|----------|--------|
| API General | 100 req/min |
| AI Endpoints | 10 req/min |
| Upload | 20 req/min |
| Auth Login | 5 tentatives/15min |
| Auth Signup | 3 inscriptions/heure |

**Headers de réponse:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1640000000
```

**Erreur (429):**
```json
{
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

---

## 📝 Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

**Format d'erreur standard:**
```json
{
  "error": "Error message",
  "details": "Additional details",
  "code": "ERROR_CODE"
}
```

---

## 🔗 Liens Utiles

- [Postman Collection](../postman-collection.json)
- [OpenAPI Spec](../api-spec.yaml)
- [Setup Guide](SETUP.md)
- [Authentication Guide](USER_GUIDE.md#authentication)

---

**Documentation complète et à jour ! 📚**

