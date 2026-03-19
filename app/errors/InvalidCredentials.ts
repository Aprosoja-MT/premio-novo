import { ApplicationError } from './ApplicationError';

export class InvalidCredentials extends ApplicationError {
  statusCode = 401;
  code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Invalid credentials provided');
    this.name = 'InvalidCredentials';
  }
}
