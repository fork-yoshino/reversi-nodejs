import mysql from 'mysql2/promise';

import { SquareRecord } from './squareRecord';

export class SquareGateway {
  // squaresテーブルから指定のturn_idの盤面情報を全件取得
  async findForTurnId(
    conn: mysql.Connection,
    turnId: number,
  ): Promise<SquareRecord[]> {
    const squaresSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      'select id, turn_id, x, y, disc from squares where turn_id = ?',
      [turnId],
    );
    const records = squaresSelectResult[0];

    return records.map(
      (record) =>
        new SquareRecord(
          record['id'],
          record['turn_id'],
          record['x'],
          record['y'],
          record['disc'],
        ),
    );
  }

  // squaresテーブルに全ての盤面情報を保存
  async insertAll(
    conn: mysql.Connection,
    turnId: number,
    board: number[][],
  ): Promise<void> {
    // マス目の数を計算
    const squareCount = board
      .map((line) => line.length)
      .reduce((pre, cur) => pre + cur, 0);

    const squaresInsertSql =
      'insert into squares (turn_id, x, y, disc) values ' +
      Array.from(new Array(squareCount))
        .map(() => '(?, ?, ?, ?)')
        .join(', ');

    const squaresInsertValues: any[] = [];
    board.forEach((line, y) => {
      line.forEach((disc, x) => {
        squaresInsertValues.push(turnId);
        squaresInsertValues.push(x);
        squaresInsertValues.push(y);
        squaresInsertValues.push(disc);
      });
    });

    await conn.execute(squaresInsertSql, squaresInsertValues);
  }
}
