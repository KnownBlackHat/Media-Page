FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT ["node", "build"]
