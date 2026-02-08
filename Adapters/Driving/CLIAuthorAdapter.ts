import { inject, injectable } from "tsyringe";

import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import type { AuthorUseCases } from "#Application/Driving/AuthorUseCases.ts";
import { Author } from "#Application/Aggregates/Author.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

@injectable()
export class CLIAuthorAdapter implements AuthorUseCases {
  constructor(@inject("AuthorRepository") private readonly authorRepo: AuthorRepository) {}

  async createAuthor(authorId: string, name: string): Promise<void> {
    const existingAuthor = await this.authorRepo.findById(UserId.parse(authorId));
    if (existingAuthor) {
      throw new Error("Author already exists");
    }

    const author = Author.create(UserId.parse(authorId), Name.parse(name), new Map());
    
    await this.authorRepo.save(author);
  }

  async publishBook(authorId: string, isbn: string): Promise<void> {
    const author = await this.authorRepo.findById(UserId.parse(authorId));
    if (!author) throw new Error("Author not found");

    author.publishBook(ISBN.parse(isbn));

    await this.authorRepo.save(author);
  }

  async unpublishBook(authorId: string, isbn: string): Promise<void> {
    const author = await this.authorRepo.findById(UserId.parse(authorId));
    if (!author) throw new Error("Author not found");

    author.unpublishBook(ISBN.parse(isbn));

    await this.authorRepo.save(author);
  }
}
