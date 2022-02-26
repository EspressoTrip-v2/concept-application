
![acmefast-slogan](https://user-images.githubusercontent.com/9296659/154143145-06262ea3-02d3-4cce-97f5-bbeb2f8d7c53.png)

Event driven microservice concept application using RabbitMQ, gRPC and Nodejs. Ability to add a service mesh like Linkerd or Istio if required. UI to be built with micro-frontends.


### Deploy Linkerd: 
Linkerd needs to be installed and running before being able to deploy the rest of the application.

### Minikube:
```bash
# The memory and cpu allocation is if you intend running a service mesh.
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

Install the Linkerd CLI.
```bash
~$ curl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install | sh
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

### Viz dashboard
Install the dashboard and on cluster metric stack.
```bash
`$ linkerd viz install | kubectl apply -f -
```
You can run ```linkerd check``` or alternatively.
```bash
# -w is the watch flag
~$ kubectl get pods -n linkerd-viz -w
```

Once everything is up and running, run the ```linkerd-setup.sh``` script to complete the setup. I have not setup the operators to use Linkerd, so please use the ```pod-deploy.sh```
to start the deployments when going back to the root README.

Open your browser on [linkerd.acmefast.dev](https://linkerd.acmefast.dev) (username: admin, password: admin), select the default namespace. You can keep this open as you deploy the rest of the application. Any pod in the 
ingress-nginx and the default namespace should be automatically meshed as they start up. 


Please go back to the [Root](https://github.com/EspressoTrip-v2/concept-application) folder and continue from the ***Stand-Alone Deployments*** section in the README.
To complete the rest of the setup for the application.