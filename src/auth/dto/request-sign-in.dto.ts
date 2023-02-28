import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class RequestSignInDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @ApiProperty()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, {
    message:
      'The password should contain at least one digit, one uppercase and one lowercase letter. The password must be between 6 and 20 characters',
  })
  @MaxLength(20)
  password: string;
}
