
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs. Ability to add a service mesh like Linkerd or Istio if required. UI to be built with micro-frontends.
### Note:
If you have completed the certificate install skip the ***Minikube*** section and start at ***Linkerd Install***
___
### Minikube:
```bash
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
Add the minikube ip with the domain of the application into the hosts file, rabbit.acmefast.dev is to access the message bus from your browser. linkerd.acme.dev is 
to get to the service mesh dashboard.
```text
192.168.49.2 acmefast.dev
192.168.49.2 rabbit.acmefast.dev
192.168.49.2 linkerd.acmefast.dev
```
___
###Linkerd Install   
Install the Linkerd CLI.
```bash
~$ curl --tlsv1.2 -sSfL https://run.linkerd.io/install | sh
```

Validate that Linkerd has access to your cluster.
```bash
~$ linkerd check --pre
```
If anything fails, check the docs: [Linkerd](https://linkerd.io/2.11/tasks/troubleshooting/)

Install the control plane.
```bash
~$ linkerd install | kubectl apply -f -
```
You can run ```linkerd check``` or alternatively.
```bash
# -w is the watch flag
~$ kubectl get pods -n linkerd -w
```

### Viz Dashboard:
Install the dashboard and on cluster metric stack.
```bash
`$ linkerd viz install | kubectl apply -f -
```
You can run ```linkerd check``` or alternatively.
```bash
# -w is the watch flag
~$ kubectl get pods -n linkerd-viz -w
```


### Buoynat Cloud Dashboard:  
Buoyant Cloud is a hosted management service for Linkerd it has a more comprehensive dashboard than viz.
```bash
~$ curl --tlsv1.2 -sSfL buoyant.cloud/install | sh
~$ linkerd buoyant install | kubectl apply -f -
```

Follow the instructions to connect your cluster.

You can access the dashboard by going to [https://buoyant.cloud](https://buoyant.cloud), or run the below command:
```bash
~$ linkerd buoyant dashboard &
```

### Proxy Injection: 
Once everything is up and running, run the ```linkerd-setup.sh``` script to setup the ingress fro the Viz dashboard and set annotations for proxy injection.
Please use the ```pod-deploy.sh``` to start the deployments. I have not spent the time to ensure the operator namespaces will allow proxy injection, so there are 
no guarantees it will function correctly.

### Dashboard
Open your browser on [linkerd.acmefast.dev](https://linkerd.acmefast.dev) (username: admin, password: admin) select the default namespace, alternatively go to [Buoyant Cloud](https://buoyant.cloud). 
You can see the deployments come online within the dashboard. If you have any issues let me know.

Click here:  [Main Page: Stand-ALone Deployments](https://github.com/EspressoTrip-v2/concept-application#stand-alone-deployments), to complete the setup.
