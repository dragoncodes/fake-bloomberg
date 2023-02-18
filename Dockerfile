# Use the official NodeJS image.
# https://hub.docker.com/_/node
FROM node:16-slim

# Copy local code to the container image.
WORKDIR /usr/fake-bloomberg/
COPY . .

# Install production dependencies.
RUN npm install 

RUN npm run build

# Run the web service on container startup.
ENTRYPOINT [ "npm", "start" ]
