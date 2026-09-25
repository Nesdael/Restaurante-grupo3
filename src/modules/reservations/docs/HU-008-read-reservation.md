# HU-008 · Read Reservation

**Issue:** #8
**Author:** Jaime David Villanova Lamar

Builds on the reservations base (#23) and on HU-006 (`findFreeTables`,
`checkAvailability`). Adds the read endpoints of the module: list every
reservation and get a single one by id.

## User Story

As a restaurant customer I want to check my reservation details and status,
so that I can verify the booking before going to the restaurant. Authorised
staff can also list every reservation.

## What was built

### Service — `reservations.service.ts`

- `findAll()` — returns every reservation ordered by `startsAt` descending,
  including the assigned table (**RN-050**). No status filter is applied, so
  cancelled and completed reservations remain queryable as history (**RN-051**).
- `findOne(id)` — returns a single reservation with its table, or throws
  `404 Not Found` if it does not exist (**RN-048**). Reused as-is by HU-009
  through HU-013.

### Controller — `reservations.controller.ts`

- `GET /reservations` — list every reservation.
- `GET /reservations/:id` — get one reservation. Declared **after**
  `GET /reservations/availability` (HU-006), so Nest does not read
  "availability" as a UUID.

## Endpoints

```http
GET /api/v1/reservations
GET /api/v1/reservations/{id}
```

## Business Rules

- **RN-048** — only existing reservations can be queried; a non-existing id
  returns `404 Not Found`.
- **RN-049** — a reservation always shows its current `status` field.
- **RN-050** — the assigned table is included via the `table` relation.
- **RN-051** — `CANCELLED` and `COMPLETED` reservations are not filtered out;
  they remain queryable as history.

## Verification

- Lint, format check, build and unit tests pass.
- `reservations.service.spec.ts`: 3 new tests (list includes table, returns
  one reservation, throws on missing id) on top of the 6 existing HU-006 tests.
- `reservations.controller.spec.ts`: 2 new tests (list, get one) on top of
  the existing "is defined" test.