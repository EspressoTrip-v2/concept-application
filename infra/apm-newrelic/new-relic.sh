#!/usr/bin/env bash

# Please do not run this in the dev env, it is only used as proof of concept for my testing

kubectl create namespace newrelic ;
kubectl apply -f ./newrelic-manifest.yaml