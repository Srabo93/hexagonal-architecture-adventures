import { Command } from "commander";
import { cliUserAdapter, cliAuthorAdapter } from "configurator";
const program = new Command();

program.name("book-tracker").description("Personal Book Tracker CLI");

program
  .command("create-user")
  .requiredOption("--user <userId>")
  .requiredOption("--name <Name>")
  .requiredOption("--email <Email>")
  .action(async (opts) => {
    const user = await cliUserAdapter.createUser(
      opts.user,
      opts.name,
      opts.email,
    );
    console.log(`${user.userId.uuid}`);
    console.log(`${user.name.fullName().toString()}\n`);
    console.log(`${user.email.email}\n`);
  });

program
  .command("track-book")
  .requiredOption("--user <userId>")
  .requiredOption("--isbn <isbn>")
  .requiredOption("--status <status>")
  .action(async (opts) => {
    const tracked = await cliUserAdapter.trackBook(
      opts.user,
      opts.isbn,
      opts.status,
    );
    console.log("Book tracked successfully");
    console.log(`${JSON.stringify(tracked)}`);
  });

program
  .command("get-tracked-books")
  .requiredOption("--user <userId>")
  .action(async (opts) => {
    const trackedBooks = await cliUserAdapter.getTrackedBooks(opts.user);
    if (!trackedBooks) {
      console.log("No tracked books found for this user");
      return;
    }

    console.log(`Tracked books for user ${opts.user}:`);
    trackedBooks.forEach((trackedBook) => {
      console.log(`- ${trackedBook.isbn}: ${trackedBook.status}`);
    });
  });

program
  .command("write-review")
  .requiredOption("--user <userId>")
  .requiredOption("--isbn <isbn>")
  .requiredOption("--rating <rating>")
  .requiredOption("--comment <comment>")
  .action(async (opts) => {
    const review = {
      reviewId: crypto.randomUUID(),
      rating: opts.rating,
      comment: opts.comment,
    };
    const writtenReview = await cliUserAdapter.writeReview(
      opts.user,
      opts.isbn,
      review,
    );
    console.log("Review written successfully");
    console.log(`${JSON.stringify(writtenReview)}`);
  });

program
  .command("get-written-reviews")
  .requiredOption("--user <userId>")
  .action(async (opts) => {
    const reviews = await cliUserAdapter.getReviews(opts.user);
    console.log("Reviews for books:");
    reviews.forEach((review) => {
      console.log(
        `Book ISBN: ${review.isbn} \n Comment: ${review.comment} \n Rating: ${review.rating} \n ReviewID: ${review.reviewId}`,
      );
    });
  });

program
  .command("untrack-book")
  .requiredOption("--user <userId>")
  .requiredOption("--isbn <isbn>")
  .action(async (opts) => {
    await cliUserAdapter.untrackBook(opts.user, opts.isbn);
    console.log("Book untracked successfully");
  });

// Author commands
program
  .command("publish-book")
  .requiredOption("--author <authorId>")
  .requiredOption("--isbn <isbn>")
  .action(async (opts) => {
    await cliAuthorAdapter.publishBook(opts.author, opts.isbn);
    console.log("Book published successfully");
  });

program
  .command("unpublish-book")
  .requiredOption("--author <authorId>")
  .requiredOption("--isbn <isbn>")
  .action(async (opts) => {
    await cliAuthorAdapter.unpublishBook(opts.author, opts.isbn);
    console.log("Book unpublished successfully");
  });

// Book commands (accessed through Author aggregate)
program
  .command("get-book")
  .requiredOption("--isbn <isbn>")
  .action(async (opts) => {
    const book = await cliAuthorAdapter.getBook(opts.isbn);
    if (!book) {
      console.log("Book not found");
      return;
    }
    console.log(`ISBN: ${book.isbn}`);
    console.log(`Title: ${book.title}`);
    console.log(`Author: ${book.author.name}`);
    console.log(`Published: ${book.published}`);
  });

program
  .command("search-books")
  .requiredOption("--query <query>")
  .action(async (opts) => {
    const books = await cliAuthorAdapter.searchBooks(opts.query);
    if (books.length === 0) {
      console.log("No books found");
      return;
    }
    console.log(`Found ${books.length} book(s):`);
    books.forEach((book) => {
      console.log(`- ${book.isbn}: ${book.title} by ${book.author.name}`);
    });
  });

program
  .command("list-books")
  .action(async () => {
    const books = await cliAuthorAdapter.listAllBooks();
    if (books.length === 0) {
      console.log("No books in catalog");
      return;
    }
    console.log(`Total books: ${books.length}`);
    books.forEach((book) => {
      console.log(`- ${book.isbn}: ${book.title} by ${book.author.name} (${book.published})`);
    });
  });

program
  .command("get-books-by-author")
  .requiredOption("--author <authorId>")
  .action(async (opts) => {
    const books = await cliAuthorAdapter.getBooksByAuthor(opts.author);
    if (books.length === 0) {
      console.log("No books found for this author");
      return;
    }
    console.log(`Books by author ${opts.author}:`);
    books.forEach((book) => {
      console.log(`- ${book.isbn}: ${book.title} (${book.published})`);
    });
  });

program.parse(process.argv);
