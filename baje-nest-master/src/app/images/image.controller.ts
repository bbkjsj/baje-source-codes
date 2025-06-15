import { Controller, Get, Param, Res } from "@nestjs/common";
import { ImageService } from "./image.service";
import { Response } from "express";

@Controller('image')
export class ImageController {

  constructor(
    private readonly imageService: ImageService
  ) {
  }

  @Get(':module/:fileName')
  async getImage(
    @Param('module') module: string,
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    const filePath: string = this.imageService.getImagePath({
      fileName: fileName,
      module: module
    });
    res.sendFile(filePath);
  }
}