# backend-fastify-setting
A high-performance Fastify-based backend API for a QR-based table ordering system, built with TypeScript, PostgreSQL, and Docker.

## 🚀 Features

- ⚡ **Fastify** - High-performance web framework
- 📝 **TypeScript** - Type-safe development
- 📚 **Swagger/OpenAPI** - Interactive API documentation
- 🔐 **JWT Authentication** - Secure token-based auth
- ✅ **Zod Schema Validation** - Runtime type validation
- 🗄️ **Kysely Query Builder** - Type-safe SQL queries
- 🐳 **Docker Support** - Containerized development and deployment
- 🎨 **Prettier & ESLint** - Code quality and formatting
- 🔄 **Database Migrations** - Version-controlled schema changes
- 🚢 **CI/CD** - Automated Docker builds and deployments

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** (v4.11.0 or higher) - Managed via Corepack
- **Docker & Docker Compose** (for database and containerized deployment)
- **PostgreSQL** (via Docker or local installation)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend-fastify-setting
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_URL=postgres://app_user:app_password@localhost:5432/app_db

# Server Configuration
PORT=3000
HOST=127.0.0.1

# Application Environment
APP_ENV=local
NODE_ENV=development
```

### 4. Start the Database

Start the database using Docker Compose:

```bash
docker compose -f docker-compose.db.yml up -d
```

### 5. Run Database Migrations

```bash
yarn migrate
```

## 🏃 Running the Project

### Development Mode

Run the server with hot-reload:

```bash
yarn dev
```

The server will start on `http://127.0.0.1:3000` (or the port specified in your `.env` file).

### Production Mode

#### Local Production Build

```bash
# Build the project
yarn build

# Start the server
yarn start
```

#### Docker Production

```bash
# Build the Docker image
docker build -t phamdongchinh683/backend-fastify:latest -f Dockerfile.prod .

# Run the container
docker run -p 3000:3000 \
  -e APP_ENV=production \
  -e DB_URL=postgres://app_user:app_password@localhost:5432/app_db \
  phamdongchinh683/backend-fastify:latest

# Or use docker-compose for production
docker compose -f docker-compose.prod.yml up -d
```

## 📖 API Documentation

Once the server is running, access the Swagger UI documentation at:

```
http://localhost:3000/swagger/docs
```

The API documentation includes:
- Interactive endpoint testing
- Request/response schemas
- Authentication requirements
- Example payloads

## 🐳 Docker Setup

### Docker Compose Files

The project includes two Docker Compose files:

- **`docker-compose.db.yml`** - Database service for local development
  - PostgreSQL 15
  - Database: `app_db`
  - User: `app_user`
  - Password: `app_password`
  - Port: `5432`
  - Persistent volume: `pg_data`

- **`docker-compose.prod.yml`** - Production deployment
  - Pulls `phamdongchinh683/backend-fastify:latest` image
  - Uses `.env` file for configuration
  - Port: `3000`

#### Docker Compose Commands

```bash
# Start database for local development
docker compose -f docker-compose.db.yml up -d

# Stop database
docker compose -f docker-compose.db.yml down

# View database logs
docker compose -f docker-compose.db.yml logs -f

# Production deployment
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Dockerfile

The project includes `Dockerfile.prod` for production builds:

- **Builder stage**: Installs dependencies and builds TypeScript
- **Runner stage**: Minimal runtime image with compiled code

The Dockerfile:
- Uses Node.js 22 Alpine for smaller image size
- Enables Corepack for Yarn 4 support
- Includes compiled code from builder stage

## 🗄️ Database Setup

### Database Configuration

The default database setup uses:

- **Database Name**: `app_db`
- **Username**: `app_user`
- **Password**: `app_password`
- **Port**: `5432`

### Migrations

#### Run Migrations

```bash
# Run all pending migrations
yarn migrate
```

#### Create a New Migration

```bash
yarn migration:create migration_name
```

#### Rollback Migration

```bash
yarn migration:down
```

### Database Connection

The application uses Kysely for type-safe database queries. Connection configuration is in `src/datasource/db.ts`.

**Connection String Format:**
```
postgres://[user]:[password]@[host]:[port]/[database]
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server with hot-reload |
| `yarn build` | Build TypeScript to JavaScript |
| `yarn start` | Start production server (runs `build` first) |
| `yarn format` | Format code using Prettier |
| `yarn format:check` | Check code formatting without changes |
| `yarn migrate` | Run database migrations |
| `yarn migration:create` | Create a new migration file |
| `yarn migration:down` | Rollback last migration |

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_URL` | PostgreSQL connection string | - | ✅ Yes |
| `PORT` | Server port number | `3000` | No |
| `HOST` | Server host address | `127.0.0.1` (dev) / `0.0.0.0` (prod) | No |
| `APP_ENV` | Application environment (`local`, `development`, `production`) | `local` | No |
| `NODE_ENV` | Node.js environment | `development` | No |

### Environment-Specific Behavior

- **`APP_ENV=local`**: Disables SSL for database connections
- **`APP_ENV!=local`**: Enables SSL with `rejectUnauthorized: false`

## 📁 Project Structure

```
backend-fastify-setting/
├── src/
│   ├── api/              # API route handlers
│   │   └── auth/         # Authentication endpoints
│   │       └── sign-up/  # Sign-up endpoint
│   ├── app/              # Application setup and configuration
│   │   ├── api.ts        # Fastify server setup
│   │   ├── error-handler.ts
│   │   └── jwt/          # JWT handler
│   ├── business/         # Business logic layer
│   │   └── auth/         # Authentication business logic
│   ├── database/         # Database queries and commands
│   │   └── auth/         # Auth-related database operations
│   ├── datasource/       # Database connection and migrations
│   │   ├── db.ts         # Kysely database instance
│   │   └── migrations/   # Database migration files
│   ├── model/            # Data models and schemas
│   │   ├── body/         # Request body schemas
│   │   └── query/        # Query parameter schemas
│   └── utils/            # Utility functions
│       ├── password.ts   # Password hashing utilities
│       └── token.ts      # JWT token utilities
├── dist/                 # Compiled JavaScript (generated)
├── .github/
│   └── workflows/
│       └── docker.yml    # GitHub Actions CI/CD pipeline
├── Dockerfile.prod       # Production Docker image
├── docker-compose.db.yml # Database Docker Compose configuration
├── docker-compose.prod.yml # Production Docker Compose configuration
├── Jenkinsfile           # Jenkins CI/CD pipeline
├── kysely.config.ts      # Kysely migration configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚢 CI/CD

The project includes CI/CD pipelines for automated Docker builds and deployments:

### GitHub Actions

GitHub Actions workflow (`.github/workflows/docker.yml`) that:
- Builds Docker image on push to `dev` branch
- Pushes image to Docker Hub
- Tags images with `latest` and commit SHA

**Setup:**
1. Create a repository on Docker Hub
2. Add GitHub Secrets: `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`
3. Push to `dev` branch to trigger the workflow

### Jenkins

Jenkins pipeline (`Jenkinsfile`) that:
- Loads production environment variables
- Installs dependencies and builds the project
- Runs database migrations
- Deploys to production using `docker-compose.prod.yml`

**Setup:**
1. Configure Jenkins credentials:
   - `env`: JSON file with environment variables
   - `dockerhub-creds`: Docker Hub username/password (if needed)
2. The pipeline will build and deploy automatically on trigger

## 🐛 Troubleshooting

### Database Connection Issues

**Error: `role "app_user" does not exist`**

- Ensure the database container is running: `docker ps`
- Verify you're connecting to the correct database instance
- Reset the database volume:
  ```bash
  docker compose -f docker-compose.db.yml down -v
  docker compose -f docker-compose.db.yml up -d
  ```

**Error: `getaddrinfo ENOTFOUND`**

- This occurs when the app can't resolve the database hostname
- Ensure the database container is running: `docker ps`
- Verify the database connection string in your `.env` file matches the database service

### Migration Issues

**Error: `No config file found`**

- Ensure `kysely.config.ts` exists in the project root
- Verify the file is copied into the Docker image

**Error: `Cannot find module './src/datasource/db'`**

- Ensure `src/` directory is copied into the Docker image
- Check that `kysely.config.ts` uses correct import paths

### Docker Build Issues

**Error: `/.yarn: not found`**

- The `.yarn` directory may not be committed to git
- The Dockerfile handles this by only copying `.yarnrc.yml`
- Ensure `.yarnrc.yml` exists in the project root

**Error: `docker: not found`**

- Docker is not installed or not in PATH on the Jenkins agent
- Install Docker on the Jenkins agent or use an agent with Docker pre-installed
- Ensure Docker socket is accessible if using Docker-in-Docker

## 🧪 Development

### Code Formatting

This project uses Prettier and ESLint for code quality:

```bash
# Format code
yarn format

# Check formatting
yarn format:check
```

### Type Checking

TypeScript is configured with strict mode. Check types:

```bash
yarn build
```

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contributing guidelines here]

## 📞 Support

[Add support information here]
