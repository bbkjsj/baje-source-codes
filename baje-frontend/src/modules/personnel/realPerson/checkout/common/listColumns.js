import React from "react";
import { timeToFa, getLink, dateToInt, covetFormatDateToFA } from "_helpers";
import moment from "moment-jalaali";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _CHANGE_STATUS } from "modules/personnel/realPerson/checkout/utils/api";
import TableActions from "components/general/TableActions";

const generateIcons = (record, history, deleteItem) => {
  const detailOnClick = () => {
    history.push(
      getLink(pageNames.personnel.realPerson.checkout.view, {
        id: record.id,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.realPerson.checkout.edit, {
        id: record.id,
      })
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };

  return [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: record.relation ? true : false,
    },
    { name: "edit", onClick: editOnClick },
    {
      name: "delete",
      onClick: deleteOnClick,
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  dateFilterTable,
  tableSelect,
  searchParams
) => {
  let columns = [
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
      title: "تاریخ تسویه",
      dataIndex: "date",
      ...dateFilterTable("date", "تاریخ"),
      sorter: (a, b) =>
        a.date
          ? dateToInt(covetFormatDateToFA(a.date)) -
            dateToInt(covetFormatDateToFA(b.date))
          : false,
      render: (text) => {
        return <span>{moment(text).format("jYYYY/jMM/jDD")}</span>;
      },
    },
    {
      //  width: 100,
      title: "علت تسویه",
      dataIndex: "reason",

      ...tableSelect("reason", "علت تسویه", {
        filters: [
          { text: "پایان قرارداد", value: "پایان قرارداد" },
          { text: "درخواست پرسنل", value: "درخواست پرسنل" },
          { text: "کمیته انضباطی", value: "کمیته انضباطی" },
          {
            text: "انتقال به سایر شرکت‌های گروه",
            value: "انتقال به سایر شرکت‌های گروه",
          },
          { text: "سایر", value: "سایر" },
        ],
      }),

      onFilter: (value, record) => record.reason.indexOf(value) === 0,
    },
    {
      //  width: 100,
      title: "ایجاد کننده",
      dataIndex: "register_user",
      sorter: (a, b) =>
        a.register_user
          ? a.register_user.localeCompare(b.register_user)
          : false,
      ...tableSearch("register_user", "ایجاد کننده"),
    },
    {
      //  width: 100,
      title: "توضیحات",
      dataIndex: "description",
      ...tableSearch("description", "توضیحات"),
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "status",
      key: "status",

      ...tableSelect("status", "وضعیت", {
        filters: [
          {
            text: "تایید نهایی",
            value: "تایید نهایی",
          },
          {
            text: "عدم تایید",
            value: "عدم تایید",
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.status === "تایید نهایی" && value === "تایید نهایی") ||
          (record.status === "عدم تایید" && value === "عدم تایید")
        ) {
          return true;
        }
        return false;
      },
      render: (status, record) => {
        return (
          <TableChangeStatus
            value={status === null || !status ? "در انتظار تایید" : status}
            options={[
              { label: "تایید نهایی", value: "تایید نهایی" },
              { label: "عدم تایید", value: "عدم تایید" },
            ]}
            id={record.id}
            requestApi={_CHANGE_STATUS}
            afterChange={updateList}
            setLoadingList={setLoadingList}
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
          <TableActions list={generateIcons(record, history, deleteItem)} />
        );
      },
    },
  ];

  columns = columns.map((column) => {
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

  return columns;
};
