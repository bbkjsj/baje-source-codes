import { FamilyRelation } from 'src/common/enums/family-relation.enum';

export interface IFamilyBrief {
  readonly id: number;
  readonly personnelId: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly fatherName: string;
  readonly insuranceNumber: string;
  readonly nationalCode: string;
  readonly relation: FamilyRelation;
  readonly dependencyStatus: string;
  readonly dependencyQuitReason: string;
  readonly dependencyQuitDate: Date;
}