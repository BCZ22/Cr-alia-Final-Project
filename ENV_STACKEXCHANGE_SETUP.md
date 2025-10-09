# Configuration des Variables d'Environnement Stack Exchange

## Fichier .env

Créez un fichier `.env` à la racine de votre projet avec les variables suivantes :

```bash
# Stack Exchange API Configuration
STACKEXCHANGE_CLIENT_ID=your_client_id_here
STACKEXCHANGE_CLIENT_SECRET=your_client_secret_here
STACKEXCHANGE_REDIRECT_URI=http://localhost:3000/api/stackexchange/connect/callback
STACKEXCHANGE_KEY=your_api_key_here

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Étapes de Configuration

### 1. Créer une Application Stack Exchange

1. Allez sur [Stack Apps](https://stackapps.com/apps/oauth/register)
2. Connectez-vous avec votre compte Stack Exchange
3. Remplissez le formulaire :
   - **Application Name** : `Crealia SaaS`
   - **Description** : `Intégration SaaS pour la gestion de contenu Stack Overflow`
   - **OAuth Domain** : `localhost:3000` (pour le développement)
   - **Application Website** : `http://localhost:3000`
   - **Application Icon** : URL de votre logo (optionnel)

### 2. Récupérer les Identifiants

Après validation, vous recevrez :
- **Client ID** : Remplacez `your_client_id_here`
- **Client Secret** : Remplacez `your_client_secret_here`
- **API Key** : Remplacez `your_api_key_here` (optionnel mais recommandé)

### 3. Configurer l'URL de Redirection

Dans les paramètres de votre application Stack Exchange :
- **OAuth Redirect URI** : `http://localhost:3000/api/stackexchange/connect/callback`

## Variables d'Environnement Détaillées

### STACKEXCHANGE_CLIENT_ID
- **Type** : String
- **Description** : Identifiant unique de votre application Stack Exchange
- **Exemple** : `12345`

### STACKEXCHANGE_CLIENT_SECRET
- **Type** : String
- **Description** : Clé secrète pour l'authentification OAuth
- **Exemple** : `abcdef123456789`

### STACKEXCHANGE_REDIRECT_URI
- **Type** : URL
- **Description** : URL de redirection après autorisation OAuth
- **Développement** : `http://localhost:3000/api/stackexchange/connect/callback`
- **Production** : `https://yourdomain.com/api/stackexchange/connect/callback`

### STACKEXCHANGE_KEY
- **Type** : String (optionnel)
- **Description** : Clé API pour augmenter les limites de quota
- **Exemple** : `abc123def456`

## Sécurité

### Protection des Clés
- Ne commitez jamais le fichier `.env` dans Git
- Ajoutez `.env` à votre `.gitignore`
- Utilisez des variables d'environnement sécurisées en production

### Validation
- Vérifiez que toutes les variables sont définies
- Testez la connexion avec l'API Stack Exchange
- Validez les URLs de redirection

## Test de Configuration

### 1. Vérifier les Variables
```bash
# Vérifier que les variables sont chargées
echo $STACKEXCHANGE_CLIENT_ID
echo $STACKEXCHANGE_CLIENT_SECRET
```

### 2. Tester la Connexion
```bash
# Tester l'API Stack Exchange
curl -X GET "https://api.stackexchange.com/2.3/sites?key=YOUR_API_KEY"
```

### 3. Démarrer le Serveur
```bash
npm run dev
```

## Dépannage

### Erreurs Courantes

1. **"Variable d'environnement manquante"**
   - Vérifiez que le fichier `.env` existe
   - Redémarrez le serveur après modification

2. **"URL de redirection invalide"**
   - Vérifiez la configuration dans Stack Apps
   - Assurez-vous que l'URL correspond exactement

3. **"Clé API invalide"**
   - Vérifiez la validité de votre clé API
   - Testez avec l'outil de test Stack Exchange

## Production

### Variables de Production
```bash
# Production
STACKEXCHANGE_REDIRECT_URI=https://yourdomain.com/api/stackexchange/connect/callback
NEXTAUTH_URL=https://yourdomain.com
```

### Sécurité en Production
- Utilisez des secrets forts
- Activez HTTPS
- Configurez les domaines autorisés
- Surveillez les logs d'accès

## Support

Pour toute question technique :
1. Vérifiez la documentation Stack Exchange
2. Consultez les logs du serveur
3. Testez avec l'outil de test de l'API
4. Vérifiez la validité des tokens 