import type { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import type { StockAvailabilityStatus } from "#Application/ValueObjects/StockAvailabilityStatus.ts";

export interface BookSnapshot {
  isbn: string;
  title: string;
  published: PublishStatus;
  stock: { amount: number; availability: StockAvailabilityStatus };
  author: { name: string; authorId: string };
}
