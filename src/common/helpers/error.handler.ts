import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Logger } from './logger.handler';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpException.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const validePipe: any = exception.getResponse();
    this.logger.catchLogger(status, response, exception.message);
    const responseBody = {
      status,
      message: validePipe?.message ?? exception.message,
    };
    response.status(status).send(responseBody);
  }
}
