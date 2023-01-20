import { DomainError } from '../../error/domainError';

export const Disc = {
  Empty: 0,
  Dark: 1,
  Light: 2,
  Wall: 3,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Disc = (typeof Disc)[keyof typeof Disc];

export function toDisc(value: any): Disc {
  if (!Object.values(Disc).includes(value)) {
    throw new DomainError('InvalidDiscValue', 'Invalid disc value');
  }
  return value as Disc;
}

// 手と逆の色の石だった場合trueを返す
export function isOppositeDisc(disc1: Disc, disc2: Disc): boolean {
  return (
    (disc1 === Disc.Dark && disc2 === Disc.Light) ||
    (disc1 === Disc.Light && disc2 === Disc.Dark)
  );
}
