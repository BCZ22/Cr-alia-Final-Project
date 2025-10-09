# Exemples d'utilisation de l'API Klaviyo

## Collection Postman

### Import de la collection
1. Ouvrez Postman
2. Cliquez sur "Import"
3. Copiez le JSON ci-dessous dans l'onglet "Raw text"

```json
{
  "info": {
    "name": "Crealia Klaviyo API",
    "description": "Collection complète pour tester l'intégration Klaviyo de Crealia",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "userId",
      "value": "123",
      "type": "string"
    },
    {
      "key": "klaviyoPrivateKey",
      "value": "pk_xxxxxxxxxx",
      "type": "string"
    },
    {
      "key": "klaviyoPublicKey",
      "value": "pk_xxxxxxxxxx",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Klaviyo Connect",
      "item": [
        {
          "name": "Connect Account",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"privateApiKey\": \"{{klaviyoPrivateKey}}\",\n  \"publicApiKey\": \"{{klaviyoPublicKey}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/connect",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "connect"]
            }
          }
        },
        {
          "name": "Get Connection Status",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/connect?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "connect"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        },
        {
          "name": "Disconnect Account",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/connect?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "connect"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Contacts Management",
      "item": [
        {
          "name": "Subscribe Contact",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"profile\": {\n    \"email\": \"contact@example.com\",\n    \"firstName\": \"Jean\",\n    \"lastName\": \"Dupont\",\n    \"phoneNumber\": \"+33123456789\",\n    \"customAttributes\": {\n      \"company\": \"Entreprise SA\",\n      \"role\": \"Manager\",\n      \"source\": \"website\"\n    },\n    \"tags\": [\"prospect\", \"qualifié\", \"web\"]\n  },\n  \"listId\": \"XxXxXx\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/subscribe",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "subscribe"]
            }
          }
        },
        {
          "name": "Update Contact",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"profileId\": \"01HXXXXXXXXX\",\n  \"updates\": {\n    \"firstName\": \"Jean-Pierre\",\n    \"customAttributes\": {\n      \"company\": \"Nouvelle Entreprise SA\",\n      \"role\": \"Directeur\",\n      \"lastContact\": \"2024-01-15\"\n    },\n    \"tags\": [\"prospect\", \"qualifié\", \"web\", \"contacté\"]\n  }\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/update-contact",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "update-contact"]
            }
          }
        }
      ]
    },
    {
      "name": "Events",
      "item": [
        {
          "name": "Trigger Event",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"event\": {\n    \"eventType\": \"Placed Order\",\n    \"eventData\": {\n      \"orderId\": \"ORD-12345\",\n      \"total\": 99.99,\n      \"currency\": \"EUR\",\n      \"shippingMethod\": \"standard\",\n      \"items\": [\n        {\n          \"name\": \"Produit A\",\n          \"price\": 49.99,\n          \"quantity\": 1,\n          \"category\": \"Électronique\"\n        },\n        {\n          \"name\": \"Produit B\",\n          \"price\": 50.00,\n          \"quantity\": 1,\n          \"category\": \"Vêtements\"\n        }\n      ]\n    },\n    \"profileId\": \"01HXXXXXXXXX\"\n  }\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/trigger-event",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "trigger-event"]
            }
          }
        },
        {
          "name": "Get Supported Event Types",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/trigger-event?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "trigger-event"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Marketing Data",
      "item": [
        {
          "name": "Get Lists",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/get-lists?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "get-lists"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        },
        {
          "name": "Get Segments",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/get-segments?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "get-segments"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        },
        {
          "name": "Get Campaigns",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/get-campaigns?userId={{userId}}&status=sent",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "get-campaigns"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                },
                {
                  "key": "status",
                  "value": "sent"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Sync",
      "item": [
        {
          "name": "Sync All Data",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"syncOptions\": {\n    \"syncLists\": true,\n    \"syncSegments\": true,\n    \"syncCampaigns\": true,\n    \"syncProfiles\": false,\n    \"syncEvents\": false,\n    \"forceRefresh\": false\n  }\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/sync",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "sync"]
            }
          }
        },
        {
          "name": "Get Sync Status",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/sync?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "sync"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Webhooks",
      "item": [
        {
          "name": "Create Webhook",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"webhookUrl\": \"https://your-domain.com/api/klaviyo/webhook-receiver\",\n  \"events\": [\n    \"email_sent\",\n    \"email_opened\",\n    \"email_clicked\",\n    \"email_bounced\",\n    \"email_unsubscribed\"\n  ],\n  \"secret\": \"your-webhook-secret\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/webhooks",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "webhooks"]
            }
          }
        },
        {
          "name": "Get Webhooks",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/klaviyo/webhooks?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "klaviyo", "webhooks"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

## Exemples cURL

### 1. Connexion d'un compte Klaviyo

```bash
curl -X POST http://localhost:3000/api/klaviyo/connect \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "privateApiKey": "pk_xxxxxxxxxx",
    "publicApiKey": "pk_xxxxxxxxxx"
  }'
```

### 2. Vérification du statut de connexion

```bash
curl -X GET "http://localhost:3000/api/klaviyo/connect?userId=123"
```

### 3. Ajout d'un contact

```bash
curl -X POST http://localhost:3000/api/klaviyo/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "profile": {
      "email": "contact@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "phoneNumber": "+33123456789",
      "customAttributes": {
        "company": "Entreprise SA",
        "role": "Manager",
        "source": "website"
      },
      "tags": ["prospect", "qualifié", "web"]
    },
    "listId": "XxXxXx"
  }'
```

### 4. Mise à jour d'un contact

```bash
curl -X PATCH http://localhost:3000/api/klaviyo/update-contact \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "profileId": "01HXXXXXXXXX",
    "updates": {
      "firstName": "Jean-Pierre",
      "customAttributes": {
        "company": "Nouvelle Entreprise SA",
        "role": "Directeur",
        "lastContact": "2024-01-15"
      },
      "tags": ["prospect", "qualifié", "web", "contacté"]
    }
  }'
```

### 5. Déclenchement d'un événement

```bash
curl -X POST http://localhost:3000/api/klaviyo/trigger-event \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "event": {
      "eventType": "Placed Order",
      "eventData": {
        "orderId": "ORD-12345",
        "total": 99.99,
        "currency": "EUR",
        "shippingMethod": "standard",
        "items": [
          {
            "name": "Produit A",
            "price": 49.99,
            "quantity": 1,
            "category": "Électronique"
          },
          {
            "name": "Produit B",
            "price": 50.00,
            "quantity": 1,
            "category": "Vêtements"
          }
        ]
      },
      "profileId": "01HXXXXXXXXX"
    }
  }'
```

### 6. Récupération des listes

```bash
curl -X GET "http://localhost:3000/api/klaviyo/get-lists?userId=123"
```

### 7. Récupération des segments

```bash
curl -X GET "http://localhost:3000/api/klaviyo/get-segments?userId=123"
```

### 8. Récupération des campagnes (filtrées par statut)

```bash
curl -X GET "http://localhost:3000/api/klaviyo/get-campaigns?userId=123&status=sent"
```

### 9. Synchronisation des données

```bash
curl -X POST http://localhost:3000/api/klaviyo/sync \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "syncOptions": {
      "syncLists": true,
      "syncSegments": true,
      "syncCampaigns": true,
      "syncProfiles": false,
      "syncEvents": false,
      "forceRefresh": false
    }
  }'
```

### 10. Vérification du statut de synchronisation

```bash
curl -X GET "http://localhost:3000/api/klaviyo/sync?userId=123"
```

### 11. Création d'un webhook

```bash
curl -X POST http://localhost:3000/api/klaviyo/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "webhookUrl": "https://your-domain.com/api/klaviyo/webhook-receiver",
    "events": [
      "email_sent",
      "email_opened",
      "email_clicked",
      "email_bounced",
      "email_unsubscribed"
    ],
    "secret": "your-webhook-secret"
  }'
```

### 12. Récupération des webhooks

```bash
curl -X GET "http://localhost:3000/api/klaviyo/webhooks?userId=123"
```

## Tests de charge avec Apache Bench

### Test de l'endpoint de connexion

```bash
ab -n 100 -c 10 -p connect_payload.json -T application/json http://localhost:3000/api/klaviyo/connect
```

### Test de l'endpoint de synchronisation

```bash
ab -n 50 -c 5 -p sync_payload.json -T application/json http://localhost:3000/api/klaviyo/sync
```

## Fichiers de payload pour les tests

### connect_payload.json
```json
{
  "userId": 123,
  "privateApiKey": "pk_xxxxxxxxxx",
  "publicApiKey": "pk_xxxxxxxxxx"
}
```

### sync_payload.json
```json
{
  "userId": 123,
  "syncOptions": {
    "syncLists": true,
    "syncSegments": true,
    "syncCampaigns": true,
    "syncProfiles": false,
    "syncEvents": false,
    "forceRefresh": false
  }
}
```

## Notes importantes

1. **Variables d'environnement** : Assurez-vous que toutes les variables d'environnement sont configurées
2. **Base de données** : La base de données doit être accessible et les tables Klaviyo créées
3. **Clés API** : Remplacez les clés API par de vraies clés Klaviyo
4. **URLs** : Ajustez les URLs selon votre environnement (localhost, staging, production)
5. **Rate limiting** : Respectez les limites de taux de l'API Klaviyo
6. **Sécurité** : N'utilisez jamais de vraies clés API dans les exemples de production 