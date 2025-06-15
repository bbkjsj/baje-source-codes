import React from "react";
import { Menu, Space } from "antd";
import { dateToInt, getLink, timeToFa } from "_helpers";
import AppMenuItem from "../../../../components/general/AppMenuItem";
import { cartableFilters } from "../../suggestion/const";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

export const columns = ({
  list,
  history,
  deleteHandler,
  tableSearch,
  tableDate,
  onReport,
  searchParams,
}) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.suggest.call.edit, record.id)),
      },
      {
        name: "delete",
        onClick: () => deleteHandler(record.id),
      },
    ];
    return list;
  };

  const OtherActions = (record) => {
    return (
      <Menu>
        <AppMenuItem
          key="1"
          onClick={() =>
            history.push(
              getLink(pageNames.suggest.suggestion.list, {
                filter: cartableFilters.ALL,
              }) +
                "?call=" +
                record.id
            )
          }
        >
          پیشنهادات مرتبط
        </AppMenuItem>
        <AppMenuItem key="2" onClick={() => onReport(record.id)}>
          گزارش آماری
        </AppMenuItem>
      </Menu>
    );
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
      title: "موضوع فراخوان",
      dataIndex: "subject",
      ...tableSearch("subject", "موضوع فراخوان"),
      sorter: (a, b) =>
        a.subject ? a.subject.localeCompare(b.subject) : false,
    },
    {
      //  width: 100,
      title: "تاریخ شروع",
      dataIndex: "start_date",
      ...tableDate("start_date", "تاریخ شروع"),
      render: (text, record) => {
        return <span>{timeToFa(record.start_date, false)}</span>;
      },
      sorter: (a, b) => {
        return a.start_date
          ? dateToInt(timeToFa(a.start_date, false)) -
              dateToInt(timeToFa(b.start_date, false))
          : false;
      },
    },
    {
      // width: 100,
      title: "تاریخ پایان",
      dataIndex: "end_date",
      ...tableDate("end_date", "تاریخ پایان"),
      render: (text, record) => {
        return <span>{timeToFa(record.end_date, false)}</span>;
      },
      sorter: (a, b) => {
        return a.end_date
          ? dateToInt(timeToFa(a.end_date, false)) -
              dateToInt(timeToFa(b.end_date, false))
          : false;
      },
    },
    {
      //  width: 100,
      title: "کارگروه پیشنهاد دهنده",
      dataIndex: "w_name",
      ...tableSearch("w_name", "کارگروه پیشنهاد دهنده"),
      sorter: (a, b) => (a.w_name ? a.w_name.localeCompare(b.w_name) : false),
    },
    {
      //  width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record)}
            moreMenu={OtherActions(record)}
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
