import React from "react";
import { permission } from "json/Permission";
import moment from "moment-jalaali";

const convertToShamsi = (time) =>
  moment(time, "YYYY-M-D HH:mm:ss").format("jYYYY/jMM/jDD");
const { EDIT_PERSON, DELETE_PERSON } = permission;
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

export const columns = (
  history,
  list,
  tableSearch,
  dateFilterTable,
  searchParams
) => {
  let cols = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      // width: 100,
      title: "تاریخ انجام معاینات",
      dataIndex: "visit_date",
      ...dateFilterTable("visit_date", "تاریخ انجام معاینات"),
      render: (text, record) => {
        return <span>{moment(record.visit_date).format("jYYYY/jMM/jDD")}</span>;
      },
    },
    {
      // width: 100,
      title: "پزشک معاینه کننده",
      dataIndex: "doctor_name",
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      ...tableSearch("full_name", "پزشک معاینه کننده", {
        multipleColumn: ["first_name", "last_name"],
      }),
      render: (text, record) => {
        return (
          <span>
            {record.first_name
              ? `${record.first_name} ${record.last_name}`
              : "–"}
          </span>
        );
      },
    },
    {
      // width: 100,
      title: "نتیجه معاینه",
      dataIndex: "result",
      sorter: (a, b) => (a.result ? a.result.localeCompare(b.result) : false),
      ...tableSearch("result", "نتیجه معاینه"),
    },
    {
      // width: 100,
      title: "شغل تایید شده",
      dataIndex: "approved_position",
      sorter: (a, b) =>
        a.approved_position
          ? a.approved_position.localeCompare(b.approved_position)
          : false,
      ...tableSearch("approved_position", "شغل تایید شده"),
      render: (text, record) => {
        return <span>{record.approved_position || "–"}</span>;
      },
    },
  ];

  cols = cols.map((column) => {
    return {
      ...column,
      defaultFilteredValue:
        searchParams && searchParams[column?.dataIndex]
          ? [searchParams[column?.dataIndex]]
          : null,
      defaultSortOrder:
        searchParams && searchParams.sort === column?.dataIndex
          ? searchParams?.sort_order || "ascend"
          : null,
    };
  });

  return cols;
};
