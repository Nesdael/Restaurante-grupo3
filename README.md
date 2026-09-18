# Restaurant API

REST API for a restaurant management platform: tables, menu and reservations.

Built for the advanced Node.js + NestJS track at RIWI. Backlog: HU-001 to HU-010.

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 LTS |
| Language | TypeScript (ESM) |
| Framework | NestJS |
| Package manager | npm |
| Database | PostgreSQL 16 |
| ORM | TypeORM + migrations |
| Configuration | `@nestjs/config` + Zod |
| Validation | `class-validator` + `class-transformer` |
| Documentation | Swagger / OpenAPI |
| Testing | Vitest |
| Quality | oxlint + Prettier |
| Security | Helmet + CORS |
| Infrastructure | Docker + Docker Compose |

## Architecture

Every functional domain lives in its own module under `src/modules/`. Controllers
receive the request and delegate; business logic lives in services; database access
goes exclusively through TypeORM repositories.

```
HTTP Request -> Controller -> Service -> Repository -> PostgreSQL
```

```
src/
├── config/          environment, database and swagger configuration
├── modules/         one folder per functional domain
├── app.module.ts
├── data-source.ts   connection used by the TypeORM CLI
└── main.ts
```

## Requirements

- Node.js 22 or higher
- npm
- Docker and Docker Compose
- Git

## Getting started

```bash
# 1. Clone and enter the project
git clone https://github.com/Nesdael/Restaurante-grupo3.git
cd Restaurante-grupo3

# 2. Create your environment file
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start PostgreSQL
docker compose up -d postgres

# 5. Run the migrations
npm run migration:run

# 6. Start the API in watch mode
npm run start:dev
```

Check that everything is up:

```bash
curl http://localhost:3000/api/v1/health
```

Expected response:

```json
{ "status": "ok", "service": "restaurant-api" }
```

Interactive documentation: http://localhost:3000/api/docs

### Running everything in Docker

```bash
docker compose up -d --build
```

This starts PostgreSQL and the API together. Inside the Docker network the database
host is `postgres`, not `localhost` — Docker Compose already sets that for you.

## Environment variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `APP_PORT` | yes | Port the API listens on | `3000` |
| `APP_NODE` | yes | `development`, `test` or `production` | `development` |
| `CORS_ORIGIN` | yes | Allowed origins, comma separated | `http://localhost:5173` |
| `DB_HOST` | yes | PostgreSQL host | `localhost` |
| `DB_PORT` | yes | PostgreSQL port | `5432` |
| `DB_USER` | yes | Database user | `postgres` |
| `DB_PASSWORD` | yes | Database password | `postgres` |
| `DB_NAME` | yes | Database name | `restaurant` |
| `OBSERVE_APP_KEY` | no | NestJS Observe key | |
| `OBSERVE_APP_SECRET` | no | NestJS Observe secret | |
| `OBSERVE_SERVICE_ID` | no | NestJS Observe service id | |

The application validates these on startup and refuses to boot if a required one is
missing or malformed. `.env` is never committed; every new variable must be added to
this table and to `.env.example`.

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Development server with hot reload |
| `npm run build` | Compile the project |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End to end tests |
| `npm run test:cov` | Tests with coverage report |
| `npm run lint` | Static analysis |
| `npm run format` | Format with Prettier |
| `npm run migration:generate -- src/database/migrations/<Name>` | Create a migration from entity changes |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Roll back the last migration |

## Database

The schema is defined by the entities in `src/modules/**/entities/`. `synchronize` is
disabled: every structural change must be represented by a versioned migration.

```bash
npm run migration:generate -- src/database/migrations/AddTablesTable
npm run migration:run
```

Manual changes to the database structure that are not captured in a migration are not
allowed.

## API

All resources are served under the `/api/v1` prefix.

| Resource | Base | User story |
|---|---|---|
| Health check | `GET /api/v1/health` | HU-001 |
| Tables | `/api/v1/tables` | HU-002 |
| Categories | `/api/v1/categories` | HU-003 |
| Products | `/api/v1/products` | HU-004 |
| Public menu | `/api/v1/menu` | HU-005 |
| Reservations | `/api/v1/reservations` | HU-006 to HU-010 |

Only the health check is implemented so far.

## Contributing

Branch names, commit messages and pull requests follow the conventions in
[CONTRIBUTING.md](./CONTRIBUTING.md). Nobody pushes directly to `main` or `develop`.








### Category — HU-003

Management of the restaurant physical tables.

| Method | Path               | Description |
|--------|--------------------|-------------|
| POST   | /api/v1/categories | Register category in table |
| GET    | /api/v1/categories | List, filtering by status |
| GET    | /api/v1/categories/{id}  | Get one table by id|
| PATCH  | /api/v1/categories/{id}       | Update a table by id|
| PATCH  | /api/v1/categories/{id}/status | Change the status |

Statuses: `Active`, `Inactive`.
A new table starts as `Active` and its name is unique.



## Team

| Member | Module |
|---|---|
| Nestor Duran | Scrum Master · `reservations/` |
| ca | `tables/` |
| ce | `categories/` |
| ja | `products/` |
| ke | `customers/` |
