import { covetFormatDateToFA } from "_helpers";
import * as api from "./api";

export const updatePeymanReport = (payload, onSucsses, onError) => {
  console.log("!update production-report");
  api
    ._UPDATE_PEYMAN(payload)
    .then((res) => onSucsses(res))
    .catch((error) => onError(error));
};

export const columnsList = (list) => {
  return [
    {
      key: "id",
      dataIndex: "id",
      title: "ردیف",
      width: 65,
      render: (text, record, index) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      key: "date",
      dataIndex: "date",
      title: "تاریخ",
      width: 100,
      render: (text, record, index) => {
        return covetFormatDateToFA(record.date);
      },
    },

    {
      key: "total_disabled_car_no_part",
      dataIndex: "total_disabled_car_no_part",
      title: "غیرفعال نبودِقطعه",
    },

    {
      key: "total_disabled_car_no_tier",
      dataIndex: "total_disabled_car_no_tier",
      title: "غیرفعال نبودِلاستیک",
    },
    {
      key: "total_disable",
      dataIndex: "total_disable",
      title: "تعداد کل غیرفعال",
    },
    {
      key: "total_active",
      dataIndex: "total_active",
      title: "تعداد کل فعال ",
    },
    {
      key: "total_car",
      dataIndex: "total_car",
      title: "تعداد کل ماشین آلات ",
    },
    {
      key: "total_baje_cars",
      dataIndex: "total_baje_cars",
      title: "تعداد کل ماشین آلات باجه",
    },
    {
      key: "ready_to_work_factor",
      dataIndex: "ready_to_work_factor",
      title: "ضریب آماده به کاری",
    },

    {
      key: "status",
      dataIndex: "status",
      title: "وضعیت",
    },
    {
      key: "edit_by_admin",
      dataIndex: "edit_by_admin",
      title: "ویرایش شده توسط مدیر",
      render: (text, record, index) => {
        return !record.edit_by_admin ? "خیر" : "بلی";
      },
    },
  ];
};
