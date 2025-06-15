export interface IAccess {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly enable: boolean;
  readonly minimumRequiredAccessLevel: string;
}