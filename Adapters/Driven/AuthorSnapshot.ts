import type { PublishStatus } from "../../Application/Aggregates/Shared/ValueObjects/PublishStatus.js";

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
