import type { Comment } from "#Application/ValueObjects/Comment.ts";
import type { Rating } from "#Application/ValueObjects/Rating.ts";
import type { ReviewId } from "#Application/ValueObjects/ReviewId.ts";

/**
 * @class is an Entity
 */
export class Review {
  private constructor(
    private _reviewId: ReviewId,
    private _rating: Rating,
    private _comment: Comment,
  ) {}

  public static create(id: ReviewId, rating: Rating, comment: Comment) {
    return new Review(id, rating, comment);
  }

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
