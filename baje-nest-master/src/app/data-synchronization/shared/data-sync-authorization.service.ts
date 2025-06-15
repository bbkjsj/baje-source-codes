import { Injectable, UnauthorizedException } from "@nestjs/common";

export interface IDataSyncTokenContext {
  readonly token: string;
  readonly name: string;
}
@Injectable()
export class DataSyncAuthorizationService {

  async authorize(token: string): Promise<IDataSyncTokenContext> {
    return new Promise((resolve, reject) => {
      const list: IDataSyncTokenContext[] = this.list();
      const result: IDataSyncTokenContext = list.find(item => item.token === token);
      if(result) {
        resolve(result);
      }
      reject(
        new UnauthorizedException(
          'Invalid token context.'
        )
      );
    })
  }


  private list(): IDataSyncTokenContext[] {
    const list: IDataSyncTokenContext[] = [
      {
        token: 'UkXp2s5v8y/B?D(G+KbPeShVmYq3t6w9z$C&F)H@McQfTjWnZr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-',
        name: 'Bimeh Client 1'
      }
    ];
    return list;
  }
}