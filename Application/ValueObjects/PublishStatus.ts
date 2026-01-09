export const PublishStatus = {
  published: "Published",
  unpublished: "Unpublished",
} as const;

export type PublishStatus = (typeof PublishStatus)[keyof typeof PublishStatus];

export function parseReadingStatus(value: string): PublishStatus {
  const statuses = Object.values(PublishStatus) as PublishStatus[];
  if (statuses.includes(value as PublishStatus)) {
    return value as PublishStatus;
  }
  throw new Error(
    `Invalid publish status: "${value}". Allowed values: ${statuses.join(", ")}`,
  );
}
