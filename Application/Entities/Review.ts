import type { Comment } from "#Application/ValueObjects/Comment.ts";
import type { Rating } from "#Application/ValueObjects/Rating.ts";
import type { ReviewId } from "#Application/ValueObjects/ReviewId.ts";

export class Review {
  constructor(
    private readonly _reviewId: ReviewId,
    private readonly _rating: Rating,
    private readonly _comment: Comment,
  ) {}

  public get reviewId(): ReviewId {
    return this._reviewId;
  }

  public get rating(): Rating {
    return this._rating;
  }

  public get comment(): Comment {
    return this._comment;
  }
}
