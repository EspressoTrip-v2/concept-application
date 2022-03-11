FROM espressotrip/golang-air
RUN mkdir /app
WORKDIR /app

COPY . .
RUN go mod download
CMD ["air"]