import { describe, expect, it } from "bun:test";

import { Comment } from "./Comment.ts";

describe("Comment Value Object", () => {
  it("should create a valid comment", () => {
    const comment = Comment.parse("This is a great book!");
    expect(comment.comment).toBe("This is a great book!");
  });

  it("should create a comment with minimum length", () => {
    const comment = Comment.parse("Good");
    expect(comment.comment).toBe("Good");
  });

  it("should create a comment with maximum length", () => {
    const longComment = "a".repeat(1000);
    const comment = Comment.parse(longComment);
    expect(comment.comment).toBe(longComment);
  });
});

