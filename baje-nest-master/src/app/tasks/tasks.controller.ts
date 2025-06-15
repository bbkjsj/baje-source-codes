import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors, UploadedFile
} from "@nestjs/common";
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Authorized } from 'src/common/guards/auth.guards';
import { Request } from "express";
import { CreateTaskConditionDTO } from './dto/create-condition.dto';
import { UpdateTaskConditionDTO } from './dto/update-condition.dto';
import { KartablTastStatus } from 'src/common/enums/task-kartabl-status.enum';
import { CreateTaskNotMyDutyDTO } from './dto/create-not-my-duty.dto';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer";
import { ForwardTaskDto } from "./dto/forward-task.dto";


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/detail/:id')
  @UseGuards(Authorized)
  taskDetail(@Param('id') id: string) { 
    return this.tasksService.taskDetail(+id);
  }

  @Get('counters')
  @UseGuards(Authorized)
  async getTasksCounters(
    @Req() req: Request
  ) {
    return await this.tasksService.getCounters(req.user.id);
  }

  @Get('/kartabl/:status')
  @UseGuards(Authorized)
  kartabl(@Req() req: Request, @Param('status') status: KartablTastStatus) { 
    return this.tasksService.kartabl(req.user.id, status);
  }


  @Post()
  @UseGuards(Authorized)
  create(@Body() body: CreateTaskDTO, @Req() req: Request) {
    return this.tasksService.create(body, req.user.id);
  }

  @Patch(':taskId/forward')
  @UseGuards(Authorized)
  async forwardTask(
    @Body()
    body: ForwardTaskDto,
    @Param('taskId')
    taskId: string
  ) {
    await this.tasksService.forwardTask({
      taskId: +taskId,
      forwardTo: body.forwardTo,
      description: body.forwardDescription
    });
  }

  @Patch(':id')
  @UseGuards(Authorized)
  @UseInterceptors(FileInterceptor('attachment'))
  updateTask(@Param('id') id:string, @Body() body: UpdateTaskDTO,
             @Req() req: Request,
             @UploadedFile() file: Express.Multer.File) {
    return this.tasksService.updateTask(+id, body, req.user.id, file);
  }

  @Get('/open')
  @UseGuards(Authorized)
  myOpenTasks(@Req() req: Request) {
    return this.tasksService.myOpenTasks(req.user.id);
  }

  @Post('/condition')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(Authorized)
  createNewTaskCondition(@Req() req: Request, @Body() body: CreateTaskConditionDTO, @UploadedFile() file: Express.Multer.File) {
    return this.tasksService.createTaskCondition(req.user.id, body, file);
  }


  @Get('/condition')
  @UseGuards(Authorized)
  listOfConditions() { 
    return this.tasksService.getTaskConditions();
  }


  @Get('/condition/:id')
  @UseGuards(Authorized)
  listOfCompanyTaskConditions(@Param('id') id:string) {
    return this.tasksService.getTaskConditionDetail(+id);
  }

  @Patch('/condition/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(Authorized)
  updateCondition(
    @Param('id') id:string,
    @Body() body: UpdateTaskConditionDTO,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.tasksService.updateTaskCondition(+id, body, file);
  }

  @Delete('/condition/:id')
  @UseGuards(Authorized)
  deleteCondition(@Param('id') id:string) { 
    return this.tasksService.deleteTaskCondition(+id);
  }

  @Patch('/approve/:id')
  @UseGuards(Authorized)
  async approveTask(@Req() req: Request, @Param('id') id:string)  { 
    return await this.tasksService.approveTask(+id, req.user.id);
  }

  @Post('not-my-duty')
  @UseGuards(Authorized)
  async createNotMyDuty(@Body() body: CreateTaskNotMyDutyDTO, @Req() req: Request) { 
    return await this.tasksService.createNotMyDuty(body, req.user.id);
  }

  @Patch('not-my-duty/:taskId/:approve')
  @UseGuards(Authorized)
  async updateNotMyDuty(@Param('taskId') id: string, @Req() req: Request,@Param('approve') approve:string) { 
    if(approve === 'true' || approve === 'false') { 
      const _approve:boolean = approve === 'true' ? true : false;
      return await this.tasksService.approveNotMyDuty(+id, _approve, req.user.id);
    }
    else {
      throw new NotFoundException('url not found');
    }
  }

  @Patch('read-task/:taskId')
  @UseGuards(Authorized)
  async readTask(
    @Req() req: Request,
    @Param('taskId') taskId: string,
  ): Promise<void> {
    await this.tasksService.readTask({
      userId: +req.user.id,
      taskId: +taskId
    });
  }
}
