#!/usr/bin/env bash

# RabbitMQ Operators
kubectl apply -f infra/infra-operators/operators/rabbitmq/operator.yaml

# Postgres Operators
kubectl apply -f infra/infra-operators/operators/postgres/configmap.yaml
kubectl apply -f infra/infra-operators/operators/postgres/operator-service-account-rbac.yaml
kubectl apply -f infra/infra-operators/operators/postgres/postgres-operator.yaml

# MongoDB Operators
kubectl apply -f infra/infra-operators/operators/mongo/crd.yaml
kubectl apply -k infra/infra-operators/operators/mongo/roles-bindings/
kubectl apply -f infra/infra-operators/operators/mongo/operator.yaml


# Connection string commands for the Mongo deployments, clusters use connection strings built up from their names

# auth-service
# kubectl get secret auth-mongo-auth-root -o json | jq -r '.data | with_entries(.value |= @base64d)'

# division-service
# kubectl get secret division-mongo-division-root -o json | jq -r '.data | with_entries(.value |= @base64d)'

# employee-service
# kubectl get secret employee-mongo-employee-root -o json | jq -r '.data | with_entries(.value |= @base64d)'

# task-service
# kubectl get secret task-mongo-task-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
