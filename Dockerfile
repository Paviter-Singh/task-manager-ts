FROM node:16.20.1

WORKDIR user/task-manager

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "./dist/index.js"]