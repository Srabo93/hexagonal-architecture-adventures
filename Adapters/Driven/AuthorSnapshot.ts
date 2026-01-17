import type { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";

export interface AuthorSnapshot {
  version: number;
  authorId: string;
  name: string;
  publishedBooks: Array<{
    isbn: string;
    title: string;
    published: PublishStatus;
  }>;
}
