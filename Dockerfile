# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies (production only)
# RUN npm ci --only=production

# For development, install all dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Expose port
EXPOSE 3000

# 7. Start app
# CMD ["node", "server.js"]

#7. Start app with nodemon for development
CMD ["npm", "run", "dev"]