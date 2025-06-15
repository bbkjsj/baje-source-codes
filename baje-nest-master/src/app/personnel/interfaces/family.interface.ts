import { FamilyRelation } from 'src/common/enums/family-relation.enum';

export interface IFamily {
  readonly personnelId: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly nationalCode: string;
  readonly fatherName: string;
  readonly insuranceNumber: string;
  readonly relation: FamilyRelation;
  readonly reverseRelation: FamilyRelation;
}