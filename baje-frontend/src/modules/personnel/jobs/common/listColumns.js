import React from "react";
import { Menu, Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import TableActions from "components/general/TableActions";
import AppSwitch from "components/general/AppSwitch";
import { getLink } from "_helpers";
import { pageNames } from "constant";

const generateIcons = (record, history, deleteItem) => {
  const deleteOnClick = () => {
    deleteItem(record.id);
  };

  let actionsList = [];

  if (record.title !== "مدیر عامل" && record.title !== "مدیر پروژه") {
    actionsList.push({
      //hide: insurance.status !== "عدم تایید",
      name: "delete",
      onClick: deleteOnClick,
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    });
  }
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
  searchParams,
  setAccessModal,
  setCodesModal,
  setChartsModal,
  setSelectedId
) => {
  const generateMore = (record) => {
    const list = [
      {
        name: "سطوح دسترسی",
        onClick: () => {
          setSelectedId(record.id);
          setAccessModal(true);
        },
      },
      {
        name: "کد شغل های تامین اجتماعی",
        onClick: () => {
          setSelectedId(record.id);
          setCodesModal(true);
        },
      },
      {
        name: "ملاک های ممیزی",
        onClick: () =>
          history.push(pageNames.hse.checklist.index + `?job_id=${record.id}`),
      },
      {
        name: "چارت های استفاده شده",
        onClick: () => {
          setSelectedId(record.id);
          setChartsModal(true);
        },
      },
    ];
    return list;
  };

  const otherActions = (record, history) => (
    <Menu>
      {generateMore(record).map((item, idx) => {
        return (
          <Menu.Item onClick={item?.onClick} key={idx}>
            {item?.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

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
      title: "کد یکتای شغل",
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
      title: "عنوان شغل",
      dataIndex: "title",
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
      ...tableSearch("title", "عنوان شغل"),
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت شغل",
      dataIndex: "status",
      key: "status",
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
                  const newStatus = status == 1 ? 0 : 1;
                  changeStatus(newStatus, record.id, record.title);
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
            list={generateIcons(record, history, deleteItem)}
            moreMenu={otherActions(record, history)}
          />
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
