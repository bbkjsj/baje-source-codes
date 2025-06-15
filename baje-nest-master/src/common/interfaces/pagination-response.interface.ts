export interface IListPaginationResponse {
  readonly list: any[];
  readonly total: number;
  readonly excelBuffer?: Buffer;
}