# Use official Node.js image as base
# FROM node:14
FROM node:14-slim

# Set working directory inside the container
WORKDIR /app/server

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8000 for the backend server
EXPOSE 8000

# Command to start the backend application
CMD ["node", "index.js"]
