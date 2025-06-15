import React from "react";
import { priceNormalizer, timeToFa } from "_helpers";

export const columns = ({ list, tableSearch }) => {
  return [
    {
      width: 65,
      title: "ردیف",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      title: "دوره",
      dataIndex: "period",
      ...tableSearch("month", "دوره", {
        multipleColumn: ["month", "year"],
      }),
      render: (text, record) => {
        return <span>{record.year + "-" + record.month}</span>;
      },
    },
    {
      title: "شرکت",
      dataIndex: "name",
      ...tableSearch("name", "شرکت"),
    },
    {
      title: "کارگاه / پیمان",
      dataIndex: "workshop_code",
      render: (text, record) => {
        return <span>{record.workshop_code + " - " + record.row}</span>;
      },
    },
    {
      title: "شماره لیست",
      dataIndex: "list_number",
    },
    {
      title: "قرارداد",
      dataIndex: "subject",
      ...tableSearch("subject", "قرارداد"),
    },
    {
      title: "شعبه",
      dataIndex: "a7",
      render: (text, record) => {
        return <span>-</span>;
      },
    },
    {
      title: "تعداد روز",
      dataIndex: "total_work_day",
    },
    {
      title: "دستمزد روزانه",
      dataIndex: "daily_salary",
      render: (text, record) => {
        return text ? priceNormalizer(text) : <span>-</span>;
      },
    },
    {
      title: "دستمزد ماهانه",
      dataIndex: "monthly_salary",
      render: (text, record) => {
        return text ? priceNormalizer(text) : <span>-</span>;
      },
    },
    {
      title: "مزایای ماهانه",
      dataIndex: "include_benefit",
      render: (text, record) => {
        return text ? priceNormalizer(text) : <span>-</span>;
      },
    },
    {
      title: "مشمول بیمه",
      dataIndex: "salary_benefit_include",
      render: (text, record) => {
        return text ? priceNormalizer(text) : <span>-</span>;
      },
    },
    {
      title: "مشمول و غیر مشمول",
      dataIndex: "salary_benefit_include_notinclude",
      render: (text, record) => {
        return text ? priceNormalizer(text) : <span>-</span>;
      },
    },
    {
      title: "پرداختی بیمه",
      dataIndex: "total_share",
      render: (text, record) => {
        return text ? priceNormalizer(text) : <span>-</span>;
      },
    },
    {
      title: "شروع کار",
      dataIndex: "start_date",
      render: (text, record) => {
        return <span>{text ? timeToFa(text, false) : "-"}</span>;
      },
    },
    {
      title: "ترک کار",
      dataIndex: "end_date",
      render: (text, record) => {
        return <span>{text ? timeToFa(text, false) : "-"}</span>;
      },
    },
    {
      title: "شغل",
      dataIndex: "title",
      render: (text, record) => {
        return <span>{text.toString().replace("\r", "")}</span>;
      },
    },
    {
      title: "کد شغل",
      dataIndex: "code",
    },
  ];
};
