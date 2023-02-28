import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

export async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}

export async function comparePasswords(args: {
  password: string;
  hash: string;
}): Promise<boolean> {
  return await bcrypt.compare(args.password, args.hash);
}

export function generateApproveCode(): string {
  const length = 8;
  let approveCode = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    approveCode += characters.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }

  return approveCode;
}

const jwt = new JwtService();
export async function signToken(payload: {
  id: number;
  email: string;
  role: string;
}): Promise<string> {
  return await jwt.signAsync(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '5d',
  });
}

export async function signRefreshToken(payload: {
  id: number;
  email: string;
  role: string;
}): Promise<string> {
  return await jwt.signAsync(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '30d',
  });
}

export async function decodeToken(authToken) {
  const token = authToken.split(' ')[1];
  return jwt.decode(token);
}
