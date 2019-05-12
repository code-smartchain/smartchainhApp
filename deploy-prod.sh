#!/bin/bash

set -e

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

kubectl apply -f webapp.yml
kubectl set image deployment/${PROJECT_ID} ${PROJECT_ID}=eu.gcr.io/${PROJECT_ID}/${IMAGE_NAME}:$TRAVIS_COMMIT
# kubectl run --image=eu.gcr.io/smartchain/webapp:1188d27229b284c0d6452d9fafeceb0daa027c27 webapp --port=80

# sleep 30
