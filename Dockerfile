# --- Build stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Enable Corepack and install dependencies (Yarn 4)
COPY package.json yarn.lock ./
# In CI, the `.yarn` directory may not be present; only `.yarnrc.yml` is required
COPY .yarnrc.yml ./
RUN corepack enable \
  && yarn install

# Copy source and build
COPY . .
RUN yarn build

# --- Runtime stage ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV APP_ENV=local

# Only copy what is needed to run (including Yarn 4 metadata and migration sources)
COPY package.json yarn.lock kysely.config.ts ./
# In CI, the `.yarn` directory may not be committed; copy only `.yarnrc.yml` which exists
COPY .yarnrc.yml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Enable Corepack so Yarn 4 can run (needed for `yarn migrate`)
RUN corepack enable

# App port (change if your Fastify listens on a different port)
EXPOSE 3000

# Start compiled API
CMD ["node", "dist/app/api.js"]