import React from "react";

// import ReactExport from "react-export-excel";
// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

/**
 *
 * @param {object} params - params of componnet
 * @param {Array<>} params.data - data array
 * @param {Array<>} params.columns - columns array
 * @returns
 */
const ExportExcel = ({ data = [], columns = [], name = "excel_file" }) => {
  // return (
  //   <ExcelFile>
  //     <ExcelSheet data={data} name={name}>
  //       {columns.map((item) => (
  //         <ExcelColumn label={item.label} value={item.value} />
  //       ))}
  //     </ExcelSheet>
  //   </ExcelFile>
  // );
  return <div>TODO: Replace react-export-excel functionality</div>;
};

export default ExportExcel;
