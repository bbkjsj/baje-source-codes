import React from "react";
import {
  timeToFa,
  getLink,
  priceNormalizer,
  commaPriceToInt,
  dateToInt,
} from "_helpers";
import routes from "../../routes";
import { Switch } from "antd";
import confirm from "antd/lib/modal/confirm";
import TableActions from "components/general/TableActions";
import AppSwitch from "components/general/AppSwitch";

const generateIcons = (
  record,
  history,
  deleteItem,
  verifyItem,
  routeParams
) => {
  const detailOnClick = () => {
    history.push(
      getLink(routes.PERSONNEL_JOBS_CHARTS_VIEW, {
        chart_id: record.id,
        id: routeParams.id,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(routes.PERSONNEL_JOBS_CHARTS_EDIT, {
        chart_id: record.id,
        id: routeParams.id,
      })
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };
  // const checkOnClick = () => {
  //   verifyItem(record.id);
  // };

  return [
    // {
    //   icon: "verify",
    //   onClick: checkOnClick,
    //   title: "تایید",
    //   hide: record.status === "تایید شده",
    // },
    {
      name: "detail",
      onClick: detailOnClick,
    },
    {
      name: "edit",
      onClick: editOnClick,

      hide: record.status === "تایید شده",
    },
    {
      name: "delete",
      onClick: deleteOnClick,

      hide: record.status === "تایید شده",
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  verifyItem,
  updateList,
  setLoadingList,
  tableSearch,
  tableDate,
  selectSearch,
  routeParams,
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
      //width: 100,
      title: "کد یکتای چارت",
      dataIndex: "id",
      //...tableSearch("id", "کد یکتای چارت"),
      sorter: (a, b) => a.id - b.id,
    },
    {
      //  width: 100,
      title: "نام چارت",
      dataIndex: "title",
      ...tableSearch("title", "نام چارت"),
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
    },
    {
      // width: 100,
      title: "تاریخ اعمال",
      align: "center",
      dataIndex: "apply_date",
      //...tableDate("apply_date", "تاریخ اعمال"),
      render: (applyDate) => {
        return timeToFa(applyDate, false);
      },
      sorter: (a, b) =>
        a.apply_date
          ? dateToInt(timeToFa(a.apply_date, false)) -
            dateToInt(timeToFa(b.apply_date, false))
          : false,
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "enable",
      key: "enable",
      //sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : false),
      ...selectSearch("enable", "وضعیت", {
        filters: [
          {
            text: "تایید شده",
            value: true,
          },
          {
            text: "عدم تایید",
            value: false,
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.enable === true && value === true) ||
          (record.enable === false && value === false)
        ) {
          return true;
        }
        return false;
      },
      render: (enable, record) => {
        return (
          <AppSwitch
            checked={enable == true ? true : false}
            title={enable == true ? "تایید شده" : "عدم تایید"}
            onChange={() => {
              confirm({
                title: "آیا مطمئن هستید؟",
                okText: "تایید",
                cancelText: "لغو",
                centered: true,
                closable: true,
                onOk() {
                  const newStatus = enable == true ? false : true;
                  verifyItem(newStatus, record.id, record.title);
                },
                onCancel() {},
              });
            }}
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
            list={generateIcons(
              record,
              history,
              deleteItem,
              verifyItem,
              routeParams
            )}
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
