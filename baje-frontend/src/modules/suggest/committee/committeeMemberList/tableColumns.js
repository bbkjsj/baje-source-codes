import React from "react";
import moment from "moment-jalaali";
import { dateToInt, timeToFa } from "../../../../_helpers";
import { isCommitteeMemberActive } from "../utils/tools";

export const columns = ({
  list,
  history,
  rowOptions,
  serverDate,
  tableSearch,
  tableDate,
  selectSearch,
}) => {
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
      title: "نام و نام خانوادگی",
      dataIndex: "name",
      ...tableSearch("name", "نام و نام خانوادگی", {
        multipleColumn: ["first_name", "last_name"],
      }),
      render: (text, record) => {
        return record.first_name + " " + record.last_name;
      },
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
    },
    {
      title: "کد ملی",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      render: (value, record) => {
        return value ?? "-";
      },
      sorter: (a, b) =>
        a.national_code
          ? a.national_code.localeCompare(b.national_number)
          : false,
    },
    {
      title: "سمت",
      dataIndex: "position",
      ...selectSearch("position", "سمت", {
        filters: [
          {
            text: "دبیر",
            value: "دبیر",
          },
          {
            text: "عضو",
            value: "عضو",
          },
        ],
      }),
    },
    {
      title: "تاریخ شروع عضویت",
      dataIndex: "member_from",
      ...tableDate("member_from", "تاریخ شروع عضویت"),
      render: (text, record) => {
        return <span>{timeToFa(record.member_from, false)}</span>;
      },
      sorter: (a, b) =>
        a.member_from
          ? dateToInt(a.member_from) - dateToInt(b.member_from)
          : false,
    },
    {
      title: "تاریخ پایان عضویت",
      dataIndex: "member_to",
      ...tableDate("member_to", "تاریخ پایان عضویت"),
      render: (text, record) => {
        return record.member_to ? (
          <span>{moment(record.member_to).format("jYYYY/jMM/jDD")}</span>
        ) : (
          "-"
        );
      },

      sorter: (a, b) => {
        if (a.member_to === b.member_to) {
          return 0;
        } else if (a.member_to === null) {
          return 1;
        } else if (b.member_to === null) {
          return -1;
        } else {
          return dateToInt(a.member_to) - dateToInt(b.member_to);
        }
      },
    },
    {
      title: "وضعیت",
      dataIndex: "expire",
      ...selectSearch("expire", "وضعیت", {
        filters: [
          {
            text: "غیر فعال",
            value: 1,
          },
          {
            text: "فعال",
            value: 0,
          },
        ],
      }),
      onFilter: (value, record) => record.expire === value,
      render: (text, record) => {
        return !serverDate || isCommitteeMemberActive(record, serverDate)
          ? "فعال"
          : "غیرفعال";
      },
    },
    {
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: rowOptions,
    },
  ];
};
