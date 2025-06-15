import React from "react";
import { Col, Form, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formColSpan } from "constant";

export const Contract = ({ options }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="contract_id" label="محل استقرار" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};
export const ExcelUploader = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="excel_file"
        label="فایل"
        getValueFromEvent={normFile}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Upload
          beforeUpload={(file) => {
            return false;
          }}
          accept=".xlsx,.xlsm"
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};
