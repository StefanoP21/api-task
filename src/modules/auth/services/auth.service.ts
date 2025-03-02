import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
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

  async register(dto: RegisterDto) {
    const trace = this.setTrace();
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (user) {
        throw new HttpException(
          errors.userAlreadyExist.message,
          errors.userAlreadyExist.status,
          { cause: errors.userAlreadyExist.code },
        );
      }

      dto.password = await TokenService.cryptPassword(dto.password);
      await this.userRepository.save(new User(dto));
      const data = {
        email: dto.email,
      };
      return ResponseDto.format(trace, data);
    } catch (err) {
      throw err;
    }
  }

  async login(dto: LoginDto) {
    const trace = this.setTrace();
    try {
      const user = await this.userRepository.findOneBy({
        email: dto.email,
      });
      if (!user) {
        throw new HttpException(
          errors.userNotExist.message,
          errors.userNotExist.status,
          { cause: errors.userNotExist.code },
        );
      }

      const matched = await TokenService.decryptPassword(
        dto.password,
        user.password,
      );
      if (!matched) {
        throw new HttpException(
          errors.passwordIncorrect.message,
          errors.passwordIncorrect.status,
          { cause: errors.passwordIncorrect.code },
        );
      }

      const payload = { email: dto.email };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('TOKEN_TIMEOUT'),
        secret: this.configService.get('TOKEN_KEYWORD'),
      });
      await this.userRepository.save(user);
      const data = {
        email: user.email,
        accessToken,
      };
      return ResponseDto.format(trace, data);
    } catch (err) {
      throw err;
    }
  }
}
