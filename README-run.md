# Instructions pour exécuter et tester le projet Crealia

Ce document décrit les étapes pour lancer l'environnement de développement et de test complet de l'application Crealia.

## Prérequis

- Docker et Docker Compose installés sur votre machine.
- Un terminal ou une ligne de commande.
- `pnpm` (ou `npm`/`yarn`) pour l'installation des dépendances locales si nécessaire.

## 1. Lancement de l'environnement avec Docker Compose

L'ensemble de l'application et de ses services (base de données, cache, etc.) peut être lancé avec une seule commande.

1.  **Ouvrez un terminal** à la racine du projet.
2.  **Exécutez la commande suivante** pour construire les images et démarrer tous les services en arrière-plan :

    ```bash
    docker-compose up --build -d
    ```

    Cette commande va :
    - Construire l'image Docker pour l'application Next.js (`api`).
    - Démarrer les services : PostgreSQL, Redis, MinIO, Nginx, Prometheus, et Grafana.
    - L'option `-d` lance les conteneurs en mode "detached" (en arrière-plan).

3.  **Vérifiez que les conteneurs sont en cours d'exécution** :

    ```bash
    docker-compose ps
    ```

    Vous devriez voir tous les services avec un statut "Up" ou "running".

L'application est maintenant accessible à l'adresse `http://localhost:3000`.

## 2. Installation des dépendances locales (Optionnel)

Si vous souhaitez exécuter des commandes `prisma` localement ou lancer le serveur de développement Next.js en dehors de Docker, vous devez installer les dépendances.

Le projet utilise `pnpm`, comme indiqué par la présence du fichier `pnpm-lock.yaml`.

```bash
pnpm install
```

## 3. Lancer le serveur de développement (Alternative à Docker)

Si vous ne souhaitez pas utiliser Docker pour l'application Next.js, vous pouvez la lancer localement. Assurez-vous que les services de la base de données (PostgreSQL) et autres (Redis) sont accessibles depuis votre machine locale (par exemple, en lançant uniquement certains services via Docker).

1.  **Assurez-vous que `env.development` ou un fichier `.env.local` est configuré** avec les bonnes variables d'environnement (ex: `DATABASE_URL`).
2.  **Lancez le serveur de développement** :

    ```bash
    pnpm dev
    ```

L'application sera également disponible sur `http://localhost:3000`.

## 4. Stopper l'environnement Docker

Pour arrêter tous les services lancés avec Docker Compose :

```bash
docker-compose down
```

Cette commande arrêtera et supprimera les conteneurs. Pour supprimer aussi les volumes (et donc perdre les données de la base de données, etc.), utilisez `docker-compose down -v`.

