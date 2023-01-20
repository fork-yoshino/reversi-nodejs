import mysql from 'mysql2/promise';

import { MoveRecord } from './moveRecord';

export class MoveGateway {
  // 指定したターンのmoveを取得
  async findForTurnId(
    conn: mysql.Connection,
    turnId: number,
  ): Promise<MoveRecord | undefined> {
    const moveSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      'select id, turn_id, disc, x, y from moves where turn_id = ?',
      [turnId],
    );
    const record = moveSelectResult[0][0];
    if (record == null) return undefined;

    return new MoveRecord(
      record['id'],
      record['turn_id'],
      record['disc'],
      record['x'],
      record['y'],
    );
  }

  // movesテーブルに置いた石の座標を保存
  async insert(
    conn: mysql.Connection,
    turnId: number,
    disc: number,
    x: number,
    y: number,
  ): Promise<void> {
    await conn.execute(
      'insert into moves (turn_id, disc, x, y) values (?, ?, ?, ?)',
      [turnId, disc, x, y],
    );
  }
}
