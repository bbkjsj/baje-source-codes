import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Button,
  Upload,
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";

const Person = ({
  useForm,
  setPerson,
  edit = false,
  disabled = true,
  defaultValue = false,

  hideButton = false,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="personnel_id"
      defaultValue={defaultValue}
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      disabled={disabled}
    />
  );
};

const Type = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "استحقاقی", value: "استحقاقی" },
    { label: "استعلاجی", value: "استعلاجی" },
    { label: "تشویقی", value: "تشویقی" },
    { label: "بدون حقوق", value: "بدون حقوق" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="نوع مرخصی" name="type" rules={rules}>
        <AppSelect options={options} onChange={onChange}></AppSelect>
      </AppFormItem>
    </Col>
  );
};

const PeriodType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "روزانه", value: "روزانه" },
    { label: "ساعتی", value: "ساعتی" },
  ];

  const handleDisable = (form) => {
    let type = form.getFieldValue("type");
    if (type === "استحقاقی") {
      return true;
    } else return false;
    // return false;
  };

  const setDisable = (form) => {
    let type = form.getFieldValue("type");
    if (type === "استعلاجی" || type === "تشویقی") {
      return true;
    } else return false;
  };

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        if (handleDisable(form)) {
          return (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <AppFormItem label="روش دریافت" name="period_type" rules={rules}>
                <AppSelect options={options} onChange={onChange}></AppSelect>
              </AppFormItem>
            </Col>
          );
        }
        if (setDisable(form)) {
          return (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <AppFormItem
                initialValue={options[0].value}
                label="روش دریافت"
                name="period_type"
                rules={rules}
              >
                <AppSelect
                  options={options}
                  disabled={true}
                  onChange={onChange}
                ></AppSelect>
              </AppFormItem>
            </Col>
          );
        }
      }}
    </Form.Item>
  );
};

const StartDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ شروع اجباری است",
    },
  ];
  return (
    <>
      <AppFormItem noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("period_type") !== "ساعتی" && (
              <CustomDatePicker
                form={useForm}
                label="اولین روز مرخصی"
                name="start_date"
                rules={rules}
                onChange={onChange}
                centerText
              />
            )
          );
        }}
      </AppFormItem>
    </>
  );
};

const finishDateRule = [
  {
    required: true,
    message: "تاریخ اتمام اجباری است",
  },
  ({ getFieldValue }) => ({
    validator(rule, value) {
      if (checkShamsi(value, false) && getFieldValue("start_date") > value) {
        return Promise.reject("تاریخ اتمام نباید قبل از تاریخ شروع باشد");
      }

      if (!value || checkShamsi(value, false)) {
        return Promise.resolve();
      } else {
        return Promise.reject("فرمت تاریخ صحیح نیست");
      }
    },
  }),
];

const EndDate = ({ useForm, onChange, pRef }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ اتمام اجباری است",
    },
  ];

  return (
    <>
      <AppFormItem noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("period_type") !== "ساعتی" && (
              <CustomDatePicker
                form={useForm}
                label="آخرین روز مرخصی"
                name="end_date"
                rules={finishDateRule}
                onChange={onChange}
                pRef={pRef}
                centerText
              />
            )
          );
        }}
      </AppFormItem>
    </>
  );
};

const Description = ({ pRef }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="توضیحات" name="description">
        <Input.TextArea ref={pRef} />
      </AppFormItem>
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

const MedicalFile = () => {
  return (
    <>
      <AppFormItem noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("type") === "استعلاجی" && (
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <AppFormItem
                  name="MedicalFile"
                  label="آپلود برگه استراحت"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  // rules={[imageValidation]}
                >
                  <Upload
                    // onPreview={onPreview}
                    beforeUpload={(file) => {
                      return false;
                    }}
                  >
                    <Button>
                      <UploadOutlined /> انتخاب فایل
                    </Button>
                  </Upload>
                </AppFormItem>
              </Col>
            )
          );
        }}
      </AppFormItem>
    </>
  );
};

const TimeFrom = () => {
  const rules = [
    {
      required: true,
    },
  ];
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("period_type") === "ساعتی" && (
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item name="time_from" label="از ساعت">
                  <TimePicker
                    format={"HH:mm"}
                    showNow={false}
                    showSecond={false}
                    rules={rules}
                    minuteStep={5}
                    onChange={(val) => console.log(val)}
                  />
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    </>
  );
};

const TimeTo = () => {
  const rules = [
    {
      required: true,
    },
  ];
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("period_type") === "ساعتی" && (
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item name="time_to" label="تا ساعت">
                  <TimePicker
                    format={"HH:mm"}
                    showNow={false}
                    showSecond={false}
                    rules={rules}
                    minuteStep={5}
                  />
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    </>
  );
};

const TimeDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ اجباری است",
    },
  ];
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("period_type") === "ساعتی" && (
              <CustomDatePicker
                form={useForm}
                label="تاریخ"
                name="time_date"
                rules={rules}
                onChange={onChange}
              />
            )
          );
        }}
      </Form.Item>
    </>
  );
};

export {
  Type,
  PeriodType,
  StartDate,
  EndDate,
  Description,
  MedicalFile,
  TimeFrom,
  TimeTo,
  TimeDate,
  Person,
};
