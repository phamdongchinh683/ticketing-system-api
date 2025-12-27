pipeline {
    agent any

    environment {
        IMAGE_NAME = "phamdongchinh683/backend-fastify"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
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

        stage('Install & Build') {
            steps {
                sh '''
                    yarn install
                    yarn build
                '''
            }
        }

        stage('Migrate') {
            steps {
                sh '''
                    yarn migrate
                '''
            }
        }

        stage ("Deploy") {
            steps {
                sh '''
                    docker-compose -f docker-compose.prod.yml pull
                    docker-compose -f docker-compose.prod.yml up -d --build
                '''
            }
        }

    }
}
