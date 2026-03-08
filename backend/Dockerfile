# Use official Node.js Alpine base image for smaller size
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (only production deps recommended, but standard for now)
RUN npm install

# Copy all the backend application files
COPY . .

# Expose the port the Express app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]
