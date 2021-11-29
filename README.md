# poc-nats-healthcheck [WiP]

Proof of concept (POC) of NATS streaming server implementation, for healthcheck purposes, in both Docker Compose and Kubernetes environments.
## 0. Table of Contents

<!-- TOC -->
  * [1. Getting started](#1-getting-started)
  * [2. Setting up the NATS streaming server](#2-setting-up-the-nats-streaming-server)
    * [2.1. Docker Compose](#21-docker-compose)
      * [2.1.1. Building and running](#211-building-and-running)
      * [2.1.2. Monitoring](#212-monitoring)
    * [2.2. Kubernetes](#22-kubernetes)
      * [2.2.1. Domain mapping](#221-domain-mapping)
      * [2.2.2. Building and running](#222-building-and-running)
      * [2.2.3. Monitoring](#223-monitoring)
  * [3. Publishing and subscribing](#3-publishing-and-subscribing)
    * [3.1. Installing packages](#31-installing-packages)
    * [3.2. Running](#32-running)
<!-- /TOC -->

## 1. Getting started

In order to build the project, you must have already installed and configured in your workspace:

* [Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Kubernetes](https://kubernetes.io/docs/setup/) stack:
    * [minukube](https://minikube.sigs.k8s.io/docs/start/)
    * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
    * [skaffold](https://skaffold.dev/docs/install/)
    * [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/#minikube)
* [Node.js (v16.13.0)](https://nodejs.org/en/)
* [Node Package Manager (NPM) (v8.1.0)](https://docs.npmjs.com/cli/v8)


## 2. Setting up the NATS streaming server

The NATS streaming server can be built and run either by Docker Compose or Kubernetes. You can follow one the instructions below, for each environment.

### 2.1. Docker Compose 

#### 2.1.1. Building and running


To build the image for the `nats` service, execute:
```shell
docker-compose build --pull nats
```

With the image built, to run the container and see its logs, run in the terminal:
```shell
docker-compose up -d nats && docker-compose logs --follow nats
```
#### 2.1.2. Monitoring

With all the deployment finished and the pods created, the interface for monitoring the NATS streaming server can be accessed via browser at [`http://localhost:8222/streaming`](http://localhost:8222/streaming).

### 2.2. Kubernetes

#### 2.2.1. Domain mapping

There are some scripts that must be run in order to setup some configurations concerning domain mapping.
In the terminal, run the following commands:


```shell
cd infra/k8s/scripts
./manage-domain.sh add # Maps the nats-healthcheck domain to the minikube IP (in /etc/hosts)
```

For removing such settings, just run:
```shell
./manage-domain.sh remove
```
#### 2.2.2. Building and running

In order to build and run the whole kubernetes cluster via skaffold, just run in the terminal, at the project root:

```shell
skaffold dev
```

#### 2.2.3. Monitoring

With all the deployment finished and the pods created, the interface for monitoring the NATS streaming server can be accessed via browser at [`http://nats-healthcheck/streaming`](http://nats-healthcheck/streaming).


## 3. Publishing and subscribing

* [`src/publisher.ts`](./src/publisher.ts): Creates a connection to the streaming server and sends a stringified JSON containing the PID and the uptime of the current process, every 30 seconds;
* [`src/listener.ts`](./src/listener.ts): Creates a connection and a subscription to the same channel

The configuration parameters, such as publishing interval, subject (channel name), can be modified in [`src/common/constants.ts`](./src/common/constants.ts)

### 3.1. Installing packages

Just run:
```shell
npm install
```
### 3.2. Running

In order to test multiple instances of publishers and subscribers, for different terminal instances, you can run:

```shell
npm run publish # Runs the publisher
```

In another terminal, run:

```shell
npm run listen # Runs the listener
```

The following image ilustrates two instances of publishers and two instances of subscribers in operation:

![multiple-pubs-subs](https://user-images.githubusercontent.com/35070513/143795340-ec6f1c85-3751-4a5d-9486-d8a58aa1d0da.png)

[**Table of Contents**](#0-table-of-contents)