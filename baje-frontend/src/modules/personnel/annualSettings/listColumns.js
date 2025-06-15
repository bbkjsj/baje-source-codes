import React from "react";
import { timeToFa, getLink, priceNormalizer, commaPriceToInt } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

const generateIcons = (record, history, deleteItem) => {
  const detailOnClick = () => {
    history.push(
      getLink(pageNames.personnel.annualSetting.view, {
        id: record.id,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.annualSetting.edit, {
        id: record.id,
      })
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };

  return [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: record.relation ? true : false,
    },
    { name: "edit", onClick: editOnClick },
    {
      name: "delete",
      onClick: deleteOnClick,
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  rangeFilter,
  searchParams
) => {
  let columns = [
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
      width: 100,
      title: "سال",
      dataIndex: "year",
      ...tableSearch("year", "سال"),
      sorter: (a, b) => (a.year ? a.year.localeCompare(b.year) : false),
    },
    {
      //  width: 100,
      title: "حداقل دستمزد روزانه",
      dataIndex: "min_daily_salary",
      ...rangeFilter("min_daily_salary"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.min_daily_salary
          ? commaPriceToInt(a.min_daily_salary) -
            commaPriceToInt(b.min_daily_salary)
          : false,
    },
    {
      //  width: 100,
      title: "حداکثر دستمزد روزانه",
      dataIndex: "max_daily_salary",
      ...rangeFilter("max_daily_salary"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.max_daily_salary
          ? commaPriceToInt(a.max_daily_salary) -
            commaPriceToInt(b.max_daily_salary)
          : false,
    },
    {
      //  width: 100,
      title: "مزایای انگیزشی",
      dataIndex: "bonus",
      ...rangeFilter("bonus"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.bonus ? commaPriceToInt(a.bonus) - commaPriceToInt(b.bonus) : false,
    },
    {
      //  width: 100,
      title: "حق مسکن",
      dataIndex: "housing",
      ...rangeFilter("housing"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.housing
          ? commaPriceToInt(a.housing) - commaPriceToInt(b.housing)
          : false,
    },
    {
      //  width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions list={generateIcons(record, history, deleteItem)} />
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
