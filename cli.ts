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
    const trackedBooks = cliUserAdapter.trackBook(
      opts.user,
      opts.isbn,
      opts.status,
    );
    console.log(trackedBooks);
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
      console.log(`- ${trackedBook.isbn.isbn}: ${trackedBook.status}`);
    });
  });

// program
//   .command("write-review")
//   .requiredOption("--user <userId>")
//   .requiredOption("--isbn <isbn>")
//   .requiredOption("--rating <rating>")
//   .requiredOption("--comment <comment>")
//   .action(async (opts) => {
//     const review = new Review(
//       ReviewId.generate(),
//       Rating.parse(Number(opts.rating)),
//       Comment.parse(opts.comment),
//     );
//     await this.writeReview(
//       UserId.parse(opts.user),
//       ISBN.parse(opts.isbn),
//       review,
//     );
//   });

program.parse(process.argv);
