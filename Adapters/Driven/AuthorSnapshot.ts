import type { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";

export interface AuthorSnapshot {
  authorId: string;
  name: string;
  publishedBooks: Array<{
    isbn: string;
    title: string;
    published: PublishStatus;
  }>;
}
