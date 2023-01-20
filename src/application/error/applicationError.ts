type ApplicationErrorType = 'LatestGmaeNotFound';

export class ApplicationError extends Error {
  constructor(private readonly _type: ApplicationErrorType, message: string) {
    super(message);
  }

  get type(): ApplicationErrorType {
    return this._type;
  }
}
