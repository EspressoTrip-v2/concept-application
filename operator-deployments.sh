#!/usr/bin/env bash
# This script deploys all the clusters that the operators will manage

# MongoDB cluster deployments
kubectl apply -f infra-operators/operator-deployments/mongo/analytics-mongo-cluster.yaml
kubectl apply -f infra-operators/operator-deployments/mongo/auth-mongo-cluster.yaml
kubectl apply -f infra-operators/operator-deployments/mongo/order-mongo-cluster.yaml
kubectl apply -f infra-operators/operator-deployments/mongo/product-mongo-cluster.yaml

# Rabbit cluster deployments
kubectl apply -f infra-operators/operator-deployments/rabbit/rabbit-cluster.yaml