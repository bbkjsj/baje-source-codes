import { Injectable, Scope } from "@nestjs/common";

@Injectable()
export class TestService {

  constructor() {
    console.log('init');
  }


  getParamName(): string {
    return '';
  }
}
