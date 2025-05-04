# ───────── Build stage ─────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build  # generates .next/

# ───────── Runtime stage ─────────
FROM node:22-alpine
RUN apk add --no-cache \
    chromium nss freetype harfbuzz ttf-freefont dumb-init
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "next", "start", "-p", "3000"]

