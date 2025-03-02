import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({
    message: 'El nombre es requerido.',
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty({
    message: 'El apellido es requerido.',
  })
  @IsString()
  @MaxLength(50)
  lastname: string;

  @IsNotEmpty({
    message: 'El correo electrónico es requerido.',
  })
  @IsEmail(
    {},
    {
      message: 'El correo electrónico es inválido.',
    },
  )
  @MaxLength(100)
  email: string;

  @IsNotEmpty({
    message: 'La contraseña es requerida.',
  })
  @IsString()
  @MaxLength(50)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  refreshToken: string;
}
