type DomainErrorType =
  | 'SelectedPointIsNotEmpty'
  | 'FlipPointsIsEmpty'
  | 'SelectedDiscIsNotNextDisc'
  | 'SpecifiedTurnNotFound'
  | 'InvalidPoint'
  | 'InvalidDiscValue'
  | 'InvalidWinnerDiscValue';

export class DomainError extends Error {
  constructor(private readonly _type: DomainErrorType, message: string) {
    super(message);
  }

  get type(): DomainErrorType {
    return this._type;
  }
}
