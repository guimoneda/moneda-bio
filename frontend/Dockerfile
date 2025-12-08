FROM node:18-alpine

WORKDIR /app

COPY package.json .

# We will install dependencies when the container starts for the first time
CMD ["npm", "start"]