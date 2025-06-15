import { Global, Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Global()
@Module({
  imports: [],
  exports: [
    AuthorizationService
  ],
  providers: [
    AuthorizationService
  ]
})
export class AuthorizationModule {}