import type { Disc } from './disc';
import { Point } from './point';

export class Move {
  constructor(private readonly _disc: Disc, private readonly _point: Point) {}

  get disc(): Disc {
    return this._disc;
  }

  get point(): Point {
    return this._point;
  }
}
