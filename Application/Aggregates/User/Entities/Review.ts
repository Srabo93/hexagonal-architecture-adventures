import type { Comment } from "#Aggregates/User/ValueObjects/Comment.js";
import type { Rating } from "#Aggregates/User/ValueObjects/Rating.js";
import type { ReviewId } from "#Aggregates/User/ValueObjects/ReviewId.js";

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
  public static rehydrate(id: ReviewId, rating: Rating, comment: Comment) {
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
