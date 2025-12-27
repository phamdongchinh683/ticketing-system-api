pipeline {
    agent any

    environment {
        YARN_CACHE_FOLDER = "${WORKSPACE}/.yarn-cache"
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
                if [ -d node_modules ]; then
                    echo "Using cached node_modules"
                else
                    yarn install --frozen-lockfile
                fi
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
                    docker-compose -f docker-compose.prod.yml pull --quiet
                    docker-compose -f docker-compose.prod.yml up -d --remove-orphans
                '''
            }
        }

    }
}
