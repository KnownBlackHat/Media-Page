FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

CMD "npm build"

EXPOSE 3000

ENTRYPOINT ["node", "build"]
