import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const validePipe: any = exception.getResponse();
    const responseBody = {
      status,
      message: validePipe?.message ?? exception.message,
    };
    response.status(status).send(responseBody);
  }
}
