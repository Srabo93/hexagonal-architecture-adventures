export class Comment {
  private constructor(private _comment: string) {}

  public parse(comment: string) {
    if (comment.length === 0) {
      throw new Error("empty comments are not allowed");
    }

    return new Comment(comment);
  }

  public get comment(): string {
    return this._comment;
  }
}
