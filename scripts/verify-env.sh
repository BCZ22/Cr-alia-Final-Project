#!/bin/bash

# Environment Variables Verification Script
# Usage: ./scripts/verify-env.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "╔════════════════════════════════════════╗"
echo "║  Environment Variables Verification    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Required variables
REQUIRED_VARS=(
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "ENCRYPTION_KEY"
)

# Optional but recommended
OPTIONAL_VARS=(
  "OPENAI_API_KEY"
  "NEXT_PUBLIC_SENTRY_DSN"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "DISCORD_BOT_TOKEN"
)

MISSING_REQUIRED=()
MISSING_OPTIONAL=()

# Check required variables
echo "Checking required variables..."
echo ""

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}✗${NC} $var - MISSING"
    MISSING_REQUIRED+=("$var")
  else
    echo -e "${GREEN}✓${NC} $var - SET"
  fi
done

echo ""
echo "Checking optional variables..."
echo ""

# Check optional variables
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${YELLOW}○${NC} $var - NOT SET (optional)"
    MISSING_OPTIONAL+=("$var")
  else
    echo -e "${GREEN}✓${NC} $var - SET"
  fi
done

echo ""
echo "════════════════════════════════════════"
echo ""

# Summary
if [ ${#MISSING_REQUIRED[@]} -eq 0 ]; then
  echo -e "${GREEN}✓ All required variables are set${NC}"
else
  echo -e "${RED}✗ Missing ${#MISSING_REQUIRED[@]} required variable(s):${NC}"
  for var in "${MISSING_REQUIRED[@]}"; do
    echo "  - $var"
  done
  echo ""
  echo "Set them with:"
  echo "  export $var=your-value"
  echo "  or add to .env.local"
  echo ""
  exit 1
fi

if [ ${#MISSING_OPTIONAL[@]} -gt 0 ]; then
  echo -e "${YELLOW}○ ${#MISSING_OPTIONAL[@]} optional variable(s) not set${NC}"
fi

echo ""
echo "All checks passed! ✓"
echo ""

exit 0

