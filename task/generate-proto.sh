#!/bin/bash
 protoc task-proto/task.proto --go_out=plugins=grpc:task-api/
 protoc task-proto/task.proto --go_out=plugins=grpc:task-service/
