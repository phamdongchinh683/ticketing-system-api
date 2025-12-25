#!/bin/bash
set -e

IMAGE_NAME=${1:-phamdongchinh683/backend-fastify:main-latest}

cd /home/ubuntu/app || mkdir -p /home/ubuntu/app

docker stop backend-fastify || true
docker rm backend-fastify || true
docker run -d --name backend-fastify -p 3000:3000 ${IMAGE_NAME}

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$STATUS" -ne 200 ]; then
    echo "App not running!"
    exit 1
fi

echo "Deployment successful!"
