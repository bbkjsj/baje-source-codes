import React from "react";
import { timeToFa, getLink, dateToInt } from "_helpers";
import { Menu } from "antd";
import { pageNames } from "constant";
import { _UPDATE_INSURANCE_STATUS } from "modules/personnel/SupplementaryInsurance/util/api";
import TableChangeStatus from "components/general/TableChangeStatus";
import TableActions from "components/general/TableActions";
import { permission as permissions } from "json/Permission";

const handleRowStatus = (personnelCount, status, type = null) => {
  // if (status === "عدم تایید" || status === null) {
  //   if (type === "remove" && personnelCount > 0) {
  return false;
  //   }
  //   return false;
  // } else return true;
};

const generateIcons = (
  record,
  history,
  deleteItem,
  detailView,
  checkAccess
) => {
  const detailOnClick = () =>
    history.push(
      getLink(pageNames.personnel.insurance.supplymentary.view, record.id)
    );
  const personListOnClick = () => {
    history.push(
      getLink(
        pageNames.personnel.insurance.supplymentary.personnel.list,
        record.id
      )
    );
  };
  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.insurance.supplymentary.edit, record.id)
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };
  const detailViewTrigger = () => {
    detailView(record.id);
  };
  return [
    { name: "detail", onClick: detailViewTrigger },
    {
      name: "edit",
      onClick: editOnClick,
      hide: record.approved || !checkAccess([permissions.ENVIRONMENT_EDIT]),
    },
    {
      name: "delete",
      onClick: deleteOnClick,
      hide: record.approved || !checkAccess([permissions.ENVIRONMENT_DELETE]),
    },
  ];
};

const otherActions = (record, history) => (
  <Menu>
    <Menu.Item
      onClick={() => {
        localStorage.setItem("record", JSON.stringify(record));
        history.push(
          getLink(pageNames.personnel.insurance.supplymentary.personnel.list, {
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
  detailView,
  list,
  history,
  deleteItem,
  tableSearch,
  tableDate,
  tableSelect,
  updateList,
  setLoadingList,
  searchParams,
  checkAccess
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

    {
      // width: 100,
      title: "تاریخ شروع",
      align: "center",
      key: "contract_date_from_date",
      dataIndex: "contract_date_from_date",
      ...tableDate("contract_date_from_date", "تاریخ شروع"),
      // defaultSortOrder: "descend",
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
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "approved",
      key: "approved",

      ...tableSelect("approved", "وضعیت", {
        filters: [
          {
            text: "تایید نهایی",
            value: 1,
          },
          {
            text: "عدم تایید",
            value: 0,
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.approved === 0 && value === 0) ||
          (record.approved === 1 && value === 1)
        ) {
          return true;
        }
        return false;
      },
      render: (text, record) => {
        return (
          <TableChangeStatus
            value={text === 1 ? 1 : 0}
            options={[
              { label: "تایید نهایی", value: 1 },
              { label: "عدم تایید", value: 0 },
            ]}
            id={record.id}
            requestApi={_UPDATE_INSURANCE_STATUS}
            setLoadingList={setLoadingList}
            afterChange={updateList}
          />
        );
      },
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
            list={generateIcons(
              record,
              history,
              deleteItem,
              detailView,
              checkAccess
            )}
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
