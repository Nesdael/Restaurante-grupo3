# HU-002 · Table Management

Summary of the work done for the Table management user story.

## Goal

Provide a CRUD-style REST API to manage restaurant tables: register them, list
and filter them, view a single table, update its data, and change its status.

## What was built

### Module (`src/modules/tables`)
- `tables.module.ts` — registers the `Table` entity with TypeORM and wires the
  controller and service. Exports `TablesService` so other modules can reuse it.

### Entity — `entities/table.entity.ts`
`tables` table with:
- `id` — UUID primary key.
- `number` — unique integer (**RN-016**: table number must be unique).
- `capacity` — integer.
- `zone` — varchar(50).
- `status` — enum, defaults to `AVAILABLE` (**RN-018**: new tables start available).

### Status enum — `enums/table-status.enum.ts`
`TableStatus`: `AVAILABLE`, `OCCUPIED`, `OUT_OF_SERVICE` (**RN-020**: only these
statuses are allowed).

### DTOs (`dto/`)
- `create-table.dto.ts` — `number`, `capacity`, `zone`, all validated
  (`capacity` must be positive → **RN-017**).
- `update-table.dto.ts` — `PartialType(CreateTableDto)`, so every field is optional on update.
- `update-table-status.dto.ts` — `status`, validated against the enum.
- `filter-tables.dto.ts` — optional `status`, `zone`, `capacity` query params for listing.

### Service — `tables.service.ts`
- `create` — checks the number is free, then saves.
- `findAll` — filters by only the query params actually sent (TypeORM rejects
  `undefined` in `where`).
- `findOne` — returns the table or throws `404`.
- `update` — re-checks number uniqueness only when the number changes, then merges and saves.
- `updateStatus` — loads the table and sets its status.
- `ensureNumberIsFree` — private guard enforcing **RN-016** (throws `409` on duplicate).

### Controller — `tables.controller.ts`
REST endpoints under `/tables`, documented with Swagger (`@ApiTags`,
`@ApiOperation`, `@ApiResponse`):

| Method | Route          | Action                         |
|--------|----------------|--------------------------------|
| POST   | `/tables`      | Register a table               |
| GET    | `/tables`      | List / filter tables           |
| GET    | `/tables/:id`  | Get one table (id is a UUID)   |
| PATCH  | `/tables/:id`  | Update a table                 |
| PATCH  | `/tables/:id/status` | Change table status      |

`:id` params are validated with `ParseUUIDPipe`.

### Migrations (`src/database/migrations`)
- `AddTablesTable` — creates the `tables` table.
- `AlterTablesZoneLength` — adjusts the `zone` column length.

### Tests
- `tables.service.spec.ts` — 4 unit tests.
- `tables.controller.spec.ts` — 6 unit tests.

## Business rules covered
- **RN-016** — unique table number.
- **RN-017** — capacity greater than zero.
- **RN-018** — new tables default to `AVAILABLE`.
- **RN-020** — only system-defined statuses accepted.

## Author 
Camilo Andres Meza Vasquez 