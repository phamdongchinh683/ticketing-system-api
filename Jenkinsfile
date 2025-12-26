pipeline {
    agent any

    environment {
        IMAGE_NAME = "phamdongchinh683/backend-fastify"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.BRANCH_NAME = env.BRANCH_NAME ?: 'main'
                    echo "Building branch: ${env.BRANCH_NAME}"
                }
            }
        }

        stage('Load Production Environment') {
            steps {
                withCredentials([file(credentialsId: 'env', variable: 'ENV_FILE')]) {
                    sh '''
                echo "Loading env from $ENV_FILE"
                cat "$ENV_FILE" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > .env
                echo ".env generated:"
                cat .env
            '''
                }
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    node -v
                    npm -v
                    corepack enable
                    corepack prepare yarn@4.11.0 --activate
                    yarn -v
                '''
            }
        }

        stage('Install & Build') {
            steps {
                sh '''
                    yarn install
                    yarn build
                '''
            }
        }

        stage('Migrate & Test') {
            steps {
                sh '''
                    yarn migrate
                    yarn start
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build \
                  -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                  -t ${IMAGE_NAME}:latest \
                  -f Dockerfile.prod .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }
}
