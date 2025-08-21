# syntax=docker/dockerfile:1.7


# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV PRISMA_SKIP_POSTINSTALL=1
ENV CI=true
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
# Copy full source before install to ensure workspace packages are present in all build contexts
COPY . .
# Install workspace dependencies deterministically without running scripts
RUN pnpm -r install --frozen-lockfile --ignore-scripts
WORKDIR /app/src/apps/rbp-shopify-app/rod-builder-pro
RUN pnpm db:generate && pnpm build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV CI=true
ENV DATABASE_URL=file:/data/dev.sqlite
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
COPY --from=builder /app /app
WORKDIR /app/src/apps/rbp-shopify-app/rod-builder-pro
EXPOSE 8080
CMD sh -lc 'pnpm db:deploy && node build/server/index.js --host 0.0.0.0 --port ${PORT:-8080}'
