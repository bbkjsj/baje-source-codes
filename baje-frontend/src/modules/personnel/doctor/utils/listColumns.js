import React from "react";
import { permission } from "json/Permission";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import TableActions from "components/general/TableActions";

const { EDIT_PERSON, DELETE_PERSON } = permission;

export const columns = (
  handleDelete,
  history,
  list,
  tableSearch,
  searchParams
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.personnel.doctor.edit, record.id)),
      },
      {
        name: "delete",
        onClick: () => handleDelete([record.id]),
      },
    ];
    return list;
  };

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
      dataIndex: "first_name",
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      ...tableSearch("first_name", "نام"),
    },
    {
      // width: 100,
      title: "نام خانوادگی",
      dataIndex: "last_name",
      sorter: (a, b) =>
        a.last_name ? a.last_name.localeCompare(b.last_name) : false,
      ...tableSearch("last_name", "نام خانوادگی"),
    },
    {
      // width: 100,
      title: "کد ملی",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      sorter: (a, b) => a.national_number - b.national_number,
    },
    {
      // width: 100,
      title: "موبایل",
      dataIndex: "mobile",
      ...tableSearch("mobile", "موبایل"),
    },
    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return <TableActions list={generateIcons(record)} />;
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
