import React from "react";
import { getLink, priceNormalizer, dateToInt } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

const generateIcons = (
  record,
  status,
  history,
  deleteItem,
  insurance,
  onViewHandler,
  onEditHandler
) => {
  // console.log("gegege", insurance);

  const detailOnClick = () => {
    onViewHandler(record);
    // history.push(
    // getLink(pageNames.personnel.insurance.tamin.personnel.view, {
    //     person_id: record.id,
    //     id: record.insurance_tamin_id_fk,
    //   })
    // );
  };

  const editOnClick = () => {
    onEditHandler(record);
    // history.push(
    // getLink(pageNames.personnel.insurance.tamin.personnel.edit, {
    //     person_id: record.id,
    //     id: record.insurance_tamin_id_fk,
    //   })
    // );
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

    {
      name: "edit",
      onClick: editOnClick,
      hide: insurance && !(status === "عدم تایید" || status === "null"),
    },
    {
      name: "delete",
      onClick: deleteOnClick,
      hide: insurance && !(status === "عدم تایید" || status === "null"),
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
  ];
};

export const renderColumns = (
  list,
  status,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  insurance,
  tableSearch,
  rangeFilter,
  onViewHandler,
  onEditHandler,
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
      //  width: 100,
      title: "شماره بیمه",
      dataIndex: "insurance_number",
      sorter: (a, b) => {
        if (a.insurance_number === b.insurance_number) {
          return 0;
        } else if (a.insurance_number === null) {
          return 1;
        } else if (b.insurance_number === null) {
          return -1;
        } else {
          return (
            parseFloat(a.insurance_number) - parseFloat(b.insurance_number)
          );
        }
      },
      ...tableSearch("insurance_number", "شماره بیمه"),
    },
    {
      // width: 150,
      title: "نام و نام خانوادگی",
      dataIndex: "full_name",
      // render: (text, record) => {
      //   return <span>{`${record.first_name} ${record.last_name}`}</span>;
      // },
      sorter: (a, b) =>
        a.full_name ? a.full_name.localeCompare(b.full_name) : false,
      ...tableSearch("full_name", "نام و نام خانوادگی"),
    },
    {
      //  width: 100,
      title: "روز کارکرد",
      dataIndex: "total_work_day",
      ...rangeFilter("total_work_day", "روز کارکرد"),
      sorter: (a, b) =>
        parseFloat(a.total_work_day) - parseFloat(b.total_work_day),
    },
    {
      //  width: 100,
      title: "دستمزد روزانه",
      dataIndex: "daily_salary",
      // sorter: (a, b) => a.daily_salary - b.daily_salary,
      ...rangeFilter("daily_salary", "دستمزد روزانه"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.daily_salary
          ? dateToInt(a.daily_salary) - dateToInt(b.daily_salary)
          : false,
    },
    {
      //  width: 100,
      title: "مزایای مشمول",
      dataIndex: "include_benefit",
      // sorter: (a, b) => a.include_benefit - b.include_benefit,
      ...rangeFilter("include_benefit", "مزایای مشمول"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.include_benefit
          ? dateToInt(a.include_benefit) - dateToInt(b.include_benefit)
          : false,
    },
    {
      // width: 120,
      title: "دستمزد مشمول",
      dataIndex: "salary_benefit_include",
      // sorter: (a, b) => a.salary_benefit_include - b.salary_benefit_include,
      ...rangeFilter("salary_benefit_include", "دستمزد مشمول"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.salary_benefit_include
          ? dateToInt(a.salary_benefit_include) -
            dateToInt(b.salary_benefit_include)
          : false,
    },
    {
      // width: 150,
      title: "مشمول و نامشمول",
      dataIndex: "salary_benefit_include_notinclude",
      ...rangeFilter("salary_benefit_include_notinclude", "مشمول و نامشمول"),
      render: (text) => {
        return priceNormalizer(text);
      },
      sorter: (a, b) =>
        a.salary_benefit_include_notinclude
          ? dateToInt(a.salary_benefit_include_notinclude) -
            dateToInt(b.salary_benefit_include_notinclude)
          : false,
    },
    {
      //  width: 100,
      title: "عنوان شغل",
      dataIndex: "job_title",
      ...tableSearch("job_title", "عنوان شغل"),
      sorter: (a, b) =>
        a.job_title ? a.job_title.localeCompare(b.job_title) : false,
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
              status,
              history,
              deleteItem,
              insurance,
              onViewHandler,
              onEditHandler
            )}
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
