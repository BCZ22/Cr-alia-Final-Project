# Guide de démarrage rapide - Intégration Substack

## 🚀 Installation et configuration en 5 minutes

### 1. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Configuration Substack
SUBSTACK_API_BASE_URL=https://api.substack.com
SUBSTACK_API_TOKEN=your_api_token_here
SUBSTACK_WEBHOOK_SECRET=your_webhook_secret_here
SUBSTACK_PUBLICATION_ID=your_publication_id_here

# Configuration des webhooks
SUBSTACK_WEBHOOK_URL=https://yourdomain.com/api/webhooks/substack
SUBSTACK_WEBHOOK_EVENTS=post.published,subscriber.created,subscription.cancelled

# Configuration des limites
SUBSTACK_RATE_LIMIT=1000
SUBSTACK_RATE_LIMIT_WINDOW=3600

# Logging
SUBSTACK_LOG_LEVEL=info
SUBSTACK_ENABLE_DEBUG=false
```

### 2. Obtention des credentials Substack

1. **Connectez-vous** à votre compte Substack
2. **Allez dans les paramètres** de votre publication
3. **Section API** → Générez un nouveau token
4. **Copiez le token** et l'ID de publication

### 3. Test de la connexion

```jsx
import useSubstack from './hooks/useSubstack';

function TestConnection() {
  const { testConnection, connectionStatus, error } = useSubstack();

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div>
      <p>Statut: {connectionStatus}</p>
      {error && <p>Erreur: {error}</p>}
    </div>
  );
}
```

## 📱 Utilisation des composants

### Tableau de bord principal

```jsx
import SubstackDashboard from './components/SubstackDashboard';

function App() {
  return (
    <div>
      <h1>Mon App Substack</h1>
      <SubstackDashboard />
    </div>
  );
}
```

### Création d'un nouveau post

```jsx
import SubstackPostEditor from './components/SubstackPostEditor';

function CreatePost() {
  const handleSave = (post) => {
    console.log('Post créé:', post);
    // Redirection ou mise à jour de l'interface
  };

  const handleCancel = () => {
    // Gestion de l'annulation
  };

  return (
    <SubstackPostEditor
      publicationId="your_publication_id"
      onSave={handleSave}
      onCancel={handleCancel}
      mode="create"
    />
  );
}
```

### Gestion des webhooks

```jsx
import SubstackWebhookHandler from './components/SubstackWebhookHandler';

function WebhookManagement() {
  return <SubstackWebhookHandler />;
}
```

## 🔧 Utilisation avancée du hook

### Gestion des publications

```jsx
import useSubstack from './hooks/useSubstack';

function PublicationsManager() {
  const {
    publications,
    loading,
    error,
    fetchPublications,
    createPublication
  } = useSubstack();

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleCreate = async () => {
    const newPub = await createPublication({
      name: 'Ma nouvelle publication',
      description: 'Description de la publication'
    });
    
    if (newPub) {
      console.log('Publication créée:', newPub);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <button onClick={handleCreate}>Nouvelle publication</button>
      {publications.map(pub => (
        <div key={pub.id}>{pub.name}</div>
      ))}
    </div>
  );
}
```

### Gestion des posts

```jsx
function PostsManager() {
  const {
    posts,
    fetchPosts,
    createPost,
    updatePost,
    deletePost
  } = useSubstack();

  const handleCreatePost = async () => {
    const post = await createPost({
      title: 'Mon nouveau post',
      body: 'Contenu du post...',
      publication_id: 'your_publication_id',
      tags: ['tech', 'news'],
      is_paid: false
    });
  };

  const handleUpdatePost = async (postId) => {
    const updated = await updatePost(postId, {
      title: 'Titre modifié',
      body: 'Contenu modifié...'
    });
  };

  const handleDeletePost = async (postId) => {
    const result = await deletePost(postId, 'your_publication_id');
    if (result.success) {
      console.log('Post supprimé');
    }
  };

  return (
    <div>
      <button onClick={handleCreatePost}>Nouveau post</button>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <button onClick={() => handleUpdatePost(post.id)}>Modifier</button>
          <button onClick={() => handleDeletePost(post.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
```

### Gestion des analytics

```jsx
function AnalyticsViewer() {
  const {
    analytics,
    fetchViewAnalytics,
    fetchSubscriberAnalytics,
    fetchRevenueAnalytics
  } = useSubstack();

  useEffect(() => {
    fetchViewAnalytics('your_publication_id');
    fetchSubscriberAnalytics('your_publication_id');
    fetchRevenueAnalytics('your_publication_id');
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      <div>
        <h3>Vues</h3>
        <p>Total: {analytics.views?.total_views || 0}</p>
      </div>
      <div>
        <h3>Abonnés</h3>
        <p>Total: {analytics.subscribers?.total_subscribers || 0}</p>
      </div>
      <div>
        <h3>Revenus</h3>
        <p>Total: ${analytics.revenue?.total_revenue || 0}</p>
      </div>
    </div>
  );
}
```

## 🌐 Configuration des webhooks

### 1. Créer l'endpoint webhook

Créez un fichier `pages/api/webhooks/substack.js` :

```javascript
import substackAPI from '../../../src/services/substackAPI';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Vérifier la signature du webhook
    const signature = req.headers['x-substack-signature'];
    const isValid = substackAPI.verifyWebhookSignature(req.body, signature);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Traiter l'événement webhook
    const event = req.body;
    
    switch (event.event) {
      case 'post.published':
        console.log('Nouveau post publié:', event.data);
        // Mettre à jour votre base de données
        break;
      
      case 'subscriber.created':
        console.log('Nouvel abonné:', event.data);
        // Ajouter l'abonné à votre système
        break;
      
      case 'subscription.cancelled':
        console.log('Abonnement annulé:', event.data);
        // Mettre à jour le statut de l'abonnement
        break;
      
      default:
        console.log('Événement non géré:', event.event);
    }

    // Répondre avec succès
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

### 2. Configurer dans Substack

1. **Copiez l'URL** de votre webhook depuis l'interface
2. **Collez-la** dans les paramètres Substack
3. **Sélectionnez les événements** à écouter
4. **Testez la connexion** avec le bouton de test

## 🎨 Personnalisation des styles

### Modifier les couleurs

```css
/* Dans votre CSS personnalisé */
:root {
  --substack-primary: #007bff;
  --substack-secondary: #6c757d;
  --substack-success: #28a745;
  --substack-danger: #dc3545;
  --substack-warning: #ffc107;
  --substack-info: #17a2b8;
}

.substack-dashboard {
  --primary-color: var(--substack-primary);
  --secondary-color: var(--substack-secondary);
}
```

### Ajouter des animations personnalisées

```css
/* Animation personnalisée pour les cartes */
.stat-card {
  animation: slideInFromLeft 0.5s ease-out;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

## 🧪 Tests et debugging

### Activer le mode debug

```bash
# Dans .env.local
SUBSTACK_ENABLE_DEBUG=true
SUBSTACK_LOG_LEVEL=debug
```

### Tester les composants

```jsx
// Test du hook avec données mock
const mockData = {
  publications: [
    { id: '1', name: 'Test Publication', description: 'Test' }
  ],
  posts: [
    { id: '1', title: 'Test Post', body: 'Test content' }
  ]
};

// Simuler les réponses de l'API
jest.mock('../services/substackAPI', () => ({
  __esModule: true,
  default: {
    getPublications: jest.fn(() => Promise.resolve(mockData.publications)),
    getPosts: jest.fn(() => Promise.resolve(mockData.posts))
  }
}));
```

### Vérifier la configuration

```jsx
function ConfigChecker() {
  const { isConfigured, getAPIInfo } = useSubstack();
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    if (isConfigured()) {
      getAPIInfo().then(setApiInfo);
    }
  }, [isConfigured, getAPIInfo]);

  return (
    <div>
      <p>Configuré: {isConfigured() ? '✅' : '❌'}</p>
      {apiInfo && (
        <pre>{JSON.stringify(apiInfo, null, 2)}</pre>
      )}
    </div>
  );
}
```

## 🚨 Dépannage courant

### Erreur de connexion

```bash
# Vérifiez vos variables d'environnement
echo $SUBSTACK_API_TOKEN
echo $SUBSTACK_PUBLICATION_ID

# Testez la connexion manuellement
curl -H "Authorization: Bearer $SUBSTACK_API_TOKEN" \
     "https://api.substack.com/api/v1/publications"
```

### Webhooks non reçus

1. **Vérifiez l'URL** du webhook dans Substack
2. **Testez l'endpoint** avec Postman ou curl
3. **Vérifiez les logs** de votre serveur
4. **Testez la signature** du webhook

### Rate limiting

```jsx
// Réinitialiser le rate limiting si nécessaire
const { resetRateLimit } = useSubstack();

// Appeler en cas de problème
resetRateLimit();
```

## 📚 Ressources supplémentaires

- [Documentation complète](./SUBSTACK_API_DOCUMENTATION.md)
- [Configuration des variables d'environnement](./SUBSTACK_ENV_SETUP.md)
- [Résumé de l'intégration](./SUBSTACK_INTEGRATION_SUMMARY.md)
- [Documentation officielle Substack](https://substack.com/api/docs)

## 🎯 Prochaines étapes

1. **Testez l'intégration** avec vos données réelles
2. **Personnalisez l'interface** selon vos besoins
3. **Configurez les webhooks** pour la synchronisation
4. **Implémentez des fonctionnalités** supplémentaires
5. **Déployez en production** avec la configuration appropriée

---

**Besoin d'aide ?** Consultez la documentation complète ou créez une issue dans le projet. 