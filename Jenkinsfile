pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    PORT = '5001'
    MONGO_URI = 'mongodb://127.0.0.1:27017/fooddelivery_ci'
    JWT_SECRET = 'ci-secret'
    PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'cd backend && npm ci'
        sh 'cd frontend && npm ci'
      }
    }

    stage('Backend Smoke Start') {
      steps {
        sh '''
          set -e
          cd backend
          node server.js > backend.log 2>&1 &
          SERVER_PID=$!
          sleep 8

          if ! kill -0 $SERVER_PID 2>/dev/null; then
            echo "Backend failed to stay up. Logs:"
            cat backend.log
            exit 1
          fi

          curl -fsS http://127.0.0.1:${PORT}/health > /dev/null
          kill $SERVER_PID
        '''
      }
    }
  }

  post {
    failure {
      echo 'Pipeline failed. Check backend.log and stage output for root cause.'
    }
  }
}
