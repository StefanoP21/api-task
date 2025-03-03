import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { errors } from '../../../common/helpers/errors';
import { TokenService } from '../../../common/services/token.service';
import { ResponseDto } from '../../../common/dtos/response.dto';
import { OperationService } from '../../../common/services/trace.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private setTrace() {
    const trace: string = OperationService.getTrace();
    return trace;
  }

  async register(registerDto: RegisterDto) {
    const trace = this.setTrace();
    try {
      const user = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });
      if (user) {
        throw new HttpException(
          errors.userAlreadyExist.message,
          errors.userAlreadyExist.status,
          { cause: errors.userAlreadyExist.code },
        );
      }

      registerDto.password = await TokenService.cryptPassword(
        registerDto.password,
      );
      const userDb = await this.userRepository.save(new User(registerDto));
      const payload = { id: userDb.id, email: registerDto.email };
      const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_TIMEOUT'),
        secret: this.configService.get('JWT_SECRET'),
      });
      const data = {
        id: userDb.id,
        email: registerDto.email,
        token,
      };
      return ResponseDto.format(trace, data);
    } catch (err) {
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    const trace = this.setTrace();
    try {
      const user = await this.userRepository.findOneBy({
        email: loginDto.email,
      });
      if (!user) {
        throw new HttpException(
          errors.userNotExist.message,
          errors.userNotExist.status,
          { cause: errors.userNotExist.code },
        );
      }

      const matched = await TokenService.decryptPassword(
        loginDto.password,
        user.password,
      );
      if (!matched) {
        throw new HttpException(
          errors.passwordIncorrect.message,
          errors.passwordIncorrect.status,
          { cause: errors.passwordIncorrect.code },
        );
      }

      const payload = { id: user.id, email: loginDto.email };
      const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_TIMEOUT'),
        secret: this.configService.get('JWT_SECRET'),
      });
      await this.userRepository.save(user);
      const data = {
        id: user.id,
        email: user.email,
        token,
      };
      return ResponseDto.format(trace, data);
    } catch (err) {
      throw err;
    }
  }
}
