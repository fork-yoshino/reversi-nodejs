import mysql from 'mysql2/promise';

import { GameGateway } from '../../../infrastructure/gameGateway';
import { Game } from './game';

const gameGateway = new GameGateway();

export class GameRepository {
  // gamesテーブルから最新の対戦を取得
  async findLatest(conn: mysql.Connection): Promise<Game | undefined> {
    const gameRecord = await gameGateway.findLatest(conn);
    if (gameRecord == null) return undefined;

    return new Game(gameRecord.id, gameRecord.startedAt);
  }

  // gamesテーブルに対戦開始時刻を保存（ゲームの作成）
  async save(conn: mysql.Connection, game: Game): Promise<Game> {
    const gameRecord = await gameGateway.insert(conn, game.startedAt);

    return new Game(gameRecord.id, gameRecord.startedAt);
  }
}
