import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
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
}
