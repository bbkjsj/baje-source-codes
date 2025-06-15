import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';

// api/v1/files/
@Controller('files')
export class FilesController {

  constructor(
    private readonly service: FilesService
  ){}


  @Get(':module/:fileName')
  async getFile(
    @Param('module') module: string,
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    const filePath: string = this.service.pathGenerator({
      fileName: fileName,
      module: module
    });
    res.sendFile(filePath);
  }
}