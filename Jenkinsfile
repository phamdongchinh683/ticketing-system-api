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

        stage('Install & Build') {
            steps {
                sh '''
                    node -v
                    yarn -v
                    yarn install --frozen-lockfile
                    yarn build
                '''
            }
        }

        stage('Migrate') {
            steps {
                sh 'yarn migrate'
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
