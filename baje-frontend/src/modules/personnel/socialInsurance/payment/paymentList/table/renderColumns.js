import React from "react";
import { timeToFa, getLink, priceNormalizer, commaPriceToInt } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _PUT_STATUS } from "modules/personnel/socialInsurance/payment/util/api";
import TableActions from "components/general/TableActions";

const generateIcons = (record, history, deleteItem, updateList) => {
  const detailOnClick = () =>
    history.push(
      getLink(pageNames.personnel.insurance.tamin.payment.view, record.id)
    );
  // const personListOnClick = () => {
  //   history.push(
  //     getLink(pageNames.personnel.insurance.supplymentary.personnel.list, record.id)
  //   );
  // };
  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.insurance.tamin.payment.edit, record.id)
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id], updateList);
  };
  return [
    { name: "detail", onClick: detailOnClick },
    { name: "edit", onClick: editOnClick },
    { name: "delete", onClick: deleteOnClick },
  ];
};

export const renderColumns = (
  list,
  history,
  handleDeleteById,
  deleteItem,
  updateList,
  tableSearch,
  setLoading
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
      // width: 100,
      title: "شرح پرداخت",
      align: "center",
      key: "paid_for",
      dataIndex: "paid_for",
      sorter: (a, b) =>
        a.paid_for ? a.paid_for.localeCompare(b.paid_for) : false,
      filters: [
        {
          text: "لیست ارسالی",
          value: "لیست ارسالی",
        },
        {
          text: "اقساط",
          value: "اقساط",
        },
        {
          text: "بدهی دوره ای",
          value: "بدهی دوره ای",
        },
        {
          text: "بدهی برآوردی",
          value: "بدهی برآوردی",
        },
        {
          text: "حق بیمه پیمان",
          value: "حق بیمه پیمان",
        },
        {
          text: "ادعای سابقه",
          value: "ادعای سابقه",
        },
      ],

      onFilter: (value, record) => record.paid_for.indexOf(value) === 0,
    },
    {
      // width: 100,
      title: "مبلغ پرداختی",
      align: "center",
      key: "total",
      dataIndex: "total",
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.total ? commaPriceToInt(a.total) - commaPriceToInt(b.total) : false,
    },

    {
      // width: 100,
      align: "center",
      title: "وضعیت",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return (
          <TableChangeStatus
            value={status === null ? "0" : status}
            options={[
              { label: "تایید نهایی", value: "1" },
              { label: "عدم تایید", value: "0" },
            ]}
            id={record.id}
            requestApi={_PUT_STATUS}
            afterChange={updateList}
            setLoadingList={setLoading}
          />
        );
      },
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

      onFilter: (value, record) => {
        if (
          (record.status === "1" && value === "1") ||
          (record.status === "0" && value === "0")
        ) {
          return true;
        }
        return false;
      },
    },
    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record, history, deleteItem, updateList)}
          />
        );
      },
    },
  ];
  return columns;
};
