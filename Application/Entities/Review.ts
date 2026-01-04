import type { Comment } from "#Application/ValueObjects/Comment.ts";
import type { Rating } from "#Application/ValueObjects/Rating.ts";
import type { ReviewId } from "#Application/ValueObjects/ReviewId.ts";

export class Review {
  constructor(
    private _reviewId: ReviewId,
    private _rating: Rating,
    private _comment: Comment,
  ) {}

  public get reviewId(): string {
    return this._reviewId.id;
  }

  public get rating(): number {
    return this._rating.rating;
  }

  public get comment(): string {
    return this._comment.comment;
  }
}
