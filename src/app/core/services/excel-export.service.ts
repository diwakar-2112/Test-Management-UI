import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';
import { from, Observable } from 'rxjs';

export interface ExcelColumn {
    header: string;
    key: string;
    width?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {
    blobType= 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    exportToExcel(
        data: any,
        columns: ExcelColumn[],
        fileName: string,
        sheetName = 'Sheet1'
    ): Observable<void> {
        return from(this.generateAndDownload(data, columns, fileName, sheetName));
    }

    private async generateAndDownload<T extends Record<string, unknown>>(
    data: T[],
    columns: ExcelColumn[],
    fileName: string,
    sheetName: string
): Promise<void> {

    const workbook = new Workbook();
    workbook.creator = 'Test Management Portal';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    // Define columns
    worksheet.columns = columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width ?? 18
    }));

    // Add data
    data.forEach(item => worksheet.addRow(item));

    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Apply full styling
    this.applyFullTableStyle(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: this.blobType
    });

    saveAs(blob, `${fileName}.xlsx`);
}
private applyFullTableStyle(worksheet: Worksheet): void {

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {

        // row.height = 22;

        row.eachCell({ includeEmpty: true }, (cell) => {

            // Borders for every cell
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            // Header styling
            if (rowNumber === 1) {
                cell.font = {
                    bold: true,
                    size: 12
                };

                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                };

                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFEDEDED' } // light grey like your image
                };
            } 
            
        });
    });
}
    
}

