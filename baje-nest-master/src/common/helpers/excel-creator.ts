import * as exportExcel from "node-excel-export";

export class ExcelCreator {

    constructor(private data: any) {
        this.data = data;
    }


    async create(): Promise<void> {
        this.prepare();
        const report = exportExcel.buildExport(
            [
                {
                    name: 'Report',
                    data: this.data,
                    merges: [],
                    specification: []
                }
            ]
        )
        return report;
    }

    private prepare() {
        return  {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: 'FF000000'
                    }
                },
                font: {
                    color: {
                        rgb: 'FFFFFFFF'
                    },
                    sz: 14,
                    bold: true,
                    underline: true
                }
            },
            cellPink: {
                fill: {
                    fgColor: {
                        rgb: 'FFFFCCFF'
                    }
                }
            },
            cellGreen: {
                fill: {
                    fgColor: {
                        rgb: 'FF00FF00'
                    }
                }
            }
        };
    }
}