import { ApplicationError } from './ApplicationError';

export class EmailAlreadyInUse extends ApplicationError {
  statusCode = 409;
  code = 'EMAIL_ALREADY_IN_USE';

  constructor() {
    super('This email is already in use');
    this.name = 'EmailAlreadyInUse';
  }
}
