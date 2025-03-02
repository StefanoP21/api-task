import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'El correo electrónico es inválido.',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'La contraseña es requerida.',
  })
  @IsString()
  password: string;
}
