import { DynamicModule, Module, Scope } from "@nestjs/common";
import { TestService } from "./test.service";

@Module({})
export class TestModule {
  static appNames: string[] = new Array<string>();
  static registerWithName(appName: string): DynamicModule {

    if(!this.appNames.includes(appName)) {
      this.appNames.push(appName);
    }

    return {
      module: TestModule,
      imports: [

      ],
      exports: [TestService],
      providers: [
        TestService,
        {
          provide: 'test-service',
          inject: [TestService],
          useFactory: () => {
            return TestService;
          },
        }
      ],

    }
  }
}
