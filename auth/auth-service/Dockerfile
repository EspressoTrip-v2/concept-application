FROM node:16.13.2-alpine3.15
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --silent
COPY . .
CMD npm start