# Contributing Guide

Everything written in this repository is in **English**: branch names, commit messages, pull request titles and descriptions, code, and documentation.

---

## 1. Branches

| Branch | Purpose |
|---|---|
| `main` | Stable, releasable version. Only receives merges from `develop`. |
| `develop` | Integration branch. All pull requests target this branch. |
| `feat/HU-XXX-<short-description>` | New feature. |
| `fix/HU-XXX-<short-description>` | Bug fix. |
| `chore/<short-description>` | Configuration, dependencies or maintenance. Include `HU-XXX` when it belongs to a user story. |

Rules:

- Lowercase, words separated by hyphens.
- Always include the user story code (`HU-001` … `HU-010`) in working branches.
- Every branch starts from `develop` and goes back to `develop` through a pull request.
- Nobody pushes directly to `main` or `develop`.

Examples:

```
feat/HU-002-table-management
feat/HU-005-menu-query
fix/HU-004-product-price-validation
chore/HU-001-project-setup
chore/setup-github-templates
```

---

## 2. Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <description>
```

- `type` — what kind of change it is.
- `scope` — the module you touched (see table below).
- `description` — lowercase, imperative mood, no trailing period. 72 characters max.

### Types

| Type | When to use it |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation (README, Swagger, this guide) |
| `style` | Formatting, indentation, imports (no logic changes) |
| `refactor` | Code restructuring without behavior changes |
| `test` | Adding or updating tests |
| `chore` | Configuration, dependencies, Docker, scripts |

### Scopes

Scopes come from the project modules. Always use the same name:

| Scope | Covers |
|---|---|
| `config` | `@nestjs/config`, environment variables, `main.ts` |
| `prisma` | `schema.prisma`, migrations, `PrismaService` |
| `docker` | `Dockerfile`, `docker-compose.yml` |
| `health` | Health check |
| `tables` | Tables (HU-002) |
| `categories` | Menu categories (HU-003) |
| `products` | Menu products (HU-004) |
| `menu` | Public menu (HU-005) |
| `reservations` | Reservations (HU-006 … HU-010) |
| `common` | Shared filters, guards, pipes, interceptors |
| `docs` | Repository documentation |

If a change does not belong to any module, the scope can be omitted: `chore: update dependencies`.

### Examples

```
feat(tables): add table registration endpoint
feat(reservations): validate availability before creating a reservation
fix(products): reject prices lower than or equal to zero
refactor(menu): move menu building logic to the service
test(categories): add unit tests for unique name validation
docs(readme): document required environment variables
chore(docker): add postgres service to docker compose
```

### Referencing the user story and the issue

The commit body carries the user story and, when it applies, the issue:

```
feat(tables): add table registration endpoint

Implements HU-002 (RN-016, RN-017, RN-018).
Refs #12
```

> `Closes #<number>` goes in the **pull request** description, not in every commit. That way the issue is closed once, on merge.

### What not to do

```
❌ changes
❌ daily progress
❌ Feat: Added the tables endpoint.
❌ feat(tables): added table registration endpoint   (past tense, not imperative)
✅ feat(tables): add table registration endpoint
```

Keep commits small and single-purpose. If the message needs an "and", it is probably two commits.

---

## 3. Workflow

1. Pick an issue from the board, assign it to yourself and move it to **In Progress**.
2. Update your local `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   ```
3. Create your branch from `develop`:
   ```bash
   git checkout -b feat/HU-002-table-management
   ```
4. Make small commits following the convention above.
5. Before opening the pull request, pull the latest changes from `develop` and resolve conflicts:
   ```bash
   git pull origin develop
   ```
6. Make sure everything passes:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
7. Push your branch and open a pull request against `develop` using the template.
8. A pull request needs at least **1 approval** to be merged.
9. After the merge, delete the branch and move the issue to **Done**.

---

## 4. Pull requests

- The **pull request title** follows the same format as commits:
  ```
  feat(tables): add table management module
  ```
- The description must contain `Closes #<number>` so the issue closes automatically on merge.
- One pull request equals one user story (or one specific fix). Do not mix stories.
- Reviewers leave concrete comments; the author resolves them before merging.
- Nobody approves their own pull request.

---

## 5. Naming conventions

**TypeScript / NestJS**

| Element | Convention | Example |
|---|---|---|
| Variables and functions | `camelCase` | `findAvailableTables`, `currentReservation` |
| Classes | `PascalCase` | `TablesService`, `CreateTableDto` |
| Interfaces and types | `PascalCase` | `ReservationSlot` |
| Enums and enum values | `PascalCase` / `UPPER_SNAKE_CASE` | `TableStatus.OUT_OF_SERVICE` |
| Global constants | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Files | `kebab-case` with the Nest suffix | `tables.controller.ts`, `create-table.dto.ts` |
| Module folders | `kebab-case`, plural | `src/modules/reservations/` |

**Database (PostgreSQL through Prisma)**

| Element | Convention | Example |
|---|---|---|
| Prisma models | `PascalCase`, singular | `Table`, `OrderItem` |
| Tables | `snake_case`, plural | `tables`, `order_items` |
| Columns | `snake_case` | `table_number`, `created_at` |
| Migrations | `snake_case` | `npx prisma migrate dev --name add_tables_table` |

---

## 6. Project technical conventions

These come from business rules RN-003 to RN-013 of HU-001:

- All endpoints live under the `/api/v1` prefix.
- Each functional domain lives in its own module inside `src/modules/`.
- Controllers only receive the request and delegate; business logic lives in services.
- Database access happens exclusively through `PrismaService`.
- The schema is changed by editing `prisma/schema.prisma` and creating a versioned migration, never with manual SQL.
- Incoming data is validated with DTOs and `class-validator`.
- No secret, password or credential is ever written in the source code.

---

## 7. Definition of Done

A user story is done only when:

- [ ] The project builds with no errors.
- [ ] `npm run lint` passes with no errors and the code is formatted with Prettier.
- [ ] Incoming data is validated through DTOs with `class-validator`.
- [ ] Business logic lives in services, not in controllers.
- [ ] Every database change has its versioned Prisma migration.
- [ ] New endpoints are documented in Swagger.
- [ ] New logic has tests and `npm run test` passes.
- [ ] All acceptance criteria of the user story are met.
- [ ] `README.md` and `.env.example` are updated if the change requires it.
- [ ] The pull request was reviewed, approved and merged into `develop`.
- [ ] The issue was moved to **Done** on the board.
