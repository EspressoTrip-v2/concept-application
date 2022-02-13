#!/bin/bash

# RabbitMQ Operators
kubectl apply -f infra-operators/operators/rabbitmq/operator.yaml
kubectl apply -f infra-operators/operators/rabbitmq/rabbit.yaml

# Postgres Operators
kubectl apply -f infra-operators/operators/postgres/configmap.yaml
kubectl apply -f infra-operators/operators/postgres/operator-service-account-rbac.yaml
kubectl apply -f infra-operators/operators/postgres/postgres-operator.yaml
kubectl apply -f infra-operators/operators/postgres/api-service.yaml

# MongoDB Operators
kubectl apply -f infra-operators/operators/mongo/crd.yaml
kubectl apply -k infra-operators/operators/mongo/roles-bindings/
kubectl apply -f infra-operators/operators/mongo/operator.yaml


# Connection string commands for the mongo deployments, clusters use connection strings built up from their names
# auth-service
# kubectl get secret auth-mongo-auth-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# order-service
# kubectl get secret order-mongo-order-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# product-service
# kubectl get secret product-mongo-product-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# analytics-service
# kubectl get secret analytic-mongo-analytic-root -o json | jq -r '.data | with_entries(.value |= @base64d)'

