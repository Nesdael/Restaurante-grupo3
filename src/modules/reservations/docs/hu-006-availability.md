# HU-006 · Table Availability Query

**Issue:** #6

Builds on the reservations base (#23). Adds the first endpoint of the module:
find the tables a customer can book for a date-time and party size.

## User Story

As a restaurant customer I want to check table availability for a date, time
and party size, so I know whether I can make a reservation.

## What was built

### DTO — `dto/check-availability.dto.ts`

- `date` — `YYYY-MM-DD`, a real calendar date (`2026-02-30` is rejected).
- `time` — `HH:mm`, 24-hour (`25:00` is rejected).
- `guests` — integer greater than zero (**RN-036**).

`date` and `time` are always Colombia time (UTC-5).

### Service — `reservations.service.ts`

- `toStartsAt(date, time)` — exported shared function (HU-007 and HU-009 reuse
  it). Turns `date` + `time` in Colombia time into `startsAt`, using
  `RESTAURANT_UTC_OFFSET = '-05:00'`. Example: `2026-10-01` `19:00` →
  `2026-10-02T00:00:00.000Z`. `endsAt` is `startsAt + RESERVATION_DURATION_MINUTES`.
- `findFreeTables(startsAt, endsAt, guests, excludeReservationId?)` — the shared
  helper HU-007 and HU-009 reuse. It returns the tables that:
  - are `AVAILABLE` (**RN-038**, **RN-041**: `OCCUPIED` and `OUT_OF_SERVICE` are excluded),
  - have `capacity >= guests` (**RN-039**),
  - have no reservation in `BLOCKING_STATUSES` overlapping the window (**RN-040**).
    Overlap: `existing.startsAt < new.endsAt AND existing.endsAt > new.startsAt`.
  - `excludeReservationId` lets HU-009 update a reservation without it clashing
    with itself.
  - Sorted by `capacity ASC, number ASC`: the first table is the smallest one
    that fits, which is the one HU-007 assigns.
- `checkAvailability(query)` — handler for the endpoint. Rejects a past
  date-time (**RN-037**), computes the window and returns the free tables with a
  clear message when none are available.

### Controller — `reservations.controller.ts`

- `GET /reservations/availability` — declared before `GET /reservations/:id`
  (HU-008) so Nest does not read "availability" as an id.

## Query

```http
GET /api/v1/reservations/availability?date=2026-10-01&time=19:00&guests=4
```

## Response

```json
{
  "date": "2026-10-01",
  "time": "19:00",
  "startsAt": "2026-10-02T00:00:00.000Z",
  "endsAt": "2026-10-02T02:00:00.000Z",
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

- Lint, build and unit tests pass (6 tests for HU-006).
- Tests cover: Colombia time conversion (`toStartsAt`), capacity/status
  filtering, conflict exclusion, past-date rejection, empty and non-empty results.
