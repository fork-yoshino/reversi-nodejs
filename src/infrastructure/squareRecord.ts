export class SquareRecord {
  constructor(
    private readonly _id: number,
    private readonly _turnId: number,
    private readonly _x: number,
    private readonly _y: number,
    private readonly _disc: number,
  ) {}

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get disc(): number {
    return this._disc;
  }
}
