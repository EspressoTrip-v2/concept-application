
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs. Ability to add a service mesh like Linkerd or Istio if required. UI to be built with micro-frontends.

#### Prerequisite installations:

[Skaffold](https://skaffold.dev)  
[Minikube](https://minikube.sigs.k8s.io/docs/start/) -> Not tested with other local k8's, it's your gamble don't ask me to help  
[kubectl](https://kubernetes.io/docs/tasks/tools/)



### Developer Note:
##### Always make sure the mongo connection strings are set to the correct deployment and that the postgres password is changed to your required in the secrets.yaml file before running the newly pulled repo.
***Repo changes***:  
Run the ```npm-install.sh``` script once you make a pull to update all the services packages. I will update this list as the application grows.
If there are any changes to the codebase, please re-run the infrastructure scripts again to ensure there are no missing deployments.

There is a ```npm-update-common.sh``` script that I use to update the npm library that is shared amongst the services. !!!DO NOT RUN THIS!!! The library changes daily and so will 
cause the master branch to not run as usually the library required is many versions behind the latest @espressotrip-org/concept-common library.


***Volume persistence***:  
The setup below needs to be done on start up of minikube... minikube shuts down all deployment, whether operators or not. The data created in Mongo will persist between restarts.
Postgres database need a bit more set up, I will get to that eventually. If you ***minikube delete*** all data will be lost. If you would like to persist data on your machine
give me a shout I will help you set it up, it unfortunately requires another command to be run and a few adjustments in the deployment files.



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
Once **Minikube** is running, move to next step.

___
### IMPORTANT:

You can choose to not run the operators for Mongo and RabbitMQ. The operators deploy a host of custom resources to manage the container. There is another script
and yaml files that allow for stand-alone deployments of all the Mongo and RabbitMQ containers. You will have to make one or two small adjustments in the deployment
ConfigMaps that are using the MongoDB pods. Postgres will still run with the operator, simply because the adjustments required can not be done without changing the source code.
___

### Stand-Alone Deployments:
Single deployments for Mongo, Postgres and RabbitMQ
```bash
# Deploys all PV, PVC and pods
~$ ./pod-deploys.sh
```
Ensure that the pods are all running and that the persistent volumes have been claimed
```bash
~$ kubectl get pods
```
Check PV and PVC
```bash
# Check the persistent volume 
~$ kubectl get pv
NAME                              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
auth-pv-claim                     Bound    volume-storage-1                           1Gi        RWO            manual         15s
division-pv-claim                 Bound    volume-storage-2                           1Gi        RWO            manual         15s
```
```bash
# Check the persistent claim
~$ kubectl get pvc
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                     STORAGECLASS   REASON   AGE
pvc-333d7126-f834-43d1-8250-dd37943b8c95   1Gi        RWO            Delete           Bound    default/pgdata-acid-analytic-postgres-0   standard                19s
volume-storage-1                           1Gi        RWO            Retain           Bound    default/auth-pv-claim                     manual                  20s
```
Make sure to comment out the cluster connection string (Long version) and uncomment the deployment connection string (Short version) in the infra/infra-dev deployment files
ConfigMaps for those that are using the MongoDB databases, once everything is up and running skip the below operators section and go to **Skaffold**.
### Operators:
Operator deployments for Mongo, Postgres and RabbitMQ.

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

### Skaffold Image Handling:
Every time you make shut Skaffold down it removes the created deployments, there is a small issue that sometimes it leaves dangling images that take up space. You might get a low
memory warning from minikube. To clean any dangling images you need to ssh into minikube to clear then out.
```bash
~$  minikube ssh -- docker system prune
```
This should stop the warnings. 
```bash
# Appending -a will clear everything
~$  minikube ssh -- docker system prune -a
```
Using the -a flag will wipe all images and Skaffold will have to rebuild them all at start.

### Postgres Database Connections:
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

### Connecting to a Kubernetes Mongo Database:
```bash
# First find the service that connects the database you want
~$ kubectl get service
# Forward the port to the host machine
~$ kubectl port-forward service/<SERVICE_NAME> 27017:27017
```
Open Compass or Studio3T and connect to the database on localhost:27017. If you already have a local database running you can map the service port to a different
local port (e.g. 27018:27017 Then adjust your connection string)

### Add Dummy User
Users will not be created from a UI, they will have to be added manually. Only employees will be created from the UI. Insert the below document into the auth-service mongo
database in the users collection. 

```json
{
  "firstName" : "John",
  "lastName" : "Doe",
  "gender" : "male",
  "race" : "white",
  "position" : "developer",
  "startDate" : "2022-02-17T07:45:08.422Z",
  "shiftPreference" : "night",
  "branchName" : "wyzetalk",
  "region" : "WC",
  "country" : "ZA",
  "phoneNUmber" : "0823333333",
  "email" : "john@test.com",
  "signInType" : "UNKNOWN",
  "userRole" : "ADMIN",
  "password" : "e959c9c75eab764731150b174506ce54197eb854522e5120eb467a4961fd1f4f0b2a37dbc9061a951767afba93e5a168faef79cdc9f29ec9997e150701cc5c21.590049f253fc43f0",
  "providerId" : "",
  "version" : 0
}
```
Emails need to be unique: Password is ***12345***

### Mongo Database Connections for operator clusters: 
If you have any issues with failure to connect to the MongoDB operator cluster pods, run the below commands in the terminal.
!!!NB. This is not for the pod-deploy.sh MongoDB instances !!!
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

___
### Infrastructure Folder Note
The folder infra/apm is not meant to be used for development, this is test case APM files that are only to be used for showcase.
Please only deploy files from the .sh scripts that are mentioned 
___


### Architectural Model:
![acme-fast-foods](https://user-images.githubusercontent.com/9296659/154967637-29999ee6-9fd4-40da-b96a-dc3612477aa0.png)