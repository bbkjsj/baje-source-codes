import React from "react";
import {
  timeToFa,
  getLink,
  covetFormatDateToFA,
  convertToShamsi,
  dateToInt,
} from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _CHANGE_STATUS } from "../utils/api";
import TableActions from "components/general/TableActions";
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;
const alphabetList = [
  { label: "الف", value: "1" },
  { label: "ب", value: "2" },
  { label: "پ", value: "3" },
  { label: "ت", value: "4" },
  { label: "ث", value: "5" },
  { label: "ج", value: "6" },
  { label: "چ", value: "7" },
  { label: "ح", value: "8" },
  { label: "خ", value: "9" },
  { label: "د", value: "10" },
  { label: "ذ", value: "11" },
  { label: "ر", value: "12" },
  { label: "ز", value: "13" },
  { label: "ژ", value: "14" },
  { label: "س", value: "15" },
  { label: "ش", value: "16" },
  { label: "ص", value: "17" },
  { label: "ض", value: "18" },
  { label: "ط", value: "19" },
  { label: "ظ", value: "20" },
  { label: "ع", value: "21" },
  { label: "غ", value: "22" },
  { label: "ف", value: "23" },
  { label: "ق", value: "24" },
  { label: "ک", value: "25" },
  { label: "گ", value: "26" },
  { label: "ل", value: "27" },
  { label: "م", value: "28" },
  { label: "ن", value: "29" },
  { label: "و", value: "30" },
  { label: "ه", value: "31" },
  { label: "ی", value: "32" },
];
const generateIcons = (record, history, deleteItem) => {
  const detailOnClick = () => {
    history.push(
      getLink(pageNames.personnel.insurance.thirdPartyIns.view, {
        id: record.id,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.insurance.thirdPartyIns.edit, {
        id: record.id,
      })
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };

  let option = [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: record.relation ? true : false,
    },
  ];
  // if status equals to confirm or not Option in table will be changed
  option =
    record.status === null || record.status == "0"
      ? [
          ...option,
          { onClick: editOnClick, name: "edit" },
          {
            onClick: deleteOnClick,
            warningText:
              !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
            name: "delete",
          },
        ]
      : option;

  //console.info(option);
  return option;
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  tableDateFilter,
  tableSelect,
  searchParams,
  tableInfo
) => {
  let columns = [
    {
      width: 65,
      title: "ردیف",
      align: "center",
      key: "number",
      dataIndex: "number",
      hideMobile: true,
      render: (text, record, index) => {
        const currPage = tableInfo?.pagination?.current || 1;
        const pageSize = tableInfo?.pagination?.pageSize || 20;
        const prevTotal = (currPage - 1) * pageSize;

        return prevTotal + index + 1;
      },
    },
    {
      //  width: 100,
      title: "کد سازمانی",
      dataIndex: "machineOrganizationCode",
      ...tableSearch("machineOrganizationCode", "کد سازمانی"),
      sorter: (a, b) =>
        a.machineOrganizationCode
          ? a.machineOrganizationCode.localeCompare(b.machineOrganizationCode)
          : false,
    },
    {
      //  width: 100,
      title: "نوع ماشین",
      dataIndex: "typeTitle",
      //...tableSearch("typeTitle", "نوع ماشین"),
      render: (text, record) => {
        return (
          <>
            <span>{record.typeTitle}</span> <span>{record.systemTitle}</span>{" "}
            <span>{record.styleTitle}</span>
          </>
        );
      },
      sorter: (a, b) =>
        a.typeTitle ? a.typeTitle.localeCompare(b.typeTitle) : false,
    },
    {
      //  width: 100,
      title: "شماره انتظامی",
      dataIndex: "plaque",
      //...tableSearch("pla", "کد سازمانی"),
      render: (text, record) => {
        if (record.plaque1 != -1 && record.plaque1 != null) {
          return `${record.plaque3}-${record.plaque4}-${
            alphabetList.find((el) => el.value == record.plaque2)?.label
          }-${record.plaque1}`;
        } else {
          return wrongText;
        }
      },
    },
    {
      //  width: 100,
      title: "شماره شاسی",
      dataIndex: "chassisNumber",
      ...tableSearch("chassisNumber", "شماره شاسی"),
    },
    {
      //  width: 100,
      title: "شماره موتور",
      dataIndex: "vinNumber",
      ...tableSearch("vinNumber", "شماره موتور"),
    },
    {
      //  width: 100,
      title: "شماره بیمه نامه",
      dataIndex: "insuranceNumber",
      ...tableSearch("insuranceNumber", "شماره بیمه نامه"),
    },
    {
      //  width: 100,
      title: "شرکت بیمه",
      dataIndex: "companyName",
      ...tableSearch("companyName", "شرکت بیمه"),
    },
    {
      // width: 100,
      title: "اعتبار",
      dataIndex: "toDate",
      // ...tableDateFilterTable("expiration_date", "تاریخ"),
      render: (text, record) => {
        return <span>{convertToShamsi(record.toDate)}</span>;
      },
      sorter: (a, b) =>
        a.date ? dateToInt(a.toDate) - dateToInt(b.toDate) : false,
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
            text: "تایید نهایی",
            value: "1",
          },
          {
            text: "عدم تایید",
            value: "0",
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.status == "1" && value == "1") ||
          (record.status == "0" && value == "0")
        ) {
          return true;
        }
        return false;
      },
      render: (status, record) => {
        return record.status == "1" ? "تایید نهایی" : "عدم تایید";
      },
    },
    {
      //  width: 80,
      align: "center",
      title: "ابزار",
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
