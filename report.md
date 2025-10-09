# Rapport d'Analyse et de Validation Technique - Crealia

## Résumé Exécutif

L'analyse statique du projet Crealia révèle une base de code bien structurée, mais présente un **blocage critique** qui empêche l'intégration de l'interface utilisateur avec le backend. L'état général du projet est **Bloqué (Blocked)**.

Le principal problème réside dans une incohérence fondamentale dans le flux d'authentification : le backend crée un cookie `HttpOnly` sécurisé lors de la connexion, mais tente ensuite de lire un token `Bearer` dans les en-têtes pour les routes protégées, ce qui est impossible pour le client.

De plus, un _mismatch_ de contrat a été identifié sur une fonctionnalité d'analyse clé. Bien que de nombreux endpoints correspondent à leurs appels frontend, ces problèmes critiques doivent être résolus avant que l'intégration puisse commencer.

Ce rapport détaille les problèmes, fournit un tableau de correspondance des fonctionnalités et propose des actions correctives concrètes.

## Tableau Détaillé des Fonctionnalités

*Voir le fichier `FeatureEndpointTable.md` pour le tableau complet.*

## Top 5 des Problèmes Bloquants

### 1. Incohérence Critique dans le Flux d'Authentification (Bloquant)

-   **Description**: Le backend génère un token JWT et le stocke dans un cookie `HttpOnly` (`auth_token`) lors de la connexion (`/api/auth/login`). Cependant, les routes protégées (ex: `/api/auth/me`) attendent ce même token dans un en-tête `Authorization: Bearer <token>`.
-   **Impact**: Le frontend ne peut pas lire un cookie `HttpOnly`, il lui est donc impossible de transférer le token vers l'en-tête `Authorization`. Toutes les routes protégées échoueront.
-   **Reproduction**:
    1.  Analyser `app.old/api/auth/login/route.ts`: la fonction `serialize` est utilisée pour créer un cookie `HttpOnly`.
    2.  Analyser `app.old/api/auth/me/route.ts`: le code tente de lire `request.headers.get('authorization')`.
-   **Patch Suggéré (Backend)**: Modifier les routes protégées pour qu'elles lisent le token depuis le cookie `auth_token` au lieu de l'en-tête.

    ```typescript
    // Exemple pour /api/auth/me/route.ts
    import { cookies } from 'next/headers';
    // ...
    export async function GET(request: NextRequest) {
      try {
        const cookieStore = cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
          return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }
        // ... continuer la logique de vérification du token
    ```

### 2. Contrat d'API Incomplet pour l'Extraction de Données (Élevé)

-   **Description**: L'endpoint `POST /api/social-analytics/extract` attend un objet `{ userId, platform, dateRange }`. L'appelant frontend dans `SocialAnalyticsDashboard.tsx` envoie uniquement `{ userId, platform }`.
-   **Impact**: La fonctionnalité d'extraction des données d'analyse échouera car le paramètre `dateRange` est manquant.
-   **Reproduction**:
    1.  Voir l'appel `fetch` dans `components/social-analytics/SocialAnalyticsDashboard.tsx:167`.
    2.  Comparer avec les attentes du body dans `app.old/api/social-analytics/extract/route.ts`.
-   **Patch Suggéré (Frontend)**: Ajouter un sélecteur de plage de dates dans l'interface utilisateur et inclure la valeur `dateRange` dans le payload de la requête.

### 3. Données Mockées dans l'API d'Authentification (Moyen)

-   **Description**: L'endpoint `/api/auth/me` utilise une base de données d'utilisateurs *mockée* en mémoire au lieu d'interroger la base de données réelle via Prisma.
-   **Impact**: La route ne fonctionnera pas avec de vrais utilisateurs provenant de la base de données.
-   **Reproduction**: Voir le tableau `mockUsers` dans `app.old/api/auth/me/route.ts`.
-   **Patch Suggéré (Backend)**: Remplacer la logique de mock par un appel à la base de données en utilisant Prisma.

    ```typescript
    // Remplacer mockUsers.find(...) par :
    import { prisma } from '@/backend/lib/prisma';
    // ...
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    ```

### 4. Problèmes d'Environnement et de Build Docker (Bloquant)

-   **Description**: Le projet ne peut pas être démarré en utilisant `docker-compose up` en raison de problèmes de réseau lors du téléchargement des images Docker et de `pnpm install`. Le `Dockerfile` initial était également mal configuré pour une application `pnpm`.
-   **Impact**: Il est impossible de tester l'application en conditions réelles, ce qui bloque toute validation d'intégration.
-   **Reproduction**: Exécuter `docker-compose up --build`.
-   **Action**: Un `Dockerfile` corrigé a été fourni. Les problèmes de réseau (timeouts TLS) doivent être résolus au niveau de l'environnement de l'utilisateur (connexion, proxy, firewall).

### 5. Absence de Gestion des CORS (Élevé)

-   **Description**: Aucune configuration explicite de CORS n'a été trouvée dans le code. Bien que Next.js puisse fonctionner sur le même domaine en production, les environnements de développement sur des ports différents (`localhost:3000` pour le front, `localhost:XXXX` pour un backend séparé) nécessiteraient une configuration CORS.
-   **Impact**: Potentiel blocage des requêtes cross-origin en développement ou si l'architecture change.
-   **Action**: Si le frontend et le backend sont servis depuis le même domaine/port Next.js, ce n'est pas un problème immédiat. Sinon, une configuration CORS doit être ajoutée, par exemple via les `headers` dans `next.config.js` ou un middleware.

## ✅ Checklist de Préparation à l'Intégration

| Critère | Statut | Commentaire |
| :--- | :--- | :--- |
| **CORS** | ⚠️ **À Vérifier** | Aucune configuration explicite trouvée. Probablement OK si servi par le même domaine Next.js. |
| **Auth** | ❌ **Bloqué** | Incohérence critique entre la définition du cookie et la lecture du token. |
| **Contrat Stable** | ⚠️ **Partiel** | La plupart des contrats correspondent, mais un mismatch critique a été trouvé (SAN-01). |
| **Tests** | 🟡 **Statique** | Des tests `curl` et Postman ont été générés statiquement, mais n'ont pas pu être exécutés. |
| **Pas de Mocks** | ❌ **Non** | Endpoint `/api/auth/me` utilise des données mockées. |

L'intégration de l'UI est actuellement **bloquée** et ne peut pas commencer avant la résolution des problèmes d'authentification et de contrat d'API.
