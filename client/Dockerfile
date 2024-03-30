# Use official Node.js image as base
FROM node:14

# Set working directory inside the container
WORKDIR /app/client

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for React development server
EXPOSE 3000

# Command to start the frontend application
CMD ["npm", "start"]
