import { Injectable } from "@nestjs/common";
import * as module from "module";

@Injectable()
export class ImageService {

  constructor() {
  }

  getImagePath(args: {
    module: string;
    fileName: string;
  }): string {

    if(args.module === 'company') {
      return this.generateCompanyPath(args.fileName);
    }
  }

  private readBaseURL(): string {
    return `${process.cwd()}/uploads`
  }

  private generateCompanyPath(fileName: string): string {
    const filePath: string = `${this.readBaseURL()}/company/${fileName}`;

    return filePath;
  }
}