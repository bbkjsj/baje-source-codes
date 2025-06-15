import * as api from "./api";
import { covetFormatDateToFA } from "_helpers";

export const updateProgress = (payload, onSuccess, onError) => {
  try {
    api
      ._PUT_PROGRESS(payload)
      .then((res) => {
        onSuccess();
      })
      .catch(() => {
        onError();
      });
  } catch (error) {
    console.log(error, "!catch error");
  }
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
      key: "program_progress",
      dataIndex: "program_progress",
      title: "درصد پیشرفت برنامه ای",
    },
    {
      key: "real_progress",
      dataIndex: "real_progress",
      title: "درصد پیشرفت واقعی",
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
