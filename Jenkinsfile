pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('dockerhub-creds') 
        DOCKER_PASS = credentials('dockerhub-creds')
        GITHUB_TOKEN = credentials('github-token')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                    env.BRANCH_NAME = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceFirst(/^origin\//, '') ?: 'main'
                    echo "Building branch: ${env.BRANCH_NAME}"
                }
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    corepack enable || true
                    node --version
                    yarn --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    # Enable corepack for Yarn 4
                    corepack enable || true
                    # Install dependencies (use --immutable for CI, or --mode=update-lockfile if lockfile needs updating)
                    yarn install --immutable || yarn install --mode=update-lockfile
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh 'yarn build'
                sh 'yarn migrate'
                sh 'yarn start'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -f Dockerfile.prod -t phamdongchinh683/backend-fastify:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', 
                                                usernameVariable: 'DOCKER_USER', 
                                                passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push phamdongchinh683/backend-fastify:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'aws-ec2-key', keyFileVariable: 'PEM')]) {
                    sh '''
                        chmod 600 $PEM
                        ssh -i $PEM -o StrictHostKeyChecking=no ubuntu@ec2-100-31-102-67.compute-1.amazonaws.com "docker pull phamdongchinh683/backend-fastify:latest && docker-compose up -d"
                    '''
                }
            }
        }
    }
}
