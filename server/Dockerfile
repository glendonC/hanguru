# Use the official Node.js 18 image as a parent image
FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Bind to all network interfaces so that it can be mapped to the host OS
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
