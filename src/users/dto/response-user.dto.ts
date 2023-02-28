import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResponseUserDto {
  @ApiProperty({
    type: 'uuid',
    format: 'uuid',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: 'string',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    type: 'string',
  })
  token?: string;
}

export class UserAccessTokenResponse {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  id_token: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  scope: string;

  @ApiProperty({
    type: 'number',
  })
  @IsNotEmpty()
  expires_in: number;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  token_type: string;
}
