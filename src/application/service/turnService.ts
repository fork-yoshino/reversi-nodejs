import { GameRepository } from '../../domain/model/game/gameRepository';
import { GameResult } from '../../domain/model/gameResult/gameResult';
import { GameResultRepository } from '../../domain/model/gameResult/gameResultRepository';
import { Disc } from '../../domain/model/turn/disc';
import { Point } from '../../domain/model/turn/point';
import { TurnRepository } from '../../domain/model/turn/turnRepository';
import { connectMySQL } from '../../infrastructure/connection';
import { ApplicationError } from '../error/applicationError';

const gameRepository = new GameRepository();
const turnRepository = new TurnRepository();
const gameResultRepository = new GameResultRepository();

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private readonly _turnCount: number,
    private readonly _board: number[][],
    private readonly _nextDisc: number | undefined,
    private readonly _winnerDisc: number | undefined,
  ) {}

  get turnCount(): number {
    return this._turnCount;
  }

  get board(): number[][] {
    return this._board;
  }

  get nextDisc(): number | undefined {
    return this._nextDisc;
  }

  get winnerDisc(): number | undefined {
    return this._winnerDisc;
  }
}

export class TurnService {
  async findLatestGameTurnByTurnCount(
    turnCount: number,
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectMySQL();
    try {
      // gamesテーブルから最新の対戦を取得
      const game = await gameRepository.findLatest(conn);
      if (game == null)
        throw new ApplicationError(
          'LatestGmaeNotFound',
          'Latest game not found',
        );
      // 上記で対戦が見つかっているのにIDが存在しないことはありえないため、発生した場合は500エラー（通常のエラー）を返す
      if (game.id == null) throw new Error('Game ID not exist');

      // 指定したgameIdとturnCountから、Turnクラスのインスタンスを作成
      const turn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        turnCount,
      );

      let gameResult: GameResult | undefined;
      if (turn.gameEnded()) {
        gameResult = await gameResultRepository.findForGameId(conn, game.id);
      }

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        gameResult?.winnerDisc,
      );
    } finally {
      await conn.end();
    }
  }

  async registerTurn(
    turnCount: number,
    disc: Disc,
    point: Point,
  ): Promise<void> {
    const conn = await connectMySQL();
    // 1つ前のターンを取得する
    try {
      // gamesテーブルから最新の対戦を取得
      const game = await gameRepository.findLatest(conn);
      if (game == null)
        throw new ApplicationError(
          'LatestGmaeNotFound',
          'Latest game not found',
        );
      if (game.id == null) throw new Error('Game ID not exist');

      // turnsテーブルから指定したgame_idとturn_countのターンを取得
      const previousTurnCount = turnCount - 1;
      const previousTurn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        previousTurnCount,
      );

      // 石を置く
      const newTurn = previousTurn.placeNext(disc, point);

      // turnsテーブルにターン情報を保存
      await turnRepository.save(conn, newTurn);

      // 勝敗が決まった場合、対戦結果を保存
      if (newTurn.gameEnded()) {
        const winnerDisc = newTurn.winnerDisc();
        const gameResult = new GameResult(game.id, winnerDisc, newTurn.endAt);
        await gameResultRepository.save(conn, gameResult);
      }

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
