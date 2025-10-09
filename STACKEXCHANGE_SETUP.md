# Configuration Stack Exchange Integration

## Variables d'environnement requises

Ajoutez les variables suivantes à votre fichier `.env` :

```bash
# Stack Exchange API Configuration
STACKEXCHANGE_CLIENT_ID=your_client_id_here
STACKEXCHANGE_CLIENT_SECRET=your_client_secret_here
STACKEXCHANGE_REDIRECT_URI=https://yourdomain.com/api/stackexchange/connect/callback
STACKEXCHANGE_KEY=your_api_key_here
```

## Configuration de l'application Stack Exchange

### 1. Créer une application sur Stack Exchange

1. Allez sur [Stack Apps](https://stackapps.com/apps/oauth/register)
2. Connectez-vous avec votre compte Stack Exchange
3. Remplissez le formulaire d'inscription :
   - **Application Name** : `Crealia SaaS`
   - **Application Description** : `Intégration SaaS pour la gestion de contenu Stack Overflow`
   - **OAuth Domain** : `yourdomain.com`
   - **Application Website** : `https://yourdomain.com`
   - **Application Icon** : URL de votre logo (optionnel)

### 2. Récupérer les identifiants

Après validation de votre application, vous recevrez :
- **Client ID** : Identifiant unique de votre application
- **Client Secret** : Clé secrète pour l'authentification
- **API Key** : Clé pour les appels API (optionnelle mais recommandée)

### 3. Configurer les URLs de redirection

Dans les paramètres de votre application, configurez :
- **OAuth Redirect URI** : `https://yourdomain.com/api/stackexchange/connect/callback`

## Sécurité et bonnes pratiques

### Chiffrement des tokens

Les tokens d'accès et de rafraîchissement sont automatiquement chiffrés avant stockage en base de données.

### Gestion des permissions

L'application demande les permissions minimales nécessaires :
- `read_inbox` : Lecture des messages privés
- `write_access` : Publication de réponses
- `private_info` : Accès aux informations du profil

### Validation des entrées

Toutes les entrées utilisateur sont validées et sanitizées :
- Longueur minimale des réponses : 15 caractères
- Longueur maximale : 30 000 caractères
- Protection contre le spam et le contenu inapproprié

## Limites de l'API

### Quotas et limitations

- **Requêtes par jour** : 10 000 (avec clé API)
- **Requêtes par seconde** : 30
- **Taille des réponses** : Max 30 000 caractères
- **Taille des questions** : Max 30 000 caractères

### Gestion des erreurs

L'intégration gère automatiquement :
- Tokens expirés (renouvellement automatique)
- Limites de quota
- Erreurs réseau temporaires
- Validation des réponses

## Migration de la base de données

Après avoir ajouté les variables d'environnement, exécutez :

```bash
# Générer la migration Prisma
npx prisma migrate dev --name add_stackexchange_models

# Appliquer la migration
npx prisma migrate deploy

# Régénérer le client Prisma
npx prisma generate
```

## Test de l'intégration

### 1. Vérifier la configuration

```bash
# Tester la connexion à l'API
curl -X GET "https://api.stackexchange.com/2.3/sites?key=YOUR_API_KEY"
```

### 2. Tester l'authentification

1. Accédez à `/api/stackexchange/connect`
2. Suivez le processus OAuth
3. Vérifiez le statut via `/api/stackexchange/status`

### 3. Tester les fonctionnalités

- Récupération de questions : `/api/stackexchange/questions?tagged=javascript`
- Récupération de réponses : `/api/stackexchange/answers?questionId=123`
- Publication de réponse : `POST /api/stackexchange/answers/post`
- Statistiques utilisateur : `/api/stackexchange/stats`

## Support et dépannage

### Erreurs courantes

- **"Compte Stack Exchange non connecté"** : L'utilisateur doit d'abord se connecter
- **"Token expiré"** : Le token sera automatiquement renouvelé
- **"Limite de quota atteinte"** : Attendre la réinitialisation quotidienne

### Logs et monitoring

Les erreurs sont loggées avec :
- Timestamp de l'erreur
- Type d'erreur
- Contexte de l'utilisateur
- Détails de la requête API

### Support technique

Pour toute question technique :
1. Vérifiez les logs du serveur
2. Consultez la documentation de l'API Stack Exchange
3. Vérifiez la validité des tokens
4. Testez avec l'outil de test de l'API Stack Exchange 