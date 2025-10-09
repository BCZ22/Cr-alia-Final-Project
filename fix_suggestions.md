# Suggestions de correctifs

Ce document contient des snippets de code et des suggestions pour corriger les problèmes identifiés lors de l'audit d'intégration.

## 1. (Bloquant) Remplacer le stockage `localStorage` du token par des Cookies `HttpOnly`

**Problème :** Le token JWT est stocké dans le `localStorage`, ce qui le rend vulnérable aux attaques XSS.

**Solution :** Le token doit être géré par le backend et stocké dans un cookie `HttpOnly`, `Secure` et `SameSite=Strict`.

---

### a) Côté Backend : Définir le Cookie à la connexion

Modifiez la route de login (`app/api/auth/login/route.ts`) pour qu'elle définisse un cookie au lieu de retourner le token dans le corps de la réponse.

**Fichier :** `app/api/auth/login/route.ts`

```typescript
// ... imports
import { serialize } from 'cookie';

// ... à l'intérieur de la fonction POST, après la génération du token

// Au lieu de retourner le token dans le body :
// return NextResponse.json({ ok: true, data: { user: userWithoutPassword, token } });

// Faites ceci :
const cookie = serialize('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development', // Mettre à `true` en production
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 1 semaine (à synchroniser avec l'expiration du JWT)
});

const response = NextResponse.json({
  ok: true,
  data: {
    user: userWithoutPassword,
  },
});

response.headers.set('Set-Cookie', cookie);

return response;
```
*Note : Des modifications similaires devront être appliquées à la route d'inscription (`/api/auth/register`).*

---

### b) Côté Backend : Lire le Cookie pour les routes protégées

Pour les routes qui nécessitent une authentification, le token devra être lu depuis les cookies de la requête, et non plus depuis l'en-tête `Authorization`.

**Exemple de middleware ou de vérification dans une route :**

```typescript
// utils/auth.ts (exemple de fonction pour vérifier le token)
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export function verifyAuth() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('Missing authentication token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // Contient { userId, email, role }
  } catch (err) {
    throw new Error('Invalid token');
  }
}
```

---

### c) Côté Frontend : Mettre à jour `apiClient`

Le `apiClient` ne doit plus manipuler le token. Le navigateur s'occupera d'envoyer le cookie automatiquement.

**Fichier :** `backend/lib/api/client.ts`

```typescript
// ...
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // !! IMPORTANT: Permet à axios d'envoyer les cookies
    });

    // L'intercepteur de requête n'est plus nécessaire pour ajouter le token
    /*
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token'); // <--- SUPPRIMER
          if (token) {
            config.headers.Authorization = `Bearer ${token}`; // <--- SUPPRIMER
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    */

    // L'intercepteur de réponse doit être mis à jour
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // La redirection peut toujours avoir lieu, mais plus besoin de nettoyer le localStorage
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }
  // ... reste du client
}
// ...
```

---

### d) Côté Frontend : Mettre à jour `AuthService`

Le `AuthService` doit être simplifié pour ne plus interagir avec le `localStorage`.

**Fichier :** `backend/lib/auth/auth.ts`

```typescript
// ...

export class AuthService {
  // Supprimer les clés TOKEN_KEY et USER_KEY

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la connexion');
    }
    // Le cookie est géré par le navigateur, plus besoin de stocker ici.
    // Il faut s'assurer que le service qui appelle `login` stocke les données utilisateur.
    return response.data;
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout'); // Le backend doit invalider le cookie
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error);
    }
    // Plus besoin de nettoyer le localStorage. La redirection se fera via le rechargement de la page
    // ou par la logique du contexte d'authentification.
  }
  
  // ...
  // Supprimer getToken(), mettre à jour getCurrentUser() pour qu'il se base sur l'état du AuthContext
  // au lieu du localStorage.
}
```
*Note : Ces changements nécessiteront une refonte de la gestion de l'état utilisateur dans `AuthContext` pour ne plus dépendre du `localStorage` à l'initialisation, mais plutôt d'un appel à `/api/auth/me`.*

