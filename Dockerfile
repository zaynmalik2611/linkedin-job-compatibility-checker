# ───────── Build stage ─────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build  # generates .next/

# ───────── Runtime stage ─────────
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
