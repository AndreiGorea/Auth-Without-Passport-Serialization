import { PartialType } from '@nestjs/mapped-types';
import { RequestAuthenticationDto } from './request-authentication.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseSignUpDto extends PartialType(RequestAuthenticationDto) {
  @ApiProperty()
  message: string;

  @ApiProperty()
  approveCode: string;
}
