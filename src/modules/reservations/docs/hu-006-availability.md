# HU-006 · Table Availability Query

**Issue:** #6

Builds on the reservations base (#23). Adds the first endpoint of the module:
find the tables a customer can book for a date-time and party size.

## User Story

As a restaurant customer I want to check table availability for a date, time
and party size, so I know whether I can make a reservation.

## What was built

### DTO — `dto/check-availability.dto.ts`

- `startsAt` — ISO date-time. `endsAt` is `startsAt + RESERVATION_DURATION_MINUTES`.
- `guests` — integer greater than zero (**RN-036**).

### Service — `reservations.service.ts`

- `findFreeTables(startsAt, endsAt, guests, excludeReservationId?)` — the shared
  helper HU-007 and HU-009 reuse. It returns the tables that:
  - are `AVAILABLE` (**RN-038**, **RN-041**: `OCCUPIED` and `OUT_OF_SERVICE` are excluded),
  - have `capacity >= guests` (**RN-039**),
  - have no reservation in `BLOCKING_STATUSES` overlapping the window (**RN-040**).
    Overlap: `existing.startsAt < new.endsAt AND existing.endsAt > new.startsAt`.
  - `excludeReservationId` lets HU-009 update a reservation without it clashing
    with itself.
- `checkAvailability(query)` — handler for the endpoint. Rejects a past
  date-time (**RN-037**), computes the window and returns the free tables with a
  clear message when none are available.

### Controller — `reservations.controller.ts`

- `GET /reservations/availability` — declared before `GET /reservations/:id`
  (HU-008) so Nest does not read "availability" as an id.

## Response

```json
{
  "startsAt": "2026-10-01T19:00:00.000Z",
  "endsAt": "2026-10-01T21:00:00.000Z",
  "guests": 4,
  "available": true,
  "count": 2,
  "tables": [ /* AVAILABLE tables that fit */ ],
  "message": "2 table(s) available"
}
```

When nothing fits: `available: false`, `count: 0`,
`message: "No tables available for the selected time and party size"`.

## Verification

- Lint, build and unit tests pass (5 new tests for HU-006).
- Tests cover: capacity/status filtering, conflict exclusion, past-date
  rejection, empty and non-empty results.
