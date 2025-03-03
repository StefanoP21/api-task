import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'El correo electrónico es inválido.',
    },
  )
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    maxLength: 50,
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida.',
  })
  @IsString()
  @MaxLength(50)
  password: string;
}
