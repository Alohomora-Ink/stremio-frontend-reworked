FROM node:20-alpine

WORKDIR /app

# Install openssl
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything
COPY . .

# Copy wasm files
RUN npm run copy-wasm

# Generate self-signed certificate
RUN mkdir -p /app/certs && \
    openssl req -x509 -newkey rsa:4096 -keyout /app/certs/key.pem -out /app/certs/cert.pem -days 365 -nodes -subj "/CN=localhost"

# Build
RUN npx next build --webpack

EXPOSE 3000

# Use custom HTTPS server
CMD ["node", "server.js"]