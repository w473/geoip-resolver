import { User } from 'src/handler/controllers/auth/user';
import { BearerHeaderTokenParser } from 'nestjs-jwt-authorize/lib/src/logic/bearer-header-token.parser';

export class TokenParser extends BearerHeaderTokenParser {
  getUserFromTokenObject(jwt: any): User {
    console.log(jwt);
    return {
      roles: [],
    };
  }
}
