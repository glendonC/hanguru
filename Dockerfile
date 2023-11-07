# Specify a base image
FROM node:18-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install node-gyp globally to compile bcrypt
RUN npm install -g node-gyp

# Copy package.json and package-lock.json from the server directory
COPY ./server/package*.json ./

# Install all node modules, excluding bcrypt initially
RUN npm install --production --no-optional && npm cache clean --force

# Now, install bcrypt with forced rebuild, this ensures it's built in the Docker environment
RUN npm install bcrypt --build-from-source

# Copy the rest of your server application code
COPY ./server .

# Set non-root user and permissions
RUN groupadd -r nodeuser && useradd -m -r -g nodeuser nodeuser \
    && chown -R nodeuser:nodeuser /usr/src/app

# Switch to non-root user
USER nodeuser

# Your application's default port
EXPOSE 5000

CMD ["node", "app.js"]
