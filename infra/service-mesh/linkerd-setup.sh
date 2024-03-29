#!/usr/bin/env bash


# Add the Linkerd annotation to the default namespace
kubectl annotate namespace --overwrite=true default linkerd.io/inject=enabled


# Add the Linkerd annotation to the ingress-nginx namespace
kubectl create namespace ingress-nginx
kubectl annotate namespace --overwrite=true ingress-nginx linkerd.io/inject=enabled

# Add Jaeger Dashboard
kubectl apply -f jaeger-depl.yaml
kubectl apply -f jaeger-ingress-srv.yaml

# Add the Linkerd dashboard ingress
kubectl apply -f linkerd-dashboard-ingress.yaml
