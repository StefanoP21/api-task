import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: 'Write detailed documentation for the API endpoints',
    description: 'Task description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'PENDING',
    description: 'Task status (PENDING is the default value)',
    enum: ['PENDING', 'COMPLETED'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED'])
  status?: string;

  @ApiProperty({
    example: '2025-03-03T03:30:39.134Z',
    description: 'Task end date',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    example: 4,
    description: 'User ID (added by the system)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
