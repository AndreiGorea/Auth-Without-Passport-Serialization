import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { RequestAuthenticationDto } from './dto/request-authentication.dto';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSignUpDto } from './dto/response-sign-up.dto';
import { ResponseSignInDto } from './dto/response-sign-in.dto';
import { AuthenticationService } from './auth.service';
import { RequestSignInDto } from './dto/request-sign-in.dto';
import { RequestApproveUserDto } from './dto/request-approve-user.dto';
import { decodeToken } from '../../utils/auth';
import { UserDecorator } from "../decorators/user.decorator";
import { AuthPayload } from "../interfaces/auth-paylod.interface";
import { JwtAuthGuard } from "./jwt/jwt-auth-guard";

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @ApiTags('User Authorization')
  @ApiCreatedResponse({
    type: ResponseSignUpDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email address is already in use.',
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred.',
  })
  async signup(
    @Body() createAuthenticationDto: RequestAuthenticationDto,
  ): Promise<ResponseSignUpDto> {
    return this.authenticationService.signup(createAuthenticationDto);
  }

  @Post('signin')
  @ApiTags('User Authorization')
  @ApiResponse({
    status: 200,
    description: 'Sign in successful',
    type: ResponseSignInDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async signin(
    @Body() createSignInDto: RequestSignInDto,
  ): Promise<ResponseSignInDto> {
    const result = await this.authenticationService.signin(createSignInDto);
    return {
      message: result.success,
      accessToken: result.token,
      foundUserId: result.foundUser.id,
      refreshToken: result.refreshToken,
    };
  }

  @Post('approve')
  async approveUserCode(
    @Body() createApproveUserDto: RequestApproveUserDto,
  ): Promise<object> {
    await this.authenticationService.approveUserCode(createApproveUserDto);
    return { message: 'You are approved!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@UserDecorator() user: AuthPayload) {
    await this.authenticationService.logout(user);
    return 'Successfully logged out';
  }

  // @Post('refresh')
  // async refresh(@Body() body, @Req() req) {
  //   const { username } = jwt.verify(
  //     body.refreshToken,
  //     'refreshTokenSecretKey',
  //   ) as jwt.JwtPayload;
  //   const user = await this.userService.findOneByUsername(username);
  //   const tokens = await this.authService.refresh(user, req);
  //   return tokens;
  // }
}
