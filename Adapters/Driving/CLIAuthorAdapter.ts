import { inject, injectable } from "tsyringe";

import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import type { AuthorUseCases } from "#Application/Driving/AuthorUseCases.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

@injectable()
export class CLIAuthorAdapter implements AuthorUseCases {
  constructor(@inject("AuthorRepository") private readonly authorRepo: AuthorRepository) {}

  async publishBook(authorId: string, isbn: string): Promise<void> {
    const author = await this.authorRepo.findById(UserId.parse(authorId));
    if (!author) throw new Error("Author not found");

    author.publishBook(ISBN.parse(isbn));

    const result = await this.authorRepo.save(author);

    if (result instanceof Error) {
      throw result;
    }
  }

  async unpublishBook(authorId: string, isbn: string): Promise<void> {
    const author = await this.authorRepo.findById(UserId.parse(authorId));
    if (!author) throw new Error("Author not found");

    author.unpublishBook(ISBN.parse(isbn));

    const result = await this.authorRepo.save(author);

    if (result instanceof Error) {
      throw result;
    }
  }
}
