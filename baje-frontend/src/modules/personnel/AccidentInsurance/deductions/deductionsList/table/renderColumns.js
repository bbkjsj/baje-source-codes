import React from "react";
import {
  timeToFa,
  getLink,
  priceNormalizer,
  dateToInt,
  commaPriceToInt,
} from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

const generateIcons = (record, history, deleteItem, params) => {
  const editOnClick = () => {
    history.push(
      getLink(
        pageNames.personnel.insurance.accident.personnel.deducation.edit,
        {
          id: record.id,
          userId: params.userId,
          insuranceId: params.insuranceId,
        }
      )
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };
  return [
    { name: "edit", onClick: editOnClick },
    { name: "delete", onClick: deleteOnClick },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  params,
  tableSearch,
  tableDate
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
      title: "نحوه پرداخت",
      align: "center",
      key: "payment_method",
      dataIndex: "payment_method",
      sorter: (a, b) =>
        a.payment_method
          ? a.payment_method.localeCompare(b.payment_method)
          : false,
      filters: [
        {
          text: "کسر از مطالبات",
          value: "کسر از مطالبات",
        },
        {
          text: "کسر از حقوق",
          value: "کسر از حقوق",
        },
        {
          text: "متفرقه",
          value: "متفرقه",
        },
      ],

      onFilter: (value, record) => record.payment_method.indexOf(value) === 0,
    },
    {
      // width: 100,
      title: "تاریخ یا دوره",
      align: "center",
      key: "payment_date",
      dataIndex: "payment_date",
      ...tableDate("payment_date", "تاریخ یا دوره"),
      render: (payment_date) => {
        return timeToFa(payment_date, false);
      },
      sorter: (a, b) =>
        a.payment_date
          ? dateToInt(timeToFa(a.payment_date, false)) -
            dateToInt(timeToFa(b.payment_date))
          : false,
    },
    {
      // width: 100,
      title: "مبلغ",
      align: "center",
      key: "amount",
      dataIndex: "amount",
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.amount
          ? commaPriceToInt(a.amount) - commaPriceToInt(b.amount)
          : false,
    },
    {
      // width: 100,
      title: "توضیحات",
      align: "center",
      key: "description",
      dataIndex: "description",
      ...tableSearch("description", "توضیحات"),
    },
    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record, history, deleteItem, params)}
          />
        );
      },
    },
  ];
  return columns;
};
