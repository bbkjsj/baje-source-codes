import { v4 as uuidv4 } from "uuid";

// for upload file
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};
const beforeUpload = () => false;

export const addGroupRightFullFiled = [
  {
    id: uuidv4(),
    option: [
      { label: "وارد کردن فایل DBF", value: "dbf" },
      { label: "وارد کردن فایل EXCEL", value: "excel" },
    ],
    type: "dropDownSelect",
    label: "انتخاب",
    name: "select_file",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    multiple: false,
    showUploadList: {
      showDownloadIcon: false,
    },
    type: "upload",
    label: "فایل",
    name: "excel_file",
    rules: [
      {
        required: true,
      },
    ],
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".xlsx",
      btnText: "انتخاب فایل",
    },
  },
  {
    id: uuidv4(),
    multiple: false,
    showUploadList: {
      showDownloadIcon: false,
    },
    type: "upload",
    label: "فایل",
    name: "dbf_file",
    rules: [
      {
        required: true,
      },
    ],
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".dbf",
      btnText: "انتخاب فایل",
    },
  },
];
