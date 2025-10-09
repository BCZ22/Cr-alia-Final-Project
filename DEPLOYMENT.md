# 🚀 Guide de Déploiement - Crealia

## Prérequis

- Node.js 18+
- Docker et Docker Compose
- PostgreSQL 15+
- Redis 7+
- OpenAI API Key

## Déploiement avec Docker

### 1. Configuration

```bash
# Copier le fichier d'environnement
cp .env.production .env

# Éditer les variables d'environnement
nano .env
```

### 2. Démarrage

```bash
# Démarrer tous les services
docker-compose -f docker-compose.production.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.production.yml logs -f
```

### 3. Vérification

```bash
# Vérifier la santé de l'application
curl http://localhost:3000/api/health

# Vérifier les services
docker-compose -f docker-compose.production.yml ps
```

## Déploiement Manuel

### 1. Installation

```bash
# Installer les dépendances
npm ci --production

# Construire l'application
npm run build
```

### 2. Configuration de la base de données

```bash
# Exécuter les migrations
npx prisma migrate deploy

# Seeder les données initiales
npm run db:seed:carousel
```

### 3. Démarrage

```bash
# Démarrer l'application
npm start
```

## Monitoring

### Health Checks

- Application: `GET /api/health`
- Base de données: Vérification automatique
- Redis: Vérification automatique

### Logs

```bash
# Logs de l'application
docker-compose logs -f app

# Logs de la base de données
docker-compose logs -f postgres

# Logs de Redis
docker-compose logs -f redis
```

## Maintenance

### Sauvegarde

```bash
# Sauvegarde de la base de données
docker-compose exec postgres pg_dump -U crealia crealia > backup.sql

# Restauration
docker-compose exec -T postgres psql -U crealia crealia < backup.sql
```

### Mise à jour

```bash
# Arrêter les services
docker-compose down

# Mettre à jour le code
git pull origin main

# Reconstruire et redémarrer
docker-compose up -d --build
```

## Sécurité

- Utiliser des mots de passe forts
- Configurer HTTPS
- Limiter l'accès aux ports
- Surveiller les logs
- Mettre à jour régulièrement

## Support

En cas de problème, vérifier :
1. Les logs des services
2. La connectivité réseau
3. Les variables d'environnement
4. L'espace disque disponible
