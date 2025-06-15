import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as moment from "moment";
import * as jmoment from "jalali-moment";
import { equals } from "class-validator";

declare const module:any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1/baje');
  app.useGlobalPipes(new ValidationPipe({
    // whitelist:true,
    // forbidNonWhitelisted: true,
    // transform: true
  }));

  await app.listen(4004);

  if(module.hot){
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  new Logger().debug('server is running on port 4004');

  const b: boy = new boy({
    name: 'amir',
    age: 11
  });

  const g: girl = new girl({
    name: 'test',
    sex: true
  });


}
bootstrap();


class person {
  constructor(args: person) {
    Object.assign(this, args);
  }
  name: string;
}

class boy extends person {
  age: number;
  constructor(args: boy) {
    super(args);
    Object.assign(this, args);
  }
}

class girl extends person {
  sex: boolean;
  constructor(args: girl) {
    super(args);
    Object.assign(this, args);
  }
}

const test = (p: person) => {
  console.log(p instanceof boy);
  console.log(p instanceof person);
  console.log(p instanceof girl);

}



