FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npm run compile

# Start the application
CMD ["node", "out/bin/serve"]
