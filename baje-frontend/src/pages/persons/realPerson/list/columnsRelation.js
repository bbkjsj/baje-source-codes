import React from "react";
import { permission } from "json/Permission";
import { getLink } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

const { EDIT_PERSON, DELETE_PERSON } = permission;
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

export const columnsRelation = (
  handleDelete,
  history,
  list,
  tableSearch,
  tableInfo,
  disabledFilters
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(
            `${getLink(
              pageNames.personnel.realPerson.view,
              record.personnel_id_fk
            )}?target=4`
          ),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(
            `${getLink(
              pageNames.personnel.realPerson.edit,
              record.personnel_id_fk
            )}?target=subordinatePersonInfoTab`
          ),
        permission: EDIT_PERSON,
      },
      {
        name: "delete",
        onClick: () => handleDelete([record.id]),
        permission: DELETE_PERSON,
      },
    ];
    return list;
  };
  return [
    {
      width: 65,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record, index) => {
        const currPage = tableInfo?.pagination?.current || 1;
        const pageSize = tableInfo?.pagination?.pageSize || 20;
        const prevTotal = (currPage - 1) * pageSize;

        return prevTotal + index + 1;
      },
    },
    {
      // width: 100,
      title: "نام",
      dataIndex: "first_name",
      key: "first_name",
      ...tableSearch("first_name", "نام"),
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
    },
    {
      // width: 100,
      title: "نام خانوادگی",
      dataIndex: "last_name",
      key: "last_name",
      ...tableSearch("last_name", "نام خانوادگی"),
      sorter: (a, b) =>
        a.last_name ? a.last_name.localeCompare(b.last_name) : false,
      defaultSortOrder: "ascend",
    },
    {
      // width: 100,
      title: "نام پدر",
      dataIndex: "father_name",
      key: "father_name",
      ...tableSearch("father_name", "نام پدر"),
      sorter: (a, b) =>
        a.father_name ? a.father_name.localeCompare(b.father_name) : false,

      // filters: [
      //   {
      //     text: "حسن",
      //     value: "حسن",
      //   },
      //   {
      //     text: "علی",
      //     value: "علی",
      //   },
      // ],

      // onFilter: (value, record) => record.father_name.indexOf(value) === 0,
    },
    {
      // width: 100,
      title: "شماره ملی",
      dataIndex: "national_code",
      key: "national_code",
      ...tableSearch("national_code", "شماره ملی"),
      sorter: (a, b) =>
        a.national_code ? a.national_code - b.national_code : false,
    },
    {
      // width: 100,
      title: "نسبت",
      dataIndex: "relation",
      key: "relation",
      render: (value, record) => {
        if (!value) {
          return "اصلی";
        } else if (value === "father") return "پدر";
        else if (value === "mother") return "مادر";
        else if (value === "daughter") return "فرزند دختر";
        else if (value === "wife") return "همسر";
        else if (value === "son") return "فرزند پسر";
        return value;
      },
      sorter: (a, b) =>
        a.relation ? a.relation.localeCompare(b.relation) : false,
    },
    {
      // width: 100,
      title: "نام بیمه شده اصلی",
      dataIndex: "main_person_firstname",
      key: "main_person_firstname",
      ...tableSearch("main_person_firstname", "نام بیمه شده اصلی", {
        multipleColumn: ["main_person_firstname", "main_person_lastname"],
      }),
      sorter: (a, b) =>
        a.main_person_firstname
          ? a.main_person_firstname.localeCompare(b.main_person_firstname)
          : false,
    },
    {
      // width: 100,
      title: "نام خانوادگی بیمه شده اصلی",
      dataIndex: "main_person_lastname",
      key: "main_person_lastname",
      ...tableSearch("main_person_lastname", "نام خانوادگی بیمه شده اصلی", {
        multipleColumn: ["main_person_firstname", "main_person_lastname"],
      }),
      sorter: (a, b) =>
        a.main_person_lastname
          ? a.main_person_lastname.localeCompare(b.main_person_lastname)
          : false,
    },
    {
      // width: 100,
      title: "شماره ملی بیمه شده اصلی",
      dataIndex: "main_nationalcode",
      key: "main_nationalcode",
      ...tableSearch("main_nationalcode", "شماره ملی"),
      sorter: (a, b) =>
        a.main_nationalcode ? a.main_nationalcode - b.main_nationalcode : false,
    },
    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record)}
            record={record}
            contractKey="contract_id"
          />
        );
      },
    },
  ];
};
