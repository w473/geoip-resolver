import { User } from 'src/handler/controllers/auth/user';
import { BearerHeaderTokenParser } from 'nestjs-jwt-authorize';

interface KratosTokenSessionTraits {
  role?: string;
}

interface KratosTokenSession {
  traits?: KratosTokenSessionTraits;
}

interface KratosToken {
  session: KratosTokenSession;
}

export class TokenParser extends BearerHeaderTokenParser {
  getUserFromTokenObject(jwt: KratosToken): User {
    return {
      roles: [jwt.session?.traits?.role],
    };
  }
}
