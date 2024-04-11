FROM oven/bun:alpine

WORKDIR /website

COPY package.json  .
COPY package-lock.json  .

RUN bun install --production

COPY . .


RUN bun run build

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

ENTRYPOINT [ "bun",".output/server/index.mjs" ]