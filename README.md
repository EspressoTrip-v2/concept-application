
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs. Ability to add a service mesh like Linkerd or Istio if required. UI to be built with micro-frontends.

#### Prerequisite installations:

[Skaffold](https://skaffold.dev)  
[Minikube](https://minikube.sigs.k8s.io/docs/start/) -> Not tested with other local k8's, it's your gamble don't ask me to help  
[kubectl](https://kubernetes.io/docs/tasks/tools/)

#### Developer Notice:
If there are any changes to the codebase, please re-run the infrastructure scripts again to ensure there are no missing deployments.
Also running "npm i" in all the services will be a good idea due to the continuous changes.

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
192.168.49.2 acmefast.dev
192.168.49.2 rabbit.acmefast.dev
```

### Operators:
Once **Minikube** is running, begin deploying the operators and operator deployments.

```bash
~$ ./operator-controllers.sh
```
```bash
# You can run this multiple times to ensure the pods are running or add -w flag to watch
~$ kubectl get pods --all-namespaces
```
All operators need to have status **Running**. Then deploy the operator deployments:
```bash
~$ ./operator-deployments.sh
```
```bash
# You can run this multiple times to ensure the pods are running or add -w flag to watch
~$ kubectl get pods
```
These also need to have status **Running** before any other deployment can be run.
### Skaffold:

Application uses Skaffold for the management of the Kubernetes cluster during development. Node can be buggy sometimes, so you might have to stop and restart Skaffold after making changes.

```bash
~$ skaffold dev
```
Once everything is up and running open your browser and go to http://acmefast.dev. 
If you have included the message bus domain in your hosts file http://rabbit.acmefast.dev will display the message bus UI. Rabit dashboard username and password is "guest".

If you are on Chrome and you get a warning about certificates, without the ability to ignore. Click anywhere on the webpage and type "thisisunsafe" and enter.
### Postgres Database Connections
Some services use Postgres for databases (e.g. analytic-service), on startup of a Postgres operator deployment you will have to get the generated password so the application can connect to it.
To get the passwords for the existing databases:
```bash
# analytic-service Postgres database
~$  kubectl get secret root.acid-analytic-postgres.credentials.postgresql.acid.zalan.do  -o json | jq -r '.data'
```
This will give you the base64 encrypted password and user, ignore the user as it is set in the ConfigMap of the deployment. The output will look like the below:
```json
{
  "password": "OE9ySmVRMkd6a1BmcHl0SklBSXAxN0hPcVdNOHFsNGpNRWJ3RmRjMFNKVjNMejhPVGlKWlpzc1FPYUt3dmxMMw==",
  "username": "cm9vdA=="
}

```
In the infra/secrets.yaml paste the password into the relevant services Postgres password key. 

### Mongo Database Connections:
If you have any issues with failure to connect to the MongoDB pods, run the below commands in the terminal.
```bash
# auth-service Mongo database
~$ kubectl get secret auth-mongo-auth-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# division-service Mongo database
~$ kubectl get secret division-mongo-division-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# employee-service Mongo database
~$ kubectl get secret employee-mongo-employee-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
# task-service Mongo database
~$ kubectl get secret task-mongo-task-root -o json | jq -r '.data | with_entries(.value |= @base64d)'
```
Copy the infra/ folder find the relevant deployment file and paste the connection string in the ConfigMap at MONGO_URI key.
### Side Note
If you really can't get things running give me a shout and please don't **skrew up** my back-end code **Ruben Verster**. If you are building the front end, you don't need to make a PR, but please do so on any back-end changes. 

The services use ts-node-dev to run, so changes need to be made if we want to run a production version of the application.