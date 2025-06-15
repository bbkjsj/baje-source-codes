import React from "react";
import { getLink, priceNormalizer, commaPriceToInt } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { changeStatusRecordClaim } from "modules/personnel/realPerson/recordClaim/api";
import TableActions from "components/general/TableActions";

export const columns = (
  history,
  list,
  deleteItem,
  tableSearch,
  tableSelect,
  rangeFilter,
  setLoadingList,
  getList,
  searchParams
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(
            getLink(pageNames.personnel.realPerson.recordClaim.view, record.id)
          ),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(
            getLink(pageNames.personnel.realPerson.recordClaim.edit, record.id)
          ),
      },
      {
        name: "delete",
        onClick: () => deleteItem([record.id]),
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
      // width: 100,
      title: "نام و نام خانوادگی",
      dataIndex: "full_name",
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      ...tableSearch("full_name", "نام و نام خانوادگی", {
        multipleColumn: ["first_name", "last_name"],
      }),
      render: (text, record) => {
        return <span>{`${record.first_name} ${record.last_name}`}</span>;
      },
    },
    {
      // width: 100,
      title: "کد ملی",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      sorter: (a, b) =>
        a.national_number ? a.national_number - b.national_number : false,
    },
    {
      // width: 100,
      title: "کد کارگاهی و ردیف پیمان",
      dataIndex: "workshop_code",
      ...tableSearch("workshop_code", "کد کارگاهی و ردیف پیمان", {
        multipleColumn: ["workshop_code", "row"],
      }),
      sorter: (a, b) =>
        a.workshop_code ? a.workshop_code - b.workshop_code : false,
      render: (text, record) => {
        return text + "-" + record.row;
      },
    },
    {
      // width: 100,
      title: "دوره مورد ادعا",
      dataIndex: "period",
      ...tableSearch("period", "دوره مورد ادعا"),
      sorter: (a, b) =>
        a.period && b.period
          ? parseFloat(a.period.split(" ").join("")) -
            parseFloat(b.period.split(" ").join(""))
          : false,
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      // width: 100,
      title: "تعداد روز",
      dataIndex: "number_of_days",
      ...rangeFilter("number_of_days", "تعداد روز"),
      sorter: (a, b) =>
        a.number_of_days ? a.number_of_days - b.number_of_days : false,
    },
    {
      // width: 100,
      title: "دستمزد مشمول",
      dataIndex: "salary_bonus",
      ...rangeFilter("salary_bonus", "دستمزد مشمول"),
      sorter: (a, b) =>
        a.salary_bonus
          ? commaPriceToInt(a.salary_bonus) - commaPriceToInt(b.salary_bonus)
          : false,
      render: (text) => {
        return priceNormalizer(text);
      },
    },

    {
      // width: 100,
      align: "center",
      title: "وضعیت",
      dataIndex: "status",
      key: "status",

      ...tableSelect("status", "وضعیت", {
        filters: [
          {
            text: "تأیید",
            value: "تأیید",
          },
          {
            text: "عدم تأیید",
            value: "عدم تأیید",
          },
          {
            text: "پرداخت بدهی",
            value: "پرداخت بدهی",
          },
          {
            text: "ثبت فرم",
            value: "ثبت فرم",
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.status === "تأیید" && value === "تأیید") ||
          (record.status === "عدم تأیید" && value === "عدم تأیید") ||
          (record.status === "پرداخت بدهی" && value === "پرداخت بدهی") ||
          (record.status === "ثبت فرم" && value === "ثبت فرم")
        ) {
          return true;
        }
        return false;
      },
      render: (status, record) => {
        return (
          <TableChangeStatus
            value={status}
            options={[
              { label: "ثبت فرم", value: "ثبت فرم" },
              { label: "پرداخت بدهی", value: "پرداخت بدهی" },
              { label: "تأیید", value: "تأیید" },
              { label: "عدم تأیید", value: "عدم تأیید" },
            ]}
            id={record.id}
            requestApi={changeStatusRecordClaim}
            afterChange={getList}
            setLoadingList={setLoadingList}
          />
        );
      },
    },
    {
      //width: 80,
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
