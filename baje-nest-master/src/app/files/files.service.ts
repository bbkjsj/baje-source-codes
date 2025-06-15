import { Injectable } from '@nestjs/common';
import * as Path from 'path';
import {
  createReadStream, ReadStream
} from 'fs';
import { Response } from 'express';


@Injectable()
export class FilesService {

  constructor(){}


  pathGenerator(args: {
    fileName: string;
    module: string;
  }): string {

    if(args.module === 'vehicle' || args.module === 'vehicle-sytstem') {
      return this.generateVehicleFile({
        fileName: args.fileName
      })
    }
    else if(args.module === 'tp-insurance') {
      return this.generateTPInsurance({
        fileName: args.fileName
      });
    }
    else if(args.module === 'personnel') {
      return this.generatePersonnel({
        fileName: args.fileName
      });
    }
    else if(args.module === 'tasks') {
      return this.generateTasks({
        fileName: args.fileName
      });
    }
    else if(args.module === 'company') {
      return this.generateCompany({
        fileName: args.fileName
      });
    }
    return null;
  }


  private generateVehicleFile(args: {
    fileName: string;
  }): string {

    const filePath: string = `${this.readBaseURL()}/vehicle/${args.fileName}`;

    return filePath;
  }

  private generateTPInsurance(args: {
    fileName: string;
  }) {
    const filePath: string = `${this.readBaseURL()}/tp-insurance/${args.fileName}`;
    return filePath;
  }

  private generatePersonnel(args: {
    fileName: string
  }): string {
    const filePath: string = `${this.readBaseURL()}/personnel/${args.fileName}`;
    return filePath;
  }

  private generateTasks(args: {
    fileName: string;
  }): string {
    const filePath: string = `${this.readBaseURL()}/tasks/${args.fileName}`;
    return filePath;
  }
  private readBaseURL(): string {
    return `${process.cwd()}/uploads`
  }

  private generateCompany(args: {
    fileName: string
  }): string {
    const filePath: string = `${this.readBaseURL()}/company/${args.fileName}`;
    return filePath;
  }
}