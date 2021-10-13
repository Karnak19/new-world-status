FROM hayd/deno:latest

WORKDIR /app

ADD . /app

RUN deno cache index.ts

CMD ["run", "--allow-net", "index.ts"]