pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/phamdongchinh683/backend-fastify-setting.git'
        NODE_VERSION = '22'
        SSH_HOST = credentials('ssh-host') ?: 'your-server-ip-or-hostname'
        SSH_USER = credentials('ssh-user') ?: 'ubuntu'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.BRANCH_NAME = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceFirst(/^origin\//, '') ?: 'dev'
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
                sh 'yarn install'
            }
        }

        stage('Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'dev'
                }
            }
            steps {
                echo "Building branch ${env.BRANCH_NAME}..."
                sh 'yarn build'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Test') {
            when {
                anyOf {
                    branch 'main'
                    branch 'dev'
                }
            }
            steps {
                script {
                    def packageJson = readJSON file: 'package.json'
                    if (packageJson.scripts && packageJson.scripts.test) {
                        echo "Running tests..."
                        sh 'yarn test'
                    } else {
                        echo "No test script found in package.json, skipping tests"
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'dev'
                }
            }
            steps {
                script {
                    def imageTag = "${env.BRANCH_NAME}-latest"
                    def imageName = "phamdongchinh683/backend-fastify:${imageTag}"

                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            docker build -f Dockerfile.prod -t backend-fastify:${env.BUILD_NUMBER} .
                            docker tag backend-fastify:${env.BUILD_NUMBER} $imageName
                            docker login -u $DOCKER_USER -p $DOCKER_PASS
                            docker push $imageName
                        """
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "Deploying branch ${env.BRANCH_NAME}..."
                    
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'graduation-project-pem',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USERNAME'
                    )]) {
                        def sshHost = env.SSH_HOST ?: 'your-server-ip-or-hostname'
                        def sshUser = env.SSH_USER ?: 'ubuntu'
                        def imageName = "phamdongchinh683/backend-fastify:${env.BRANCH_NAME}-latest"
                        
                        sh """
                            chmod 600 \$SSH_KEY
                            
                            scp -i \$SSH_KEY -o StrictHostKeyChecking=no deploy.sh ${sshUser}@${sshHost}:/tmp/deploy.sh
                            
                            ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${sshUser}@${sshHost} bash -s << 'ENDSSH'
                                IMAGE_NAME='${imageName}'
                                # Pull the latest Docker image
                                docker pull \$IMAGE_NAME
                                
                                chmod +x /tmp/deploy.sh
                                /tmp/deploy.sh \$IMAGE_NAME
                                
                                # Clean up
                                rm -f /tmp/deploy.sh
ENDSSH
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished for branch ${env.BRANCH_NAME}"
            cleanWs()
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
        }
        unstable {
            echo "Pipeline is unstable!"
        }
    }
}
