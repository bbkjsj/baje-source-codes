import AppButton from "components/general/AppButton";
import React from "react";
import TableActions from "components/general/TableActions";
import { deleteMachineHandler } from "../utils/index";
import { getLink } from "_helpers";
import { pageNames } from "constant";
import { permission } from "json/Permission";
import { stringifyUrl } from "query-string";
import { Menu } from "antd";
import AppPopConfirm from "components/general/AppPopConfirm";
import { DeleteFilled } from "@ant-design/icons";

const { EDIT_MACHINERY, DELETE_MACHINERY } = permission;
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;
export const alphabetList = [
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
export const columns = (
  setDeleteLoading,
  successDelete,
  history,
  tableSearch,
  searchParams,
  tableInfo
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "مشاهده",
        onClick: () =>
          history.push(getLink(pageNames.machinery.view, record.id)),
      },
      {
        name: "ویرایش",
        onClick: () =>
          history.push(getLink(pageNames.machinery.edit, record.id)),
        permission: EDIT_MACHINERY,
      },
      {
        name: "حذف",
        onClick: () =>
          deleteMachineHandler(
            [{ id: record.id, cid: record.contract_id }],
            setDeleteLoading,
            successDelete
          ),
        permission: DELETE_MACHINERY,
      },
      {
        name: "مشاهده بازرسی ها",
        onClick: () => {
          history.push(
            stringifyUrl({
              url: pageNames.hse.audit.index,
              query: { organization_code: record.organizationCode },
            })
          );
        },
        children: "مشاهده بازرسی ها",
        style: { width: "inherit" },
      },
      {
        name: "بازرسی جدید",
        onClick: () => {
          history.push(
            stringifyUrl({
              url: pageNames.hse.audit.addEdit,
              query: { organization_code: record.organizationCode },
            })
          );
        },
        children: "بازرسی جدید",
        style: { width: "inherit" },
      },
      {
        name: "بیمه های شخص ثالث",
        onClick: () => {
          history.push(
            stringifyUrl({
              url: pageNames.personnel.insurance.thirdPartyIns.list,
              query: { machineOrganizationCode: record.organizationCode },
            })
          );
        },
        children: "بیمه های شخص ثالث",
        style: { width: "inherit" },
      },
    ];
    return list;
  };

  const otherActions = (record, history) => (
    <Menu>
      {generateIcons(record).map((item, idx) => {
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
    {
      width: 65,
      title: "",
      align: "center",
      dataIndex: "id",
      key: "id",

      render: (text, record, index) => {
        const currPage = tableInfo?.pagination?.current || 1;
        const pageSize = tableInfo?.pagination?.pageSize || 20;
        const prevTotal = (currPage - 1) * pageSize;

        return prevTotal + index + 1;
      },
    },
    {
      // width: 100,
      title: "مالک",
      dataIndex: "ownerCompanyName",
      key: "ownerCompanyName",
      ...tableSearch("ownerCompanyName", "مالک"),
      sorter: (a, b) =>
        a.ownerCompanyName ? a.ownerCompanyName - b.ownerCompanyName : false,
      render: (ownerCompanyName, record) =>
        ownerCompanyName
          ? ownerCompanyName
          : record.ownerFirstName && record.ownerLastName
          ? `${record.ownerFirstName} ${record.ownerLastName}`
          : "-",
    },
    {
      // width: 100,
      title: "کد سازمانی",
      dataIndex: "organizationCode",
      key: "organizationCode",
      ...tableSearch("organizationCode", "کد سازمانی"),
      sorter: (a, b) =>
        a.organizationCode ? a.organizationCode - b.organizationCode : false,
      render: (text, record) => (text ? text : wrongText),
    },
    {
      // width: 100,
      title: "شماره شاسی",
      dataIndex: "chassisNumber",
      key: "chassisNumber",
      ...tableSearch("chassisNumber", "شماره شاسی"),
      sorter: (a, b) =>
        a.chassisNumber ? a.chassisNumber - b.chassisNumber : false,
    },
    {
      // width: 100,
      title: "شماره موتور",
      dataIndex: "engineNumber",
      key: "engineNumber",
      ...tableSearch("engineNumber", "شماره موتور"),
      sorter: (a, b) =>
        a.engineNumber ? a.engineNumber - b.engineNumber : false,
    },
    {
      // width: 100,
      title: "نوع",
      dataIndex: "type",
      key: "type",
      ...tableSearch("type", "نوع"),
      sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
      render: (text, record) => <p>{text}</p>,
    },

    {
      title: "سیستم",
      // width: 100,
      dataIndex: "system",
      key: "system",
      ...tableSearch("system", "تیپ"),
      sorter: (a, b) => (a.system ? a.system.localeCompare(b.system) : false),
      render: (text, record) => <p>{text}</p>,
    },

    {
      // width: 100,
      title: "تیپ",
      dataIndex: "style",
      key: "style",
      ...tableSearch("style", "تیپ"),
      sorter: (a, b) => (a.style ? a.style.localeCompare(b.style) : false),
      render: (text, record) => <p>{text}</p>,
    },
    {
      // width: 100,
      title: "شرکت",
      dataIndex: "companyName",
      key: "companyName",
      ...tableSearch("companyName", "شرکت"),
      sorter: (a, b) =>
        a.companyName ? a.companyName.localeCompare(b.companyName) : false,
      render: (text, record) => <p>{text}</p>,
    },
    {
      // width: 150,
      title: "محل استقرار",
      dataIndex: "environmentTitle",
      key: "environmentTitle",
      ...tableSearch("environmentTitle", "محل استقرار"),
      sorter: (a, b) =>
        a.environmentTitle
          ? a.subject.localeCompare(b.environmentTitle)
          : false,
      render: (text, record) => <div className="tabel-big-text">{text}</div>,
    },
    {
      // width: 100,
      title: "پلاک",
      dataIndex: "plaque",
      key: "plaque",
      ...tableSearch("plaque", "پلاک"),
      // sorter: (a, b) => (a.subject ? a.subject.localeCompare(b.subject) : false),
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
      // width: 100,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={[]}
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
