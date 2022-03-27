#!/usr/bin/env bash
$(npm bin)/proto-loader-gen-types --longs=String --keepCase=true --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto
\cp -r proto ../employee-dash-api/src/services

 protoc employee.proto --go_out=plugins=grpc:../employee-dash-service/proto/