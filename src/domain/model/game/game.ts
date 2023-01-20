export class Game {
  constructor(
    private readonly _id: number | undefined,
    private readonly _startedAt: Date,
  ) {}

  get id(): number | undefined {
    return this._id;
  }

  get startedAt(): Date {
    return this._startedAt;
  }
}
