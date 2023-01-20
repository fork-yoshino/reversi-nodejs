import { WinnerDisc } from './winnerDisc';

export class GameResult {
  constructor(
    private readonly _gameId: number,
    private readonly _winnerDisc: WinnerDisc,
    private readonly _endAt: Date,
  ) {}

  get gameId(): number {
    return this._gameId;
  }

  get winnerDisc(): WinnerDisc {
    return this._winnerDisc;
  }

  get endAt(): Date {
    return this._endAt;
  }
}
