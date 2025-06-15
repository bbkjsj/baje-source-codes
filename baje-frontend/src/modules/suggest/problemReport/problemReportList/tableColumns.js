import React from "react";
import moment from "moment-jalaali";
import { getLink } from "_helpers";
import TableActions from "components/general/TableActions";

export const columns = ({
  list,
  history,
  deleteHandler,
  setCommitteeId,
  suggestId,
  canModify,
}) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(
            getLink(`/suggest/problem/details/${suggestId}/${record.id}`)
          ),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(
            getLink(`/suggest/problem/edit/${suggestId}/${record.id}`)
          ),
        hide: !canModify,
      },
      {
        name: "delete",
        onClick: () => () => deleteHandler(record.id),
        hide: !canModify,
      },
    ];
    return list;
  };
  return [
    {
      width: 65,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      //  width: 100,
      title: "نوع مشکل",
      dataIndex: "type",
    },
    {
      //  width: 100,
      title: "عنوان مشکل",
      dataIndex: "title",
    },
    {
      //  width: 100,
      title: "تاریخ بروز مشکل",
      dataIndex: "problem_date",
      render: (text, record) => {
        return (
          <span>{moment(record.problem_date).format("jYYYY/jMM/jDD")}</span>
        );
      },
    },
    {
      //  width: 100,
      title: "نتیجه بروز مشکل",
      dataIndex: "result",
    },
    {
      //  width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return <TableActions list={generateIcons(record)} />;
      },
    },
  ];
};
