import React from "react";
import {
  timeToFa,
  getLink,
  covetFormatDateToFA,
  downloadExcel,
} from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _CHANGE_STATUS } from "modules/personnel/realPerson/mission/utils/api";
import TableActions from "components/general/TableActions";
import AppMenuItem from "components/general/AppMenuItem";
import { Menu } from "antd";
import { endpoint, updatePermissionStatus } from "../utils/api";

export const renderColumns = ({
  list,
  history,
  updateList,
  setLoadingList,
  tableSearch,
  tableSelect,
  searchParams,
  setSelectedId,
  setCodesModal,
  setJobsModal,
}) => {
  const otherActions = (record) => {
    const actions = [
      {
        title: "دارندگان",
        onClick: () => {
          downloadExcel(
            endpoint("/access/report/excel/personnel-access/" + record.code)
          );
        },
      },
      {
        title: "مشاغل دارای دسترسی",
        onClick: () => {
          setSelectedId(record.code);
          setJobsModal(true);
        },
      },
      {
        title: "دسترسی های لازم",
        onClick: () => {
          setSelectedId(record.code);
          setCodesModal(true);
        },
      },
      {
        title: "دسترسی های ملزوم",
        onClick: () => {
          downloadExcel(
            endpoint("/access/report/excel/prerequisite/" + record.code)
          );
        },
      },
    ];
    return actions.filter((el) => !el.hidden).length > 0 ? (
      <Menu>
        {actions.map((item, idx) => (
          <AppMenuItem key={idx} onClick={item.onClick} hidden={item.hidden}>
            {item.title}
          </AppMenuItem>
        ))}
      </Menu>
    ) : (
      false
    );
  };

  let columns = [
    // {
    //   width: 65,
    //   title: "",
    //   align: "center",
    //   key: "number",
    //   dataIndex: "number",
    //   render: (text, record) => {
    //     return list.indexOf(record) + 1;
    //   },
    // },
    {
      width: 65,
      title: "کد",
      dataIndex: "code",
      ...tableSearch("code", "کد"),
      sorter: (a, b) => (a.code ? Number(a.code) - Number(b.code) : false),
    },
    {
      title: "ماژول",
      dataIndex: "module",
      ...tableSearch("module", "ماژول"),
      sorter: (a, b) => (a.module ? a.module.localeCompare(b.module) : false),
    },
    {
      title: "دسترسی",
      dataIndex: "label",
      ...tableSearch("label", "دسترسی"),
      sorter: (a, b) => (a.label ? a.label.localeCompare(b.label) : false),
    },
    {
      title: "کوچکترین حوزه دسترسی",
      dataIndex: "baseLevelLabel",
      ...tableSearch("baseLevelLabel", "کوچکترین حوزه دسترسی"),
      sorter: (a, b) =>
        a.baseLevelLabel
          ? a.baseLevelLabel.localeCompare(b.baseLevelLabel)
          : false,
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
            text: "فعال",
            value: true,
          },
          {
            text: "غیر فعال",
            value: false,
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.status === true && value === true) ||
          (record.status === false && value === false)
        ) {
          return true;
        }
        return false;
      },
      render: (status, record) => {
        return (
          <TableChangeStatus
            value={status ?? "نامشخص"}
            options={[
              { label: "فعال", value: true },
              { label: "غیر فعال", value: false },
            ]}
            id={record.id}
            requestApi={updatePermissionStatus}
            afterChange={updateList}
            setLoadingList={setLoadingList}
          />
        );
      },
    },
    {
      //  width: 80,
      align: "center",
      title: "ابزار",
      key: "action",
      render: (_, record) => {
        return (
          <TableActions list={[]} moreMenu={otherActions(record, history)} />
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
