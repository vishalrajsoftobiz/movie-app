# Stage 1: Build React app
FROM node:20-alpine as build

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

# Copy all frontend files
COPY client/ .

# Build React app
RUN npm run build

# Stage 2: Set up Node.js backend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all backend files
COPY . .

# Copy the built React app from Stage 1
COPY --from=build /app/client/build ./client/build

# Expose port (Adjust if needed)
EXPOSE 3000

# Command to start the backend server
CMD ["npm", "run", "dev"]
