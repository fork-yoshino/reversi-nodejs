import { Game } from '../../domain/model/game/game';
import { GameRepository } from '../../domain/model/game/gameRepository';
import { firstTurn } from '../../domain/model/turn/turn';
import { TurnRepository } from '../../domain/model/turn/turnRepository';
import { connectMySQL } from '../../infrastructure/connection';

const gameRepository = new GameRepository();
const turnRepository = new TurnRepository();

export class GameService {
  async startNewGame(): Promise<void> {
    const now = new Date();

    const conn = await connectMySQL();
    try {
      await conn.beginTransaction();

      // gamesテーブルに対戦開始時刻を保存（ゲームの作成）
      const game = await gameRepository.save(conn, new Game(undefined, now));
      if (game.id == null) throw new Error('Game ID not exist');

      // 初回ターンを作成
      const turn = firstTurn(game.id, now);

      // turnsテーブルにターン情報を保存（初回ターン）
      await turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
