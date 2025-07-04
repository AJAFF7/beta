# Use the official Node.js image as a base image
FROM node:20-alpine3.18

# Install kubectl
RUN apk add --no-cache curl && \
    curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.21.0/bin/linux/amd64/kubectl && \
    chmod +x ./kubectl && \
    mv ./kubectl /usr/local/bin/kubectl

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server files to the working directory
COPY . .

# Expose the ports the servers will run on
EXPOSE 3535 3536 3537 3538

# Command to run the application
CMD ["sh", "-c", "node server1.js & node server2.js & node server3.js & node server4.js"]

