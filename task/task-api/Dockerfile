FROM golang:1.18 as builder
COPY . .
ARG SKAFFOLD_GO_GCFLAGS
RUN go build -gcflags="${SKAFFOLD_GO_GCFLAGS}" -o /app .

FROM alpine:3
ENV GOTRACEBACK=single
CMD ["./app"]

COPY --from=builder /app .