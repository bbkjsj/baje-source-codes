import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Personnel } from "../personnel/schemas/personnel.schema";
import { IsNull, Not, Repository, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm";
import { FamilySchema } from "./schemas/family.schema";
import { FamilyRelation } from "../../common/enums/family-relation.enum";
import { IRelative } from "./interfaces/relative.interface";
import { v4 as v4uuid } from "uuid";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class FamilyService {
  
  constructor(
    @InjectRepository(Personnel)
    private readonly personnelRepository: Repository<Personnel>,
    
    @InjectRepository(FamilySchema)
    private readonly familyRepository: Repository<FamilySchema>
  ) {
  }

  async create(args: {
    personnelNationalId: string;
    relation: FamilyRelation;
    fatherNationalId?: string;
    motherNationalId?: string;
    spouseNationalId?: string;
    brotherNationalId?: string;
    sisterNationalId?: string;
    sameFather?: boolean;
    sameMother?: boolean;
    syncMother?: boolean;
  }): Promise<void> {

    if(args.sameFather === null) {
      args.sameFather = true;
    }

    if(args.sameMother === null) {
      args.sameMother = true;
    }


    const person: Personnel = await this.personnelRepository.findOne({
      where: {
        national_number: args.personnelNationalId
      }
    });

    if(!person) {
      throw new HttpException(`Person could not be found with this national Id: ${args.personnelNationalId}`, 400);
    }

    let fatherPerson: Personnel = null;
    let motherPerson: Personnel = null;
    let father: IRelative = null;
    let mother: IRelative = null;
    let brotherPerson: Personnel = null;
    let sisterPerson: Personnel = null;
    let spousePerson: Personnel = null;
    let spouse: IRelative = null;

    if(args.fatherNationalId) {
      fatherPerson = await this.personnelRepository.findOne({
        where: {
          national_number: args.fatherNationalId
        }
      });
    }

    if(args.motherNationalId) {
      motherPerson = await this.personnelRepository.findOne({
        where: {
          national_number: args.motherNationalId
        }
      })
    }

    if(args.spouseNationalId) {
      spousePerson = await this.personnelRepository.findOne({
        where: {
          national_number: args.spouseNationalId
        }
      });

      if(!spousePerson) {
        throw new HttpException('Spouce could not be found.', 400);
      }

      spouse = {
        id: spousePerson.id,
        firstName: spousePerson.first_name,
        lastName: spousePerson.last_name,
        nationalId: spousePerson.national_number,
        relation: FamilyRelation.SPOUSE,
        insuranceNumber: spousePerson.insurance_number
      };
    }

    if(args.brotherNationalId) {
      brotherPerson = await this.personnelRepository.findOne({
        where: {
          national_number: args.brotherNationalId
        }
      });

      father = await this.findFather([
        args.personnelNationalId,
        args.brotherNationalId
      ]);

      mother = await this.findMother([
        args.personnelNationalId,
        args.brotherNationalId
      ]);
    }

    if(args.sisterNationalId) {
      sisterPerson = await this.personnelRepository.findOne({
        where: {
          national_number: args.sisterNationalId
        }
      });

      father = await this.findFather([
        args.personnelNationalId,
        args.sisterNationalId
      ]);

      mother = await this.findMother([
        args.personnelNationalId,
        args.sisterNationalId
      ]);
    }

    if(
      !father && !fatherPerson &&
      !mother && !motherPerson &&
      !sisterPerson && !brotherPerson &&
      !spouse && !spousePerson
    ) {
      throw new HttpException('Could not find any relative.', 400);
    }


    const familyEntity: FamilySchema = await this.familyRepository.findOne({
      where: {
        personnelId: person.id
      }
    });

    if(familyEntity) {
      if(father || fatherPerson) {
        familyEntity.fatherId = father?.id || fatherPerson?.id;
      }

      if(mother || motherPerson) {
        familyEntity.motherId =  mother?.id || motherPerson?.id;
      }


      if(spousePerson) {
        // should get current person spouses
        const spouseEntities: FamilySchema[] = await this.familyRepository.find({
          where: {
            personnelId: person.id,
            spouseId: Not(IsNull())
          }
        });

        const spouseIds: number[] = spouseEntities.map(entity => {
          return entity.spouseId
        });

        if(spouseIds.indexOf(spousePerson.id) === -1) {
          const familySchema: FamilySchema = new FamilySchema(person.id, null, null, spousePerson.id);
          await this.familyRepository.save(familySchema);
        }
      }

      familyEntity.sameFather = args.sameFather;
      familyEntity.sameMother = args.sameMother;

      await this.familyRepository.save(familyEntity);

    }
    else {
      const duplicate = await this.familyRepository.findOne({
        where: {
          personnelId: person.id,
          fatherId: father?.id || fatherPerson?.id,
          motherId: mother?.id || motherPerson?.id
        }
      });

      if(!duplicate) {

        const entity: FamilySchema = new FamilySchema(person.id, null, null, null);

        if(fatherPerson) {
          entity.fatherId = fatherPerson.id;
        }

        if(motherPerson) {
          entity.motherId = motherPerson.id;
        }

        if(spousePerson) {
          entity.spouseId = spousePerson.id;
        }

        entity.sameMother = args.sameMother;
        entity.sameFather = args.sameFather;

        await this.familyRepository.save(entity);
      }
    }

    // repair old data
    if(sisterPerson || brotherPerson) {
      await this.syncBrotherSister({
        personEntity: person,
        brotherNationalId: brotherPerson?.national_number,
        sisterNationalId: sisterPerson?.national_number,
      });
    }
    else if(fatherPerson || motherPerson) {
      await this.syncFatherMother({
        personEntity: person,
        fatherEntity: fatherPerson,
        motherEntity: motherPerson,
        syncMother: args.syncMother
      });
    }
    else if(spousePerson) {
      await this.syncSpouse({
        personEntity: person,
        spouseEntity: spousePerson
      });
    }
  }

  async getPersonFamily(personnelNationalId: string): Promise<any> {

    const person: Personnel = await this.personnelRepository.findOne({
      where: {
        national_number: personnelNationalId
      }
    });

    const father = await this.findFather([personnelNationalId]);
    const mother = await this.findMother([personnelNationalId]);
    const brothers = await this.findBrothers(person.id);
    const sisters = await this.findSisters(person.id);
    const children: IRelative[] = await this.findChildren(person.id);
    const spouse: IRelative[] = await this.findSpouse(person.id);

    return {
      person: {
        id: person.id,
        firstName: person.first_name,
        lastName: person.last_name,
        nationalId: person.national_number
      },
      father: father,
      mother: mother,
      spouse: spouse,
      children: children,
      brothers: brothers,
      sisters: sisters
    };
  }


  private async findFather(nationalIds: string[]): Promise<IRelative | undefined> {
    const ids = await this.personnelRepository.createQueryBuilder('personnel')
      .where('national_number IN(:...nationalNumbers)', {
        nationalNumbers: nationalIds
      })
      .select([
        'personnel.id as id'
      ])
      .getRawMany();



    const fatherEntity = await this.familyRepository.createQueryBuilder('family')
      .innerJoinAndSelect('personnel', 'personnel', 'family.father_id_fk = personnel.id')
      .where('personnel_id_fk in (:...ids)', {
        ids: ids.map(item => item.id)
      })
      .andWhere('not(father_id_fk is null)')
      .select([
        'personnel.first_name as firstName',
        'personnel.last_name as lastName',
        'personnel.national_number as nationalId',
        'family.father_id_fk as fatherId',
        'personnel.insurance_number as insuranceNumber'
      ])
      .getRawOne();

    if(!fatherEntity) {
      return null;
    }

    return {
      id: fatherEntity.fatherId,
      firstName: fatherEntity.firstName,
      lastName: fatherEntity.lastName,
      nationalId: fatherEntity.nationalId,
      relation: FamilyRelation.FATHER,
      insuranceNumber: fatherEntity.insuranceNumber
    };
  }

  private async findMother(nationalIds: string[]): Promise<IRelative> {
    const ids = await this.personnelRepository.createQueryBuilder('personnel')
      .where('national_number IN(:...nationalNumbers)', {
        nationalNumbers: nationalIds
      })
      .select([
        'personnel.id as id'
      ])
      .getRawMany();

    const motherEntity = await this.familyRepository.createQueryBuilder('family')
      .innerJoinAndSelect('personnel', 'personnel', 'family.mother_id_fk = personnel.id')
      .where('personnel_id_fk in (:...ids)', {
        ids: ids.map(item => item.id)
      })
      .andWhere('not(mother_id_fk is null)')
      .select([
        'personnel.first_name as firstName',
        'personnel.last_name as lastName',
        'personnel.national_number as nationalId',
        'family.mother_id_fk as motherId',
        'personnel.insurance_number as insuranceNumber'
      ])
      .getRawOne();

    if(!motherEntity) {
      return null;
    }

    return {
      id: motherEntity.motherId,
      firstName: motherEntity.firstName,
      lastName: motherEntity.lastName,
      nationalId: motherEntity.nationalId,
      relation: FamilyRelation.MOTHER,
      insuranceNumber: motherEntity.insuranceNumber
    }

  }

  private async findSpouse(personId: number): Promise<IRelative[]> {
    const spouseEntities: FamilySchema[] = await this.familyRepository.createQueryBuilder()
      .where('(personnel_id_fk = :pid or spouse_id_fk = :sid) and not(spouse_id_fk is null)', {
        pid: personId,
        sid: personId
      })
      .getMany();

    if(!spouseEntities || spouseEntities.length === 0) {
      return null;
    }

    const result: IRelative[] = [];

    for(const spouseEntity of spouseEntities) {
      const spouseId: number = spouseEntity.personnelId != personId ? spouseEntity.personnelId : spouseEntity.spouseId;

      const personEntity: Personnel = await this.personnelRepository.findOne({
        where: {
          id: spouseId
        }
      });

      result.push({
        id: personEntity.id,
        firstName: personEntity.first_name,
        lastName: personEntity.last_name,
        insuranceNumber: personEntity.insurance_number,
        relation: FamilyRelation.SPOUSE,
        nationalId: personEntity.national_number
      })
    }
    return result;
  }
  private async findBrothers(personnelId: number): Promise<IRelative[]> {
    const entity = await this.familyRepository.findOne({
      where: {
        personnelId: personnelId
      }
    });

    if(!entity) {
      return null;
    }

    let brotherIds: number[] = [];

    if(!entity.fatherId && !entity.motherId && entity.vid) {
      const brothers = await this.familyRepository.find({
        where: {
          vid: entity.vid,
          personnelId: Not(entity.personnelId)
        }
      });

      brothers.forEach(item => brotherIds.push(item.personnelId));
    }
    else if(entity.fatherId || entity.motherId && !entity.vid) {
      const brothers = await this.familyRepository.createQueryBuilder()
        .where('personnel_id_fk <> :pid and (mother_id_fk = :mid or father_id_fk = :fid)', {
          pid: personnelId,
          mid: entity.motherId,
          fid: entity.fatherId
        })
        .getMany();


      brothers.forEach(item => brotherIds.push(item.personnelId));
    }


    if(brotherIds.length === 0) {
      return null;
    }

    const brotherEntities: any[] = await this.personnelRepository.createQueryBuilder('personnel')
      .innerJoinAndSelect('family', 'family', 'family.personnel_id_fk=personnel.id')
      .where('personnel.id IN(:...ids)', {
      ids: brotherIds
    })
      .andWhere('personnel.sex = :sex', {
        sex: 'm'
      })
      .select([
        'personnel.id as id',
        'personnel.first_name as first_name',
        'personnel.last_name as last_name',
        'personnel.national_number as national_number',
        'personnel.insurance_number as insurance_number',
        'family.same_mother as sameMother',
        'family.same_father as sameFather'
      ])
      .getRawMany();

    const result: IRelative[] = [];

    brotherEntities.forEach(brotherEntity => {
      result.push({
        id: brotherEntity.id,
        firstName: brotherEntity.first_name,
        lastName: brotherEntity.last_name,
        nationalId: brotherEntity.national_number,
        relation: FamilyRelation.BROTHER,
        insuranceNumber: brotherEntity.insurance_number,
        sameMother: brotherEntity.sameMother,
        sameFather: brotherEntity.sameFather
      })
    });

    return result;
  }

  private async findSisters(personnelId: number): Promise<IRelative[]> {
    const entity = await this.familyRepository.findOne({
      where: {
        personnelId: personnelId
      }
    });

    if(!entity) {
      return null;
    }

    let sisterIds: number[] = [];

    if(!entity.fatherId && !entity.motherId && entity.vid) {
      const sisters = await this.familyRepository.find({
        where: {
          vid: entity.vid,
          personnelId: Not(entity.personnelId)
        }
      });

      sisters.forEach(item => sisterIds.push(item.personnelId));
    }
    else if(entity.fatherId || entity.motherId && !entity.vid){
      const sisters = await this.familyRepository.createQueryBuilder()
        .where('personnel_id_fk <> :pid and (mother_id_fk = :mid or father_id_fk = :fid)', {
          pid: personnelId,
          mid: entity.motherId,
          fid: entity.fatherId
        })
        .getMany();

      sisters.forEach(item => sisterIds.push(item.personnelId));
    }


    if(sisterIds.length === 0) {
      return null;
    }


    const sisterEntities = await this.personnelRepository.createQueryBuilder('personnel')
      .innerJoinAndSelect('family', 'family', 'family.personnel_id_fk=personnel.id')
      .where('personnel.id IN(:...ids)', {
        ids: sisterIds
      })
      .andWhere('personnel.sex = :sex', {
        sex: 'f'
      })
      .select([
        'personnel.id as id',
        'personnel.first_name as first_name',
        'personnel.last_name as last_name',
        'personnel.national_number as national_number',
        'personnel.insurance_number as insurance_number',
        'family.same_mother as sameMother',
        'family.same_father as sameFather'
      ])
      .getRawMany();

    const result: IRelative[] = [];

    sisterEntities.forEach(sisterEntity => {
      result.push({
        id: sisterEntity.id,
        firstName: sisterEntity.first_name,
        lastName: sisterEntity.last_name,
        nationalId: sisterEntity.national_number,
        relation: FamilyRelation.SISTER,
        insuranceNumber: sisterEntity.insurance_number,
        sameFather: sisterEntity.sameFather,
        sameMother: sisterEntity.sameMother,
      })
    });

    return result;
  }

  private async findChildren(personnelId: number): Promise<IRelative[]> {
    const query = this.familyRepository.createQueryBuilder('family')
      .innerJoinAndSelect('personnel', 'personnel', 'family.personnel_id_fk = personnel.id')
      .where('family.father_id_fk = :fid', {
        fid: personnelId
      })
      .orWhere('family.mother_id_fk = :mid', {
        mid: personnelId
      })
      .select('personnel.*');

    const list = await query.getRawMany();

    const result: IRelative[] = [];

    list.forEach(personnel => {
      result.push({
        id: personnel.id,
        firstName: personnel.first_name,
        lastName: personnel.last_name,
        nationalId: personnel.national_number,
        relation: personnel.sex === 'm' ? FamilyRelation.SON : FamilyRelation.DOUGHTER,
        insuranceNumber: personnel.insurance_number,
      })
    });

    return result;
  }
  private async assertFamilyNotExists(args: {
    personId: number;
    relation: FamilyRelation;
    fatherId?: number;
    motherId?: number;
    spouseId?: number;
  }): Promise<void> {

    let executeQuery: boolean = false;

    let query: SelectQueryBuilder<FamilySchema> = null;

    if(args.relation === FamilyRelation.FATHER) {
      const duplicate = await this.familyRepository.findOne({
        where: {
          personnelId: args.personId,
          fatherId: args.fatherId
        }
      });

      if(duplicate) {
        throw new HttpException('This family record exists.', 400);
      }
    }

    if(args.relation === FamilyRelation.MOTHER) {
      const duplicate = await this.familyRepository.findOne({
        where: {
          personnelId: args.personId,
          motherId: args.motherId
        }
      });

      if(duplicate) {
        throw new HttpException('This family record exists.', 400);
      }
    }

    if(args.relation === FamilyRelation.SPOUSE) {
      const duplicate = await this.familyRepository.findOne({
        where: {
          personnelId: args.personId,
          spouseId: args.motherId
        }
      });

      if(duplicate) {
        throw new HttpException('This family record exists.', 400);
      }
    }

    if(args.relation === FamilyRelation.BROTHER || args.relation === FamilyRelation.SISTER) {

    }
  }
  
  private async getVId(personnelNationalNumbers: string[]) : Promise<string> {
    let result: string = null;
    
    const ids = await this.personnelRepository.createQueryBuilder('personnel')
      .where('national_number in (:...nationalNumbers)', {
        nationalNumbers: personnelNationalNumbers
      })
      .select('personnel.id')
      .getMany();

    const vIds = await this.familyRepository.createQueryBuilder()
      .where('personnel_id_fk in (:...ids)', {
        ids: ids.map(item => item.id)
      })
      .andWhere('not(vid is null)')
      .getMany();

    if(vIds.length > 0) {
      result = vIds[0].vid;
    }
    else {
      result = v4uuid();
    }

    return result;
  }

  async deletePersonFromFamily(personnelId: number): Promise<void> {

    console.log(personnelId);

    const fatherCount: number = await this.familyRepository.count({
      where: {
        fatherId: personnelId
      }
    });

    if(fatherCount > 0) {
      throw new HttpException('This person is father of a family and not able to be deleted.', 400);
    }

    const motherCount: number = await this.familyRepository.count({
      where: {
        motherId: personnelId
      }
    });

    if(motherCount > 0) {
      throw new HttpException('This person is mother of a family and not able to be deleted.', 400);
    }

    await this.familyRepository.delete({
      personnelId: personnelId
    });

  }

  private async syncBrotherSister(args: {
    personEntity: Personnel;
    brotherNationalId?: string;
    sisterNationalId?: string;
  }): Promise<void> {

    const firstPersonFamilyEntity: FamilySchema = await this.familyRepository.findOne({
      where: {
        personnelId: args.personEntity.id
      }
    });

    const secondPersonEntity: Personnel = await this.personnelRepository.findOne({
      where: [
        {
          national_number: args.brotherNationalId
        },
        {
          national_number: args.sisterNationalId
        }
      ]
    });

    if(secondPersonEntity) {
      // insert second record for second person
      const secondPersonCount: number = await this.familyRepository.count({
        where: {
          personnelId: secondPersonEntity.id
        }
      });

      if(secondPersonCount === 0) {
        const familyEntityForSecondPerson: FamilySchema = new FamilySchema(secondPersonEntity.id);
        familyEntityForSecondPerson.sameMother = firstPersonFamilyEntity.sameMother;
        familyEntityForSecondPerson.sameFather = firstPersonFamilyEntity.sameFather;
        await this.familyRepository.save(familyEntityForSecondPerson);
      }

      let fatherId: number = 0;
      let motherId: number = 0;
      let vid: string = null;

      const fatherFamilyEntities: FamilySchema[] = await this.familyRepository.createQueryBuilder()
        .where('personnel_id_fk = :pid or personnel_id_fk = :spid',  {
          pid: args.personEntity.id,
          spid: secondPersonEntity.id,
        })
        .getMany();

      const updateEntities: FamilySchema[] = [];

      for(let entity of fatherFamilyEntities) {
        if(entity.fatherId && fatherId === 0) {
          fatherId = entity.fatherId;
        }

        if(entity.motherId && motherId === 0) {
          motherId = entity.motherId;
        }


        if(entity.vid) {
          vid = entity.vid;
        }


        updateEntities.push(entity);
      }

      if(vid === null) {
        vid = v4uuid();
      }

      updateEntities.forEach(entity => {
        entity.vid = entity.vid || vid;
        entity.fatherId = fatherId || entity.fatherId;
        entity.motherId = motherId || entity.motherId;

      });

      await this.familyRepository.save(updateEntities);
    }
  }

  private async syncFatherMother(args: {
    personEntity: Personnel;
    fatherEntity?: Personnel;
    motherEntity?: Personnel;
    syncMother?: boolean;
  }): Promise<void> {
    const personFamily: FamilySchema = await this.familyRepository.findOne({
      where: {
        personnelId: args.personEntity.id
      }
    });

    const spouseEntity: FamilySchema = await this.familyRepository.findOne({
      where: [
        {
          personnelId: args.fatherEntity?.id || args.motherEntity?.id
        },
        {
          spouseId: args.fatherEntity?.id || args.motherEntity?.id
        }
      ]
    });


    if(personFamily.fatherId) {

      await this.familyRepository.createQueryBuilder()
        .update()
        .where('vid = :vid and father_id_fk is null and (same_father = 1 or same_father is null)', {
          vid: personFamily.vid
        })
        .set({
          fatherId: personFamily.fatherId,
          sameFather: personFamily.sameFather,
          sameMother: personFamily.sameMother
        })
        .execute();

    }

    if(personFamily.motherId && args.syncMother === true) {

      await this.familyRepository.createQueryBuilder()
        .update()
        .where('vid = :vid and mother_id_fk is null and (same_mother = 1 or same_mother is null)', {
          vid: personFamily.vid
        })
        .set({
          motherId: personFamily.motherId,
          sameFather: personFamily.sameFather,
          sameMother: personFamily.sameMother,
        })
        .execute();
    }

    if(spouseEntity) {

      if(args.motherEntity) {
        const fatherId: number = spouseEntity.personnelId === args.motherEntity.id ? spouseEntity.spouseId : spouseEntity.personnelId;

        await this.familyRepository.createQueryBuilder()
          .update()
          .set({
            fatherId: fatherId
          })
          .where('mother_id_fk = :mid and (same_father = 1 or same_father is null)', {
            mid: args.motherEntity.id
          })
          .execute();
      }

      if(args.fatherEntity) {
        const motherId: number = spouseEntity.personnelId === args.fatherEntity.id ? spouseEntity.spouseId : spouseEntity.personnelId;

        await this.familyRepository.createQueryBuilder()
          .update()
          .set({
            motherId: motherId
          })
          .where('father_id_fk = :fid and (same_mother = 1 or same_mother is null)', {
            fid: args.fatherEntity.id
          })
          .execute();
      }
    }
  }

  private async syncSpouse(args: {
    personEntity: Personnel;
    spouseEntity: Personnel;
  }): Promise<void> {

    const motherEntity: Personnel = args.personEntity.sex === 'f' ? args.personEntity : args.spouseEntity;
    const fatherEntity: Personnel = args.personEntity.sex === 'm' ? args.personEntity : args.spouseEntity;

    console.log(motherEntity);
    console.log(fatherEntity);

  }
}
