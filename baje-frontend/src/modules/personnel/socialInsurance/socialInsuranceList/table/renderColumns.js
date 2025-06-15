import React from "react";
import { Menu } from "antd";
import { getLink, priceNormalizer } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { permission } from "json/Permission";
import { pageNames } from "constant";
import { _PUT_STATUS } from "modules/personnel/socialInsurance/util/api";
import TableActions from "components/general/TableActions";

const handleRowStatus = (personnelCount, status, type = null) => {
  if (status === "عدم تایید" || status === null) {
    if (type === "remove" && personnelCount > 0) {
      return true;
    }
    return false;
  } else return true;
};

const handleEditButton = (status) => {
  if (status === null) return false;
  if (status !== "عدم تایید") {
    return true;
  } else return false;
};

const generateIcons = (
  record,
  history,
  deleteItem,
  updateList,
  onDbfModal,
  onViewHandler,
  onEditHandler
) => {
  const detailOnClick = () => onViewHandler(record);
  const personListOnClick = () => {
    history.push(
      getLink(pageNames.personnel.insurance.tamin.personnel.list, {
        id: record.id,
      })
    );
  };
  const editOnClick = () => onEditHandler(record);
  const deleteOnClick = () => {
    deleteItem([record.id], updateList);
  };
  return [
    { name: "detail", onClick: detailOnClick },

    {
      name: "edit",
      onClick: editOnClick,
      hide: handleEditButton(record.status),
    },
    {
      name: "delete",
      onClick: deleteOnClick,
      hide: handleRowStatus(record.personnel_count, record.status, "remove"),
    },
    // {
    //   name: "file",
    //   onClick: () => onDbfModal(record.id),
    //   tooltip: "افزودن افراد از فایل DBF یا EXCEL",
    // },
  ];
};

const otherActions = (record, history) => (
  <Menu>
    <Menu.Item
      onClick={() => {
        history.push(
          getLink(pageNames.personnel.insurance.tamin.personnel.list, {
            id: record.id,
            status: record.status,
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
  handleDeleteById,
  deleteItem,
  updateList,
  tableSearch,
  tableSelect,
  rangeFilter,
  onDbfModal,
  onViewHandler,
  onEditHandler,
  checkAccess,
  setLoading,
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
      width: 200,
      title: "پروژه",
      columnActionsPlacement: "corner",
      // align: "center",
      key: "contract_name",
      dataIndex: "contract_name",
      ...tableSearch("contract_name", "پروژه"),
      sorter: (a, b) =>
        a.contract_name
          ? a.contract_name.localeCompare(b.contract_name)
          : false,
    },
    {
      width: 125,
      title: "کد کارگاهی",
      // align: "center",
      key: "workshop_code",
      dataIndex: "workshop_code",
      ...tableSearch("workshop_code", "کد کارگاهی و ردیف پیمان", {
        multipleColumn: ["workshop_code", "row"],
      }),
      render: (workshop_code, record) => {
        return workshop_code + "-" + record.row;
      },
      sorter: (a, b) => (a.row ? a.row.localeCompare(b.row) : false),
    },

    {
      width: 100,
      title: "دوره",
      // align: "center",
      key: "month",
      dataIndex: "month",
      ...tableSearch("month", "دوره", {
        multipleColumn: ["month", "year"],
      }),
      render: (month, record) => {
        return record.year + "-" + month;
      },
      sorter: (a, b) => {
        if (parseFloat(a.year) > parseFloat(b.year)) {
          return -1;
        } else if (parseFloat(a.year) < parseFloat(b.year)) {
          return 1;
        } else if (parseFloat(a.year) === parseFloat(b.year)) {
          if (parseFloat(a.month) > parseFloat(b.month)) {
            return -1;
          } else if (parseFloat(a.month) < parseFloat(b.month)) {
            return 1;
          }
          return 0;
        }
        return 0;
      },
    },
    {
      width: 100,
      title: "شماره لیست",
      // align: "center",
      key: "list_number",
      dataIndex: "list_number",
      ...tableSearch("list_number", "شماره لیست"),
      sorter: (a, b) => a.list_number - b.list_number,
    },
    {
      // width: 100,
      title: "تعداد نفرات",
      // align: "center",
      key: "personnel_count",
      dataIndex: "personnel_count",
      ...rangeFilter("personnel_count", "تعداد نفرات"),
      sorter: (a, b) =>
        parseFloat(a.personnel_count) - parseFloat(b.personnel_count),
    },
    {
      // width: 100,
      title: "جمع حق بیمه",
      // align: "center",
      key: "total_insured",
      dataIndex: "total_insured",
      ...rangeFilter("total_insured", "جمع حق بیمه"),
      render: (text) => {
        if (!text) return "-";
        return priceNormalizer(text);
      },
      sorter: (a, b) => {
        if (a.total_insured === b.total_insured) {
          return 0;
        } else if (a.total_insured === null) {
          return 1;
        } else if (b.total_insured === null) {
          return -1;
        } else {
          return parseFloat(a.total_insured) - parseFloat(b.total_insured);
        }
      },
    },
    {
      // width: 500,
      // align: "center",
      title: "وضعیت",
      dataIndex: "status",
      key: "status",
      ...tableSelect("status", "وضعیت", {
        filters: [
          {
            text: "ارسال در مهلت قانونی از طریق سایت",
            value: "تایید نهایی - ارسال در مهلت قانونی از طریق سایت",
          },
          {
            text: "ارسال در مهلت قانونی از طریق شعبه",
            value: "تایید نهایی - ارسال در مهلت قانونی از طریق شعبه",
          },
          {
            text: "ارسال لیست به صورت معوق",
            value: "تایید نهایی - ارسال لیست به صورت معوق",
          },
          {
            text: "ارسال نشده",
            value: "تایید نهایی - ارسال نشده",
          },
          {
            text: "عدم تایید",
            value: "عدم تایید",
          },
        ],
      }),
      render: (status, record) => {
        return (
          <TableChangeStatus
            value={status === null ? "عدم تایید" : status}
            options={[
              {
                label: "ارسال در مهلت قانونی از طریق سایت",
                value: "تایید نهایی - ارسال در مهلت قانونی از طریق سایت",
              },
              {
                label: "ارسال در مهلت قانونی از طریق شعبه",
                value: "تایید نهایی - ارسال در مهلت قانونی از طریق شعبه",
              },
              {
                label: "ارسال لیست به صورت معوق",
                value: "تایید نهایی - ارسال لیست به صورت معوق",
              },
              {
                label: "ارسال نشده",
                value: "تایید نهایی - ارسال نشده",
              },
              { label: "عدم تایید", value: "عدم تایید" },
            ]}
            id={record.id}
            requestApi={_PUT_STATUS}
            afterChange={updateList}
            setLoadingList={setLoading}
            disabled={!checkAccess([permission.SOCIAL_INSURANCE_CHANGE_STATUS])}
          />
        );
      },

      onFilter: (value, record) =>
        record.status && record.status.indexOf(value) === 0,
    },
    {
      // width: 80,
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
              updateList,

              onDbfModal,
              onViewHandler,
              onEditHandler
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
