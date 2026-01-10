import type { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import type { StockAvailabilityStatus } from "#Application/ValueObjects/StockAvailabilityStatus.ts";

export interface BookDTO {
  isbn: string;
  author: { name: string; authorId: string };
  title: string;
  stock: { amount: number; availability: StockAvailabilityStatus };
  published: PublishStatus;
}
