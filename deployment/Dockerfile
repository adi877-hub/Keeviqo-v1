FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/uploads
VOLUME /app/uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
