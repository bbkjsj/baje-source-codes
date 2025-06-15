import React from "react";
import { timeToFa, getLink, covetFormatDateToFA, dateToInt } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _CHANGE_STATUS } from "modules/personnel/realPerson/leaveRequest/utils/api";
import TableActions from "components/general/TableActions";
import { permission } from "json/Permission";

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  tableDateFilter,
  tableSelectSearch,
  isAdmin,
  checkAccess,
  searchParams,
  tablePersonFilter
) => {
  const getYesterday = (today) => {
    const time = new Date(today).getTime() - 1000;
    const newFormat = new Date(time).toISOString().split("T")[0];
    return covetFormatDateToFA(`${newFormat} 00:00:00`);
  };
  const generateIcons = (record, history, deleteItem) => {
    const detailOnClick = () => {
      history.push(
        getLink(pageNames.personnel.realPerson.leaveRequest.view, {
          id: record.id,
        })
      );
    };

    const editOnClick = () => {
      history.push(
        getLink(pageNames.personnel.realPerson.leaveRequest.edit, {
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
        hide: false,
      },
      {
        name: "edit",
        onClick: editOnClick,
        hide:
          record.status == "تایید نهایی" || record.status == "عدم تایید"
            ? true
            : false,
      },
      {
        name: "delete",
        onClick: deleteOnClick,
        warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
        hide:
          record.status == "تایید نهایی" ||
          isAdmin ||
          record.status == "عدم تایید"
            ? true
            : false,
      },
    ];
  };
  let columns = [
    {
      width: 40,
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
      title: "نام و نام خانوادگی شاغل",
      dataIndex: "full_name",
      ...tablePersonFilter("personnel_id_fk", "نام و نام خانوادگی"),
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      render: (text, record) => {
        return <span>{record.first_name + " " + record.last_name}</span>;
      },
    },
    {
      //  width: 100,
      title: "تایید کننده",
      dataIndex: "operator",
      ...tablePersonFilter("operator_id_fk", "تایید کننده"),
      sorter: (a, b) =>
        a.operator_first_name
          ? a.operator_first_name.localeCompare(b.operator_first_name)
          : false,
      render: (text, record) => {
        return record.operator_first_name ? (
          <span>
            {record.operator_first_name + " " + record.operator_last_name}
          </span>
        ) : (
          "-"
        );
      },
    },
    {
      //  width: 100,
      title: "کد ملی",
      dataIndex: "national_number",
      className: "d-none",
      hideMobile: true,
      ...tableSearch("national_number", "کد ملی"),
    },
    {
      //  width: 100,
      title: "تایید کننده",
      dataIndex: "operator_id_fk",
      className: "d-none",
      hideMobile: true,
    },
    {
      //  width: 100,
      title: "نوع",
      dataIndex: "type",
      ...tableSelectSearch("type", "نوع", {
        customText: (record) => {
          return `${
            record.request_type && record.request_type !== "undefined"
              ? " - " + record.request_type
              : ""
          }`;
        },
        filters: [
          {
            text: "استحقاقی - روزانه",
            value: "استحقاقی - روزانه",
          },
          {
            text: "استعلاجی - روزانه",
            value: "استعلاجی - روزانه",
          },
          {
            text: "تشویقی - روزانه",
            value: "تشویقی - روزانه",
          },
          {
            text: "استحقاقی - ساعتی",
            value: "استحقاقی - ساعتی",
          },
          {
            text: "استعلاجی - ساعتی",
            value: "استعلاجی - ساعتی",
          },
          {
            text: "تشویقی - ساعتی",
            value: "تشویقی - ساعتی",
          },
          {
            text: "بدون حقوق",
            value: "بدون حقوق",
          },
        ],
      }),

      onFilter: (value, record) => {
        let fullText = record.type + " - " + record.request_type;
        return fullText.indexOf(value) === 0;
      },

      render: (text, record) => {
        return (
          <span>{`${text} ${
            record.request_type &&
            record.request_type != "undefined" &&
            text != "بدون حقوق"
              ? " - " + record.request_type
              : ""
          }`}</span>
        );
      },
      sorter: (a, b) => {
        if (a.type.localeCompare(b.type) === 0) {
          return a.request_type.localeCompare(b.request_type);
        } else {
          return a.type.localeCompare(b.type);
        }
      },
    },
    {
      title: "مدت",
      dataIndex: "duration",
      sorter: (a, b) =>
        a.request_type === "ساعتی" ? a.hours - b.hours : a.days - b.days,
      render: (_, record) =>
        record.request_type === "ساعتی"
          ? `${record.hours} ساعت`
          : `${record.days + 1} روز`,
    },
    {
      //  width: 100,
      title: "تاریخ",
      dataIndex: "period",
      ...tableDateFilter("period", "دوره", { period: true }),
      render: (text, record) => {
        if (record.request_type === "ساعتی") {
          return (
            <span>
              <span>
                از : {timeToFa(record.from_date).split("-")[0]} تا{"  "}
                {timeToFa(record.to_date)}
              </span>
            </span>
          );
        } else {
          return (
            <span>
              از تاریخ: {timeToFa(record.from_date, false)} تا{"  "}
              {timeToFa(record.to_date, false)}
            </span>
          );
        }
      },
      sorter: (a, b) =>
        a.to_date
          ? dateToInt(timeToFa(a.to_date, false)) -
            dateToInt(timeToFa(b.to_date, false))
          : false,
    },
    // {
    //   //  width: 100,
    //   title: "سال",
    //   dataIndex: "year",
    //   hideMobile: true,
    //   className: "d-none",
    //   ...tableSelectSearch("year", "سال", {
    //     filters: [
    //       {
    //         text: "1399",
    //         value: "1399",
    //       },
    //       {
    //         text: "1400",
    //         value: "1400",
    //       },
    //       {
    //         text: "1401",
    //         value: "1401",
    //       },
    //       {
    //         text: "1402",
    //         value: "1402",
    //       },
    //     ],
    //   }),

    //   onFilter: (value, record) => {
    //     return record.year == value;
    //   },
    //   render(text, record) {
    //     return record.year;
    //   },
    // },
    {
      //  width: 100,
      key: "usedInYear",
      id: "usedInYear",
      title: (
        <div>
          <span>استفاده شده</span>
          <br />
          <span>در سال</span>
        </div>
      ),
      dataIndex: "usedInYear",
      sorter: (a, b) => a.daysYear - b.daysYear,
      //...tableSearch("used", "استفاده شده در سال"),
      render: (value, record) => {
        if (record.type === "بدون حقوق" || record.type === "تشویقی") {
          return "-";
        } else {
          return value;
        }
      },
    },
    {
      //  width: 100,
      key: "usedInMonth",
      id: "usedInMonth",
      title: (
        <div>
          <span>استفاده شده</span>
          <br />
          <span>در ماه</span>
        </div>
      ),
      dataIndex: "usedInMonth",
      sorter: (a, b) => a.daysMonth - b.daysMonth,
      //...tableSearch("used", "استفاده شده در سال"),
      render: (value, record) => {
        if (record.type === "بدون حقوق" || record.type === "تشویقی") {
          return "-";
        } else {
          return value;
        }
      },
    },
    {
      //  width: 100,
      key: "usedAll",
      id: "usedAll",
      title: "مجموع",
      dataIndex: "usedAll",
      sorter: (a, b) => a.daysAll - b.daysAll,
      //...tableSearch("used", "استفاده شده در سال"),
      render: (value, record) => {
        if (record.type === "بدون حقوق" || record.type === "تشویقی") {
          return "-";
        } else {
          return value;
        }
      },
    },
    // {
    //   width: 100,
    //   title: "مانده در سال",
    //   dataIndex: "remaining",
    // },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت تایید",
      dataIndex: "status",
      key: "status",
      //sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : false),
      ...tableSelectSearch("status", "وضعیت تایید", {
        filters: [
          {
            text: "در انتظار تایید",
            value: "در انتظار تایید",
          },
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
        return record.status === value;
      },
      render: (status, record) => {
        if (checkAccess([permission.APPROVETIMEOFF])) {
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
        } else {
          return status === null || !status ? "در انتظار تایید" : status;
        }
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
