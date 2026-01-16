import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const trackedBookStatusEnum = pgEnum("book_status", ["WantToRead", "Read", "Reading"]);
export const bookPublishStatus = pgEnum("publish_status", ["Published", "Unpublished"]);

export const users = pgTable("users", {
  version: integer("version").notNull(),
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const userRelations = relations(users, ({ many }) => ({
  trackedBooks: many(trackedBooks),
  reviews: many(reviews),
}));

export const trackedBooks = pgTable("tracked_books", {
  isbn: uuid("isbn").primaryKey(),
  status: trackedBookStatusEnum("status").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const trackedBooksRelation = relations(trackedBooks, ({ one }) => ({
  user: one(users, {
    fields: [trackedBooks.userId],
    references: [users.id],
  }),
  reviews: one(reviews, {
    fields: [trackedBooks.isbn],
    references: [reviews.trackedBookIsbn],
  }),
}));

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey(),
  rating: integer("rating"),
  comment: text("comment"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackedBookIsbn: uuid("isbn")
    .notNull()
    .references(() => trackedBooks.isbn, { onDelete: "cascade" }),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  trackedBook: one(trackedBooks, {
    fields: [reviews.trackedBookIsbn],
    references: [trackedBooks.isbn],
  }),
}));

export const authors = pgTable("authors", {
  version: integer("version").notNull(),
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const books = pgTable("books", {
  isbn: uuid("isbn").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  published: bookPublishStatus("published").notNull(),
  authorId: uuid("author_id").references(() => authors.id, { onDelete: "cascade" }),
});

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
}));
