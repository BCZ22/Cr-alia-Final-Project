# Étape 1: Dépendances
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Étape 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm
# Assurez-vous que le schéma Prisma est au bon endroit si nécessaire
# COPY --from=deps /app/backend/prisma/schema.prisma ./backend/prisma/schema.prisma
RUN pnpm prisma generate --schema=./backend/prisma/schema.prisma
RUN pnpm build

# Étape 3: Production
FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["next", "start"]