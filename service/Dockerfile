FROM node:16.13.2-alpine3.15
WORKDIR /app
COPY package.json .
RUN npm i --only=prod
COPY . .
CMD npm start