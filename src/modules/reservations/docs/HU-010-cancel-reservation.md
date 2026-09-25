# HU-010 · Cancel Reservation

**Issue:** #10
**Author:** Jaime David Villanova Lamar

Builds on the reservations base (#23) and reuses `findOne` from HU-008. Adds
the endpoint to cancel a reservation.

## User Story

As a restaurant customer I want to cancel an existing reservation, so that
the table is released when I can no longer attend.

## What was built

### Service — `reservations.service.ts`

- `cancel(id)` — reuses `findOne(id)` (RN-059), rejects an already
  `CANCELLED` reservation (RN-060) and a `CHECKED_IN` or `COMPLETED` one
  (RN-061), then sets `status = CANCELLED` and `cancelledAt = new Date()`
  (RN-064) and saves. The reservation is not deleted, only its status
  changes (RN-062). Since `CANCELLED` is not part of `BLOCKING_STATUSES`,
  `findFreeTables()` stops counting it automatically, freeing the table for
  new reservations (RN-063).

### Controller — `reservations.controller.ts`

- `PATCH /reservations/:id/cancel`.

## Endpoint

```http
PATCH /api/v1/reservations/{id}/cancel
```

## Business Rules

- **RN-059** — only existing reservations can be cancelled.
- **RN-060** — an already `CANCELLED` reservation cannot be cancelled again.
- **RN-061** — reservations in `CHECKED_IN` or `COMPLETED` cannot be cancelled.
- **RN-062** — cancellation keeps the reservation for history purposes.
- **RN-063** — a cancelled reservation stops blocking table availability.
- **RN-064** — the cancellation date and time are recorded.

## Validation and Error Handling

- **Reservation not found:** `404 Not Found` (RN-059, reused from HU-008).
- **Already cancelled / checked-in / completed:** `409 Conflict` (RN-060, RN-061).

## Verification

- Lint, format check, build and unit tests pass.
- `reservations.service.spec.ts`: 4 new tests (cancels successfully, rejects
  double cancellation, rejects CHECKED_IN, rejects COMPLETED) on top of the
  existing HU-006/HU-008 tests.
- `reservations.controller.spec.ts`: 1 new test (cancels a reservation).