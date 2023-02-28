import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestAuthenticationDto } from './dto/request-authentication.dto';
import {
  hashPassword,
  comparePasswords,
  signToken,
  generateApproveCode,
  signRefreshToken,
} from '../../utils/auth';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestSignInDto } from './dto/request-sign-in.dto';
import { RequestApproveUserDto } from './dto/request-approve-user.dto';
import { ApproveUser } from './entities/approve-user.entity';
import { AuthPayload } from '../interfaces/auth-paylod.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async signup(createAuthenticationDto: RequestAuthenticationDto) {
    const { email, password, username } = createAuthenticationDto;

    const foundUser = await this.usersRepository.findOne({
      where: [{ email: email }, { username: username }],
      relations: ['approveUser'],
    });

    if (foundUser && foundUser.approveUser.approveCode) {
      throw new ConflictException(
        `Don't kill the register button, approve yourself with code: ${foundUser.approveUser.approveCode}`,
      );
    }

    if (foundUser) {
      throw new BadRequestException('Email or username already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.username = username;
    newUser.isApproved = false;

    const newApproveUser = new ApproveUser();
    newApproveUser.approveCode = generateApproveCode();
    newUser.approveUser = newApproveUser;

    await this.usersRepository.save(newUser);
    return {
      message: 'Signup was successful',
      approveCode: newUser.approveUser.approveCode,
    };
  }

  async signin(createAuthenticationDto: RequestSignInDto) {
    const { email, password, username } = createAuthenticationDto;

    const foundUser = await this.usersRepository.findOne({
      where: [{ email: email }, { username: username }],
      relations: ['approveUser'],
    });

    if (foundUser.isApproved) {
      if (!foundUser) {
        throw new BadRequestException('Wrong credentials');
      }

      const isMatch = await comparePasswords({
        password,
        hash: foundUser.password,
      });

      if (!isMatch) {
        throw new BadRequestException('Wrong password');
      }

      const accessToken = await signToken({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      });
      const refreshToken = await signRefreshToken({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      });

      foundUser.refreshToken = refreshToken;

      await this.usersRepository.save(foundUser);

      return {
        success: true,
        token: accessToken,
        refreshToken: refreshToken,
        foundUser: foundUser,
      };
    } else {
      throw new ForbiddenException(
        'You are not approved to access this resource',
      );
    }
  }

  async approveUserCode(createApproveUserDto: RequestApproveUserDto) {
    const { email, password, username, approveCode } = createApproveUserDto;

    const foundUser = await this.usersRepository.findOne({
      where: [{ email: email }, { username: username }],
      relations: ['approveUser'],
    });

    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const isMatch = await comparePasswords({
      password,
      hash: foundUser.password,
    });

    if (!isMatch) {
      throw new BadRequestException('Wrong password');
    }

    if (approveCode && approveCode === foundUser.approveUser.approveCode) {
      foundUser.isApproved = true;
      await this.usersRepository.save(foundUser);
    } else {
      throw new BadRequestException('Provide please a valid code');
    }
  }

  // async refresh(user, req: any) {
  //   const accessToken = await this.signToken(
  //     user.id,
  //     user.username,
  //     user.roleId,
  //   );
  //   await this.usersRepository.update(user.id, {
  //     last_active: new Date(),
  //     user_agent: req.headers['user-agent'],
  //   });
  //   return { accessToken };
  // }

  async logout(user: AuthPayload) {
    return this.usersRepository.update(user.id, { refreshToken: null });
  }
}
