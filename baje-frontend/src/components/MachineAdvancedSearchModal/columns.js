import React from "react";
import { getLink, getPlaqueString } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";
import { CheckOutlined } from "@ant-design/icons";
import { alphabetList } from "modules/machinery/MachineList/columns";

const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

export const columns = (
  history,
  tableSearch,
  searchParams,
  onChoose,
  selectSearch,
  filterOptions
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "انتخاب",
        icon: <CheckOutlined />,
        tooltip: "انتخاب",
        onClick: () => onChoose(record),
      },
    ];
    return list;
  };

  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      // width: 100,
      title: "مالک",
      dataIndex: "ownerCompanyName",
      key: "ownerCompanyName",
      //...tableSearch("ownerCompanyName", "مالک"),
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
      //...tableSearch("organizationCode", "کد سازمانی"),
      sorter: (a, b) =>
        a.organizationCode ? a.organizationCode - b.organizationCode : false,
      render: (text, record) => (text ? text : wrongText),
    },
    {
      // width: 100,
      title: "شماره شاسی",
      dataIndex: "chassisNumber",
      key: "chassisNumber",
      //...tableSearch("chassisNumber", "شماره شاسی"),
      sorter: (a, b) =>
        a.chassisNumber ? a.chassisNumber - b.chassisNumber : false,
    },
    {
      // width: 100,
      title: "شماره موتور",
      dataIndex: "engineNumber",
      key: "engineNumber",
      //...tableSearch("engineNumber", "شماره موتور"),
      sorter: (a, b) =>
        a.engineNumber ? a.engineNumber - b.engineNumber : false,
    },
    {
      // width: 100,
      title: "شرکت",
      dataIndex: "companyName",
      key: "companyName",
      //...tableSearch("name", "شرکت"),
      sorter: (a, b) =>
        a.companyName ? a.companyName.localeCompare(b.companyName) : false,
      render: (text, record) => <p>{text}</p>,
    },
    {
      // width: 100,
      title: "نوع",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
      ...selectSearch("type", "نوع", {
        filters: filterOptions.type,
      }),

      onFilter: (value, record) => {
        return record.type === value;
      },
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "سیستم",
      // width: 100,
      dataIndex: "system",
      key: "system",
      sorter: (a, b) => (a.system ? a.system.localeCompare(b.system) : false),
      ...selectSearch("system", "سیستم", {
        filters: filterOptions.system,
      }),

      onFilter: (value, record) => {
        return record.system === value;
      },
      render: (text, record) => <p>{text}</p>,
    },
    {
      // width: 100,
      title: "تیپ",
      dataIndex: "style",
      key: "style",
      sorter: (a, b) => (a.style ? a.style.localeCompare(b.style) : false),
      ...selectSearch("style", "تیپ", {
        filters: filterOptions.style,
      }),

      onFilter: (value, record) => {
        return record.style === value;
      },
      render: (text, record) => <p>{text}</p>,
    },
    {
      // width: 150,
      title: "محل استقرار",
      dataIndex: "environmentTitle",
      key: "environmentTitle",
      //...tableSearch("contractName", "محل استقرار"),
      sorter: (a, b) =>
        a.environmentTitle
          ? a.environmentTitle.localeCompare(b.environmentTitle)
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
      render: (text, record) => getPlaqueString(record),
    },
    {
      // width: 100,
      align: "center",
      title: "ابزار",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record)}
            record={record}
            contractKey="contract_id"
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
