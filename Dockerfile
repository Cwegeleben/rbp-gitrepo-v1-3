# <!-- BEGIN RBP GENERATED: gateway-docker-devdeps-fix-v1-0 (root) -->
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
# ensure the gateway package has its own node_modules (for remix CLI), then build
RUN pnpm --filter "./src/apps/gateway/api-gateway" install --no-frozen-lockfile --ignore-scripts --prod=false \
	&& pnpm -w -r --filter "./src/apps/gateway/api-gateway" build \
	&& pnpm -C src/apps/gateway/api-gateway install --no-frozen-lockfile --ignore-scripts --prod=true

# prod-deps stage: install only production deps for runtime image
FROM base AS prod-deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/**/package.json src/**/package.json
RUN pnpm -w -r install --no-frozen-lockfile --ignore-scripts --prod=true

# runtime: production-only env serving the gateway
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/**/package.json src/**/package.json
# Copy built gateway
COPY --from=build /app/src/apps/gateway/api-gateway /app/src/apps/gateway/api-gateway
# Provide root-level production deps for transitive resolution
COPY --from=prod-deps /app/node_modules /app/node_modules
# Ensure gateway local node_modules exists in runtime image
RUN pnpm -C src/apps/gateway/api-gateway install --no-frozen-lockfile --ignore-scripts --prod=true
EXPOSE 8080
ENV PORT=8080
# Start the gateway (binds to 0.0.0.0:PORT)
CMD ["pnpm","--filter","./src/apps/gateway/api-gateway","start"]
# <!-- END RBP GENERATED: gateway-docker-devdeps-fix-v1-0 (root) -->
