import React, { useState } from "react";
import { Tooltip } from "antd";
import { notice } from "_helpers";

import { statusTypes } from "../const";

export const columns = ({
  list,
  history,
  rowOptions,
  showIdentity,
  showPoint,
  showRating,
  scoreClickHandler,
  tableSearch,
  tableSelectSearch,
  rangeFilter,
  searchParams,
}) => {
  notice("RENDERRRR");
  if (!scoreClickHandler) scoreClickHandler = () => null;

  let cols = [
    {
      width: 50,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      title: "عنوان پیشنهاد",
      dataIndex: "title",
      ...tableSearch("title", "عنوان پیشنهاد"),
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
    },
    {
      title: "مشارکت",
      dataIndex: "participate_type",
      ...tableSearch("participate_type", " مشارکت"),
      render: (value, record) => {
        return value ?? "-";
      },
      sorter: (a, b) =>
        a.participate_type
          ? a.participate_type.localeCompare(b.participate_type)
          : false,
    },
    {
      title: "نوع پیشنهاد",
      dataIndex: "type",
      ...tableSearch("type", "نوع پیشنهاد"),
      render: (value, record) => {
        return value ?? "-";
      },
      sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
    },
    {
      title: "زمینه پیشنهاد",
      dataIndex: "category_name",

      ...tableSelectSearch("category_name", "زمینه پیشنهاد", {
        filters: [
          {
            text: "اصلاح و بهبود روش ها",
            value: "اصلاح و بهبود روش ها",
          },
          {
            text: "تحقق شرکت الكترونیك",
            value: "تحقق شرکت الكترونیك",
          },
          {
            text: "بهسازی محیط كار",
            value: "بهسازی محیط كار",
          },
          {
            text: "شاول",
            value: "شاول",
          },
          {
            text: "سایر",
            value: "سایر",
          },
        ],
      }),
      render: (value, record) => {
        return value
          ? value
          : record.category_title
          ? record.category_title
          : "-";
      },
      sorter: (a, b) =>
        a.category_name
          ? a.category_name.localeCompare(b.category_name)
          : false,
      onFilter: (value, record) =>
        record.category_name && record.category_name.indexOf(value) === 0,
    },
    {
      title: "پیشنهاد دهنده",
      dataIndex: "sender_name",
      ...tableSearch("sender_name", "پیشنهاد دهنده", {
        multipleColumn: ["first_name", "last_name"],
      }),
      render: (values, record) => {
        return record.first_name
          ? (record.first_name ?? null) + " " + (record.last_name ?? null)
          : "-";
      },
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
    },
    {
      title: "کد ملی",
      dataIndex: "national_code",
      ...tableSearch("national_code", "کد ملی"),
      render: (value, record) => {
        return value ?? "-";
      },
      sorter: (a, b) =>
        a.national_code
          ? a.national_code.localeCompare(b.national_code)
          : false,
    },
    {
      title: "کد رهگیری",
      dataIndex: "code",
      ...tableSearch("code", "عنوان پیشنهاد"),
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
    },
    {
      title: "امتیاز",
      dataIndex: "result",
      ...rangeFilter("point"),
      render: (value, record) => {
        return Number(record.result?.average) ? (
          <Tooltip title="مشاهده جزئیات امتیاز">
            <a onClick={() => scoreClickHandler(record.id || record.s_id)}>
              {Math.round(record.result?.average * record.result?.tadil)}
            </a>
          </Tooltip>
        ) : (
          "-"
        );
      },
      sorter: (a, b) => {
        if (a.point === b.point) {
          return 0;
        } else if (a.point === null || a.point === undefined) {
          return 1;
        } else if (b.point === null || b.point === undefined) {
          return -1;
        } else {
          return parseFloat(a.point) - parseFloat(b.point);
        }
      },
    },
    {
      title: "رتبه",
      dataIndex: "rating",
      ...rangeFilter("rating"),
      render: (value, record) => {
        return value ?? "-";
      },
      sorter: (a, b) => {
        if (a.rating === b.rating) {
          return 0;
        } else if (a.rating === null || a.rating === undefined) {
          return 1;
        } else if (b.rating === null || b.rating === undefined) {
          return -1;
        } else {
          return parseFloat(a.rating) - parseFloat(b.rating);
        }
      },
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      ...tableSelectSearch("status", "وضعیت", {
        filters: Object.entries(statusTypes).map((value) => ({
          text: value[1],
          value: value[1],
        })),
      }),
      render: (value, record) => {
        return value ?? "ثبت اولیه";
      },
      sorter: (a, b) =>
        a.category_name ? a.status.localeCompare(b.status) : false,
      onFilter: (value, record) =>
        record.status && record.status.indexOf(value) === 0,
    },
    {
      align: "center",
      width: 200,
      title: "تنظیمات",
      key: "action",
      render: rowOptions,
    },
  ];

  if (!showIdentity)
    cols = cols.filter(
      (item) => !["sender_name", "national_code"].includes(item.dataIndex)
    );

  if (!showRating) cols = cols.filter((item) => item.dataIndex !== "rating");

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
