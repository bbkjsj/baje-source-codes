import { Injectable } from '@nestjs/common';
import * as excel4node from 'excel4node';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';

export interface IExcelHeader {
  readonly key: string;
  readonly value: string;
}

@Injectable()
export class ExcelService {

  private header: IExcelHeader[] = [];
  /**
   *
   */
  constructor() {}


  async create(args: {
    header: IExcelHeader[];
    stringJson: string;
  }): Promise<Buffer> {
    const wb = new excel4node.Workbook(this.workBookOptionsGenerator());
    const ws = wb.addWorksheet('برنامه جامع باجه', this.workSheetOptionsGenerator());
    let rowIndex: number = 1;

    if(args.header && args.header.length > 0) {
      this.header = args.header;
      this.generateHeaders(ws);
      rowIndex++;
    }

    const jsonData: any[] = JSON.parse(args.stringJson);



    for(const item of jsonData) {
      let cellIndex: number = 1;
      for(const header of this.header) {
        const value: string = item[header.key];

        ws.cell(rowIndex, cellIndex)
          .string(value != null ? value.toString() : '-');
          cellIndex++;

      }
      rowIndex++;
    }

    return await wb.writeToBuffer();
  }


  private workSheetOptionsGenerator(): any {
    return {
      'margins' : {},
      'printOptions': {},
      'headerFooter': {},
      'pageSetup': {},
      'sheetView': {
        'rightToLeft': true
      },
      'sheetFormat': {
        'defaultRowHeight': 30
      },
      'sheetProtection': {},
      'outline': {},
      'disableRowSpansOptimization': {},
      'hidden': false
    }
  }

  private workBookOptionsGenerator(): any {
    return {
      author: 'Amir Zandi-2022'
    }
  }

  private generateHeaders(workSheet: any) {
    let index = 1;
    for(const header of this.header) {
      workSheet.cell(1, index)
      .string(header.value);

      index++;
    }
  }
}