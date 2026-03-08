# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the frontend code
COPY . .

# Build the app for production (Vite)
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built assets from the previous stage to Nginx's web root
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]
