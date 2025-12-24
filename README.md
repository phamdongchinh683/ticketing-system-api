# Backend QR-Based Table Ordering System

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

#### Option A: Using Docker Compose (Recommended)

```bash
# Start database and app together
docker compose up -d

# Or start only the database
docker compose up -d db
```

#### Option B: Standalone Database

```bash
docker compose -f docker-compose.dev.yml up -d
```
# Env 
DATABASE_URL=postgresql://dev:dev@localhost:5433/app_dev

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
# Build and run with Docker Compose
docker compose up --build

# Or build and run separately
docker build -t backend-fastify-app .
docker run -p 3000:3000 \
  -e APP_ENV=local \
  -e DB_URL=postgres://app_user:app_password@localhost:5432/app_db \
  backend-fastify-app
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

### Docker Compose

The project includes a `docker-compose.yml` file that sets up:

- **PostgreSQL Database** (`db` service)
  - Image: `postgres:16-alpine`
  - Database: `app_db`
  - User: `app_user`
  - Password: `app_password`
  - Port: `5432`
  - Persistent volume: `db_data`

- **Fastify Application** (`app` service)
  - Built from `Dockerfile`
  - Automatically runs migrations on startup
  - Port: `3000`
  - Depends on `db` service

#### Docker Compose Commands

```bash
# Start all services
yarn docker:up
# or
docker compose up -d

# Stop all services
yarn docker:down
# or
docker compose down

# View logs
yarn docker:logs
# or
docker compose logs -f

# Restart services
yarn docker:restart
# or
docker compose restart

# Rebuild and start
docker compose up --build
```

### Dockerfile

The project includes a multi-stage `Dockerfile`:

- **Builder stage**: Installs dependencies and builds TypeScript
- **Runner stage**: Minimal runtime image with compiled code

The Dockerfile:
- Uses Node.js 22 Alpine for smaller image size
- Enables Corepack for Yarn 4 support
- Includes migration files and Kysely config
- Runs migrations automatically before starting the app

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

# Or using Docker
docker compose exec app yarn migrate
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
| `yarn docker:up` | Start Docker Compose services |
| `yarn docker:down` | Stop Docker Compose services |
| `yarn docker:logs` | View Docker Compose logs |
| `yarn docker:restart` | Restart Docker Compose services |

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
│       └── docker.yml    # CI/CD pipeline for Docker Hub
├── Dockerfile            # Production Docker image
├── docker-compose.yml    # Docker Compose configuration
├── docker-compose.dev.yml # Development Docker Compose
├── kysely.config.ts      # Kysely migration configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚢 CI/CD

The project includes GitHub Actions workflow (`.github/workflows/docker.yml`) that:

- Builds Docker image on push to `dev` branch
- Pushes image to Docker Hub
- Tags images with `latest` and commit SHA

### Setup CI/CD

1. **Create Docker Hub Repository**
   - Create a repository on Docker Hub (e.g., `your-username/backend-fastify-setting`)

2. **Add GitHub Secrets**
   - Go to repository Settings → Secrets and variables → Actions
   - Add `DOCKERHUB_USERNAME`: Your Docker Hub username
   - Add `DOCKERHUB_TOKEN`: Docker Hub access token

3. **Push to `dev` Branch**
   - The workflow will automatically build and push the image

## 🐛 Troubleshooting

### Database Connection Issues

**Error: `role "app_user" does not exist`**

- Ensure the database container is running: `docker ps`
- Verify you're connecting to the correct database instance
- Reset the database volume:
  ```bash
  docker compose down -v
  docker compose up -d db
  ```

**Error: `getaddrinfo ENOTFOUND app-db`**

- This occurs when the app container can't resolve the database hostname
- Ensure both containers are on the same Docker network
- Use `localhost` instead of `app-db` if running app outside Docker

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
