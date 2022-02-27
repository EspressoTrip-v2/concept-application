
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs. Ability to add a service mesh like Linkerd or Istio if required. UI to be built with micro-frontends.
___
#### Prerequisite installations:

[Skaffold](https://skaffold.dev)  
[Minikube](https://minikube.sigs.k8s.io/docs/start/)  
[kubectl](https://kubernetes.io/docs/tasks/tools/)

___
#### Certificates (Optional):  
***Go here for [SSL Certificate Setup](https://github.com/EspressoTrip-v2/concept-application/tree/master/infra/certs) before moving on***
___
#### Service Mesh Deployment (Optional):
***Go here for [Linkerd Servive Mesh Setup](https://github.com/EspressoTrip-v2/concept-application/tree/master/infra/service-mesh) before moving on***
___

#### Developer Notes:    
Always make sure the mongo connection strings are set to the correct deployment and that the postgres password is changed to your required in the secrets.yaml file before running the newly pulled repo.

##### Repo changes:  
Run the ```npm-install.sh``` script once you make a pull to update all the services packages. I will update this list as the application grows.
If there are any changes to the codebase, please re-run the infrastructure scripts again to ensure there are no missing deployments.

There is a ```npm-update-common.sh``` script that I use to update the npm library that is shared amongst the services. 
!!!DO NOT RUN THIS!!! The library changes daily and so will 
cause the master branch to not run as usually the library required is many versions behind the latest @espressotrip-org/concept-common library.


##### Volume persistence:  
All data wil persist on restarts, if you do a ```minikube delete``` everything will be lost. The latest version of Minikube v1.25.2 also will maintain any deployments after restart.
Versions before that you will have to manually restart all the deployments again as described below... my suggestion is upgrade.
___
### Note:
If you have completed any of the optional setup above, please skip ***Minikube*** section and move to the [***Stand Alone Deployments***](#stand-alone-deployments) section.
### Minikube:
```bash
~$ minikube start 
```
```bash
# This adds a nginx ingress controller, it is required else you will not 
# be able to access the application through the browser.
~$ minikube addons enable ingress
```

You will need to add the domain to your OS hosts file.
```bash
# Get the ip of your running minikube
~$ minikube ip
```
Add the minikube ip with the domain of the application into the hosts file,
the rabbit.acmefast.dev is to access the message bus from your browser.
```text
<MINIKUBE IP> acmefast.dev
<MINIKUBE IP> rabbit.acmefast.dev
```
Once **Minikube** is running, move to next step.

___
### Note:

You can choose to not run the operators for Mongo and RabbitMQ. The operators deploy a host of custom resources to manage the container. There is another script
and yaml files that allow for stand-alone deployments of all the Mongo and RabbitMQ containers. You will have to make one or two small adjustments in the deployment
ConfigMaps that are using the MongoDB pods. Postgres will still run with the operator, simply because the adjustments required can not be done without changing the source code.
___

### Stand Alone Deployments:
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
___
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
___
### Skaffold:

Application uses Skaffold for the management of the Kubernetes cluster during development. Node can be buggy sometimes, so you might have to stop and restart Skaffold after making changes.

```bash
~$ skaffold dev
```
Once everything is up and running open your browser and go to http://acmefast.dev. 
If you have included the message bus domain in your hosts file http://rabbit.acmefast.dev will display the message bus UI. Rabit dashboard username and password is "guest".

If you are on Chrome and you get a warning about certificates, without the ability to ignore. Click anywhere on the webpage and type "thisisunsafe" and enter.

#### Skaffold Image Handling:
Every time you shut Skaffold down it removes the created deployments, there is a small issue that sometimes it leaves dangling images that take up space. You might get a low
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
___
### Connections:  
#### Postgres Database Connections:
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

#### Connecting to a Kubernetes Mongo Database:
```bash
# First find the service that connects the database you want
~$ kubectl get service
# Forward the port to the host machine
~$ kubectl port-forward service/<SERVICE_NAME> 27017:27017
```
Open Compass or Studio3T and connect to the database on localhost:27017. If you already have a local database running you can map the service port to a different
local port (e.g. 27018:27017 Then adjust your connection string)

#### Mongo Database Connections for operator clusters:
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
Copy the connection string that applies and in the infra/infra-dev/ folder find the relevant deployment file and paste the connection string in the ConfigMap at MONGO_URI key.
___
### Data:
#### Add Dummy User
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
Email values need to be unique: Password is ***12345***


### Architectural Model:
![acme-fast-foods](https://user-images.githubusercontent.com/9296659/154967637-29999ee6-9fd4-40da-b96a-dc3612477aa0.png)