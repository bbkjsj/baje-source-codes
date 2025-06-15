import React from "react";
import { permission } from "json/Permission";
import moment from "moment-jalaali";
import { calculateAge, getLink } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";
import { PlusOutlined } from "@ant-design/icons";
const convertToShamsi = (time) =>
  moment(time, "YYYY-M-D HH:mm:ss").format("jYYYY/jMM/jDD");
const { EDIT_PERSON, DELETE_PERSON } = permission;
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

export const columns = (
  history,
  list,
  tableSearch,
  rangeFilter,
  searchParams
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(
            getLink(
              pageNames.personnel.realPerson.examination.list,
              record.personnel_id
            )
          ),
      },
      {
        name: "add",
        onClick: () =>
          history.push(
            getLink(
              `${pageNames.personnel.realPerson.examination.add}/?person_id=${record.national_number}`
            )
          ),
        toolTip: "افزودن",
        icon: <PlusOutlined className="text-13" />,
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
      title: "نام و نام خانوادگی",
      dataIndex: "full_name",
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      ...tableSearch("full_name", "نام و نام خانوادگی", {
        multipleColumn: ["first_name", "last_name"],
      }),
      render: (text, record) => {
        return <span>{`${record.first_name} ${record.last_name}`}</span>;
      },
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
      title: "موبایل",
      dataIndex: "mobile",
      ...tableSearch("mobile", "موبایل"),
      sorter: (a, b) => (a.mobile ? a.mobile - b.mobile : false),
      render: (text, record) => {
        return <span>{record.mobile || "–"}</span>;
      },
    },
    {
      // width: 100,
      title: "سن",
      dataIndex: "age",
      sorter: (a, b) =>
        a.birth_date
          ? calculateAge(a.birth_date) - calculateAge(b.birth_date)
          : false,
      ...rangeFilter("age", "سن", {
        customConvert: (text) => {
          return calculateAge(text).toString();
        },
      }),
      // ...tableSearch("birth_date", "سن", {
      //   customConvert: (text) => {
      //     return calculateAge(text).toString();
      //   },
      // }),
      render: (text, record) => {
        return <span>{calculateAge(record.birth_date) || "–"}</span>;
      },
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
