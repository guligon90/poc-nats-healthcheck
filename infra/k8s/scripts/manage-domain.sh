#!/bin/bash

MINIKUBE_IP=$(minikube ip)
DOMAIN=nats-healthcheck

function add() {
    ./manage-etc-hosts.sh add $MINIKUBE_IP $DOMAIN
}

function remove() {
    ./manage-etc-hosts.sh remove $MINIKUBE_IP $DOMAIN    
}

$@
