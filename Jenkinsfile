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

        stage('Load Production Environment ') {
            steps {
                withCredentials([file(credentialsId: 'env', variable: 'ENV_FILE')]) {
                    sh '''
                        cat "$ENV_FILE" | jq -r '. | to_entries[] | .key + "=" + (.value | tostring)' > .env
                        cat .env
                        '''
                }
            }
        }
          
        stage ("Deploy") {
            steps {
                sh '''
                    docker-compose -f docker-compose.prod.yml pull
                    docker-compose -f docker-compose.prod.yml run --rm api yarn migrate
                    docker-compose -f docker-compose.prod.yml up -d --remove-orphans

                '''
            }
        }

    }
}
