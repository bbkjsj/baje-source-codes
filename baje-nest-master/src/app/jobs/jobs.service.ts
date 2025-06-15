import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateJobChartNodeDTO } from './dto/create-job-chart-node.dto';
import { CreateJobChartDTO } from './dto/create-job-chart.dto';
import { CreateJobPermissionDTO } from './dto/create-job-permission.dto';
import { CreateJobTaminCodeDTO } from './dto/create-job-tamincode.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateJobsShiftDTO } from './dto/create-jobs-shift.dto';
import { JobTitleDTO } from './dto/job-title.dto';
import { UpdateJobChartNodeDTO } from './dto/update-job-chart-node.dto';
import { UpdateJobChartDTO } from './dto/update-job-chart.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateJobsShiftDTO } from './dto/update-jobs-shift.dto';
import { IJob } from './responses/job.interface';
import { Job } from './schemas/job.schema';
import { JobChart } from './schemas/job_chart.schema';
import { JobChartNode } from './schemas/job_chart_node.schema';
import { JobPermission } from './schemas/job_permission.schema';
import { JobsShift } from './schemas/job_shift.schema';
import { JobsShiftPattern } from './schemas/job_shift_pattern.schema';
import { JobsTaminCode } from './schemas/job_tamin_code.schema';
import { PersonnelShift } from "../personnel/schemas/personnel-shift.schema";

@Injectable()
export class JobsService {

  constructor(@InjectRepository(Job) private readonly repo: Repository<Job>,
    @InjectRepository(JobPermission) private readonly jobPermissionRepo: Repository<JobPermission>,
    @InjectRepository(JobsTaminCode) private readonly jobTaminCodeRepo: Repository<JobsTaminCode>,
    @InjectRepository(JobsShift) private readonly jobShiftRepo: Repository<JobsShift>,
    @InjectRepository(JobsShiftPattern) private readonly jobShiftPatternRepo: Repository<JobsShiftPattern>,
    @InjectRepository(JobChart) private readonly jobChartRepo: Repository<JobChart>,
    @InjectRepository(JobChartNode) private readonly jobChartNodeRepo: Repository<JobChartNode>,
              @InjectRepository(PersonnelShift)
              private readonly personnelShiftRepo: Repository<PersonnelShift>
  ) { }

  async create(dto: CreateJobDto) {
    try {
      const dups = await this.repo.createQueryBuilder()
        .where('title = :title', { title: dto.title })
        .getCount();

      if (dups === 0) {
        await this.repo.createQueryBuilder()
          .insert()
          .values([
            {
              ...dto,
              status: 1
            }
          ])
          .execute();
      }
      else {
        throw new HttpException(`${dto.title} already exists`, 400);
      }
    }
    catch (err) {
      throw err;
    }
  }

  async findAll(params?: any) {
    if (params.page && params.size) {
      const list: Job[] = await this.repo.createQueryBuilder()
        .take(params.size)
        .skip(params.page)
        .getMany();
      const total = await this.repo.createQueryBuilder()
        .getCount();

      return {
        list: list,
        total: total
      }
    }

    return await this.repo.createQueryBuilder()
      .where('status = :status', { status: 1 })
      .getMany();
  }

  async findAllJobsForHSE(ids: number[]) {
    try {
      if (ids.length == 0) {
        return await this.repo.createQueryBuilder()
          .getMany();
      }
      else {
        return await this.repo.createQueryBuilder()
          .where('not(id in (:...arr))', { arr: ids })
          .getMany();
      }

    }
    catch (err) {
      throw err;
    }
  }

  async findOne(id: number): Promise<Job> {
    try {
      return await this.repo.createQueryBuilder()
        .where('id = :id', { id: id })
        .getOne();
    }
    catch (err) {
      throw err;
    }
  }

  async update(id: number, dto: UpdateJobDto) {
    try {
      return await this.repo.createQueryBuilder()
        .update()
        .set(dto)
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      return await this.repo.createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async createPermission(dto: CreateJobPermissionDTO) {
    try {
      const values = [];

      //check if job id is valid
      const valid = await this.repo.createQueryBuilder()
        .where('id = :id', { id: dto.jobId })
        .getCount();

      if (valid > 0) {
        //delete previous
        await this.jobPermissionRepo.createQueryBuilder()
          .delete()
          .where('jobs_id_fk = :id', { id: dto.jobId })
          .execute();


        for (let i = 0; i < dto.accessIds.length; i++) {
          values.push({
            jobs_id_fk: dto.jobId,
            accessId: dto.accessIds[i]
          });
        }

        await this.jobPermissionRepo.createQueryBuilder()
          .insert()
          .values(values)
          .execute();
      }
      else {
        throw new HttpException('job id is not valid', 400);
      }
    }
    catch (err) {
      throw err;
    }
  }

  async findPermissions(jobId: number): Promise<JobPermission[]> {
    const select: SelectQueryBuilder<JobPermission> = this.jobPermissionRepo.createQueryBuilder('jobPermission')
    .innerJoinAndSelect('access', 'access', 'access.id = jobPermission.access_id_fk')
    .where('jobPermission.jobs_id_fk = :jobId', {
      jobId: jobId
    })
    .select([
      'jobPermission.id as id',
      'jobPermission.jobs_id_fk as jobId',
      'access.name as access',
      'access.code as accessCode',
      'access.id as accessId'
    ]);

    return await select.getRawMany();
  }

  async createJobTaminCode(dto: CreateJobTaminCodeDTO) {
    try {

      const valid = await this.repo.createQueryBuilder()
        .where('id = :id', { id: dto.jobId })
        .getCount();

      if (valid > 0) {
        //delete previous tamin codes.
        await this.jobTaminCodeRepo.createQueryBuilder()
          .delete()
          .where('jobs_id_fk = :jid', { jid: dto.jobId })
          .execute();

        const values = [];
        for (let i = 0; i < dto.codes.length; i++) {
          values.push({
            jobs_id_fk: dto.jobId,
            code: dto.codes[i]
          });
        }
        await this.jobTaminCodeRepo.createQueryBuilder()
          .insert()
          .values(values)
          .execute();
      }
      else {
        throw new HttpException('job id is not valid', 400);
      }
    }
    catch (err) {
      throw err;
    }
  }

  async findTaminCodes(jobId: number): Promise<JobsTaminCode[]> {
    try {
      return await this.jobTaminCodeRepo.createQueryBuilder( 't1')
        .leftJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
        .where('t1.jobs_id_fk = :jid', { jid: jobId })
        .select([
          't1.id as id',
          't1.jobs_id_fk as jobs_id_fk',
          't1.code as code',
          't2.title as title'
        ])
        .getRawMany();
    }
    catch (err) {
      throw err;
    }
  }

  async createJobsShift(dto: CreateJobsShiftDTO) {
    try {

      const shift = await this.jobShiftRepo.createQueryBuilder()
        .insert()
        .values([
          {
            title: dto.title,
            enabled: dto.enabled == true ? 1:0,
            time_off_days: dto.numberOfTimeOffDays,
            timespan: dto.timespan,
            calculate_public_holidays: dto.calculatePublicHolidays==true ? 1:0,
            calculate_extra_work: dto.calculateExtraWork == true ? 1:0,
            calculate_off_work: dto.calculateOffWork == true ? 1 : 0,
            calculate_friday: dto.calculateFriday==true?1:0,
            calculate_night: dto.calculateNight==true?1:0,
            public_holidays_are_off: dto.publicHolidaysAreOff==true?1:0,

          }
        ])
        .execute();

      const values = [];
      for (let i = 0; i < dto.patterns.length; i++) {
        values.push({
          shift_id_fk: shift.identifiers[0].id,
          status: dto.patterns[i].status,
          days: dto.patterns[i].days,
          from_time: dto.patterns[i].from,
          to_time: dto.patterns[i].to
        })
      }

      await this.jobShiftPatternRepo.createQueryBuilder()
        .insert()
        .values(values)
        .execute();

      return shift;


    }
    catch (err) {
      throw err;
    }
  }

  async updateJobShift(id: number, dto: UpdateJobsShiftDTO) {
    try {
      const _dto: any = {};

      if (dto.title) {
        _dto.title = dto.title;
      }

      if (dto.enabled) { _dto.enabled = dto.enabled };
      if (dto.numberOfTimeOffDays) { _dto.time_off_days = dto.numberOfTimeOffDays };
      if (dto.timespan) { _dto.timespan = dto.timespan };
      if (dto.calculatePublicHolidays) { _dto.calculate_public_holidays = dto.calculatePublicHolidays };
      if (dto.calculateExtraWork) { _dto.calculate_extra_work = dto.calculateExtraWork };
      if (dto.publicHolidaysAreOff) { _dto.public_holidays_are_off = dto.publicHolidaysAreOff };
      if (dto.calculateNight) { _dto.calculate_night = dto.calculateNight };
      if (dto.calculateFriday) { _dto.calculate_friday = dto.calculateFriday };

      await this.jobShiftRepo.createQueryBuilder()
        .update()
        .where('id = :id', { id: id })
        .set(_dto)
        .execute();

      if (dto.patterns) {


        //delete previous
        await this.jobShiftPatternRepo.createQueryBuilder()
          .delete()
          .where('shift_id_fk = :sid', { sid: id })
          .execute();


        const values = [];

        for (let i = 0; i < dto.patterns.length; i++) {
          values.push({
            shift_id_fk: id,
            status: dto.patterns[i].status,
            days: dto.patterns[i].days,
            from_time: dto.patterns[i].from,
            to_time: dto.patterns[i].to
          })
        }

        await this.jobShiftPatternRepo.createQueryBuilder()
          .insert()
          .values(values)
          .execute();
      }

    }
    catch (err) {
      throw err;
    }
  }

  async deleteJobShift(id: number) {
    try {
      await this.jobShiftRepo.createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();

      await this.jobShiftPatternRepo.createQueryBuilder()
        .delete()
        .where('shift_id_fk = :jid', { jid: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async findAllShifts() {
    try {
      const shifts: any[] = await await this.jobShiftRepo.createQueryBuilder().getMany();
      for (let i = 0; i < shifts.length; i++) {
        const patterns: any = await this.jobShiftPatternRepo.createQueryBuilder().where('shift_id_fk= :sid', { sid: shifts[i].id }).getMany();


        shifts[i].patterns = patterns;
      }
      return shifts;
    }
    catch (err) {
      throw err;
    }
  }

  async shiftDetails(id: number) {
    try {
      const shift = await this.jobShiftRepo.createQueryBuilder()
        .where('id = :id', { id: id })
        .getOne();

      const patterns = await this.jobShiftPatternRepo.createQueryBuilder()
        .where('shift_id_fk = :sid', { sid: id })
        .getMany();



      return {
        shift: shift,
        patterns: patterns
      }
    }
    catch (err) {
      throw err;
    }
  }

  async jobTitle(dto: JobTitleDTO) {
    try {
      const output: any = {};
      const jobs: any = await this.jobTaminCodeRepo.createQueryBuilder( 't1')
        .leftJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
        .where('t1.code IN (:...code)', { code: dto.codes })
        .select([
          't1.code as code',
          't2.title as title'
        ])
        .getRawMany();


      jobs.forEach(item => {
        output[`${item.code}`] = item.title
      });

      return output;
    }
    catch (err) {
      throw err;
    }
  }

  async createJobChart(dto: CreateJobChartDTO) {
    try {
      const _dto: any = { ...dto };
      delete _dto.nodes;
      const jobChart = await this.jobChartRepo.createQueryBuilder()
        .insert()
        .values([_dto])
        .execute();


      if (dto.nodes != null && dto.nodes.length > 0) {
        await this._insertNodes(dto.nodes, jobChart.identifiers[0].id, jobChart.identifiers[0].id);
      }
      return jobChart;
    }
    catch (err) {
      throw err;
    }
  }

  private _insertNodes = (async (nodes, parentId, chartId) => {
    try {
      for (let i = 0; i < nodes.length; i++) {
        const node: any = nodes[i];
        const newNode = await this.jobChartNodeRepo.createQueryBuilder()
          .insert()
          .values([
            {
              parent_id_fk: parentId != chartId ? parentId : null,
              title: node.title,
              jobs_tamin_code_id_fk: node.jobs_tamin_code_id_fk,
              count: node.count,
              chart_id_fk: chartId
            }
          ])
          .execute();

        if (node.nodes != null && node.nodes.length > 0) {
          await this._insertNodes(node.nodes, newNode.identifiers[0].id, chartId);
        }
      }
    }
    catch (err) {
      throw err;
    }
  })

  async updateJobChart(id: number, dto: UpdateJobChartDTO) {
    try {
      const _dto:any = dto;
      _dto.enable = dto.enable == true ? 1 : 0;
      return await this.jobChartRepo.createQueryBuilder()
        .update()
        .set(_dto)
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async updateJobChartNode(id: number, dto: UpdateJobChartNodeDTO) {
    try {
      return await this.jobChartNodeRepo.createQueryBuilder()
        .update()
        .set(dto)
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async listOfCharts() {
    try {
      return await this.jobChartRepo.createQueryBuilder()
        .select()
        .getMany();
    }
    catch (err) {
      throw err;
    }
  }

  async chartDetail(id: number) {
    try {
      const chart: any = await this.jobChartRepo.createQueryBuilder()
        .where('id = :id', { id: id })
        .getOne();

      if (chart) {
        const nodes = await this.jobChartNodeRepo.createQueryBuilder()
          .where('chart_id_fk = :cid', { cid: id })
          .getMany();


        chart.nodes = this.makeTree(nodes, null);
        return chart;
      }
      else {
        throw new HttpException('chart not found', 400);
      }
    }
    catch (err) {
      throw err;
    }
  }

  async deleteNodeChart(id:number) {
    try{
      await this.jobChartNodeRepo.createQueryBuilder()
      .delete()
      .where('id = :id', {id: id})
      .execute();

      await this.jobChartNodeRepo.createQueryBuilder()
      .delete()
      .where('parent_id_fk = :id', { id: id})
      .execute();
    }
    catch(err){
      throw err;
    }
  }

  async deleteChart(id:number) {
    try{
      await this.jobChartRepo.createQueryBuilder()
      .delete()
      .where('id = :id', { id: id})
      .execute();

      await this.jobChartNodeRepo.createQueryBuilder()
      .delete()
      .where('chart_id_fk = :cid', { cid: id})
      .execute();
    }
    catch(err){
      throw err;
    }
  }


  async addChildToNode(nodeId: number, child: CreateJobChartNodeDTO) {
    try{
      const node = await this.jobChartNodeRepo.createQueryBuilder()
      .where('id = :id', {id: nodeId})
      .getOne();

      if(node){
        return await this.jobChartNodeRepo.createQueryBuilder()
        .insert()
        .values([
          {
            count: child.count,
            jobs_tamin_code_id_fk: child.jobs_tamin_code_id_fk,
            title: child.title,
            parent_id_fk: nodeId,
            chart_id_fk: node.chart_id_fk
          }
        ])
        .execute();
      }
      else {
        throw new HttpException('node could not be found', 400);
      }
    }
    catch(err) {
      throw err;
    }
  }

  async findPersonnelShift(personnelId: number) {
    try{
      const list = await this.personnelShiftRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('jobs_shift', 't2', 't1.jobs_shift_id_fk = t2.id')
      .where('t1.personnel_id_fk = :pid', { pid: personnelId})
      .select([
        't2.*',
        't1.start_date as start_date',
        't1.end_date as end_date'
      ])
      .getRawMany();

      return list;
    }
    catch(err) {
      throw err;
    }
  }

  async regenerateFromExistingChart(id: number) {
    try{
      const chart = await this.jobChartRepo.createQueryBuilder()
      .where('id = :id', { id: id})
      .getOne();

      if(chart) {
        const chartNodes = await this.jobChartNodeRepo.createQueryBuilder()
        .where('chart_id_fk = :cid', { cid: chart.id})
        .getMany();


        //insert new chart
        const _newChart:any = chart;
        delete _newChart.id;

        const newChart = await this.jobChartRepo.createQueryBuilder()
        .insert()
        .values([
          _newChart
        ])
        .execute();

        const addedNodes = [];

        for(let i=0;i<chartNodes.length;i++) {
          const node:any= chartNodes[i];

          let newNode = null;

          if(node.parent_id_fk == null) {
            //delete node.id;
            let nId = node.id;
            delete node.id;
            node.chart_id_fk = newChart.identifiers[0].id;

            newNode = await this.jobChartNodeRepo.createQueryBuilder()
            .insert()
            .values([{...node}])
            .execute();

            addedNodes.push({
              oldId: nId,
              oldParentId: node.parent_id_fk,
              newId: newNode.identifiers[0].id
            });

          }
          else {
            const found = addedNodes.find(x=> x.oldId === node.parent_id_fk);

            if(found) {
              newNode = await this.jobChartNodeRepo.createQueryBuilder()
              .insert()
              .values([
                {
                  chart_id_fk: newChart.identifiers[0].id,
                  title: node.title,
                  parent_id_fk: found.newId,
                  count: node.count,
                  jobs_tamin_code_id_fk: node.jobs_tamin_code_id_fk
                }
              ])
              .execute();

              addedNodes.push({
                oldId: node.id,
                oldParentId: node.parent_id_fk,
                newId: newNode.identifiers[0].id
              });
            }
            else {

            }
          }
          newNode = null;
        }

        return newChart;
      }
      else {
        throw new HttpException('chart could not be found', 400);
      }
    }
    catch(err) {
      throw err;
    }
  }

  async findJobInCompanyChart(jobId: number) {
    try{
      return await this.jobChartNodeRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('jobs_chart', 't2', 't1.chart_id_fk = t2.id')
      .innerJoinAndSelect('company', 't3', 't2.company_id_fk = t3.id')
      .innerJoinAndSelect('jobs_tamin_code', 't4', 't1.jobs_tamin_code_id_fk = t4.id')
      .innerJoinAndSelect('jobs', 't5', 't4.jobs_id_fk = t5.id')
      .groupBy('t3.id')
      .where('t4.jobs_id_fk = :id', { id: jobId})
      .select([
        't3.id as id',
        't3.name as title'
      ])
      .getRawMany();
    }
    catch(err){throw err;}
  }

  async getJobsByAccessCode(code: string) {
    const selectQuery: SelectQueryBuilder<JobPermission> =
      this.jobPermissionRepo.createQueryBuilder('jobPermission')
      .innerJoinAndSelect('access', 'access', 'jobPermission.access_id_fk = access.id')
      .innerJoinAndSelect('jobs', 'jobs', 'jobPermission.jobs_id_fk = jobs.id')
      .where('access.code = :code', {
        code: code
      })
      .select([
        'jobs.id as id',
        'jobs.title as title'
      ]);

      const result: IJob[] = await selectQuery.getRawMany();

      return result;
  }

  private makeTree = ((nodes, parentId) => {
    return nodes
    .filter((node) => node.parent_id_fk === parentId)
    .reduce(
      (tree, node) => [
        ...tree,
        {
          ...node,
          nodes: this.makeTree(nodes, node.id),
        },
      ],
      [],
    )
  })
}

