FROM node:carbon

ENV SRC_DIR=/usr/src/app
WORKDIR $SRC_DIR

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80
CMD [ "npm", "start" ]
