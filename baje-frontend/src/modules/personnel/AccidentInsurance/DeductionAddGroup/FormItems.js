import React, { useEffect, useContext } from "react";
import { Col, Form, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formColSpan } from "../../../../constant";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const ExcelFile = () => {
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            <Col {...formColSpan}>
              <Form.Item
                name="ExcelFile"
                label="فایل اکسل"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                // rules={[imageValidation]}
              >
                <Upload
                  // onPreview={onPreview}
                  beforeUpload={(file) => {
                    return false;
                  }}
                  accept=".XLSX,XLS,XLSM"
                >
                  <Button>
                    <UploadOutlined /> انتخاب فایل
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    </>
  );
};

export { ExcelFile };
