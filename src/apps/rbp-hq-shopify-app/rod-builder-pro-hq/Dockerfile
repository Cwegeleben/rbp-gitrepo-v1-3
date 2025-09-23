# <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
# Replaced by multi-stage build below
# <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->

# <!-- BEGIN RBP GENERATED: rbp-hq-docker-build-v1 -->
FROM node:20-alpine AS base
WORKDIR /app
ENV CI=1
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
ENV NODE_ENV=development
RUN corepack prepare pnpm@10.15.0 --activate \
	&& pnpm install --frozen-lockfile || pnpm install

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure build port/host are not required; Remix Vite builds to /build
RUN pnpm build

FROM base AS prune
COPY --from=build /app/node_modules ./node_modules
RUN pnpm prune --prod

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8083
ENV HOST=0.0.0.0
COPY --from=prune /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./
COPY .env.example ./.env.example
EXPOSE 8083
CMD ["pnpm","start"]
# <!-- END RBP GENERATED: rbp-hq-docker-build-v1 -->
