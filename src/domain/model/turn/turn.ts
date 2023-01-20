import { DomainError } from '../../error/domainError';
import { WinnerDisc } from '../gameResult/winnerDisc';
import { Board, initialBoard } from './board';
import { Disc } from './disc';
import { Move } from './move';
import { Point } from './point';

export class Turn {
  constructor(
    private readonly _gameId: number,
    private readonly _turnCount: number,
    private readonly _nextDisc: Disc | undefined,
    private readonly _move: Move | undefined,
    private readonly _board: Board,
    private readonly _endAt: Date,
  ) {}

  placeNext(disc: Disc, point: Point): Turn {
    // 打とうとした石が、nextDiscと異なる場合
    if (disc !== this._nextDisc)
      throw new DomainError(
        'SelectedDiscIsNotNextDisc',
        'Selected disc is not next disc',
      );

    // 置いた石を盤面に反映
    const move = new Move(disc, point);
    const nextBoard = this._board.place(move);

    // 次の石が何かを判定
    const nextDisc = this.decideNextDisc(nextBoard, disc);

    return new Turn(
      this._gameId,
      this._turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      new Date(),
    );
  }

  gameEnded(): boolean {
    return this._nextDisc === undefined;
  }

  winnerDisc(): WinnerDisc {
    const darkCount = this._board.count(Disc.Dark);
    const lightCount = this.board.count(Disc.Light);

    if (darkCount === lightCount) {
      return WinnerDisc.Draw;
    } else if (darkCount > lightCount) {
      return WinnerDisc.Dark;
    } else {
      return WinnerDisc.Light;
    }
  }

  private decideNextDisc(board: Board, previousDisc: Disc): Disc | undefined {
    const existDarkValidMove = board.existValidMove(Disc.Dark);
    const existLightValidMove = board.existValidMove(Disc.Light);

    if (existDarkValidMove && existLightValidMove) {
      // 両方置ける場合、前の石と反対の石の番
      return previousDisc === Disc.Dark ? Disc.Light : Disc.Dark;
    } else if (!existDarkValidMove && !existLightValidMove) {
      // 両方置けない場合、次の石はない（終了）
      return undefined;
    } else if (existDarkValidMove) {
      // 片方しか置けない場合、置ける方の石の番
      return Disc.Dark;
    } else {
      return Disc.Light;
    }
  }

  get gameId(): number {
    return this._gameId;
  }

  get turnCount(): number {
    return this._turnCount;
  }

  get nextDisc(): Disc | undefined {
    return this._nextDisc;
  }

  get move(): Move | undefined {
    return this._move;
  }

  get board(): Board {
    return this._board;
  }

  get endAt(): Date {
    return this._endAt;
  }
}

// 初回ターンを作成
export function firstTurn(gameId: number, endAt: Date): Turn {
  return new Turn(gameId, 0, Disc.Dark, undefined, initialBoard, endAt);
}
