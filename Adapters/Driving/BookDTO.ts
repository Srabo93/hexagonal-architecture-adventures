import type { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";

export interface BookDTO {
  isbn: string;
  author: { name: string; authorId: string };
  title: string;
  published: PublishStatus;
}
