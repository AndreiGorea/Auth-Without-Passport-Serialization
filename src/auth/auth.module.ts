import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ApproveUser } from './entities/approve-user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([User, ApproveUser]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UsersService],
})
export class AuthModule {}
