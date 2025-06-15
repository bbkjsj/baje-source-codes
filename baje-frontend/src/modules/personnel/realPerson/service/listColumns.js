import React from "react";
import { permission } from "json/Permission";
import moment from "moment-jalaali";
import { dateToInt } from "_helpers";

const convertToShamsi = (time) =>
  moment(time, "YYYY-M-D HH:mm:ss").format("jYYYY/jMM/jDD");
const { EDIT_PERSON, DELETE_PERSON } = permission;
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

export const columns = (
  history,
  list,
  tableSearch,
  tableDateFilterTable,
  tableSelect,
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
      title: "نام",
      dataIndex: "name",
      ...tableSearch("name", "نام"),
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),
    },
    {
      // width: 100,
      title: "کد ملی",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      sorter: (a, b) =>
        a.national_number ? a.national_number - b.national_number : false,
    },
    {
      // width: 100,
      title: "نوع خدمت/خسارت",
      dataIndex: "type_service_damage",

      ...tableSelect("type_service_damage", "نوع خدمت/خسارت", {
        filters: [
          {
            text: "مالی",
            value: "مالی",
          },
          {
            text: "جانی",
            value: "جانی",
          },
          {
            text: "حیثیتی",
            value: "حیثیتی",
          },
        ],
      }),
      onFilter: (value, record) =>
        record.type_service_damage.indexOf(value) === 0,
    },
    {
      // width: 100,
      title: "تاریخ",
      dataIndex: "date",
      ...tableDateFilterTable("date", "تاریخ"),
      render: (text, record) => {
        return <span>{convertToShamsi(record.date)}</span>;
      },
      sorter: (a, b) =>
        a.date ? dateToInt(a.date) - dateToInt(b.date) : false,
    },
    {
      // width: 120,
      title: "وضعیت تایید",
      dataIndex: "status",
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
