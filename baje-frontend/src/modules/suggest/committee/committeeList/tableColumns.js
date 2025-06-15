import React from "react";
import { Space, Button } from "antd";
import { getLink } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

export const columns = ({
  list,
  history,
  deleteHandler,
  setCommitteeId,
  tableSearch,
  rangeFilter,
  searchParams,
}) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "edit",
        onClick: () => setCommitteeId(record.id),
        hide: record.fix,
      },
      {
        name: "delete",
        onClick: () => deleteHandler(record.id),
        hide: record.fix,
      },
      {
        name: "members",
        onClick: () =>
          history.push(
            getLink(pageNames.suggest.commitee.member.list, record.id)
          ),

        children: "اعضاء",
        style: { width: "auto" },
        variant: "",
      },
      {
        name: "assessmentCriteria",
        onClick: () =>
          history.push(
            getLink(pageNames.suggest.assessmentCriteria.list, record.id)
          ),
        hide: record.fix,
        children: "ملاک های ارزیابی ",
        style: { width: "auto" },
        variant: "",
      },
      {
        name: "rejectionCriteria",
        onClick: () =>
          history.push(
            getLink(pageNames.suggest.rejectionCriteria.list, record.id)
          ),
        hide: record.fix,
        children: "ملاک های ارزیابی ",
        style: { width: "auto" },
        variant: "",
      },
    ];
    return list;
  };

  let cols = [
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
      title: "عنوان",
      dataIndex: "name",
      ...tableSearch("name", "عنوان"),
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),
    },
    {
      title: "حداکثر امتیاز",
      key: "max_point",
      width: 120,
      ...rangeFilter("max_point"),
      render: (text, record) => {
        return record?.rate.total ?? "–";
      },
      sorter: (a, b) => {
        if (a.rate.total === b.rate.total) {
          return 0;
        } else if (a.rate.total === null) {
          return 1;
        } else if (b.rate.total === null) {
          return -1;
        } else {
          return parseFloat(a.rate.total) - parseFloat(b.rate.total);
        }
      },
    },
    {
      title: "ضریب تعدیل",
      key: "factor",
      ...rangeFilter("max_point"),
      width: 120,
      render: (text, record) => {
        return record?.rate.factor ?? "–";
      },
      sorter: (a, b) => {
        if (a.rate.factor === b.rate.factor) {
          return 0;
        } else if (a.rate.factor === null) {
          return 1;
        } else if (b.rate.factor === null) {
          return -1;
        } else {
          return parseFloat(a.rate.factor) - parseFloat(b.rate.factor);
        }
      },
    },
    {
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return <TableActions list={generateIcons(record)} />;
      },
    },
  ];

  cols = cols.map((column) => {
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

  return cols;
};
