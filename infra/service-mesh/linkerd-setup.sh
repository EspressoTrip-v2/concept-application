#!/usr/bin/env bash

# Add the Linkerd dashboard ingress
kubectl apply -f linkerd-dashboard-ingress.yaml

# Add the Linkerd annotation to the default namespace
kubectl annotate namespace --overwrite=true default linkerd.io/inject=enabled


# Add the Linkerd annotation to the ingress-nginx namespace
kubectl create namespace ingress-nginx
kubectl annotate namespace --overwrite=true ingress-nginx linkerd.io/inject=enabled

