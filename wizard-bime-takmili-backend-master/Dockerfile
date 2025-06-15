FROM node:11.10.0-alpine

WORKDIR /usr/src/app

#COPY package*.json ./
ADD . .
RUN npm install pm2 -g

EXPOSE 5000
CMD pm2 start --no-daemon processes.json
