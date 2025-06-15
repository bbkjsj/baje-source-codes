import React from "react";
import { timeToFa, getLink, dateToInt, covetFormatDateToFA } from "_helpers";
import routes from "../../routes";
import moment from "moment-jalaali";
import TableChangeStatus from "components/general/TableChangeStatus";
import TableActions from "components/general/TableActions";
import { persianMemberRoles } from "./../utils/const";

const generateIcons = (record, history, deleteItem, params) => {
  const detailOnClick = () => {
    history.push(
      getLink(routes.PERSONNEL_BOARD_MEMBERS_VIEW, {
        id: params.id,
        member_id: record.personnel_id,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(routes.PERSONNEL_BOARD_MEMBERS_EDIT, {
        id: params.id,
        member_id: record.personnel_id,
      })
    );
  };
  const deleteOnClick = () => {
    deleteItem(record.id);
  };

  return [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: record.relation ? true : false,
    },
    {
      name: "delete",
      onClick: deleteOnClick,
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
    { name: "edit", onClick: editOnClick },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  updateStatus,
  tableSearch,
  dateFilterTable,
  tableSelect,
  params,
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
      //  width: 100,
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
      //  width: 100,
      title: "کد ملی",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      sorter: (a, b) =>
        a.national_number ? a.national_number - b.national_number : false,
    },
    {
      //  width: 100,
      title: "از تاریخ",
      dataIndex: "from_date",
      // ...dateFilterTable("date", "تاریخ"),
      // sorter: (a, b) =>
      //   a.date
      //     ? dateToInt(covetFormatDateToFA(a.from_date)) -
      //       dateToInt(covetFormatDateToFA(b.from_date))
      //     : false,
      render: (text) => {
        return <span>{moment(text).format("jYYYY/jMM/jDD")}</span>;
      },
    },
    {
      //  width: 100,
      title: "تا تاریخ",
      dataIndex: "to_date",
      // ...dateFilterTable("date", "تاریخ"),
      // sorter: (a, b) =>
      //   a.date
      //     ? dateToInt(covetFormatDateToFA(a.to_date)) -
      //       dateToInt(covetFormatDateToFA(b.to_date))
      //     : false,
      render: (text) => {
        return <span>{moment(text).format("jYYYY/jMM/jDD")}</span>;
      },
    },
    {
      //  width: 100,
      title: "سمت",
      dataIndex: "role",
      sorter: (a, b) => (a.role ? a.role.localeCompare(b.role) : false),
      ...tableSearch("role", "نقش"),
      render: (text) => {
        return <span>{persianMemberRoles[text] || "-"}</span>;
      },
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "enabled",
      key: "enabled",

      ...tableSelect("enabled", "وضعیت", {
        filters: [
          {
            text: "تایید نهایی",
            value: 1,
          },
          {
            text: "عدم تایید",
            value: 0,
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.enabled == 1 && value == 1) ||
          (record.enabled == 0 && value == 0)
        ) {
          return 1;
        }
        return 0;
      },
      render: (enabled, record) => {
        return (
          <TableChangeStatus
            record={record}
            afterChange={updateList}
            onChange={(val) => updateStatus(val, record.id)}
            value={enabled}
            options={[
              { label: "تایید نهایی", value: 1 },
              { label: "عدم تایید", value: 0 },
            ]}
          />
        );
      },
    },
    {
      //  width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record, history, deleteItem, params)}
          />
        );
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
