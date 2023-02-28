import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '../enums/user-role';

export const ROLES_KEY = 'roles';
export const RolesDecorator = (...roles: Role[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
