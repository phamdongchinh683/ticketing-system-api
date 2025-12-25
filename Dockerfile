  FROM node:22-alpine AS builder
  WORKDIR /app
  
  COPY package.json yarn.lock .yarnrc.yml ./
  RUN corepack enable && yarn install --immutable
  
  COPY . .
  RUN yarn build
  
  FROM node:22-alpine AS runner
  WORKDIR /app
  
  ENV NODE_ENV=production
  
  COPY package.json yarn.lock .yarnrc.yml ./
  RUN corepack enable && yarn install --immutable --production
  
  COPY --from=builder /app/dist ./dist
  
  EXPOSE 3000
  CMD ["node", "dist/app/api.js"]
  