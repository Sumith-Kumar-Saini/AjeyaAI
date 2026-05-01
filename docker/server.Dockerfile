# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only server package.json and lockfile
COPY packages/server/package*.json ./

# Install all dependencies
RUN npm ci

# Copy server source code
COPY packages/server/src ./src

# Build server bundle
RUN npm install --save-dev esbuild esbuild-node-externals \
    && npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy only package.json + prod deps
COPY packages/server/package*.json ./
RUN npm ci --omit=dev

# Copy built dist folder
COPY --from=builder /app/dist ./dist
COPY packages/server/.env ./  
# or mount via docker-compose

# Expose port
EXPOSE 5000

# Run server
CMD ["node", "dist/server.js"]