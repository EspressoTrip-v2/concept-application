#!/usr/bin/env bash
# This script deploys all the clusters that the operators will manage

# MongoDB cluster deployments
kubectl apply -f infra/infra-operators/operator-deployments/mongo/auth-mongo-cluster.yaml
kubectl apply -f infra/infra-operators/operator-deployments/mongo/division-mongo-cluster.yaml
kubectl apply -f infra/infra-operators/operator-deployments/mongo/employee-mongo-cluster.yaml
kubectl apply -f infra/infra-operators/operator-deployments/mongo/task-mongo-cluster.yaml

# Rabbit cluster deployments
kubectl apply -f infra/infra-operators/operator-deployments/rabbit/rabbit-cluster.yaml

# Postgres cluster deployments
kubectl apply -f infra/infra-operators/operator-deployments/postgres/analytic-postgres-cluster.yaml