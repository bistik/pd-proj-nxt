# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=1536
# check=skip=SecretsUsedInArgOrEnv
ENV DATABASE_URL="postgres://build:build@localhost:5432/build" \
    BETTER_AUTH_SECRET="build-time-placeholder" \
    BETTER_AUTH_URL="http://localhost:3000" \
    GITHUB_CLIENT_ID="build-time-placeholder" \
    GITHUB_CLIENT_SECRET="build-time-placeholder" \
    GOOGLE_CLIENT_ID="build-time-placeholder" \
    GOOGLE_CLIENT_SECRET="build-time-placeholder"
RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NODE_OPTIONS=--max-old-space-size=512

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
