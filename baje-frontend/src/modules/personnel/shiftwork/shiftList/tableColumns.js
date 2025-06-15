import React, { useState } from "react";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getShiftPatternString,
  getShiftWorkingDays,
  getShiftWorkingHours,
} from "../utils/misc";
import { getLink } from "_helpers";
import { pageNames } from "constant";
import Modal from "antd/es/modal/Modal";
import TableActions from "components/general/TableActions";

export const columns = ({
  list,
  history,
  deleteHandler,
  setCommitteeId,
  tableSearch,
  rangeFilter,
  updateItemStatus,
  selectSearch,
  searchParams,
}) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.personnel.shiftWork.edit, record.id)),
        hide: record.enabled,
      },
      {
        name: "delete",
        onClick: () => deleteHandler(record.id),
      },
    ];
    return list;
  };
  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      title: "کد یکتا",
      dataIndex: "id",
      width: 100,
      //...tableSearch("id", "کد"),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "نام شیفت",
      key: "title",
      dataIndex: "title",
      ...tableSearch("title", "نام شیفت"),
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
    },
    {
      title: "تعداد روز دوره کاری",
      key: "workDays",
      render: (record) => {
        return getShiftWorkingDays(record["patterns"]);
      },
    },
    {
      title: "تعداد ساعت دوره کاری",
      key: "workHours",
      render: (record) => {
        return getShiftWorkingHours(record["patterns"]);
      },
    },
    {
      title: "الگوی شیفت",
      key: "shiftPattern",
      render: (record) => {
        return getShiftPatternString(record["patterns"]).map((item) => [
          item,
          <br />,
        ]);
      },
    },
    {
      title: "وضعیت",
      width: 60,
      key: "enabled",
      dataIndex: "enabled",
      //sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : false),
      ...selectSearch("enabled", "وضعیت", {
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
          (record.enabled && value === true) ||
          (!record.enabled && value === false)
        ) {
          return true;
        }
        return false;
      },
      render: (value, record) => {
        return (() => {
          const [status, setStatus] = useState(!!value);

          const handleClick = () => {
            const newStatusString = !status === false ? "غیرفعال" : "فعال";

            // if (!record.is_removable) {
            //   Modal.warn({
            //     title: "عدم امکان غیرفعالسازی",
            //     content:
            //       "شیفت کاری به افراد اختصاص داده شده و امکان غیرفعالسازی آن وجود ندارد.",
            //   });

            //   return;
            // }

            Modal.confirm({
              title: "تغییر وضعیت شیفت کاری",
              content:
                "آیا مطمئن هستید که میخواهید این شیفت را " +
                newStatusString +
                " نمایید؟",
              onOk: async () => {
                updateItemStatus(record.id, !status);
                setStatus((curr) => !curr);
              },
            });
          };

          return (
            <Switch
              checked={status}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onClick={handleClick}
            />
          );
        })();
      },
    },
    {
      align: "right",
      title: "تنظیمات",
      key: "action",
      render: (record) => {
        return <TableActions list={generateIcons(record)} />;
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
