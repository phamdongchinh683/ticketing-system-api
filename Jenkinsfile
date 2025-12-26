pipeline {
    agent any

    environment {
        IMAGE_NAME = "phamdongchinh683/backend-fastify"
    }

    stages {

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

        stage('Migrate & Test') {
            steps {
                sh '''
                    yarn migrate
                '''
            }
        }

        stage ("Deploy to Production") {
            steps {
                sh '''
                    docker pull phamdongchinh683/backend-fastify:latest
                    docker compose -f docker-compose.prod.yml up -d
                '''
            }
        }

    }
}
