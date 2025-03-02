import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { errors } from '../helpers/errors';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const headers = context.switchToHttp().getRequest().headers;
    const authorizationHeader: string = headers.authorization;
    if (authorizationHeader) {
      const partsAuthentication = authorizationHeader.split(' ');
      if (partsAuthentication.length > 1) {
        const accessToken = partsAuthentication[1];
        try {
          const payload = this.jwtService.verify(accessToken, {
            secret: this.configService.get('TOKEN_KEYWORD'),
          });
          const response = context.switchToHttp().getResponse();
          const request = context.switchToHttp().getRequest();
          request.user = payload;
          response.payload = payload;
          return true;
        } catch (error) {
          if (error.name == 'TokenExpiredError') {
            throw new HttpException(
              errors.expiredToken.message,
              errors.expiredToken.status,
              { cause: errors.expiredToken.code },
            );
          } else {
            throw new HttpException(
              errors.wrongToken.message,
              errors.wrongToken.status,
              { cause: errors.wrongToken.code },
            );
          }
        }
      } else {
        throw new HttpException(
          errors.missingToken.message,
          errors.missingToken.status,
          { cause: errors.missingToken.code },
        );
      }
    }
  }
}
