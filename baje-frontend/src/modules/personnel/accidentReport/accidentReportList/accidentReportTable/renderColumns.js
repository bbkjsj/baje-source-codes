import React from "react";
import {
  timeToFa,
  dateToInt,
  timeToInt,
  covetFormatDateToFA,
  getLink,
} from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

export const renderColumns = (
  list,
  history,
  deleteItem,
  tableSearch,
  tableSelectSearch,
  tableDateFilter,
  searchParams
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(
            getLink(
              pageNames.personnel.realPerson.accidentReport.view,
              record.id
            )
          ),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(
            getLink(
              pageNames.personnel.realPerson.accidentReport.edit,
              record.id
            )
          ),
      },
      {
        name: "delete",
        onClick: () => deleteItem([record.id]),
      },
    ];
    return list;
  };

  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "count",
      dataIndex: "count",
      render: (text, record, index) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      //  width: 100,
      title: "محل پروژه",
      // align: "center",
      key: "location",
      dataIndex: "location",
      ...tableSearch("location", "محل پروژه"),
      sorter: (a, b) =>
        a.location ? a.location.localeCompare(b.location) : false,
      // render: (address, record) => {
      //   return address ? address : record.address;
      // },
    },
    {
      //  width: 100,
      title: "زمان",
      // align: "center",
      key: "date",
      dataIndex: "date",
      // ...tableSearch("date", "زمان", {
      //   customConvert: (text) => {
      //     return timeToFa(text);
      //   },
      // }),
      ...tableDateFilter("date", "زمان"),
      render: (date) => {
        return timeToFa(date);
      },
      sorter: (a, b) =>
        a.date
          ? dateToInt(covetFormatDateToFA(a.date, false)) -
            dateToInt(covetFormatDateToFA(b.date, false))
          : false,
    },
    {
      //  width: 100,
      title: "علت",
      // align: "center",
      key: "reason",
      dataIndex: "reason",
      ...tableSelectSearch("reason", "علت", {
        filters: [
          {
            text: "تصادف و تصادم",
            value: "تصادف و تصادم",
          },
          {
            text: "سقوط از ارتفاع",
            value: "سقوط از ارتفاع",
          },
          {
            text: "سقوط اجسام",
            value: "سقوط اجسام",
          },
          {
            text: "کار با ابزار",
            value: "کار با ابزار",
          },
          {
            text: "خفگی",
            value: "خفگی",
          },
          {
            text: "انفجار",
            value: "انفجار",
          },
          {
            text: "نزاع و درگیری",
            value: "نزاع و درگیری",
          },
          {
            text: "ریزش آوار",
            value: "ریزش آوار",
          },
          {
            text: "برق گرفتگی",
            value: "برق گرفتگی",
          },
        ],
      }),
    },
    {
      //  width: 100,
      title: "نوع",
      align: "center",
      key: "type",
      dataIndex: "type",
      ...tableSelectSearch("type", "نوع", {
        filters: [
          {
            text: "جرحی",
            value: "جرحی",
          },
          {
            text: "مالی",
            value: "مالی",
          },
          {
            text: "فوتی",
            value: "فوتی",
          },
        ],
      }),

      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      //  width: 80,
      // align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return <TableActions list={generateIcons(record)} />;
      },
    },
  ];
  // dynamically add default filters and sorts to columns based on search params
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
