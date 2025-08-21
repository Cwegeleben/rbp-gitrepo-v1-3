## <!-- BEGIN RBP GENERATED: Fly-MinDocker -->
# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Non-interactive installs + skip prisma postinstall
ENV CI=1 PNPM_SKIP_PROMPTS=true PRISMA_SKIP_POSTINSTALL=1

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# 1) Copy the minimal set first for a deterministic, cached install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/apps/rbp-shopify-app/rod-builder-pro/package.json src/apps/rbp-shopify-app/rod-builder-pro/

# 2) Install without running postinstall scripts
RUN pnpm -r install --frozen-lockfile --ignore-scripts

# 3) Bring in the rest of the repo (incl. prisma/)
COPY . .

# 4) Generate Prisma client and build the subapp
WORKDIR /app/src/apps/rbp-shopify-app/rod-builder-pro
RUN pnpm exec prisma generate --schema ./prisma/schema.prisma
RUN pnpm build

# ---- runtime ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production CI=1
WORKDIR /app/src/apps/rbp-shopify-app/rod-builder-pro

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy built app + workspace files
COPY --from=builder /app /app

# Install production deps only (still no scripts)


EXPOSE 8080

# On boot: apply migrations, then start server bound to 0.0.0.0:PORT
CMD sh -lc 'pnpm exec prisma migrate deploy --schema ./prisma/schema.prisma && node build/server/index.js --host 0.0.0.0 --port ${PORT:-8080}'
## <!-- END RBP GENERATED: Fly-MinDocker -->
