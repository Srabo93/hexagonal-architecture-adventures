import type { Author } from "#Application/Aggregates/Author.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export interface AuthorRepository {
  findById(id: UserId): Promise<Author | null>;
  save(author: Author): Promise<boolean | Error>;
}
