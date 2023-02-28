import { Role } from '../enums/user-role';

export interface AuthPayload {
  id: string;
  email: string;
  role: Role;
}
