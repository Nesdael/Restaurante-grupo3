# Reservations module · Base (Sprint 2)
 
**Author:** Nestor Duran
**Issue:** #23
 
Summary of the base of the reservations module. It adds the structure every
Sprint 2 story builds on (HU-006 to HU-013). There are no endpoints yet: each
story adds its own.
 
## Goal
 
Create the reservations module before anyone starts their story, so there is
**one** `Reservation` entity and **one** migration for the whole sprint. In
Sprint 1 two modules defined their own `Product` entity for the same table and
it broke the menu; this avoids that.
 
## What was built
 
### Module (`src/modules/reservations`)
- `reservations.module.ts` — registers the `Reservation` and `Table` entities
  with TypeORM and wires the controller and service.
- Registered in `src/app.module.ts`.
### Entity — `entities/reservation.entity.ts`
`reservations` table with:
- `id` — UUID primary key.
- `customerName` — varchar(100).
- `phone` — varchar(20).
- `email` — varchar(150).
- `guests` — integer.
- `startsAt`, `endsAt` — `timestamptz`. `endsAt` is `startsAt` plus the
  reservation length.
- `status` — enum, defaults to `PENDING` (**RN-046**: every new reservation starts
  as `PENDING`).
- `tableId` — UUID, foreign key to `tables.id` with `ON DELETE RESTRICT` (a table
  with reservations can't be deleted).
- `confirmedAt` — nullable, set by HU-011 (**RN-069**).
- `checkedInAt` — nullable, set by HU-012 (**RN-074**).
- `cancelledAt` — nullable, set by HU-010 (**RN-064**).
- `noShowAt` — nullable, set by HU-013 (**RN-081**).
- `createdAt` — set automatically.
All the columns the sprint needs are created now, so no story has to add a
migration of its own.
 
### Status enum — `enums/reservation-status.enum.ts`
`ReservationStatus`: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CANCELLED`,
`NO_SHOW`, `COMPLETED`.
 
### Migration — `src/database/migrations/1790190134741-AddReservationsTable.ts`
Creates the `reservations_status_enum` type, the `reservations` table and the
foreign key to `tables`. `down()` drops them in reverse order.
 
### Service — `reservations.service.ts`
Empty for now; it only receives the `Reservation` and `Table` repositories. It
defines two shared constants:
 
- `RESERVATION_DURATION_MINUTES = 120` — how long a reservation keeps its table busy.
- `BLOCKING_STATUSES` — `PENDING`, `CONFIRMED` and `CHECKED_IN`. `CANCELLED` and
  `NO_SHOW` free the table (**RN-063**, **RN-079**).
### Controller — `reservations.controller.ts`
Empty, tagged `Reservations` in Swagger.
 
### Tests
`reservations.service.spec.ts` and `reservations.controller.spec.ts` only check
that both are defined. Each story adds the tests for its own methods.
 
## Agreements for the Sprint 2 stories
 
### Method names
 
| Story | Method(s) in `ReservationsService` |
|---|---|
| HU-006 | `findFreeTables(startsAt, endsAt, guests, excludeReservationId?)`, `checkAvailability(query)` |
| HU-007 | `create(dto)` — uses `findFreeTables()` |
| HU-008 | `findAll()`, `findOne(id)` — `findOne()` is reused by HU-009 to HU-013 |
| HU-009 | `update(id, dto)` — uses `findFreeTables(..., id)` so it doesn't clash with itself |
| HU-010 | `cancel(id)` |
| HU-011 | `confirm(id)` |
| HU-012 | `checkIn(id)` |
| HU-013 | `markNoShow(id)` |
 
### Route order
 
| Method | Path | Story |
|---|---|---|
| GET | /reservations/availability | HU-006 |
| POST | /reservations | HU-007 |
| GET | /reservations | HU-008 |
| GET | /reservations/:id | HU-008 |
| PATCH | /reservations/:id | HU-009 |
| PATCH | /reservations/:id/cancel | HU-010 |
| PATCH | /reservations/:id/confirm | HU-011 |
| PATCH | /reservations/:id/check-in | HU-012 |
| PATCH | /reservations/:id/no-show | HU-013 |
 
`GET /reservations/availability` must be declared **before**
`GET /reservations/:id`. Otherwise Nest takes "availability" as an id and
`ParseUUIDPipe` answers `400`.
 
### Schedule conflicts
 
Two reservations of the same table overlap when:
 
```
existing.startsAt < new.endsAt  AND  existing.endsAt > new.startsAt
```
 
Only reservations in `BLOCKING_STATUSES` count (**RN-040**, **RN-045**).
 
### Rules for the team
 
- Nobody creates another entity for reservations, and nobody changes this one
  without talking to the team first.
- Each story adds its own DTOs in `dto/`, its methods, its endpoints and its tests.
- Before opening a pull request: merge `develop` into the branch, and check that
  the CI is green.
## Pending decisions (Tech Lead)
 
- Reservation length: 2 hours (`RESERVATION_DURATION_MINUTES`).
- Dates and times interpreted in Colombia time (UTC-5).
- RN-038 says only `AVAILABLE` tables count. `OCCUPIED` is the current state of a
  table, so it should probably not block a reservation for another day.
## Verification
 
- Lint, format check, build and 49 unit tests pass.
- The 5 migrations run on an empty database, and `migration:generate --check`
  finds no difference between the entities and the schema.
- `migration:revert` drops the `reservations` table cleanly.
- The API applies the 5 migrations on startup and Swagger shows the
  **Reservations** section.
 