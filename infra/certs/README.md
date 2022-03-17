
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs.

## TLS Certificates:  
This will assist you in setting up a local Certificate Authority for development and the annoyance of security blocks from the browser. 
___
#### File Changes:
Before continuing changes need to be made to the ingress yaml files to allow TLS on port 443.
The files that need to be changes are:
 - infra/infra-dev/concept-ingress-srv.yaml
 - infra/infra-dev/rabbit-ingress-srv.yaml
 - infra/service-mesh/linkerd-dashboard-ingress.yaml  

Example:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rabbit-ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  # This section needs to be uncommented to use TLS
  tls:
    - hosts:
        - rabbit.acmefast.dev
      secretName: mkcert
    # #########################################
  rules:
    - host: rabbit.acmefast.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: rabbit-cluster
                port:
                  number: 15672
```

___
#### Prerequisite installations:
[Skaffold](https://skaffold.dev)  
[Minikube](https://minikube.sigs.k8s.io/docs/start/)  
[kubectl](https://kubernetes.io/docs/tasks/tools/)   
[mkcert](https://github.com/FiloSottile/mkcert)  

### Minikube:
```bash
# The application takes up a lot of space as there are multiple services and volumes that need to be created 
~$ minikube start --memory 8000 --cpus 4 --disk-size 50000mb
```

You will need to add the domain to your OS hosts file.
```bash
# Get the ip of your running minikube
~$ minikube ip
```
Add the minikube ip with the domains of the application into the hosts file.
to get to the service mesh dashboard.
```text
<MINIKUBE IP> acmefast.dev
<MINIKUBE IP> rabbit.acmefast.dev
<MINIKUBE IP> linkerd.acmefast.dev ** Add this if you are also going to install the service mesh **
<MINIKUBE IP> jaeger.acmefast.dev ** This is for distributed tracing that gets deployed with the service mesh **
```

You will need mkcert, have a look at the installation instructions for you OS [here](https://github.com/FiloSottile/mkcert), binaries can be downloaded [here](https://github.com/FiloSottile/mkcert/releases).
Minikube can use ```mkcert``` to insert a SSL certificate into the ingress addon, you will first need to generate the root certificate and key.
```bash
~$ mkcert -install
```
You will then need to add the certificates for the ```acmefast``` domain:
```bash
#  Replace <MINIKUBE IP> with the correct ip address of your Minikube instance
~$ mkcert acmefast.dev rabbit.acmefast.dev linkerd.acmefast.dev jaeger.acmefast.dev <MINIKUBE IP>
```
You will get an output that looks like this:
```
Created a new certificate valid for the following names 📜
 - "acmefast.dev"
 - "rabbit.acmefast.dev"
 - "linkerd.acmefast.dev"
 - "jaeger.acmefast.dev"
 - "192.168.49.2"

Reminder: X.509 wildcards only go one level deep, so this won't match a.b.acmefast.dev ℹ️

The certificate is at "./acmefast.dev+2.pem" and the key at "./acmefast.dev+2-key.pem" ✅

It will expire on 27 May 2024 🗓

```
Generate a TLS secret in Kubernetes from the certificates:
```bash
# Ensure the key and the cert match the output
~$ kubectl -n kube-system create secret tls mkcert --key ./acmefast.dev+2-key.pem --cert ./acmefast.dev+2.pem
```
You will then need to update the ingress config before enabling it.
```bash
~$ minikube addons configure ingress
# You will be asked to enter the secret, enter as below
-- Enter custom cert(format is "namespace/secret"): kube-system/mkcert
````

If you are going to include the service mesh.
Click here: [Linkerd Service Mesh Setup: Linkerd Install](https://github.com/EspressoTrip-v2/concept-application/tree/master/infra/service-mesh#linkerd-install) to set up the service mesh.

Else run the below command:
```bash
~$ minikube addons enable ingress
```
 
Click here: [Main Page: Stand-Alone Deployments](https://github.com/EspressoTrip-v2/concept-application#stand-alone-deployments) to continue with the standard setup.
