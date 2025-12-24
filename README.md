# Backend QR-Based Table Ordering System

A Fastify-based backend API for a QR-based table ordering system, built with TypeScript.

## Features

- 🚀 Fastify web framework
- 📝 TypeScript for type safety
- 📚 Swagger/OpenAPI documentation
- 🔐 JWT authentication
- ✅ Zod schema validation
- 🗄️ Kysely query builder
- 🎨 Prettier & ESLint for code quality

## Prerequisites

- Node.js (v18 or higher)
- Yarn (v4.11.0 or higher)
- Docker & Docker Compose (for database)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend-fastify-setting
```

2. Install dependencies:
```bash
yarn install
```

3. Start the PostgreSQL database using Docker:
```bash
yarn docker:up
```

4. Create a `.env` file in the root directory:
```bash
DB_URL=postgresql://postgres:postgres@localhost:5432/backend_db
PORT=3000
HOST=127.0.0.1
NODE_ENV=development
```

5. Run database migrations:
```bash
yarn migrate
```

## Running the Project

### Development Mode

Run the server in development mode with hot-reload:
```bash
yarn dev
```

The server will start on `http://127.0.0.1:3000` (or the port specified in your `.env` file).

### Production Mode

1. Build the project:
```bash
yarn build
```

2. Start the server:
```bash
yarn start
```

The server will start on `http://0.0.0.0:3000` (or the port specified in your `.env` file).

## API Documentation

Once the server is running, you can access the Swagger UI documentation at:
```
http://localhost:3000/docs
```

## Available Scripts

- `yarn dev` - Start development server with hot-reload
- `yarn build` - Build the project for production
- `yarn start` - Start the production server
- `yarn format` - Format code using Prettier
- `yarn format:check` - Check code formatting without making changes
- `yarn migrate` - Run database migrations
- `yarn migration:create` - Create a new migration
- `yarn docker:up` - Start PostgreSQL database container
- `yarn docker:down` - Stop PostgreSQL database container
- `yarn docker:logs` - View database logs
- `yarn docker:restart` - Restart database container

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port number | `3000` |
| `HOST` | Server host address | `127.0.0.1` (dev) / `0.0.0.0` (prod) |
| `NODE_ENV` | Environment mode | `development` |

## Project Structure

```
src/
├── api/           # API route handlers
│   └── auth/      # Authentication endpoints
├── app/           # Application setup and configuration
├── database/      # Database queries and commands
├── datasource/    # Database connection
├── model/         # Data models and schemas
└── utils/         # Utility functions
```

## Database Setup

This project uses PostgreSQL with Docker for local development.

### Starting the Database

```bash
yarn docker:up
```

This will start a PostgreSQL 16 container with:
- **Database**: `backend_db`
- **User**: `postgres`
- **Password**: `postgres`
- **Port**: `5432`

### Database Migrations

After starting the database, run migrations:
```bash
yarn migrate
```

To create a new migration:
```bash
yarn migration:create migration_name
```


## Code Formatting

This project uses Prettier and ESLint for code formatting and linting. Configuration files:
- `.prettierrc.json` - Prettier configuration
- `.eslintrc.json` - ESLint configuration

Format your code before committing:
```bash
yarn format
```

## License

[Add your license here]
