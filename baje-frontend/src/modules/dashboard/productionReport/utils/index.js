import { covetFormatDateToFA } from "_helpers";
import * as api from "./api";

export const updateProductionReport = (payload, onSucsses, onError) => {
  console.log("!update production-report");
  api
    ._UPDATE_PRODUCTION(payload)
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
      key: "stone_tonnage",
      dataIndex: "stone_tonnage",
      title: "تناژ سنگ",
    },

    {
      key: "dust_tonnage",
      dataIndex: "dust_tonnage",
      title: "تناژ خاک و باطله",
    },
    {
      key: "total_tonnage",
      dataIndex: "total_tonnage",
      title: "تناژ کل",
    },
    {
      key: "stone_load_quantity",
      dataIndex: "stone_load_quantity",
      title: "تعداد بار سنگ",
    },
    {
      key: "dust_load_quantity",
      dataIndex: "dust_load_quantity",
      title: "تعداد بار خاک و باطله",
    },
    {
      key: "total_load",
      dataIndex: "total_load",
      title: "تعداد بار کل",
    },
    {
      key: "stone_tonnage_avg",
      dataIndex: "stone_tonnage_avg",
      title: "میانگین تناژ سنگ",
    },
    {
      key: "dust_tonnage_avg",
      dataIndex: "dust_tonnage_avg",
      title: "میانگین تناژ باطله و خاک",
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
