# Use an official Node runtime as a parent image
FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your server code
COPY server/ .

# Make port available to the world outside this container
EXPOSE 5000

# Define the command to run your app
CMD [ "npm", "start" ]
