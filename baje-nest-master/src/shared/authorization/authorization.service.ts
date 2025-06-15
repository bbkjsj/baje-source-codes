import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthorizationService {

  constructor() {}

  async onlineShopping(args: {
    token: string;
  }): Promise<boolean> {

    if(args.token === 'D579FAE62A5273FAF1BFCEE9973B7') {
      return true;
    }

    throw new UnauthorizedException(
      AuthorizationService,
      'invalid token'
    );
  }
}