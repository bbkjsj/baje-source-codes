import AppButton from "components/general/AppButton";
import React from "react";
import TableActions from "components/general/TableActions";
import { convertIdToCode, getLink } from "_helpers";
import { pageNames } from "constant";
import { permission } from "json/Permission";
import { stringifyUrl } from "query-string";
import { Menu, Modal, Popover } from "antd";
import AppPopConfirm from "components/general/AppPopConfirm";
import { DeleteFilled, ExclamationCircleOutlined } from "@ant-design/icons";
import AppSwitch from "components/general/AppSwitch";
import { getOccupiedTitle } from "../utils/utils";
import { permission as permissions } from "json/Permission";

const { EDIT_MACHINERY, DELETE_MACHINERY } = permission;

const columns = (
  setLoading,
  history,
  tableSearch,
  searchParams,
  tableInfo,
  tableSelect,
  changeStatus,
  deleteItem,
  checkAccess
) => {
  const generateIcons = (record) => {
    const detailOnClick = () => {
      history.push(
        getLink(pageNames.environment.view, {
          id: record.id,
        })
      );
    };
    const buttons = [
      {
        name: "detail",
        onClick: detailOnClick,
        hide: !checkAccess([permissions.ENVIRONMENT_VIEW]),
      },
    ];
    const list = [
      {
        name: "ویرایش",
        hide: !checkAccess([permissions.ENVIRONMENT_EDIT]),
        onClick: () =>
          history.push(getLink(pageNames.environment.edit, record.id)),
        // permission: EDIT_MACHINERY,
      },
      {
        name: "حذف",
        hide: !checkAccess([permissions.ENVIRONMENT_DELETE]),
        onClick: () => {
          deleteItem(record.id);
        },
      },
    ];
    return { list, buttons };
  };

  const otherActions = (record, history) => (
    <Menu>
      {generateIcons(record).list.map((item, idx) => {
        return item.name === "حذف" ? (
          <AppPopConfirm
            key={idx}
            title={"آیا برای حذف اطمینان دارید ؟"}
            onConfirm={item.onClick}
            placement="top"
          >
            <Menu.Item>{item?.name}</Menu.Item>
          </AppPopConfirm>
        ) : (
          <Menu.Item onClick={item?.onClick} key={idx}>
            {item?.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  let columns = [
    // {
    //   width: 65,
    //   title: "",
    //   align: "center",
    //   dataIndex: "id",
    //   key: "id",

    //   render: (text, record, index) => {
    //     const currPage = tableInfo?.pagination?.current || 1;
    //     const pageSize = tableInfo?.pagination?.pageSize || 20;
    //     const prevTotal = (currPage - 1) * pageSize;

    //     return prevTotal + index + 1;
    //   },
    // },
    {
      title: "کد یکتای محیط",
      dataIndex: "id",
      //...tableSearch("id", "کد شغل"),
      sorter: (a, b) => a.id - b.id,
      render: (text) => convertIdToCode(text),
    },
    {
      // width: 100,
      title: "نام محیط",
      dataIndex: "title",
      key: "title",
      ...tableSearch("title", "نام محیط"),
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
    },
    {
      // width: 100,
      title: "کاربری اصلی محیط",
      dataIndex: "usageTitle",
      key: "usageTitle",
      ...tableSearch("usageTitle", "کاربری اصلی محیط"),
      sorter: (a, b) =>
        a.usageTitle ? a.usageTitle.localeCompare(b.usageTitle) : false,
      render: (title) => {
        return title && title != null ? title : "وابسطه به زیر محیط ها";
      },
    },
    {
      //  width: 30,
      title: "وضعیت در چارت",
      dataIndex: "parentId",
      key: "parentId",

      // ...tableSelect("parentId", "وضعیت در چارت", {
      //   filters: [
      //     {
      //       text: "محیط",
      //       value: "محیط",
      //     },
      //     {
      //       text: "محاط",
      //       value: "محاط",
      //     },
      //   ],
      // }),

      // onFilter: (value, record) => {
      //   return record.parentId == -1;
      // },
      render: (status, record) => {
        return record.parentId == -1 ? "محیط" : "محاط";
      },
    },
    {
      //  width: 30,
      title: "وضعیت تصرف محیط",
      dataIndex: "occupiedStatus",
      key: "occupiedStatus",

      ...tableSelect("occupiedStatus", "وضعیت تصرف محیط", {
        filters: [
          {
            text: "تملیکی",
            value: "owned",
          },
          {
            text: "استیجاری",
            value: "rented",
          },
          {
            text: "امانی",
            value: "borrowed",
          },
          {
            text: "تحویلی از کارفرما",
            value: "ownedByEmployer",
          },
        ],
      }),

      onFilter: (value, record) => {
        return record.occupiedStatus == value;
      },
      render: (status, record) => {
        return getOccupiedTitle(record.occupiedStatus);
      },
    },
    {
      //  width: 30,
      align: "center",
      title: "چارت مستقل",
      dataIndex: "independentChart",
      key: "independentChart",
      //sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : false),
      ...tableSelect("independentChart", "چارت مستقل", {
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
          (record.independentChart == 1 && value == 1) ||
          (record.independentChart == 0 && value == 0)
        ) {
          return 1;
        }
        return 0;
      },
      render: (status, record) => {
        return (
          <Popover
            placement="right"
            content={
              <div style={{ width: "200px", textAlign: "justify" }}>
                در صورتی که تمایل دارید پرسنل این محیط، در فیلتر محیط ها و در
                گزارشات، از سایر محیط ها تفکیک و مشخص شوند، این ورودی را فعال، و
                دقت فرمایید که در صورت تغییر این ورودی، چارت سازمانی نیاز به
                اصلاح دارد
              </div>
            }
          >
            <AppSwitch
              checked={status == 1 ? 1 : 0}
              onChange={() => {
                const newStatus = status !== 1;

                changeStatus("independentChart", newStatus, record.id);
              }}
            />
          </Popover>
        );
      },
    },
    {
      //  width: 30,
      align: "center",
      title: "ماشین آلات مستقل",
      dataIndex: "independentVehicle",
      key: "independentVehicle",
      //sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : false),
      ...tableSelect("independentVehicle", "ماشین آلات مستقل", {
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
          (record.independentVehicle == 1 && value == 1) ||
          (record.independentVehicle == 0 && value == 0)
        ) {
          return 1;
        }
        return 0;
      },
      render: (status, record) => {
        return (
          <Popover
            placement="right"
            content={
              <div style={{ width: "200px", textAlign: "justify" }}>
                در صورتی که تمایل دارید ماشین آلات مستقر در این محیط در فیلتر
                محیط ها و در گزارشات از سایر محیط ها تفکیک و مشخص شوند این ورودی
                را فعال نمایید
              </div>
            }
          >
            <AppSwitch
              checked={status == 1 ? 1 : 0}
              onChange={() => {
                const newStatus = status !== 1;

                changeStatus("independentVehicle", newStatus, record.id);
              }}
            />
          </Popover>
        );
      },
    },

    {
      // width: 100,
      align: "center",
      title: "ابزار",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record).buttons}
            record={record}
            contractKey="contractId"
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

export default columns;
