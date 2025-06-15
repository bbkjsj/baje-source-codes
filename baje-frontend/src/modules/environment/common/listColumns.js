import React from "react";
import { Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import TableActions from "components/general/TableActions";
import AppSwitch from "components/general/AppSwitch";

const generateIcons = (record, history, deleteItem) => {
  const deleteOnClick = () => {
    deleteItem(record.id);
  };

  let actionsList = [];

  actionsList.push({
    name: "delete",
    onClick: deleteOnClick,
    warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
  });

  return actionsList;
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  selectSearch,
  changeStatus,
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
      title: "کد یکتای کاربری محیط",
      dataIndex: "id",
      //...tableSearch("id", "کد شغل"),
      sorter: (a, b) => a.id - b.id,
      render: (text) => {
        const count = 5 - text.toString().length;
        let code = "0".repeat(count) + text;
        return code;
      },
    },
    {
      title: "عنوان کاربری محیط",
      dataIndex: "title",
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
      ...tableSearch("title", "عنوان کاربری محیط"),
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت کاربری محیط",
      dataIndex: "isEnable",
      key: "isEnable",
      //sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : false),
      ...selectSearch("status", "وضعیت", {
        filters: [
          {
            text: "فعال",
            value: 1,
          },
          {
            text: "غیرفعال",
            value: 0,
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.status == 1 && value == 1) ||
          (record.status == 0 && value == 0)
        ) {
          return 1;
        }
        return 0;
      },
      render: (status, record) => {
        return (
          <AppSwitch
            checked={status == 1 ? 1 : 0}
            onChange={() => {
              confirm({
                title: "آیا مطمئن هستید؟",
                icon: <ExclamationCircleOutlined />,
                okText: "تایید",
                cancelText: "لغو",
                centered: true,
                closable: true,
                onOk() {
                  const newStatus = status !== 1;

                  changeStatus(newStatus, record.id);
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
