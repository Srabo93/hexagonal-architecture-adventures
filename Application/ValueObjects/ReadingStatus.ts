export const ReadingStatus = {
  wantToRead: "WantToRead",
  reading: "Reading",
  read: "Read",
} as const;

export type ReadingStatus = (typeof ReadingStatus)[keyof typeof ReadingStatus];
