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
                git url: 'https://github.com/phamdongchinh683/backend-fastify-setting',
                    credentialsId: 'github-token'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'yarn install'
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
                sh 'docker build -t phamdongchinh683/backend-fastify:latest ./'
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
                    sh 'ssh -i $PEM ubuntu@ec2-100-31-102-67.compute-1.amazonaws.com 
                    "docker pull phamdongchinh683/backend-fastify:latest && docker-compose up -d"'
                }
            }
        }
    }
}
