import type { Author } from "#Aggregates/Author/Author.js";
import type { UserId } from "#Aggregates/User/ValueObjects/UserId.js";

export interface AuthorRepository {
  findById(id: UserId): Promise<Author | null>;
  save(author: Author): Promise<void>;
}
