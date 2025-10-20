#!/bin/bash

# Quick Deploy Script for Créalia on Vercel
# Usage: ./scripts/quick-deploy.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo ""
echo "╔════════════════════════════════════════╗"
echo "║    Créalia Quick Deploy to Vercel      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Vercel CLI
echo -e "${BLUE}[1/6]${NC} Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}✗${NC} Vercel CLI not found"
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi
echo -e "${GREEN}✓${NC} Vercel CLI ready"
echo ""

# Check if logged in
echo -e "${BLUE}[2/6]${NC} Checking Vercel authentication..."
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✓${NC} Logged in as: $VERCEL_USER"
else
    echo -e "${YELLOW}Please log in to Vercel:${NC}"
    vercel login
fi
echo ""

# Check if project is linked
echo -e "${BLUE}[3/6]${NC} Checking project linkage..."
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}Project not linked. Linking now...${NC}"
    vercel link
else
    echo -e "${GREEN}✓${NC} Project already linked"
fi
echo ""

# Verify environment variables
echo -e "${BLUE}[4/6]${NC} Verifying environment variables..."
echo -e "${YELLOW}Required variables:${NC}"
echo "  - DATABASE_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXTAUTH_URL"
echo "  - STRIPE_SECRET_KEY"
echo "  - STRIPE_WEBHOOK_SECRET"
echo "  - ENCRYPTION_KEY"
echo ""
echo -e "${YELLOW}⚠ Make sure all variables are set in Vercel Dashboard${NC}"
echo -e "  Visit: https://vercel.com/dashboard > Your Project > Settings > Environment Variables"
echo ""
read -p "Are all environment variables configured? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}✗${NC} Please configure environment variables first"
    echo -e "  See: DEPLOY_GUIDE.md for complete setup"
    exit 1
fi
echo -e "${GREEN}✓${NC} Environment variables confirmed"
echo ""

# Commit check
echo -e "${BLUE}[5/6]${NC} Checking git status..."
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠ Uncommitted changes detected${NC}"
    read -p "Commit and push changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        git push
        echo -e "${GREEN}✓${NC} Changes committed and pushed"
    else
        echo -e "${YELLOW}⚠ Deploying with uncommitted changes${NC}"
    fi
else
    echo -e "${GREEN}✓${NC} Working tree clean"
fi
echo ""

# Deploy
echo -e "${BLUE}[6/6]${NC} Deploying to Vercel..."
echo -e "${YELLOW}This may take 2-3 minutes...${NC}"
echo ""

DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo ""
    echo "$DEPLOY_OUTPUT" | grep -E "(Preview|Production):" || echo "$DEPLOY_OUTPUT"
    echo ""
    
    # Extract URL
    DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE "https://[^ ]+" | head -1)
    
    if [ -n "$DEPLOY_URL" ]; then
        echo "╔════════════════════════════════════════╗"
        echo "║         Deployment Complete!           ║"
        echo "╚════════════════════════════════════════╝"
        echo ""
        echo -e "${GREEN}🌐 URL:${NC} $DEPLOY_URL"
        echo ""
        
        # Health check
        echo -e "${BLUE}Running health check...${NC}"
        sleep 15
        
        if curl -f -s "$DEPLOY_URL/api/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Health check passed"
        else
            echo -e "${YELLOW}⚠${NC} Health check pending (app may still be starting)"
        fi
        echo ""
        
        # Next steps
        echo "╔════════════════════════════════════════╗"
        echo "║           Next Steps                    ║"
        echo "╚════════════════════════════════════════╝"
        echo ""
        echo "1. Visit your site: $DEPLOY_URL"
        echo "2. Test authentication: $DEPLOY_URL (click 'Se connecter')"
        echo "3. Test pricing: $DEPLOY_URL/pricing"
        echo "4. Configure Stripe webhook (if not done):"
        echo "   → https://dashboard.stripe.com/webhooks"
        echo "   → Add endpoint: $DEPLOY_URL/api/stripe-webhook"
        echo "5. Monitor logs: https://vercel.com/dashboard"
        echo ""
        echo -e "${GREEN}✓ Deployment successful!${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚠ Could not extract deployment URL${NC}"
        echo "Check Vercel dashboard: https://vercel.com/dashboard"
    fi
else
    echo ""
    echo -e "${RED}✗ Deployment failed${NC}"
    echo ""
    echo "Error output:"
    echo "$DEPLOY_OUTPUT"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check build logs on Vercel dashboard"
    echo "2. Verify all environment variables are set"
    echo "3. Run 'npm run build' locally to test"
    echo "4. See DEPLOY_GUIDE.md for detailed help"
    echo ""
    exit 1
fi

exit 0

