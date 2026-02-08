export const StockAvailabilityStatus = {
  green: "Green",
  yellow: "Yellow",
  red: "Red",
} as const;

export type StockAvailabilityStatus =
  (typeof StockAvailabilityStatus)[keyof typeof StockAvailabilityStatus];

export function parseReadingStatus(value: string): StockAvailabilityStatus {
  const statuses = Object.values(StockAvailabilityStatus) as StockAvailabilityStatus[];
  if (statuses.includes(value as StockAvailabilityStatus)) {
    return value as StockAvailabilityStatus;
  }
  throw new Error(`Invalid stock status: "${value}". Allowed values: ${statuses.join(", ")}`);
}

export function setStatus(amount: number) {
  if (amount >= 100) {
    return StockAvailabilityStatus.green;
  }
  if (amount <= 50) {
    return StockAvailabilityStatus.yellow;
  }
  return StockAvailabilityStatus.red;
}
