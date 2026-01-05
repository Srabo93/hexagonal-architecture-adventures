import { Command } from "commander";
import { cliUserAdapter } from "configurator";

const program = new Command();
program.name("book-tracker").description("Personal Book Tracker CLI");

program
  .command("create-user")
  .requiredOption("--user <userId>")
  .requiredOption("--name <Name>")
  .requiredOption("--email <Email>")
  .action(async (opts) => {
    cliUserAdapter.createUser(opts.user, opts.name, opts.email);
  });

program
  .command("track-book")
  .requiredOption("--user <userId>")
  .requiredOption("--isbn <isbn>")
  .requiredOption("--status <status>")
  .action(async (opts) => {
    await cliUserAdapter.trackBook(opts.user, opts.isbn, opts.status);
    console.log("Book tracked successfully");
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
    await cliUserAdapter.writeReview(opts.user, opts.isbn, review);
    console.log("Review written successfully");
  });

program
  .command("get-written-reviews")
  .requiredOption("--user <userId>")
  .action(async (opts) => {
    const reviews = await cliUserAdapter.getReviews(opts.user);
    console.log("Reviews for books:");
    reviews.forEach((review) => {
      console.log(
        `Book ISBN: ${review.isbn} \n Comment: ${review.review.comment.comment} \n Rating: ${review.review.rating.rating} \n ReviewID: ${review.review.reviewId.id}`,
      );
    });
  });

program.parse(process.argv);
