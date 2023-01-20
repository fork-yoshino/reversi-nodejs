export class GameRecord {
  constructor(
    private readonly _id: number,
    private readonly _startedAt: Date,
  ) {}

  get id(): number {
    return this._id;
  }

  get startedAt(): Date {
    return this._startedAt;
  }
}
