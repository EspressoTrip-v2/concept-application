#!/usr/bin/env bash

# This will deploy a single operator for Postgres as the codebase requires ssl so single pod is too much work
# everything else will be a standalone pod

# MongoDB Deployments
kubectl apply -f infra/infra-pods/auth-mongo.yaml
kubectl apply -f infra/infra-pods/division-mongo.yaml
kubectl apply -f infra/infra-pods/employee-mongo.yaml
kubectl apply -f infra/infra-pods/task-mongo.yaml

# RabbitMQ Deployments
kubectl apply -f infra/infra-pods/rabbitmq.yaml

# Postgres Operators
kubectl apply -f infra/infra-operators/operators/postgres/configmap.yaml
kubectl apply -f infra/infra-operators/operators/postgres/operator-service-account-rbac.yaml
kubectl apply -f infra/infra-operators/operators/postgres/postgres-operator.yaml

# Wait for deployments to be ready
kubectl wait --for=condition=Ready --timeout=600s --all deployments

# Postgres cluster deployments
kubectl apply -f infra/infra-operators/operator-deployments/postgres/analytic-postgres-cluster.yaml