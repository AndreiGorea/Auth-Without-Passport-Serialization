import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../../interfaces/auth-paylod.interface';
import * as process from 'process';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request['headers']?.authorization;

    if (!token) {
      return false;
    }

    request.user = this.validateToken(token);

    return true;
  }

  private validateToken(token: string): AuthPayload {
    try {
      token = token.replace('Bearer ', '');
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (_) {
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
