
export class CompanyResponse {

  readonly id: number;
  readonly name: string;
  readonly registerNumber: string;
  readonly registerDate: string;
  readonly nationalId: string;
  readonly financeCode: string;
  readonly logoUrl: string;
  readonly sealUrl: string;
  readonly phone: string;
  readonly address: string;
  readonly postalCode: string;
  readonly email: string;
  readonly description: string;
  readonly isGroup: boolean;
  readonly type: string;

  constructor(args: CompanyResponse) {
    Object.assign(this, args);
  }
}
