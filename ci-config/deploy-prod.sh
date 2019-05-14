#!/bin/bash

set -e

mv Dockerfile ../Dockerfile
cd ..

docker build -t eu.gcr.io/${PROJECT_ID}/${IMAGE_NAME}:$TRAVIS_COMMIT .

echo $GOOGLE_APPLICATION_CREDENTIALS | base64 --decode -i > ${HOME}/gcloud-service-key.json
gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json

gcloud --quiet config set project $PROJECT_ID
gcloud --quiet config set container/cluster $CLUSTER
gcloud --quiet config set compute/zone $ZONE
gcloud --quiet container clusters get-credentials $CLUSTER

gcloud docker -- push eu.gcr.io/${PROJECT_ID}/${IMAGE_NAME}

yes | gcloud beta container images add-tag eu.gcr.io/${PROJECT_ID}/${IMAGE_NAME}:$TRAVIS_COMMIT eu.gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest

kubectl config view
kubectl config current-context

kubectl set image deployment/${IMAGE_NAME} ${IMAGE_NAME}=eu.gcr.io/${PROJECT_ID}/${IMAGE_NAME}:$TRAVIS_COMMIT

# sleep 30
