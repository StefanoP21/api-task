import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  private requestTrace?: string;
  requestPath?: string;

  constructor(context: string, requestTrace?: string) {
    super(context);
    this.requestTrace = requestTrace;
  }

  setRequestTrace(requestTrace: string) {
    this.requestTrace = requestTrace;
  }

  private formatLogMessage(message: string): string {
    return this.requestTrace
      ? `${this.requestPath} - [${this.requestTrace}] - ${message}`
      : `${message}`;
  }

  requestLogger(
    request: Request & { user: { email: string } },
    methodName: string,
  ) {
    const user = request.user.email;
    const path = request.url;
    const method = request.method;
    this.requestPath = `[${method} ${path}] - [${user}]`;
    this.verbose(`${this.requestPath} - ${methodName}`);
  }

  traceLogger(trace: string, action: string) {
    this.debug(`[END] - [${trace}] - ${action}`);
  }

  catchLogger(status: number, response: any, message: string) {
    const path = response.req.url;
    const method = response.req.method;
    const user = response.payload ? response.payload.email : 'no user';
    this.error(`[${method} ${path}] - [${user}] - [${status}] - ${message}`);
  }

  log(message: string) {
    super.log(this.formatLogMessage(message));
  }

  error(message: string, trace?: string) {
    const stackTrace = trace || new Error().stack;
    super.error(`${this.formatLogMessage(message)} - Stack: ${stackTrace}`);
  }

  warn(message: string) {
    super.warn(this.formatLogMessage(message));
  }

  debug(message: string) {
    super.debug(this.formatLogMessage(message));
  }

  verbose(message: string) {
    super.verbose(this.formatLogMessage(message));
  }
}
