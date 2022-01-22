import { UserInterface } from 'nestjs-jwt-authorize';

export class User implements UserInterface {
  roles: string[];
}
