FROM node:17

LABEL maintainer = "GIRIDHAR M A"

LABEL version = "1.0"

LABEL description = "IoT-backEnd application using nodeJS"

WORKDIR /src/IoT-Home-backEnd

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

#ENV IP 172.17.0.3

EXPOSE 3001

CMD ["node", "app.js"]
