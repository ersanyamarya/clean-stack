FROM docker.io/oven/bun:distroless

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app


COPY dist/services/main-service main-service/

CMD [ "bun", "main-service" ]
