# Use the Node.js image to build your client app
FROM node:18-bullseye-slim as build

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your client's source code
COPY . .

# Build your React app
RUN npm run build

# Use the Nginx image to serve your client app
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to the Docker host, so we can access it
# from the outside.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
