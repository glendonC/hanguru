# Use an official Node runtime as a parent image
FROM node:18-bullseye-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Ensure npm log files are not hidden
ENV NPM_CONFIG_LOGLEVEL warn

# If you have native dependencies, you'll need extra tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json from the server directory
COPY server/package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the server code
COPY server/ .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define the command to run your app
CMD [ "npm", "start" ]
