# Use official Node.js 18 image
FROM node:18-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies (only production)
RUN npm install --production

# Copy local code to the container image
COPY . .

# Run the web service on container startup
CMD [ "npm", "start" ]
