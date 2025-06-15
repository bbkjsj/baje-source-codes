import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Res } from '@nestjs/common';
import { HseService } from './hse.service';
import { HSECreateQuestionDTO } from './dto/create-question.dto';
import { UpdateHseDto } from './dto/update-hse.dto';
import { Authorized } from 'src/common/guards/auth.guards';
import { HSECreateChecklistDTO } from './dto/create-checklist.dto';
import { HSEUpdateChecklistDTO } from './dto/update-checklist.dto';
import { HSECreateAllocateQuestion } from './dto/create-allocate-question.dto';
import { HSEUpdateAllocateQuestion } from './dto/update-allocate-question.dto';
import { HSEGetQuestionsDTO } from './dto/get-questions.dto';
import { CreateHSEAuditDTO } from './dto/create-audit.dto';
import { Request, Response } from "express";


@Controller('hse')
export class HseController {
  constructor(private readonly hseService: HseService
    ) {}

  @Get('/types')
  @UseGuards(Authorized)
  listOfTypes() { 
    return this.hseService.findTypesForHSE();
  }

  @Get('/jobs')
  @UseGuards(Authorized)
  listOfJobs() {
    return this.hseService.findJobsForHSE();
  }


  @Post('/question')
  @UseGuards(Authorized)
  createQuestion(@Body() body: HSECreateQuestionDTO) {
    return this.hseService.createQuestion(body);
  }

  @Patch('/question/:id')
  @UseGuards(Authorized)
  updateQuestion(@Body() body: HSECreateQuestionDTO, @Param('id') id:string) { 
    return this.hseService.updateQuestion(+id, body);
  }

  @Get('/question')
  @UseGuards(Authorized)
  listQuestions(){
    return this.hseService.listQuestions();
  }

  @Get('/question/bycode/:code')
  @UseGuards(Authorized)
  getQuestionByCode(@Param('code') code: string) { 
    return this.hseService.getQuestionByCode(code);
  }

  @Delete('/question/:id') 
  @UseGuards(Authorized)
  deleteQuestion(@Param('id') id: string) { 
    return this.hseService.deleteQuestion(+id);
  }

  @Post('/checklist')
  @UseGuards(Authorized)
  createChecklist(@Body() body: HSECreateChecklistDTO) { 
    return this.hseService.createCheckList(body);
  }


  @Get('/checklist')
  @UseGuards(Authorized)
  async findAllChecklist() { 
   return await this.hseService.findAllCheckList();
  }

  

  @Get('/checklist/:id')
  @UseGuards(Authorized)
  findPublicChecklist(@Param('id') id:string) { 
    return this.hseService.findCheckList(+id);
  }

  @Patch('/checklist/:id')
  @UseGuards(Authorized)
  updatePublicChecklist(@Param('id') id:string, @Body() body: HSEUpdateChecklistDTO) { 
    return this.hseService.updateChecklist(+id, body);
  }

  @Delete('/checklist/:id')
  @UseGuards(Authorized)
  deletePublicChecklist(@Param('id') id: string) { 
    return this.hseService.deleteChecklist(+id);
  }

  @Post('/allocate')
  @UseGuards(Authorized)
  allocate(@Body() body: HSECreateAllocateQuestion) { 
    return this.hseService.createAllocate(body);
  }

  @Get('/allocate')
  @UseGuards(Authorized)
  findAllocate(@Query() params: any) {
    const {pid, vid, eid} = params; 
    
    if(pid != undefined){
      return this.hseService.findAllocatesOf(+pid, null, null);
    }
    else if(vid != undefined) {
      return this.hseService.findAllocatesOf(null, +vid, null);
    }
    else if(eid != undefined){
      return this.hseService.findAllocatesOf(null, null, +eid);
    }
  }

  @Patch('/allocate/:id')
  @UseGuards(Authorized)
  updateAllocate(@Param('id') id:string, @Body() body: HSEUpdateAllocateQuestion) { 
    return this.hseService.updateAllocate(+id, body);
  }

  @Delete('/allocate/:id')
  @UseGuards(Authorized)
  deleteAllocate(@Param('id') id:string) { 
    return this.hseService.deleteAllocate(+id);
  }

  @Post('/audit/questions')
  @UseGuards(Authorized)
  getQuestions(@Body() body: HSEGetQuestionsDTO) { 
    return this.hseService.getHSEQuestions(body);
  }

  @Post('/audit')
  @UseGuards(Authorized)
  createAudit(@Req() req: Request, @Body() body: CreateHSEAuditDTO) { 
    return this.hseService.createAudit(req.user.id, body);
  }

  @Patch('/audit/:id')
  @UseGuards(Authorized)
  updateAudit(@Param('id') id:string, @Req() req: Request, @Body() body:CreateHSEAuditDTO) { 
    return this.hseService.updateHse(+id, req.user.id, body);
  }

  @Get('/audit/:id')
  @UseGuards(Authorized)
  findAudit(@Param('id') id: string, @Req() req: Request) { 
    return this.hseService.findHse(+id, req.user.id);
  }

  @Get('/audit')
  @UseGuards(Authorized)
  listMyAudits(@Req() req: Request) { 
    return this.hseService.listMyHSE(req.user.id);
  }

  @Delete('/audit/:id')
  @UseGuards(Authorized)
  deleteMyAudit(@Req() req: Request, @Param('id') id:string) { 
    return this.hseService.deleteAudit(+id, req.user.id);
  }
}
