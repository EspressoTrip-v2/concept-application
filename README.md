# Micro-service Concept Application

Event driven micro-service application using RabbitMQ, gRPC and Nodejs. Ability to add service mesh like Linkerd or Istio if required. UI to be built with micro-frontends.

#### Prerequisite installations:

[Skaffold](https://skaffold.dev)  
[Minikube](https://minikube.sigs.k8s.io/docs/start/) -> Not tested with other local k8's, it's your gamble don't ask me to help  
[kubectl](https://kubernetes.io/docs/tasks/tools/)
### Minikube:
```bash
# The memory and cpu allocation is if you intend running a service mesh.
# Run 'minikube start' for standard allocation
~$ minikube start --memory 8000 --cpus 4
```
```bash
# This adds a nginx ingress controller, it is required else you will not 
# be able to access the application through the browser.
~$ minikube addons enable ingress
```

You will need to add the domain to your OS hosts file (Linux: etc/hosts)
```bash
# Get the ip of your running minikube
~$ minikube ip
```
Add the minikube ip with the domain of the application (concept.dev) into the hosts file,
the rabbit.info is to access the message bus from your browser.
```text
192.168.49.2 concept.dev
192.168.49.2 rabbit.info
```

### Operators:
Once **Minikube** is running, begin deploying the operators and operator deployments.

```bash
~$ ./operator-controllers.sh
```
```bash
# You can run this multiple times to ensure the pods are running
~$ kubectl get pods --all-namespaces
```
All operators need to have status **Running**. Then deploy the operator deployments:
```bash
~$ ./operator-deployments.sh
```
```bash
# You can run this multiple times to ensure the pods are running
~$ kubectl get pods
```
These also need to have status **Running** before any other deployment can be run.
### Skaffold:

Application uses Skaffold for the management of the Kubernetes cluster during development. Node can be buggy sometimes, so you might have to stop and restart Skaffold after making changes.

```bash
~$ skaffold dev
```
Once everything is up and running open your browser and go to http://concept.dev. If you have included the message bus domain in your hosts file http://rabit.info will display the message bus UI.

If you are on Chrome and you get a warning about certificates, without the ability to ignore. Click anywhere on the webpage and type "thisisunsafe" and enter.
### Connection issues:
If you have any issues with failure to connect to the MongoDB pods, run the below commands in the terminal. More services will be added in the future, these are only initial MongoDB databases.
```bash
# auth-service Mongo database
~$ kubectl get secret auth-mongo-auth-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# order-service Mongo database
~$ kubectl get secret order-mongo-order-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# product-service Mongo database
~$ kubectl get secret product-mongo-product-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# analytics-service Mongo database
~$ kubectl get secret analytic-mongo-analytic-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
```

If you really can't get things running give me a shout and please don't **skrew up** my back-end code **Ruben Verster**. If you are building the front end, you don't need to make a PR, but please do so on any back-end changes. 

The services use ts-node-dev to run, so changes need to be made if we want to run a production version of the application.
