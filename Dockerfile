# Use an official Node.js 14 image as a base
FROM node:20-slim


# Set the working directory to /app
WORKDIR /app

# Copy the application code
COPY . .

# Expose the port
EXPOSE 3000

# Install dependencies
RUN npm install

# Run the command to start the Node.js application
CMD ["npm", "run", "start"]