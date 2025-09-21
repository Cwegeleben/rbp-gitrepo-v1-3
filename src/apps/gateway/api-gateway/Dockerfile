# <!-- BEGIN RBP GENERATED: gateway-docker-devdeps-fix-v1-0 -->
FROM node:20-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

# deps stage: include devDependencies for build tools (remix CLI)
FROM base AS deps
ARG RBP_DOCKER_DEVDEPS_FIX="gateway-docker-devdeps-fix-v1-0"
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/**/package.json src/**/package.json
# force-install dev deps regardless of NODE_ENV
RUN echo "RBP devdeps: $RBP_DOCKER_DEVDEPS_FIX" && pnpm -w -r install --frozen-lockfile --ignore-scripts --prod=false

# build stage: build only gateway
FROM deps AS build
COPY . .
# no NODE_ENV=production here; we need dev tools available
# ensure the gateway package has its own node_modules (for remix CLI)
RUN pnpm --filter "./src/apps/gateway/api-gateway" install --frozen-lockfile --ignore-scripts --prod=false \
	&& pnpm -w -r --filter "./src/apps/gateway/api-gateway" build \
	&& pnpm -C src/apps/gateway/api-gateway install --frozen-lockfile --ignore-scripts --prod=true

# prod-deps stage: install only production deps for runtime image
FROM base AS prod-deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/**/package.json src/**/package.json
RUN pnpm -w -r install --frozen-lockfile --ignore-scripts --prod=true

# prod-app-deps stage: install only production deps for the gateway (single install to keep symlinks consistent)
FROM base AS prod-app-deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/**/package.json src/**/package.json
# Install production deps filtered to the gateway so both root and local node_modules are created
RUN pnpm -w -r --filter "./src/apps/gateway/api-gateway" install --frozen-lockfile --ignore-scripts --prod=true

# runtime: production-only env
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/**/package.json src/**/package.json
# Copy built app first so any subsequent installs create node_modules that won't be overwritten
COPY --from=build /app/src/apps/gateway/api-gateway /app/src/apps/gateway/api-gateway
# Provide root-level production dependencies for transitive module resolution (e.g., 'cookie')
COPY --from=prod-deps /app/node_modules /app/node_modules
# Install production deps for the gateway in the runtime image to ensure local node_modules exists
RUN pnpm -C src/apps/gateway/api-gateway install --frozen-lockfile --ignore-scripts --prod=true
EXPOSE 8080
ENV PORT=8080
# Run via workspace filter to satisfy preflight and ensure monorepo resolution
CMD ["pnpm","--filter","./src/apps/gateway/api-gateway","start"]
# <!-- END RBP GENERATED: gateway-docker-devdeps-fix-v1-0 -->
