import { v4 } from 'uuid';

export class OperationService {
  static getTrace() {
    return v4();
  }
}
