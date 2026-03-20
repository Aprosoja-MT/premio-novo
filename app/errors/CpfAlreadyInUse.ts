import { ApplicationError } from './ApplicationError';

export class CpfAlreadyInUse extends ApplicationError {
  statusCode = 409;
  code = 'CPF_ALREADY_IN_USE';

  constructor() {
    super('This CPF is already registered');
    this.name = 'CpfAlreadyInUse';
  }
}
