import React from "react";
import { getLink } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

export const columns = ({
  list,
  history,
  deleteHandler,
  tableSearch,
  tableSelect,
  searchParams,
}) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.suggest.category.edit, record.id)),
      },
      {
        name: "delete",
        onClick: () => deleteHandler(record.id),
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
      //  width: 100,
      title: "نام حوزه",
      dataIndex: "name",
      ...tableSearch("name", "نام ملاک"),
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),
    },
    {
      //  width: 100,
      title: "وضعیت",
      dataIndex: "is_enable",
      ...tableSelect("is_enable", "وضعیت", {
        filters: [
          {
            text: "فعال",
            value: 1,
          },
          {
            text: "غیرفعال",
            value: 0,
          },
        ],
      }),
      render: (value, record) => {
        return value ? "فعال" : "غیرفعال";
      },

      onFilter: (value, record) => record.is_enable === value,
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
