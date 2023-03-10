import { DomainError } from '../../error/domainError';

const MIN_POINT = 0;
const MAX_POINT = 7;

export class Point {
  constructor(private readonly _x: number, private readonly _y: number) {
    if (_x < MIN_POINT || MAX_POINT < _x || _y < MIN_POINT || MAX_POINT < _y) {
      throw new DomainError('InvalidPoint', 'Invalid point');
    }
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }
}
