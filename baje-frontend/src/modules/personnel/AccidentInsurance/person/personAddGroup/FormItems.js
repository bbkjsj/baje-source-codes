import React, { useEffect, useContext } from "react";
import {
  Checkbox,
  Col,
  Form,
  TimePicker,
  Radio,
  Input,
  Select,
  Button,
  Row,
  message,
  Divider,
  Upload,
} from "antd";
import {
  accidentType,
  accidentLocation,
  injuries,
  injuryType,
  relationWithOffice,
  reason,
} from "../const";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { checkShamsi, countOfNumInp, covetFormatDateToFA } from "_helpers";

import * as values from "../const";
import { useGetUserAndSubordinate } from "../util/hooks";
import { AccidentInsuranceContext } from "modules/personnel/AccidentInsurance/util/AccidentInsuranceContext";
import { UploadOutlined } from "@ant-design/icons";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const checkUserId = (from) => {
  let data = from.getFieldValue("personnel_id");
  if (data) {
    return true;
  }
  return false;
};

const CheckShowPersonal = ({ children }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return checkUserId(form) && children;
      }}
    </Form.Item>
  );
};

const Type = () => {
  const option = [
    { label: "کپی از لیست دیگر", value: "1" },
    { label: "فایل اکسل", value: "2" },
  ];

  return (
    <Col span={24}>
      <Form.Item label="روش" name="type">
        <Radio.Group options={option} />
      </Form.Item>
    </Col>
  );
};

const InsuranceListID = () => {
  const rules = [{ required: true }];
  const insuranceContext = useContext(AccidentInsuranceContext);
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          form.getFieldValue("type") === "1" && (
            <Col span={24}>
              <Form.Item label="لیست بیمه" name="insurance_id" rules={rules}>
                <Select>
                  {insuranceContext.insuranceList.map((el) => {
                    if (el.id === insuranceContext.insurance.id) return null;
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
              <Col span={24}>
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
