import { ApplicationError } from './ApplicationError';

export class InvalidRefreshToken extends ApplicationError {
  statusCode = 401;
  code = 'INVALID_REFRESH_TOKEN';

  constructor() {
    super('Invalid refresh token provided');
    this.name = 'InvalidRefreshToken';
  }
}
