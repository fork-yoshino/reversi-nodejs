export class TurnRecord {
  constructor(
    private readonly _id: number,
    private readonly _gameId: number,
    private readonly _turnCount: number,
    private readonly _nextDisc: number | undefined,
    private readonly _endAt: Date,
  ) {}

  get id(): number {
    return this._id;
  }

  get nextDisc(): number | undefined {
    return this._nextDisc;
  }

  get endAt(): Date {
    return this._endAt;
  }
}
