
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs.

## SSL Certificates:  
This will assist you in setting up a local Certificate Authority for development and the annoyance of security blocks from the browser. 

#### Prerequisite installations:
[Skaffold](https://skaffold.dev)  
[Minikube](https://minikube.sigs.k8s.io/docs/start/)  
[kubectl](https://kubernetes.io/docs/tasks/tools/)   
[mkcert](https://github.com/FiloSottile/mkcert)  

### Minikube:
```bash
~$ minikube start --memory 8000 --cpus 4
```

You will need to add the domain to your OS hosts file.
```bash
# Get the ip of your running minikube
~$ minikube ip
```
Add the minikube ip with the domain of the application into the hosts file, rabbit.acmefast.dev is to access the message bus from your browser. linkerd.acme.dev is
to get to the service mesh dashboard.
```text
<MINIKUBE IP> acmefast.dev
<MINIKUBE IP> rabbit.acmefast.dev
<MINIKUBE IP> linkerd.acmefast.dev ** Add this if you are also going to install the service mesh **
```

Please have a look at the installation instructions for you OS, binaries can be downloaded [here](https://github.com/FiloSottile/mkcert/releases).
Minikube can use ```mkcert``` to insert a SSL certificate into the ingress addon, you will first need to generate the root certificate and key.
```bash
~$ mkcert -install
```
You will then need to add certificate for the ```acmefast``` domain:
```bash
#  Replace <MINIKUBE IP> with the correct ip address of your Minikube instance
~$ mkcert acmefast.dev "*.acmefast.dev" <MINIKUBE IP>
```
You will get an output that looks like this:
```
Created a new certificate valid for the following names 📜
 - "acmefast.dev"
 - "*.acmefast.dev"
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

Now enable the ingress controller.
```bash
~$ minikube addons enable ingress
```

Click here: [Linkerd Service Mesh Setup](https://github.com/EspressoTrip-v2/concept-application/tree/master/infra/service-mesh) to set up the service mesh.  
Click here: [Main Page: Stand-ALone Deployments](https://github.com/EspressoTrip-v2/concept-application#stand-alone-deployments) to continue with the standard setup.