export interface AuthorUseCases {
  publishBook(authorId: string, isbn: string): Promise<void>;
  unpublishBook(authorId: string, isbn: string): Promise<void>;
}
