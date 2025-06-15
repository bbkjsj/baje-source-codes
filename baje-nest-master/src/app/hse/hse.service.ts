import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HSEGroup } from 'src/common/enums/hse-group.enum';
import { HSERateType } from 'src/common/enums/hse-rate-type.enum';
import { RandomNumber } from 'src/common/helpers/randomnumber';
import { createQueryBuilder, Repository } from 'typeorm';
import { HSECreateChecklistDTO } from './dto/create-checklist.dto';
import { HSECreateQuestionDTO } from './dto/create-question.dto';
import { UpdateHseDto } from './dto/update-hse.dto';
import { HSEUpdateChecklistDTO } from './dto/update-checklist.dto';
import { HSEChecklistQuestion } from './schemas/checklist-questions.schema';
import { HSEChecklist } from './schemas/checklist.schema';
import { HSEQuestion } from './schemas/question.schema';
import { HSECreateAllocateQuestion } from './dto/create-allocate-question.dto';
import { HSEAllocateQuestion } from './schemas/allocate-question.schema';
import { HSEUpdateAllocateQuestion } from './dto/update-allocate-question.dto';
import { HSEGetQuestionsDTO } from './dto/get-questions.dto';
import * as moment from "moment";
import { VehicleService } from '../vehicle/vehicle.service';
import { HSEAudit } from './schemas/hse-audit.schema';
import { CreateHSEAuditDTO } from './dto/create-audit.dto';
import { HSEAuditQuestion } from './schemas/audit-question.schema';
import { JobsService } from '../jobs/jobs.service';
import { ExcelCreator } from 'src/common/helpers/excel-creator';

@Injectable()
export class HseService {
  constructor(@InjectRepository(HSEQuestion) private readonly repo: Repository<HSEQuestion>,
    @InjectRepository(HSEChecklist) private readonly hseChecklistRepo: Repository<HSEChecklist>,
    @InjectRepository(HSEChecklistQuestion) private readonly hseChecklistQuestionRepo: Repository<HSEChecklistQuestion>,
    @InjectRepository(HSEAllocateQuestion) private readonly hseAllocteQuestionRepo: Repository<HSEAllocateQuestion>,
    @InjectRepository(HSEAudit) private readonly hseAuditRepo: Repository<HSEAudit>,
    @InjectRepository(HSEAuditQuestion) private readonly hseAuditQuestionRepo: Repository<HSEAuditQuestion>,
    private readonly vehicleService: VehicleService,
    private readonly jobsService: JobsService
  ) { }

  async createQuestion(dto: HSECreateQuestionDTO): Promise<any> {
    try {
      //generate code
      let questionCode = new RandomNumber(1000, 9999).generate().toString();
      switch (dto.group) {
        case HSEGroup.VEHICLE:
          questionCode = `50${questionCode.toString()}`;
          break;
        case HSEGroup.ENVIRONMENT:
          questionCode = `80${questionCode.toString()}`;
          break;
        default:
          questionCode = `10${questionCode.toString()}`;
          break;
      }

      const _dto: any = { ...dto };
      _dto.code = questionCode;
      _dto.is_reverse = dto.isReverse;


      return await this.repo.createQueryBuilder()
        .insert()
        .values([_dto])
        .execute();
    }
    catch (err) {
      throw err;
    }
  }


  async updateQuestion(id: number, dto: HSECreateQuestionDTO) {
    try {
      const _dto:any = dto;
      _dto.is_reverse = dto.isReverse;
      delete _dto.isReverse;

      return await this.repo.createQueryBuilder()
        .update()
        .set(_dto)
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) { throw err; }
  }

  async listQuestions(): Promise<any> {
    try {
      return this.repo.createQueryBuilder()
        .getMany();
    }
    catch (err) {
      throw err;
    }
  }

  async deleteQuestion(id: number) {
    try {

      //delete from allocate
      await this.hseAllocteQuestionRepo.createQueryBuilder()
      .delete()
      .where('question_id_fk = :qid', { qid: id})
      .execute();

      //delete from public checklist
      await this.hseChecklistQuestionRepo.createQueryBuilder()
      .delete()
      .where('question_id_fk = :qid', {qid: id})
      .execute();


      return await this.repo.createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }


  async createCheckList(dto: HSECreateChecklistDTO) {
    try {

      let code = new RandomNumber(100, 999).generate().toString();


      //check duplicates
      if (dto.environmentId) {
        const dup = await this.hseChecklistRepo.createQueryBuilder()
          .select()
          .where('environment_id_fk = :eid and enable = :status and type = :type', { eid: dto.environmentId, status: 1, type: dto.type }).getCount();

        if (dup > 0) {
          throw new HttpException('envrionment id does already have a public checklist', 400);
        }

        code = `80${code}`;
      }

      if (dto.jobsId) {
        const dup = await this.hseChecklistRepo.createQueryBuilder()
          .select()
          .where('jobs_id_fk = :jid and enable = :status and type = :type', { jid: dto.jobsId, status: 1, type: dto.type }).getCount();

        if (dup > 0) {
          throw new HttpException('job id does already have a public checklist', 400);
        }

        code = `10${code}`;
      }

      if (dto.vehicleTypeId) {
        const dup = await this.hseChecklistRepo.createQueryBuilder()
          .select()
          .where('vehicle_type_id_fk = :vid and enable = :status and type  = :type', { vid: dto.vehicleTypeId, status: 1, type: dto.type }).getCount();

        if (dup > 0) {
          throw new HttpException('vehicle type does already have a public checklist', 400);
        }

        code = `50${code}`;
      }




      //create checklist
      const checklist = await this.hseChecklistRepo.createQueryBuilder()
        .insert()
        .values([
          {
            group: dto.group,
            environment_id_fk: dto.environmentId,
            jobs_id_fk: dto.jobsId,
            vehicle_type_id_fk: dto.vehicleTypeId,
            enable: 0,
            code: +code,
            comment: dto.comment,
            type: dto.type,
            minimum_point: dto.minimumPoint
          }
        ])
        .execute();



      //insert questions
      for (let i = 0; i < dto.questions.length; i++) {
        await this.hseChecklistQuestionRepo.createQueryBuilder()
          .insert()
          .values([
            {
              checklist_id_fk: checklist.identifiers[0].id,
              question_id_fk: dto.questions[i].questionId,
              weight_factor: dto.questions[i].weight_factor,
              description: dto.questions[i].description,
              critical: dto.questions[i].critical
            }
          ])
          .execute();
      }

      return checklist;
    }
    catch (err) {
      throw err;
    }
  }

  async findAllCheckList():Promise<any> {
    try {
      const query = this.repo.createQueryBuilder( 't1')
        .leftJoinAndSelect('vehicle_type', 't2', 't1.vehicle_type_id_fk = t2.id')
        .leftJoinAndSelect('jobs', 't3', 't1.jobs_id_fk = t3.id')
        .select([
          't1.*',
          't3.title as job',
          't2.title as vehicleType'
        ]);

      const list = await query.getRawMany();

      for (let i = 0; i < list.length; i++) {
        const count = await this.hseChecklistQuestionRepo.createQueryBuilder()
          .where('checklist_id_fk = :cid', { cid: list[i].id })
          .getCount();
        list[i].questionCount = count;
      }

      return list;

    }
    catch (err) {
      throw err;
    }
  }



  async findCheckList(id: number): Promise<any> {
    try {
      const checklist = await this.hseChecklistRepo.createQueryBuilder()
        .where('id = :id', { id: id })
        .getOne();



      const questions = this.repo.createQueryBuilder( 't1')
        .leftJoinAndSelect('hse_checklist_question', 't3', 't1.id = t3.checklist_id_fk')
        .leftJoinAndSelect('hse_question', 't2', 't3.question_id_fk = t2.id')
        .select([
          't1.minimum_point as minimum_point',
          't2.id as id',
          't2.group as _group',
          't2.question as question',
          't2.id as questionId',
          't2.type as type',
          't2.code as code',
          't3.weight_factor as weight_factor',
          't3.critical as critical',
          't3.requirements as requirements',
          't3.description as description',
          't2.is_reverse as is_reverse'
        ])
        .groupBy('t2.id')
        .andWhere('t1.id = :id', { id: id });

      const questionsList = await questions.getRawMany();

      return {
        checklist: checklist,
        questions: questionsList
      }
    }
    catch (err) {
      throw err;
    }
  }

  async findTypesForHSE() {
    try{
      let vtypes = await this.hseChecklistRepo.createQueryBuilder()
      .where('not(vehicle_type_id_fk is null) and enable=1')
      .select(['vehicle_type_id_fk'])
      .getRawMany();



      vtypes = vtypes.map(item => {
        return item.vehicle_type_id_fk
      })

      let list = await this.vehicleService.findAllTypesForHSE(vtypes);
      return list;
    }
    catch(Err){
      throw Err;
    }
  }

  async findJobsForHSE() {
    try{
      let jobs = await this.hseChecklistRepo.createQueryBuilder()
      .where('not(jobs_id_fk is null) and enable = 1')
      .select(['jobs_id_fk'])
      .getRawMany();



      jobs = jobs.map(item => {
        return item.jobs_id_fk
      });

      const list = await this.jobsService.findAllJobsForHSE(jobs);

      return list;
    }
    catch(err){
      throw err;
    }
  }

  async updateChecklist(id: number, dto: HSEUpdateChecklistDTO) {
    try {
      const _dto: any = { ...dto };

      let questions = [];
      if (_dto.questions) {
        questions = _dto.questions;
        delete _dto.questions
      }

      if (questions.length > 0) {
        //delete previous questions
        await this.hseChecklistQuestionRepo.createQueryBuilder()
          .delete()
          .where('checklist_id_fk = :cid', { cid: id })
          .execute();

        //enter new questions
        for (let i = 0; i < questions.length; i++) {
          await this.hseChecklistQuestionRepo.createQueryBuilder()
            .insert()
            .values([
              {
                checklist_id_fk: id,
                question_id_fk: questions[i].questionId,
                weight_factor: questions[i].weight_factor,
                critical: questions[i].critical,
                requirements: questions[i].requirements,
                description: questions[i].description
              }
            ])
            .execute();
        }
      }


      if(_dto.jobsId) {
        _dto.jobs_id_fk = _dto.jobsId;
        delete _dto.jobsId;
      }

      if(_dto.personnelId) {
        _dto.personnel_id_fk = _dto.personnelId;
        delete _dto.personnelId;
      }

      if(_dto.environmentId) {
        _dto.environment_id_fk = _dto.environmentId;
        delete _dto.environmentId;
      }

      if(_dto.vehicleTypeId) {
        _dto.vehicle_type_id_fk = _dto.vehicleTypeId;
        delete _dto.vehicleTypeId;
      }

      if(_dto.minimumPoint) {
        _dto.minimum_point = _dto.minimumPoint;
        delete _dto.minimumPoint;
      }

      return await this.hseChecklistRepo.createQueryBuilder()
        .update()
        .set(_dto)
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async deleteChecklist(id: number) {
    try {
      return await this.hseChecklistRepo.createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async getQuestionByCode(code: string): Promise<HSEQuestion> {
    try {
      return await this.repo.createQueryBuilder()
        .select()
        .where('code = :code', { code: code })
        .getOne();
    }
    catch (err) {
      throw err;
    }
  }

  async copyQuestionsFromList(fromListId: number, toListId: number) {
    try {

    }
    catch (err) {
      throw err;
    }
  }

  async createAllocate(dto: HSECreateAllocateQuestion) {
    try {
      //delete previous
      for (let i = 0; i < dto.questionIds.length; i++) {
        //check if question is available
        const count = await this.repo.createQueryBuilder()
        .where('id = :id', { id: dto.questionIds[i]})
        .getCount();


        if(count > 0) {
          await this.hseAllocteQuestionRepo.createQueryBuilder()
          .delete()
          .where('question_id_fk = :qid and (personnel_id_fk = :pid or vehicle_id_fk=:vid or environment_id_fk=:eid)', {
            pid: dto.personnelId,
            qid: dto.questionIds[i],
            vid: dto.vehicleId,
            eid: dto.environmentId
          })
          .execute();

        //insert new questions
        await this.hseAllocteQuestionRepo.createQueryBuilder()
          .insert()
          .values([
            {
              question_id_fk: dto.questionIds[i],
              personnel_id_fk: dto.personnelId,
              vehicle_id_fk: dto.vehicleId,
              environment_id_fk: dto.environmentId,
              from_date: dto.fromDate,
              to_date: dto.toDate,
              weight_factor: dto.weightFactor,
              critical: dto.critical,
              requirements: dto.requirements,
              description: dto.description
            }
          ])
          .execute();
        }

      }
    }
    catch (err) {
      throw err;
    }
  }

  async updateAllocate(id: number, dto: HSEUpdateAllocateQuestion) {
    try {
      const _dto: any = {};
      for (let key in dto) {
        switch (key) {
          case 'questionId':
            _dto.question_id_fk = dto[key];
            break;
          case 'personnelId':
            _dto.personnel_id_fk = dto[key];
            break;
          case 'vehicleId':
            _dto.vehicle_id_fk = dto[key];
            break;
          case 'environmentId':
            _dto.environment_id_fk = dto[key];
            break;
          case 'toDate':
            _dto.to_date = dto[key];
            break;
          case 'fromDate':
            _dto.from_date = dto[key];
            break;
          case 'weightFactor':
            _dto.weight_factor = dto[key];
            break;
          default:
            _dto[key] = dto[key];
        }
      }
      return await this.hseAllocteQuestionRepo.createQueryBuilder()
        .update()
        .set(_dto)
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async deleteAllocate(id: number) {
    return await this.hseAllocteQuestionRepo.createQueryBuilder()
      .delete()
      .where('id = :id', { id: id })
      .execute();
  }

  async findAllocatesOf(personnelId?: number, vehicleId?: number, environmentId?: number): Promise<any[]> {
    try {
      let where = '';

      if (personnelId) {
        where = `personnel_id_fk=${personnelId}`;
      }
      else if (vehicleId) {
        where = `vehicle_id_fk=${vehicleId}`;
      }
      else if (environmentId) {
        where = `environment_id_fk=${environmentId}`
      }


      const list = createQueryBuilder(HSEAllocateQuestion, 't1')
        .leftJoinAndSelect('hse_question', 't2', 't1.question_id_fk=t2.id')
        .where(where)
        .select([
          't1.id as id',
          't1.from_date as from_date',
          't1.to_date as to_date',
          't1.weight_factor as weight_factor',
          't1.critical as critical',
          't1.requirements as requirements',
          't1.description as description',
          't2.question as question',
          't2.id as question_id_fk'
        ])
        .getRawMany();

      return list;
    }
    catch (err) {
      throw err;
    }
  }

  async getHSEQuestions(dto: HSEGetQuestionsDTO) {
    try {
      let commonQuestions = [];
      let exclusiveQuestions = [];

      if (dto.personnelId) {
        //get exclusive questions
        exclusiveQuestions = await this._getExQuestions(dto.personnelId, 'personnel');

        //TODO: common questions
      }

      if(dto.vehicleId) {
        exclusiveQuestions = await this._getExQuestions(dto.vehicleId, 'vehicle');
        commonQuestions = await this._getCommonQuestions(dto.vehicleId, 'vehicle');

      }



      return {
        commonQuestions: commonQuestions,
        exclusiveQuestions: exclusiveQuestions
      };
    }
    catch (err) {
      throw err;
    }
  }

  private _getExQuestions(id: number, type: string): Promise<any[]> {
    return new Promise(async (resolve, _) => {
      let list = [];
      if(type === 'personnel') {
        list = await await this.repo.createQueryBuilder( 't1')
        .leftJoinAndSelect('hse_question', 't2', 't1.question_id_fk = t2.id')
        .where('DATE(t1.from_date) <= :today and DATE(t1.to_date) >= :today and personnel_id_fk= :pid',
          {
            today: moment().utc(true).format('YYYY-MM-DD 00:00:00'),
            pid: id
          })
        .select([
          't1.question_id_fk as question_id',
          't1.weight_factor as weight_factor',
          't1.critical as critical',
          't1.requirements as requirements',
          't1.description as description',
          't2.group as _group',
          't2.question as question',
          't2.type as type',
          't2.code as code'
        ]).getRawMany();
      }
      else if(type === 'vehicle') {
        list = await await this.repo.createQueryBuilder('t1')
        .leftJoinAndSelect('hse_question', 't2', 't1.question_id_fk = t2.id')
        .where('DATE(t1.from_date) <= :today and DATE(t1.to_date) >= :today and vehicle_id_fk= :vid',
          {
            today: moment().utc(true).format('YYYY-MM-DD 00:00:00'),
            vid: id
          })
        .select([
          't1.question_id_fk as question_id',
          't1.weight_factor as weight_factor',
          't1.critical as critical',
          't1.requirements as requirements',
          't1.description as description',
          't2.group as _group',
          't2.question as question',
          't2.type as type',
          't2.code as code'
        ]).getRawMany();
      }
      else if(type === 'environment') {

      }

      resolve(list);
    });
  }

  private _getCommonQuestions(id: number, type: string): Promise<any> {
    return new Promise(async(resolve, _) => {
      //get type of vehicle
      const vehicle = await this.vehicleService.findAllWithSearch({ id: id});
      if(vehicle.length > 0){
        const list = createQueryBuilder(HSEChecklist, 't1')
        .leftJoinAndSelect('hse_checklist_question', 't2', 't1.id = t2.checklist_id_fk')
        .leftJoinAndSelect('hse_question', 't3', 't2.question_id_fk = t3.id')
        .where('t1.vehicle_type_id_fk = :vtid and t1.enable = :enable', {
          vtid: (vehicle[0] as any).type_id_fk,
          enable: 1
        })
        .select([
          't1.code as checklist_code',
          't2.weight_factor as weight_factor',
          't2.critical as critical',
          't2.requirements as requirements',
          't2.description as description',
          't3.id as question_id',
          't3.question as question',
          't3.group as _group',
          't3.type as type',
          't3.code as code'
        ])
        .getRawMany();
        resolve(list);
      }else {
        resolve([]);
      }
    });
  }

  async createAudit(userId: number, dto: CreateHSEAuditDTO):Promise<any> {
    try{
      const audit = await this.hseAuditRepo.createQueryBuilder()
      .insert()
      .values([
        {
          personnel_id_fk: dto.personnel_id_fk,
          vehicle_id_fk: dto.vehicle_id_fk,
          environment_id_fk: dto.environment_id_fk,
          troubleshooter_id_fk: dto.troubleshooter_id_fk,
          audit_date: dto.date,
          description: dto.description,
          operator_id_fk: userId,
          draft: 1,
          date: moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
          minimum_point: dto.minimumPoint
        }
      ])
      .execute();


      //insert questions
      const insertObjs = [];

      for(let i=0;i< dto.questions.length; i++) {
        const question = dto.questions[i];
        insertObjs.push({
          audit_id_fk: audit.identifiers[0].id,
          question: question.question ,
          question_id_fk: question.questionId,
          answer: question.isNotRelated === true ? null :  question.answer,
          critical: question.critical,
          weight_factor: question.weight_factor,
          requirements: question.requirements,
          description: question.description,
          group: question.group,
          type: question.type,
          code: question.code,
          is_not_related: question.isNotRelated,
          operator_description: question.operatorDescription,
          is_reverse: question.isReverse
        });
      }

      if(insertObjs.length>0) {
        await this.hseAuditQuestionRepo.createQueryBuilder()
        .insert()
        .values(insertObjs)
        .execute();
      }

      return audit;
    }
    catch(err) {
      throw err;
    }
  }

  async updateHse(id: number, userId: number, dto: CreateHSEAuditDTO): Promise<any> {
    try{
      //check if draft is true
      const hse = await this.hseAuditRepo.createQueryBuilder()
      .where('id = :id', { id: id})
      .getOne();

      if(hse.draft == 0) {
        throw new HttpException('hse is finalized and could not be edited', 400);
      }

      const _dto:any = {
        personnel_id_fk: dto.personnel_id_fk,
        vehicle_id_fk: dto.vehicle_id_fk,
        environment_id_fk: dto.environment_id_fk,
        troubleshooter_id_fk: dto.troubleshooter_id_fk,
        audit_date: dto.date,
        description: dto.description,
        operator_id_fk: userId,
        draft: dto.draft
      }
      //update hse
      await this.hseAuditRepo.createQueryBuilder()
      .update()
      .set(_dto)
      .where('id = :id', { id: id })
      .execute();

      //delete questions of hse
      await this.hseAuditQuestionRepo.createQueryBuilder()
      .delete()
      .where('audit_id_fk = :aid', { aid: id })
      .execute();

      const insertObjs = [];

      for(let i=0;i< dto.questions.length; i++) {
        const question = dto.questions[i];
        insertObjs.push({
          audit_id_fk: id,
          question: question.question,
          question_id_fk: question.questionId,
          answer: question.isNotRelated == true ? null : question.answer,
          critical: question.critical,
          weight_factor: question.weight_factor,
          requirements: question.requirements,
          description: question.description,
          group: question.group,
          type: question.type,
          code: question.code,
          is_not_related: question.isNotRelated,
          operator_description: question.operatorDescription,
          is_reverse: question.isReverse
        });
      }

      if(insertObjs.length>0) {
        await this.hseAuditQuestionRepo.createQueryBuilder()
        .insert()
        .values(insertObjs)
        .execute();
      }
    }
    catch(err) {
      throw err;
    }
  }

  async findHse(id: number, userId: number) : Promise<any> {
    try{
      const hse = await this.hseAuditRepo.createQueryBuilder('t1')
      .leftJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
      .leftJoinAndSelect('vehicle', 't3','t1.vehicle_id_fk = t3.id')
      .leftJoinAndSelect('personnel', 't4', 't1.operator_id_fk = t4.id')
      .where('t1.id = :id', { id: id})
      .select([
        't1.id as id',
        't1.personnel_id_fk as personnel_id_fk',
        't1.vehicle_id_fk as vehicle_id_fk',
        't1.environment_id_fk as environment_id_fk',
        't1.audit_date as audit_date',
        't1.minimum_point as minimum_point',
        't1.description as description',
        't1.date as date',
        't1.draft as draft',
        't2.image_url as image_url',
        't2.first_name as first_name',
        't2.last_name as last_name',
        't2.national_number as national_number',
        't3.organization_code as organization_code',
        't3.plaque1 as plaque1',
        't3.plaque2 as plaque2',
        't3.plaque3 as plaque3',
        't3.plaque4 as plaque4',
        't4.first_name as operator_first_name',
        't4.last_name as operator_last_name'
      ])
      .getRawOne();

      const questions = await this.hseAuditQuestionRepo.createQueryBuilder()
      .where('audit_id_fk = :aid', { aid: id })
      .getMany();

      return {
        audit: hse,
        questions: questions
      };
    }
    catch(err){
      throw err;
    }
  }

  async listMyHSE(userId: number): Promise<any> {
    try{
      const list =  await this.hseAuditRepo.createQueryBuilder( 't1')
      .leftJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
      .leftJoinAndSelect('vehicle', 't3','t1.vehicle_id_fk = t3.id')
      .leftJoinAndSelect('personnel', 't4', 't1.operator_id_fk = t4.id')
      .leftJoinAndSelect('vehicle_system', 't5', 't3.system_id_fk = t5.id')
      .leftJoinAndSelect('vehicle_type', 't6', 't3.type_id_fk = t6.id')
      .leftJoinAndSelect('vehicle_style', 't7', 't3.style_id_fk = t7.id')
      .where('t1.operator_id_fk = :pid', { pid: userId})
      .select([
        't1.id as id',
        't1.audit_date as audit_date',
        't1.description as description',
        't1.date as date',
        't1.draft as draft',
        't1.minimum_point as minimum_point',
        't2.first_name as first_name',
        't2.last_name as last_name',
        't2.national_number as national_number',
        't3.organization_code as organization_code',
        't3.plaque1 as plaque1',
        't3.plaque2 as plaque2',
        't3.plaque3 as plaque3',
        't3.plaque4 as plaque4',
        't3.color as color',
        't5.title as system',
        't6.title as type',
        't4.first_name as operator_first_name',
        't4.last_name as operator_last_name',
        't4.id as operator_id',
        't7.title as style',
        't7.id as style_id_fk'
      ])
      .getRawMany();

      for(let i=0;i<list.length;i++) {
        const item = list[i];
        if(item.draft === 0) {
          //must calculate questions
          const questions = await this.hseAuditQuestionRepo.createQueryBuilder()
          .where('audit_id_fk = :aid',  { aid: item.id})
          .getMany();
          let userTotalPoint = 0;
          let auditTotalPoint = 0;
          let isCritical = false;
          questions.forEach(question => {
            if(question.answer) {
              const criticals = question.critical.split(',');
              if(criticals.indexOf(question.answer) > -1) {
                isCritical = true;
              }
              else {
                userTotalPoint += Number(parseInt(question.answer) * question.weight_factor);
                auditTotalPoint += Number(4 * question.weight_factor);
              }
            }
          });
          const percentage = (userTotalPoint/auditTotalPoint) * 100 ;
          if(isCritical) {
            item.percentage = null;
            item.permit = false;
          }
          else {
            item.percentage = isCritical ? null : percentage;
            item.permit =  percentage > item.minimum_point? true : false;
          }
          isCritical = false;
        }
      }
      return list;
    }
    catch(err){
      throw err;
    }
  }

  async deleteAudit(id:number, userId:number) {
    try{
      return await this.hseAuditRepo.createQueryBuilder()
      .delete()
      .where('id = :id and draft = :draft and operator_id_fk = :oid', { id: id, draft: 1, oid: userId})
      .execute();
    }
    catch(err) {
      throw err;
    }
  }
}
