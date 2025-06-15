export interface IRelative {
  readonly id: number;
  readonly relation: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly nationalId: string;
  readonly insuranceNumber: string;
  readonly sameFather?: boolean;
  readonly sameMother?: boolean;
}
