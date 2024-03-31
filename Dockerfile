FROM node:16.20.1

WORKDIR user/task-manager

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "./dist/index.js"]

#To run Docker install 1. Install Docker, Docker build -t task-manager . -------run this command in the some dict as the project, and I am using mongo Atals