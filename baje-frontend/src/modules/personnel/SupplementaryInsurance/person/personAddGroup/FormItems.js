import React, { useEffect, useContext, useState } from "react";
import { Col, Form, Radio, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as Api from "../../util/api";
import { useSelector } from "react-redux";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const Type = () => {
  const option = [
    { label: "کپی از لیست دیگر", value: "1" },
    { label: "فایل اکسل", value: "2" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label="روش" name="type">
        <Radio.Group options={option} />
      </Form.Item>
    </Col>
  );
};

const InsuranceListID = ({ insuranceID }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const rules = [{ required: true }];
  const [list, setList] = useState([]);

  useEffect(() => {
    Api._GET(currentOffice, "takmili").then((res) => setList(res.data.list));
  }, []);

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          form.getFieldValue("type") === "1" && (
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item label="لیست بیمه" name="insurance_id" rules={rules}>
                <Select>
                  {list.map((el) => {
                    if (el.id === insuranceID) return null;
                    return (
                      <Select.Option key={el.id} value={el.id} title={el.name}>
                        {`${el.type}--${el.contract_number}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

const ExcelFile = () => {
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("type") === "2" && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
            )
          );
        }}
      </Form.Item>
    </>
  );
};

export { Type, InsuranceListID, ExcelFile };
