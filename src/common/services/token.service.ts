import * as bcryptjs from 'bcryptjs';
import { v4 } from 'uuid';
import jwt from 'jwt-simple';

export class TokenService {
  static async cryptPassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }

  static async decryptPassword(
    password: string,
    passwordCipher: string,
  ): Promise<boolean> {
    return await bcryptjs.compare(password, passwordCipher);
  }

  static generateRefreshToken(): string {
    return v4();
  }

  static validateAccessToken(
    accessToken: string,
    tokenKeyWord: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const payload = jwt.decode(accessToken, tokenKeyWord);
        resolve(payload);
      } catch (error) {
        if (error.message.toLowerCase() === 'token expirado') {
          reject({
            status: 409,
            message: 'El token de acceso ha expirado',
          });
        } else {
          reject({
            status: 401,
            message: 'Debe iniciar sesión',
          });
        }
      }
    });
  }
}
