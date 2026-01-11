import type { Book } from "#Application/Entities/Book.ts";
import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import type { AuthorUseCases } from "#Application/Driving/AuthorUseCases.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";
import { inject, injectable } from "tsyringe";
import type { BookDTO } from "./BookDTO";

@injectable()
export class CLIAuthorAdapter implements AuthorUseCases {
  constructor(
    @inject("AuthorRepository") private readonly authorRepo: AuthorRepository,
  ) {}

  async publishBook(authorId: string, isbn: string): Promise<void> {
    const author = await this.authorRepo.findById(UserId.parse(authorId));
    if (!author) throw new Error("Author not found");

    const book = await this.authorRepo.findBookByISBN(ISBN.parse(isbn));
    if (!book) throw new Error("Book not found");

    try {
      author.publishBook(book);

      // Save both aggregates
      const authorSaveResult = await this.authorRepo.save(author);
      if (authorSaveResult instanceof Error) {
        throw authorSaveResult;
      }

      const bookSaveResult = await this.authorRepo.saveBook(book);
      if (bookSaveResult instanceof Error) {
        throw bookSaveResult;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to publish book");
    }
  }

  async unpublishBook(authorId: string, isbn: string): Promise<void> {
    const author = await this.authorRepo.findById(UserId.parse(authorId));
    if (!author) throw new Error("Author not found");

    const book = await this.authorRepo.findBookByISBN(ISBN.parse(isbn));
    if (!book) throw new Error("Book not found");

    try {
      author.unpublishBook(book);

      // Save both aggregates
      const authorSaveResult = await this.authorRepo.save(author);
      if (authorSaveResult instanceof Error) {
        throw authorSaveResult;
      }

      const bookSaveResult = await this.authorRepo.saveBook(book);
      if (bookSaveResult instanceof Error) {
        throw bookSaveResult;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to unpublish book");
    }
  }

  // Book query methods
  async getBook(isbn: string): Promise<BookDTO | null> {
    const book = await this.authorRepo.findBookByISBN(ISBN.parse(isbn));
    if (!book) return null;
    return this.toDTO(book);
  }

  async searchBooks(query: string): Promise<BookDTO[]> {
    const books = await this.authorRepo.searchBooks(query);
    return books.map((book) => this.toDTO(book));
  }

  async getBooksByAuthor(authorId: string): Promise<BookDTO[]> {
    const books = await this.authorRepo.findBooksByAuthorId(authorId);
    return books.map((book) => this.toDTO(book));
  }

  async listAllBooks(): Promise<BookDTO[]> {
    const books = await this.authorRepo.findAllBooks();
    return books.map((book) => this.toDTO(book));
  }

  private toDTO(book: Book): BookDTO {
    return {
      title: book.title.title,
      isbn: book.isbn.isbn,
      published: book.published,
      author: {
        name: book.author.name.fullName(),
        authorId: book.author.authorId.uuid,
      },
    } satisfies BookDTO;
  }
}
