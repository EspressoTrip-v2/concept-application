#!/bin/bash
 protoc task.proto --go_out=plugins=grpc:../task-api/proto/
 protoc task.proto --go_out=plugins=grpc:../task-service/proto/
