pipeline {
    agent any

    environment {
        IMAGE_NAME = "phamdongchinh683/backend-fastify"
        DOCKER_HUB_CREDS = 'dockerhub-creds'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage("Migrate") {
            steps {
                sh '''
                    yarn migrate
                '''
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDS, usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    sh '''
                        docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}
                        docker build -t ${IMAGE_NAME}:latest -f Dockerfile.prod .
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Load Production Environment') {
            steps {
                withCredentials([file(credentialsId: 'env', variable: 'ENV_FILE')]) {
                    sh '''
                        cat "$ENV_FILE" | jq -r '. | to_entries[] | .key + "=" + (.value | tostring)' > .env
                        cat .env
                        '''
                }
            }
        }
          
        stage("Deploy") {
            steps {
                 sh '''
                    echo "checking if postgres is running on port 5432"
                    if docker ps --filter "publish=5432" --format "{{.Names}}" | grep -q postgres; then
                        echo "postgres is already running → deploy API only"

                        docker-compose -f docker-compose.prod.yml pull api
                        docker-compose -f docker-compose.prod.yml run --rm api yarn migrate
                        docker-compose -f docker-compose.prod.yml up -d api
                    else
                        echo " Postgres is NOT running → full docker compose up"
                        docker-compose -f docker-compose.prod.yml up -d
                    fi
                 '''
            }
        }
    }
}

