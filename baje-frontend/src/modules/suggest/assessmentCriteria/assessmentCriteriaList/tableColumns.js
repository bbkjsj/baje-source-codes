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
            getLink(pageNames.suggest.assessmentCriteria.edit, record.id) +
              "?committee_id=" +
              (pageId || 0)
          ),
      },
      {
        name: "delete",
        onClick: () => deleteHandler(record.id),
      },
    ];
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
      title: "نام ملاک",
      dataIndex: "name",
      ...tableSearch("name", "نام ملاک"),
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),
    },
    {
      title: "شیوه امتیازدهی",
      dataIndex: "rate_type",
      ...tableSelect("rate_type", "شیوه امتیازدهی", {
        filters: [
          {
            text: "نمره دهی",
            value: "نمره دهی",
          },
          {
            text: "انتخاب کیفیت - خیلی ضعیف تا عالی",
            value: "انتخاب کیفیت - خیلی ضعیف تا عالی",
          },
          {
            text: "انتخاب کیفیت - هیچ تا خیلی زیاد",
            value: "انتخاب کیفیت - هیچ تا خیلی زیاد",
          },
          {
            text: "بلی/خیر",
            value: "بلی/خیر",
          },
        ],
      }),
      sorter: (a, b) =>
        a.rate_type ? a.rate_type.localeCompare(b.rate_type) : false,

      onFilter: (value, record) => record.rate_type.indexOf(value) === 0,
    },
    {
      title: "وضعیت",
      dataIndex: "is_enabled",
      ...tableSelect("is_enabled", "وضعیت", {
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
      title: "حداکثر امتیاز",
      dataIndex: "max_point",
      ...rangeFilter("max_point"),
      sorter: (a, b) => {
        if (a.max_point === b.max_point) {
          return 0;
        } else if (a.max_point === null) {
          return 1;
        } else if (b.max_point === null) {
          return -1;
        } else {
          return parseFloat(a.max_point) - parseFloat(b.max_point);
        }
      },
    },
    {
      title: "کارگروه",
      dataIndex: "workgroup_name",
      ...tableSearch("w_name", "کارگروه"),
      render: (value, record) => {
        return record.w_name || record.workgroup_name;
      },
      sorter: (a, b) => (a.w_name ? a.w_name.localeCompare(b.w_name) : false),
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
