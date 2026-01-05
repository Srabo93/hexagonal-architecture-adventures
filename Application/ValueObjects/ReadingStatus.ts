export const ReadingStatus = {
  wantToRead: "WantToRead",
  reading: "Reading",
  read: "Read",
} as const;

export type ReadingStatus = (typeof ReadingStatus)[keyof typeof ReadingStatus];

export function parseReadingStatus(value: string): ReadingStatus {
  const statuses = Object.values(ReadingStatus) as ReadingStatus[];
  if (statuses.includes(value as ReadingStatus)) {
    return value as ReadingStatus;
  }
  throw new Error(
    `Invalid reading status: "${value}". Allowed values: ${statuses.join(", ")}`,
  );
}
