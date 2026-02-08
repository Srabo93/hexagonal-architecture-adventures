export interface AuthorUseCases {
  createAuthor(authorId: string, name: string): Promise<void>;
  publishBook(authorId: string, isbn: string): Promise<void>;
  unpublishBook(authorId: string, isbn: string): Promise<void>;
}
