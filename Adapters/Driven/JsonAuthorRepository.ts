import { Author } from "#Application/Aggregates/Author.ts";
import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import { Book } from "#Application/Entities/Book.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Title } from "#Application/ValueObjects/Title.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";
import type { AuthorSnapshot } from "./AuthorSnapshot";
import { injectable } from "tsyringe";

interface BookSnapshot {
  isbn: string;
  title: string;
  published: string;
  author: { name: string; authorId: string };
}

@injectable()
export class JsonAuthorRepository implements AuthorRepository {
  constructor(
    private readonly authorFilepath: string,
    private readonly bookFilepath: string,
  ) {}

  toSnapshot(author: Author): AuthorSnapshot {
    return {
      authorId: author.authorId.uuid,
      name: author.name.fullName(),
      publishedBooks: author.publishedBooks.map((isbn) => isbn.isbn),
    };
  }

  private async loadAllAuthors(): Promise<AuthorSnapshot[]> {
    const file = Bun.file(this.authorFilepath);

    if (!(await file.exists())) {
      return [];
    }

    const content = await file.text();
    return JSON.parse(content);
  }

  private async loadAllBooks(): Promise<BookSnapshot[]> {
    const file = Bun.file(this.bookFilepath);

    if (!(await file.exists())) {
      return [];
    }

    const content = await file.text();
    return JSON.parse(content);
  }

  private toBookSnapshot(book: Book): BookSnapshot {
    return {
      isbn: book.isbn.isbn,
      title: book.title.title,
      published: book.published,
      author: {
        name: book.author.name.fullName(),
        authorId: book.author.authorId.uuid,
      },
    };
  }

  private fromBookSnapshot(snapshot: BookSnapshot): Book {
    return Book.rehydrate(
      {
        authorId: UserId.parse(snapshot.author.authorId),
        name: Name.parse(snapshot.author.name),
      },
      snapshot.published as any,
      ISBN.parse(snapshot.isbn),
      Title.parse(snapshot.title),
    );
  }

  async findById(id: UserId): Promise<Author | null> {
    const authors = await this.loadAllAuthors();
    const persistedAuthor = authors.find(
      (author) => author.authorId === id.uuid,
    );

    return persistedAuthor
      ? Author.rehydrate(
          UserId.parse(persistedAuthor.authorId),
          Name.parse(persistedAuthor.name),
          persistedAuthor.publishedBooks.map((isbn) => ISBN.parse(isbn)),
        )
      : null;
  }

  async save(author: Author): Promise<boolean | Error> {
    const authors = await this.loadAllAuthors();
    const snapshot = this.toSnapshot(author) satisfies AuthorSnapshot;

    const index = authors.findIndex(
      (a) => a.authorId === snapshot.authorId,
    );

    if (index >= 0) {
      authors[index] = snapshot;
    } else {
      authors.push(snapshot);
    }

    try {
      const isSuccessfull = await Bun.write(
        this.authorFilepath,
        JSON.stringify(authors, null, 2),
      );

      if (!(typeof isSuccessfull === "number")) {
        throw new Error("Something went wrong to persist the aggregate Author");
      }
    } catch (error) {
      throw error;
    }
    return true;
  }

  // Book methods (books are entities within Author aggregate)
  async findBookByISBN(isbn: ISBN): Promise<Book | null> {
    const books = await this.loadAllBooks();
    const persistedBook = books.find((book) => book.isbn === isbn.isbn);
    return persistedBook ? this.fromBookSnapshot(persistedBook) : null;
  }

  async findAllBooks(): Promise<Book[]> {
    const snapshots = await this.loadAllBooks();
    return snapshots.map((snapshot) => this.fromBookSnapshot(snapshot));
  }

  async searchBooks(query: string): Promise<Book[]> {
    const snapshots = await this.loadAllBooks();
    const lowerQuery = query.toLowerCase();
    const matching = snapshots.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.name.toLowerCase().includes(lowerQuery) ||
        book.isbn.includes(lowerQuery),
    );
    return matching.map((snapshot) => this.fromBookSnapshot(snapshot));
  }

  async findBooksByAuthorId(authorId: string): Promise<Book[]> {
    const snapshots = await this.loadAllBooks();
    const matching = snapshots.filter(
      (book) => book.author.authorId === authorId,
    );
    return matching.map((snapshot) => this.fromBookSnapshot(snapshot));
  }

  async saveBook(book: Book): Promise<boolean | Error> {
    const books = await this.loadAllBooks();
    const snapshot = this.toBookSnapshot(book);

    const index = books.findIndex((b) => b.isbn === snapshot.isbn);

    if (index >= 0) {
      books[index] = snapshot;
    } else {
      books.push(snapshot);
    }

    try {
      const isSuccessfull = await Bun.write(
        this.bookFilepath,
        JSON.stringify(books, null, 2),
      );

      if (!(typeof isSuccessfull === "number")) {
        throw new Error("Something went wrong to persist the book");
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
}
