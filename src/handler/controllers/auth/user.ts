import { UserInterface } from 'nestjs-jwt-authorize/lib/src';

export class User implements UserInterface {
  roles: string[];
}
