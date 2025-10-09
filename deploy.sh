#!/bin/bash

# =============================================================================
# SCRIPT DE DÉPLOIEMENT PRODUCTION CREALIA
# =============================================================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
ENV_FILE="env.production"

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifications préalables
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé"
        exit 1
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    # Vérifier les fichiers de configuration
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Fichier $COMPOSE_FILE introuvable"
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Fichier $ENV_FILE introuvable"
        exit 1
    fi
    
    print_success "Prérequis vérifiés"
}

# Arrêt des services existants
stop_services() {
    print_status "Arrêt des services existants..."
    
    if docker-compose -f "$COMPOSE_FILE" ps -q | grep -q .; then
        docker-compose -f "$COMPOSE_FILE" down --remove-orphans
        print_success "Services arrêtés"
    else
        print_status "Aucun service en cours d'exécution"
    fi
}

# Nettoyage des volumes (optionnel)
cleanup_volumes() {
    read -p "Voulez-vous nettoyer les volumes existants ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Nettoyage des volumes..."
        docker volume prune -f
        print_success "Volumes nettoyés"
    fi
}

# Construction des images
build_images() {
    print_status "Construction des images Docker..."
    
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    if [ $? -eq 0 ]; then
        print_success "Images construites avec succès"
    else
        print_error "Erreur lors de la construction des images"
        exit 1
    fi
}

# Démarrage des services
start_services() {
    print_status "Démarrage des services..."
    
    # Charger les variables d'environnement
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    
    # Démarrer les services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    if [ $? -eq 0 ]; then
        print_success "Services démarrés avec succès"
    else
        print_error "Erreur lors du démarrage des services"
        exit 1
    fi
}

# Vérification de la santé des services
health_check() {
    print_status "Vérification de la santé des services..."
    
    # Attendre que les services soient prêts
    sleep 30
    
    # Vérifier l'application principale
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Application principale en ligne"
    else
        print_error "Application principale inaccessible"
        exit 1
    fi
    
    # Vérifier Prometheus
    if curl -f http://localhost:9090/-/healthy > /dev/null 2>&1; then
        print_success "Prometheus en ligne"
    else
        print_warning "Prometheus inaccessible"
    fi
    
    # Vérifier Grafana
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        print_success "Grafana en ligne"
    else
        print_warning "Grafana inaccessible"
    fi
    
    # Vérifier MongoDB
    if docker exec crealia-mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_success "MongoDB en ligne"
    else
        print_warning "MongoDB inaccessible"
    fi
    
    # Vérifier Redis
    if docker exec crealia-redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis en ligne"
    else
        print_warning "Redis inaccessible"
    fi
}

# Affichage des informations de déploiement
show_deployment_info() {
    print_success "Déploiement terminé avec succès !"
    echo
    echo "Services disponibles :"
    echo "  - Application Crealia: https://localhost"
    echo "  - Grafana: http://localhost:3001 (admin/admin)"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - cAdvisor: http://localhost:8080"
    echo "  - Loki: http://localhost:3100"
    echo
    echo "Logs des services :"
    echo "  docker-compose logs -f crealia-app"
    echo "  docker-compose logs -f nginx"
    echo
    echo "Arrêt des services :"
    echo "  docker-compose down"
}

# Fonction principale
main() {
    echo "=============================================================================="
    echo "                    DÉPLOIEMENT PRODUCTION CREALIA"
    echo "=============================================================================="
    echo
    
    check_prerequisites
    stop_services
    cleanup_volumes
    build_images
    start_services
    health_check
    show_deployment_info
}

# Gestion des erreurs
trap 'print_error "Erreur lors du déploiement. Arrêt..."; exit 1' ERR

# Exécution du script
main "$@"




