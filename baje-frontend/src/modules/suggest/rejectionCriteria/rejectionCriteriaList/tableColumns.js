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
  rangeFilter,
  pageId,
  searchParams,
}) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "edit",
        onClick: () =>
          history.push(
            getLink(pageNames.suggest.rejectionCriteria.edit, record.id) +
              "?committee_id=" +
              (pageId || 0)
          ),
      },
      {
        name: "delete",
        onClick: () => () => deleteHandler(record.id),
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
      title: "نام ملاک",
      dataIndex: "name",
      ...tableSearch("name", "نام ملاک"),
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),
    },
    {
      //  width: 100,
      title: "حداقل رای",
      dataIndex: "min_point",
      ...rangeFilter("min_point"),
      sorter: (a, b) => {
        if (a.min_point === b.min_point) {
          return 0;
        } else if (a.min_point === null) {
          return 1;
        } else if (b.min_point === null) {
          return -1;
        } else {
          return parseFloat(a.min_point) - parseFloat(b.min_point);
        }
      },
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

      onFilter: (value, record) => record.is_enabled === value,
    },
    {
      //  width: 100,
      title: "کارگروه",
      dataIndex: "workgroup_name",
      ...tableSearch("w_name", "کارگروه"),
      render: (value, record) => {
        return record.w_name || record.workgroup_name;
      },
      sorter: (a, b) => (a.w_name ? a.w_name.localeCompare(b.w_name) : false),
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
