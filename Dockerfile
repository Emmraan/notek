FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build command to create the production build
RUN npm run build

# Expose the port if your application listens to a specific port
EXPOSE 3000

# Command to run the application
# Use environment variable to determine the command to run
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm run start; fi"]