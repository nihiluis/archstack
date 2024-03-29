# Install dependencies only when needed
FROM node:16.3.0-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16.3.0-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat git
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ARG PROXY_AUTHORIZATION_HEADER
ENV PROXY_AUTHORIZATION_HEADER $PROXY_AUTHORIZATION_HEADER

RUN touch .env.local
RUN touch .env
RUN echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local
RUN echo "NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER=$PROXY_AUTHORIZATION_HEADER" >> .env.local

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16.3.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ARG PROXY_AUTHORIZATION_HEADER
ENV PROXY_AUTHORIZATION_HEADER $PROXY_AUTHORIZATION_HEADER

RUN touch .env.local
RUN touch .env
RUN echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local
RUN echo "NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER=$PROXY_AUTHORIZATION_HEADER" >> .env.local

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3001

ENV PORT 3001

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start", "-p", "3001"]
