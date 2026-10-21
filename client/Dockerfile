# Frontend Dockerfile (multistage)
# Stage 1: Build the React/Vite app
FROM node:22 AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the client source code
COPY . ./

# Build the production static files
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Expose HTTP port (optional SSL termination will be done by reverse proxy)
EXPOSE 80

# Use the default nginx command
CMD ["nginx", "-g", "daemon off;"]
