export interface ITaskCounter {
  readonly tasks: number;
  readonly toInform: number;
  readonly inProgress: number;
  readonly done: number;
  readonly notDone: number;
  readonly redirected: number;
  readonly toApprove: number;
  readonly notMyDuty: number;
}