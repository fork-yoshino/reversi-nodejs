import env from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { ApplicationError } from './application/error/applicationError';
import { DomainError } from './domain/error/domainError';
import { gameRouter } from './presentation/gameRouter';
import { turnRouter } from './presentation/turnRouter';

env.config();

const PORT = process.env.APP_PORT ?? '3000';

const app = express();

app.use(express.json());
// アクセスログ出力の設定
app.use(morgan('dev'));

app.use(express.static('static', { extensions: ['html'] }));
app.use(gameRouter);
app.use(turnRouter);

// エラーハンドラの設定
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Reversi application started: http://localhost:${PORT}`);
});

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // すでにレスポンスを返している場合、Expressのデフォルトエラーハンドラにエラーを渡す
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof DomainError) {
    res.status(400).json({
      type: err.type,
      message: err.message,
    });
    return;
  }

  if (err instanceof ApplicationError) {
    switch (err.type) {
      case 'LatestGmaeNotFound':
        res.status(404).json({
          type: err.type,
          message: err.message,
        });
        return;
    }
  }

  console.error('An unexpected error has occurred', err);
  res.status(500).json({
    message: 'An unexpected error has occurred',
  });
}
