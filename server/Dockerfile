FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Bind to all network interfaces so that it can be mapped to the host OS
ENV PORT=8100
EXPOSE 8100

CMD ["npm", "start"]
