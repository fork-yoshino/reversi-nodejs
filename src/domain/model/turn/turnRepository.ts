import mysql from 'mysql2/promise';

import { MoveGateway } from '../../../infrastructure/moveGateway';
import { SquareGateway } from '../../../infrastructure/squareGateway';
import { TurnGateway } from '../../../infrastructure/turnGateway';
import { DomainError } from '../../error/domainError';
import { Board } from './board';
import { toDisc } from './disc';
import { Move } from './move';
import { Point } from './point';
import { Turn } from './turn';

const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

export class TurnRepository {
  // 指定したgameIdとturnCountから、Turnクラスのインスタンスを作成
  async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number,
  ): Promise<Turn> {
    // turnsテーブルから指定したgame_idとturn_countのターンを取得
    const turnRecord = await turnGateway.findForGameIdAndTurnCount(
      conn,
      gameId,
      turnCount,
    );
    if (turnRecord == null)
      throw new DomainError(
        'SpecifiedTurnNotFound',
        'Specified turn not found',
      );

    // squaresテーブルから指定したturn_idの盤面情報を全件取得
    const squareRecords = await squareGateway.findForTurnId(
      conn,
      turnRecord.id,
    );

    // 取得した盤面情報から2次元配列（盤面）を作成
    const board = Array.from(new Array(8)).map(() => Array.from(new Array(8)));
    squareRecords.forEach((square) => {
      board[square.y][square.x] = square.disc;
    });

    // 指定したターンのmoveを取得
    const moveRecord = await moveGateway.findForTurnId(conn, turnRecord.id);
    let move: Move | undefined;
    if (moveRecord != null) {
      move = new Move(
        toDisc(moveRecord.disc),
        new Point(moveRecord.x, moveRecord.y),
      );
    }

    // データベースから取り出したnextDiscがnullだった場合、undefinedに置換
    const nextDisc =
      turnRecord.nextDisc === null ? undefined : toDisc(turnRecord.nextDisc);

    return new Turn(
      gameId,
      turnCount,
      nextDisc,
      move,
      new Board(board),
      turnRecord.endAt,
    );
  }

  // ターンの保存
  async save(conn: mysql.Connection, turn: Turn): Promise<void> {
    // turnsテーブルにターン情報を保存
    const turnRecord = await turnGateway.insert(
      conn,
      turn.gameId,
      turn.turnCount,
      turn.nextDisc,
      turn.endAt,
    );

    // squaresテーブルに全ての盤面情報を保存
    await squareGateway.insertAll(conn, turnRecord.id, turn.board.discs);

    // movesテーブルに置いた石の座標を保存
    if (turn.move != null) {
      await moveGateway.insert(
        conn,
        turnRecord.id,
        turn.move.disc,
        turn.move.point.x,
        turn.move.point.y,
      );
    }
  }
}
