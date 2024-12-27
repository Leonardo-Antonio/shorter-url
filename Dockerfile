FROM golang:1.23.2

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o main .

ENV PORT=9000
ENV TTL_MINS_URLS=5

CMD ["./main"]