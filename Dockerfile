FROM node:16.13.2-alpine3.15

WORKDIR /website

COPY package.json  .
COPY package-lock.json  .
COPY deps deps

RUN npm ci

COPY . .


RUN npm run build

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

ENTRYPOINT [ "node",".output/server/index.mjs" ]