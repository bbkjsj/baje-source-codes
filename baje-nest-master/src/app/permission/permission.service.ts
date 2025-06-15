import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enums/roles.enum';
import { IsNull, Not, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { IAccess } from '../access/interfaces/access.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private readonly repo: Repository<Permission>,
    private readonly accessService: AccessService
  ) { }

  async create(personnelId: number, dto: CreatePermissionDto) {
    const insertData = [];
    dto.data.forEach((person) => {
      person.access.forEach(access => {
        const _insert: any = {
          personnelId: personnelId,
          contractId: person.contractId,
          companyId: person.companyId,
          access: access.toString(),
        };
        insertData.push(_insert);
      });
    });
    return await this.repo.insert(insertData);
  }

  async findAll(personId: number) {
    return await this.repo.find({
      where: {
        personnelId: personId,
        companyId: Not(IsNull())
      },
    });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id: id } });
  }

  async update(personnelId: number, dto: UpdatePermissionDto) {
    //delete previous
    await this.repo
      .createQueryBuilder()
      .delete()
      .where('personnel_id_fk = :pid', { pid: personnelId })
      .execute();

    const insertData = [];
    dto.data.forEach((person) => {
      person.access.forEach(access => {
        const _insert: any = {
          personnelId: personnelId,
          contractId: person.contractId,
          companyId: person.companyId,
          access: access.toString(),
        };
        insertData.push(_insert);
      })
    });

    return await this.repo.insert(insertData);
  }

  async getAllPermissions(): Promise<IAccess[]> {
    return await this.accessService.getAllAccess();
  }
}
