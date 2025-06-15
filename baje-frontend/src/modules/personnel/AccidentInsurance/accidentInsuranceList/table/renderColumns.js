import React from "react";
import { timeToFa, getLink, dateToInt } from "_helpers";
import TableActions from "components/general/TableActions";
import { Menu } from "antd";
import { pageNames } from "constant";
const handleRowStatus = (personnelCount, status, type = null) => {
  // if (status === "عدم تایید" || status === null) {
  //   if (type === "remove" && personnelCount > 0) {
  return false;
  //   }
  //   return false;
  // } else return true;
};

const generateIcons = (record, setInsurance, history, deleteItem) => {
  const detailOnClick = () =>
    history.push(
      getLink(pageNames.personnel.insurance.accident.view, record.id)
    );

  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.insurance.accident.edit, record.id)
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };
  return [
    { name: "detail", onClick: detailOnClick },
    { name: "edit", onClick: editOnClick },
    {
      name: "delete",
      onClick: deleteOnClick,
      hide: handleRowStatus(record.personnel_count, record.status, "remove"),
    },
  ];
};

const otherActions = (record, history, setInsurance, setInsuranceId) => (
  <Menu>
    <Menu.Item
      onClick={() => {
        setInsurance(record);
        setInsuranceId(record.id);
        localStorage.setItem("record", JSON.stringify(record));
        history.push(
          getLink(pageNames.personnel.insurance.accident.personnel.list, {
            id: record.id,
          })
        );
      }}
    >
      لیست افراد
    </Menu.Item>
  </Menu>
);

export const renderColumns = (
  list,
  history,
  deleteItem,
  setInsurance,
  setInsuranceId,
  tableSearch,
  tableDate,
  tableSelect,
  searchParams
) => {
  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "count",
      dataIndex: "count",
      render: (text, record, index) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      //  width: 100,
      title: "بیمه گر",
      align: "center",
      key: "insurer_main",
      dataIndex: "insurer_main",
      ...tableSearch("insurer_main", "بیمه گر"),
      sorter: (a, b) =>
        a.insurer_main ? a.insurer_main.localeCompare(b.insurer_main) : false,
    },
    {
      //  width: 100,
      title: "بیمه گذار",
      align: "center",
      key: "insurer_company",
      dataIndex: "insurer_company",
      ...tableSearch("insurer_company", "بیمه گذار"),
      sorter: (a, b) =>
        a.insurer_company
          ? a.insurer_company.localeCompare(b.insurer_company)
          : false,
    },
    // {
    //   // width: 100,
    //   title: "نوع بیمه",
    //   align: "center",
    //   key: "type",
    //   dataIndex: "type",
    //   sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
    //   ...tableSelect("type", "نوع بیمه", {
    //     filters: [
    //       {
    //         text: "تکمیلی",
    //         value: "تکمیلی",
    //       },
    //       {
    //         text: "عمر و حادثه",
    //         value: "عمر و حادثه",
    //       },
    //     ],
    //   }),
    //   onFilter: (value, record) => record.type.indexOf(value) === 0,
    // },
    {
      // width: 100,
      title: "تاریخ شروع",
      align: "center",
      key: "contract_date_from_date",
      dataIndex: "contract_date_from_date",
      ...tableDate("contract_date_from_date", "تاریخ شروع"),
      render: (contract_date_from_date) => {
        return timeToFa(contract_date_from_date, false);
      },
      sorter: (a, b) =>
        a.contract_date_from_date
          ? dateToInt(timeToFa(a.contract_date_from_date, false)) -
            dateToInt(timeToFa(b.contract_date_from_date, false))
          : false,
    },
    {
      //  width: 100,
      title: "تاریخ پایان",
      align: "center",
      key: "to_date",
      dataIndex: "to_date",
      ...tableDate("to_date", "تاریخ پایان"),
      render: (to_date) => {
        return timeToFa(to_date, false);
      },
      sorter: (a, b) =>
        a.to_date
          ? dateToInt(timeToFa(a.to_date, false)) -
            dateToInt(timeToFa(b.to_date, false))
          : false,
    },
    {
      //  width: 100,
      title: "تاریخ قرارداد",
      align: "center",
      key: "contract_issue_date",
      dataIndex: "contract_issue_date",
      ...tableDate("contract_issue_date", "تاریخ قرارداد"),
      render: (contract_issue_date) => {
        return timeToFa(contract_issue_date, false);
      },
      sorter: (a, b) =>
        a.contract_issue_date
          ? dateToInt(a.contract_issue_date) - dateToInt(b.contract_issue_date)
          : false,
    },
    {
      //  width: 100,
      title: "شماره قرارداد",
      align: "center",
      key: "contract_number",
      dataIndex: "contract_number",
      ...tableSearch("contract_number", "شماره قرارداد"),
      sorter: (a, b) =>
        a.contract_number
          ? a.contract_number.localeCompare(b.contract_number)
          : false,
    },
    {
      //  width: 100,
      title: "کد یکتا",
      align: "center",
      key: "insurer_id",
      dataIndex: "insurer_id",
      ...tableSearch("insurer_id", "کد یکتا"),
      sorter: (a, b) =>
        a.insurer_id ? a.insurer_id.localeCompare(b.insurer_id) : false,
    },
    {
      //  width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record, setInsurance, history, deleteItem)}
            moreMenu={otherActions(
              record,
              history,
              setInsurance,
              setInsuranceId
            )}
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
