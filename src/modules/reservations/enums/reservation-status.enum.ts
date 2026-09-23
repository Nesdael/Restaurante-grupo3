// Every status a reservation can go through (HU-007 to HU-013).
export enum ReservationStatus {
  PENDING = 'PENDING', // RN-046: a new reservation starts here
  CONFIRMED = 'CONFIRMED', // HU-011
  CHECKED_IN = 'CHECKED_IN', // HU-012
  CANCELLED = 'CANCELLED', // HU-010
  NO_SHOW = 'NO_SHOW', // HU-013
  COMPLETED = 'COMPLETED',
}
