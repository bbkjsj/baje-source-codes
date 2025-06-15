import React from "react";
import TableHeaderInput from "pages/persons/realPerson/list/TableHeaderInput";
import { calculateAge, convertDateToENProper } from "_helpers";

function getColumns({ tableInfo, setTableInfo }) {
  const columns = [
    {
      placeholder: "نام",
      dataIndex: "first_name",
      key: "first_name",
      title: (
        <TableHeaderInput
          placeholder="نام"
          dataIndex="first_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
          noDropDown
        />
      ),
    },
    {
      placeholder: "نام خانوادگی",
      title: (
        <TableHeaderInput
          placeholder="نام خانوادگی"
          dataIndex="last_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
          noDropDown
        />
      ),
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      placeholder: "نام پدر",
      title: (
        <TableHeaderInput
          placeholder="نام پدر"
          dataIndex="father_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
          noDropDown
        />
      ),
      dataIndex: "father_name",
      key: "father_name",
    },
    {
      placeholder: "شماره شناسنامه",
      title: (
        <TableHeaderInput
          placeholder="شماره شناسنامه"
          dataIndex="id_number"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
          noDropDown
        />
      ),
      dataIndex: "id_number",
      key: "id_number",
    },
    {
      placeholder: "سن",
      title: "سن",
      dataIndex: "age",
      key: "age",
      render: (_, record) => {
        if (
          typeof record?.birth_date !== "string" ||
          record?.birth_date.startsWith("0")
        ) {
          return "-";
        }
        const birthDate =
          record.birth_date.startsWith("14") ||
          record.birth_date.startsWith("13")
            ? convertDateToENProper(record.date)
            : record.birth_date;
        return Number(calculateAge(birthDate)) > 0 &&
          Number(calculateAge(birthDate)) < 120
          ? calculateAge(birthDate)
          : "-";
      },
    },
  ];

  return columns;
}

export default getColumns;
