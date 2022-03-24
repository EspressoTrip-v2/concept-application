#!/usr/bin/env bash
$(npm bin)/proto-loader-gen-types --longs=String --keepCase=true --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto
\cp -r proto ../auth-api/src/services
\cp -r proto ../auth-service/src/services