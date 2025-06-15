import { IPersonnel } from 'src/app/personnel/interfaces/personnel.interface';
import { DependencyQuitReason } from 'src/common/enums/dependency-quit-status.enum';
import { DependencyStatus } from 'src/common/enums/dependency-status.enum';
import { FamilyRelation } from 'src/common/enums/family-relation.enum';

export interface IPersonnelFamily {
  readonly personnel: IPersonnel;
  readonly relation: FamilyRelation;
  readonly dependencyStatus: DependencyStatus;
  readonly dependencyQuitReason: DependencyQuitReason;
  readonly dependencyQuitDate: Date;
  readonly familyMembers: IPersonnelFamily[];
}

