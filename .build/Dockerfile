FROM node:18.16.0-alpine3.17

WORKDIR /website

COPY package.json  .
COPY package-lock.json  .

RUN npm ci

COPY . .


RUN npm run build

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

ENTRYPOINT [ "node",".output/server/index.mjs" ]