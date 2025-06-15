import React from "react";
import { Col, Select, Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const beforeUpload = () => false;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};
export const FileType = ({ personType }) => {
  const list = [{ label: "وارد کردن فایل EXCEL", value: "excel" }];

  if (personType === "mainTab") {
    list.push({ label: "وارد کردن فایل DBF", value: "dbf" });
  }

  const Rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={8} lg={8} xl={6}>
      <Form.Item name="select_file" label="انتخاب نوع فایل" rules={Rules}>
        <Select>
          {list.map((el) => (
            <Select.Option key={el.value} value={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const uploadDBF = ({ hidden }) => {
  const Rules = [
    {
      required: true,
      message: "فایلی انتخاب نشده است",
    },
    () => ({
      validator(rule, value) {
        let file = value[0]["name"].split(".");
        let fileExtension = file[file.length - 1];
        let allowedExtensions = ["dbf", "DBF"];
        if (allowedExtensions.includes(fileExtension)) {
          if (fileExtension === "dbf") {
            if (value.size > 8000000) {
              return Promise.reject("حجم فایل بیشتر از 8 مگابایت است !");
            }
          }
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت فایل صحیح نمی باشد");
        }
      },
    }),
  ];

  return (
    !hidden && (
      <Col xs={24} sm={24} md={8} lg={8} xl={6}>
        <Form.Item
          label="بارگذاری فایل DBF"
          name="dbf_file"
          getValueFromEvent={normFile}
          rules={Rules}
        >
          <Upload accept=".dbf" beforeUpload={beforeUpload}>
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    )
  );
};

export const uploadExcel = ({ hidden }) => {
  const Rules = [
    {
      required: true,
      message: "فایلی انتخاب نشده است",
    },
    () => ({
      validator(rule, value) {
        let file = value[0]["name"].split(".");
        let fileExtension = file[file.length - 1];
        let allowedExtensions = ["xlsx", "xlsm"];
        if (allowedExtensions.includes(fileExtension)) {
          if (value.size > 8000000) {
            return Promise.reject("حجم فایل بیشتر از 8 مگابایت است !");
          }

          return Promise.resolve();
        } else {
          return Promise.reject("فرمت فایل صحیح نمی باشد");
        }
      },
    }),
  ];

  return (
    !hidden && (
      <Col xs={24} sm={24} md={8} lg={8} xl={6}>
        <Form.Item
          label="بارگذاری فایل excel"
          name="excel_file"
          getValueFromEvent={normFile}
          rules={Rules}
        >
          <Upload accept=".xlsx,.xlsm" beforeUpload={beforeUpload}>
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    )
  );
};
