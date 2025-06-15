import React from "react";
import { timeToFa, getLink, covetFormatDateToFA, dateToInt } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _CHANGE_STATUS } from "modules/personnel/realPerson/mission/utils/api";
import TableActions from "components/general/TableActions";
import AppMenuItem from "components/general/AppMenuItem";
import { Menu } from "antd";
import { baseLevels, levels } from "json/Permission";

export const renderColumns = ({
  tableSearch,
  searchParams,
  setEditModal,
  deleteItem,
  setSelectedId,
}) => {
  const generateIcons = (record) => {
    const editOnClick = () => {
      setSelectedId({
        id: record.id,
        accessId: record.accessId,
        endDate: record.endDate,
        startDate: record.startDate,
      });
      setEditModal(true);
    };
    const deleteOnClick = () => {
      deleteItem(record.accessId);
    };

    let option = [
      { name: "edit", onClick: editOnClick, title: "ویرایش" },
      {
        name: "delete",
        onClick: deleteOnClick,
        title: "حذف",
        warningText: !record.relation && "آیا از حذف این دسترسی اطمینان دارید؟",
      },
    ];

    return option;
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
      title: "دارنده",
      dataIndex: "personnelFirstName",
      hidden: !window.location.pathname.includes("all"),
      ...tableSearch("full_name", "نام و نام خانوادگی", {
        multipleColumn: ["personnelFirstName", "personnelLastName"],
      }),
      render: (text, record) => {
        return (
          <span>{`${record.personnelFirstName} ${record.personnelLastName}`}</span>
        );
      },
      sorter: (a, b) =>
        a.personnelFirstName
          ? a.personnelFirstName.localeCompare(b.personnelFirstName)
          : false,
    },
    {
      title: "کد ملی",
      hidden: !window.location.pathname.includes("all"),
      dataIndex: "personnelNationalNumber",
      ...tableSearch("personnelNationalNumber", "کد ملی"),
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
      title: "کد",
      dataIndex: "accessCode",
      ...tableSearch("accessCode", "کد"),
      sorter: (a, b) => (a.code ? Number(a.code) - Number(b.code) : false),
    },
    {
      title: "ایجاد کننده",
      dataIndex: "operatorFullName",
      ...tableSearch("operatorFullName", "ایجاد کننده"),
      sorter: (a, b) =>
        a.operatorFullName
          ? a.creator.localeCompare(b.operatorFullName)
          : false,
    },
    {
      title: "کد ملی ایجاد کننده",
      dataIndex: "operatorNationalNumber",
      ...tableSearch("operatorNationalNumber", "کد ملی ایجاد کننده"),
    },
    {
      // width: 100,
      title: "تاریخ شروع",
      align: "center",
      key: "startDate",
      dataIndex: "startDate",
      render: (startDate) => {
        return timeToFa(startDate, false).includes("Invalid")
          ? "-"
          : timeToFa(startDate, false);
      },
      sorter: (a, b) =>
        a.startDate
          ? dateToInt(timeToFa(a.startDate, false)) -
            dateToInt(timeToFa(b.startDate, false))
          : false,
    },
    {
      //  width: 100,
      title: "تاریخ پایان",
      align: "center",
      key: "endDate",
      dataIndex: "endDate",
      render: (endDate) => {
        return endDate?.includes("2099") ||
          timeToFa(endDate, false).includes("Invalid")
          ? "-"
          : timeToFa(endDate, false);
      },
      sorter: (a, b) =>
        a.endDate
          ? dateToInt(timeToFa(a.endDate, false)) -
            dateToInt(timeToFa(b.endDate, false))
          : false,
    },
    {
      title: "حوزه",
      dataIndex: "accessLevel",
      ...tableSearch("accessLevel", "حوزه"),
      render: (text) => baseLevels[text]?.label || "نامشخص",
      sorter: (a, b) => (a.level ? a.level.localeCompare(b.level) : false),
    },
    {
      title: "آدرس شاخه",
      dataIndex: "branch",
      ...tableSearch("branch", "آدرس شاخه"),
      render: (_, record) =>
        record.environmentName || record.companyName || "-",
      sorter: (a, b) => (a.branch ? a.branch.localeCompare(b.branch) : false),
    },
    {
      //  width: 80,
      align: "center",
      title: "ابزار",
      key: "action",
      render: (_, record) => {
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

  columns = columns.filter((column) => !column.hidden);

  return columns;
};
