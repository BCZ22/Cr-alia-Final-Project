# Configuration Instagram Graph API pour Crealia

## 🚀 Installation

1. **Installer les dépendances** (déjà fait) :
```bash
npm install axios
```

2. **Créer le fichier `.env.local`** à la racine du projet :
```env
# Instagram Graph API Configuration
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Variables publiques (accessibles côté client)
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📱 Configuration Instagram App

### 1. Créer une App Facebook
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle app ou utilisez une existante
3. Ajoutez le produit "Instagram Basic Display" ou "Instagram Graph API"

### 2. Configuration de l'App
1. **App ID** : Copiez l'ID de votre app
2. **App Secret** : Copiez le secret de votre app
3. **Valid OAuth Redirect URIs** : Ajoutez `http://localhost:3000/api/auth/callback`

### 3. Permissions requises
Votre app doit demander ces permissions :
- `instagram_basic` - Accès basique au compte Instagram
- `instagram_content_publish` - Publier du contenu
- `pages_show_list` - Voir les pages Facebook
- `pages_read_engagement` - Lire les métriques des pages

## 🔧 Utilisation

1. **Démarrer le serveur** :
```bash
npm run dev
```

2. **Accéder à la page** :
```
http://localhost:3000/instagram-auth
```

3. **Tester l'authentification** :
- Cliquez sur "Connecter mon compte Instagram"
- Autorisez l'accès sur Facebook
- Vous serez redirigé avec les données du compte

## 📊 Données récupérées

Le système récupère automatiquement :
- **User ID** : ID de l'utilisateur Facebook
- **Page ID** : ID de la page Facebook liée
- **Instagram Business ID** : ID du compte Instagram Business
- **Access Token** : Token pour les appels API
- **Username** : Nom d'utilisateur Instagram
- **Profile Picture** : URL de la photo de profil

## 🔒 Sécurité

- Les tokens sont temporaires (généralement 60 jours)
- Stockez les tokens de manière sécurisée en production
- Utilisez HTTPS en production
- Validez toujours les tokens côté serveur

## 🚨 Erreurs courantes

1. **"Aucune page avec compte Instagram Business trouvée"**
   - L'utilisateur doit avoir une page Facebook
   - La page doit être liée à un compte Instagram Business
   - L'utilisateur doit être admin de la page

2. **"Erreur d'authentification"**
   - Vérifiez que l'App ID et App Secret sont corrects
   - Vérifiez que l'URL de redirection est autorisée
   - Vérifiez que les permissions sont correctement configurées

## 📝 Prochaines étapes

1. **Stockage sécurisé** : Intégrer avec votre base de données
2. **Refresh tokens** : Gérer le renouvellement automatique
3. **Webhooks** : Écouter les événements Instagram
4. **Analytics** : Récupérer les métriques de performance
5. **Publication** : Publier du contenu automatiquement 