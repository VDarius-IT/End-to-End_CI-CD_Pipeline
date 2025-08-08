FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy rest of the application code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]