import { PartialType } from '@nestjs/mapped-types';
import { RequestAuthenticationDto } from './request-authentication.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseSignInDto extends PartialType(RequestAuthenticationDto) {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  message: boolean;

  @ApiProperty()
  foundUserId: number;
}
