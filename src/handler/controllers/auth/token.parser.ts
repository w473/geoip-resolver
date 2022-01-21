import { TokenParserInterface } from 'nestjs-jwt-authorize/lib/src';
import { User } from 'src/handler/controllers/auth/user';

export class TokenParser implements TokenParserInterface {
  getUserFromTokenObject(jwt: any): User {
    return {
      roles: [],
    };
  }
}
