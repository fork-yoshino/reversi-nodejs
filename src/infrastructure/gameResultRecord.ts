export class GameResultRecord {
  constructor(
    private readonly _id: number,
    private readonly _gameId: number,
    private readonly _winnerDisc: number,
    private readonly _endAt: Date,
  ) {}

  get gameId(): number {
    return this._gameId;
  }

  get winnerDisc(): number {
    return this._winnerDisc;
  }

  get endAt(): Date {
    return this._endAt;
  }
}
