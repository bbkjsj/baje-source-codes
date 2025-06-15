import React from "react";
import {
  timeToFa,
  getLink,
  priceNormalizer,
  dateToInt,
  covetFormatDateToFA,
} from "_helpers";
import routes from "modules/personnel/routes";
import TableActions from "components/general/TableActions";
import { Modal } from "antd";
import confirm from "antd/lib/modal/confirm";
import AppSwitch from "components/general/AppSwitch";

const generateIcons = (record, history, deleteItem, params) => {
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };
  const detailOnClick = () =>
    history.push(
      getLink(routes.PERSONNEL_REAL_RESUME_VIEW, {
        resume_id: record.id,
        id: params.id,
      })
    );

  return [
    {
      //hide: insurance.status !== "عدم تایید",
      name: "delete",
      onClick: deleteOnClick,
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
    //{ name: "detail", onClick: detailOnClick, title: "مشاهده" },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  tableSelect,
  tableDate,
  params,
  verifyItem
) => {
  return [
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
      title: "از تاریخ",
      align: "center",
      key: "from_date",
      dataIndex: "from_date",
      //...tableDate("start_date", "از تاریخ"),
      render: (_, record) => {
        return covetFormatDateToFA(record.from_date);
      },
      // sorter: (a, b) =>
      //   a.start_date ? dateToInt(a.from_date) - dateToInt(b.from_date) : false,
    },
    {
      // width: 100,
      title: "تا تاریخ",
      align: "center",
      key: "to_date",
      dataIndex: "to_date",
      //...tableDate("end_date", "تا تاریخ"),
      render: (_, record) => {
        return covetFormatDateToFA(record.to_date);
      },
      // sorter: (a, b) =>
      //   a.end_date ? dateToInt(a.to_date) - dateToInt(b.to_date) : false,
    },
    {
      title: "شرکت",
      dataIndex: "company_name",
      // sorter: (a, b) =>
      //   a.company_name ? a.company_name.localeCompare(b.company_name) : false,
      // ...tableSearch("company_name", "شرکت"),
    },
    {
      title: "چارت",
      dataIndex: "chart_title",
      // sorter: (a, b) =>
      //   a.project ? a.project.localeCompare(b.project) : false,
      // ...tableSearch("project", "پروژه"),
    },
    {
      title: "عنوان شغلی",
      dataIndex: "job_title",
      // sorter: (a, b) =>
      //   a.job_title ? a.job_title.localeCompare(b.job_title) : false,
      // ...tableSearch("job_title", "شرکت"),
    },
    {
      title: "وضعیت",
      dataIndex: "approved",

      // ...tableSelect("status", "وضعیت", {
      //   filters: [
      //     {
      //       text: "تایید نهایی",
      //       value: 1,
      //     },
      //     {
      //       text: "عدم تایید",
      //       value: 0,
      //     },
      //   ],
      // }),

      // onFilter: (value, record) => {
      //   if (
      //     (record.approved === 0 && value === 0) ||
      //     (record.approved === 1 && value === 1)
      //   ) {
      //     return 1;
      //   }
      //   return 0;
      // },
      render: (enable, record) => {
        return (
          <AppSwitch
            checked={enable == 1 ? true : false}
            title={enable == 1 ? "تایید شده" : "عدم تایید"}
            onChange={() => {
              Modal.confirm({
                title: "آیا مطمئن هستید؟",
                okText: "تایید",
                cancelText: "لغو",
                centered: true,
                closable: true,
                onOk() {
                  verifyItem(record);
                },
                onCancel() {},
              });
            }}
          />
        );
      },
    },
    {
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
};
