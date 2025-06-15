import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";

import PeriodTime from "../../../../components/PeriodTime";
import * as value from "./const";
import { getUserDataProjectApi } from "./api";
import AppButton from "components/general/AppButton";
import AppNumInput from "components/general/AppNumInput";
import { NationalIdInput } from "../service/formItems";

const UserID = ({}) => {
  return (
    <Form.Item hidden name={"personnel_id"}>
      <Input />
    </Form.Item>
  );
};

const Person = ({
  useForm,
  setPerson,
  edit = false,
  disabled,
  defaultValue = false,
  button = true,
  hideButton = false,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      defaultValue={defaultValue}
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      disabled={button}
    />
  );
};

const NationalID = ({ useForm, initialValue, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValue) {
      initialValue = false;
      handleOnChange();
    }
  }, []);

  const handleOnChange = () => {
    let value = useForm.getFieldValue("national_id");
    if (value.length === 10) {
      let error = useForm.getFieldError("national_id");
      if (error.length === 0) {
        // check machine code
        handleGetData(value);
      }
    }
  };

  const handleGetData = async (nationalID) => {
    setLoading(true);
    try {
      console.info(nationalID);
      const { data } = await getUserDataProjectApi(nationalID);
      setLoading(false);
      useForm.setFieldsValue({
        row: data.row,
        workshop_code: data.workshop_code,
        personnel_id: data.id,
        fullName: data.first_name + " " + data.last_name,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error) {
        if (error.response.status === 403) {
          message.error("کد ملی در سامانه ثبت نشده است.");
        }
      }
      useForm.setFieldsValue({
        national_id: null,
      });
    }
  };

  const handleOnClick = () => {
    initialValue = false;
    let value = useForm.getFieldValue("national_id");
    if (value) {
      let error = useForm.getFieldError("national_id");
      if (error.length === 0) {
        // check machine code
        handleGetData(value);
      }
    }
  };

  const handelChangePerson = () => {
    useForm.resetFields();
  };

  const rules = [
    { required: true, message: "کد ملی اجباری است" },
    { len: 10, message: "کد ملی اشتباه است" },
  ];

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item style={{ marginBottom: "0" }} label="جستجو">
              <Row>
                {form.getFieldValue("personnel_id") ? (
                  <Col span={18}>
                    <Form.Item name={"fullName"}>
                      <Input
                        disabled={form.getFieldValue("personnel_id") && true}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <Col span={18}>
                    <Form.Item
                      rules={rules}
                      name={"national_id"}
                      normalize={(value, prevValue) =>
                        countOfNumInp(value, prevValue, 10)
                      }
                    >
                      <Input
                        disabled={form.getFieldValue("personnel_id") && true}
                        onChange={handleOnChange}
                      />
                    </Form.Item>
                  </Col>
                )}

                <Col span={6}>
                  {form.getFieldValue("personnel_id") ? (
                    <AppButton
                      size="large"
                      block
                      onClick={handelChangePerson}
                      disabled={disabled}
                    >
                      تغییر
                    </AppButton>
                  ) : (
                    <AppButton
                      size="large"
                      block
                      onClick={handleOnClick}
                      loading={loading}
                      disabled={disabled}
                    >
                      بررسی
                    </AppButton>
                  )}
                </Col>
              </Row>
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

const Status = () => {
  const options = [
    {
      label: value.statusValue.SUBMIT_FORM,
      value: value.statusValue.SUBMIT_FORM,
    },
    {
      label: value.statusValue.SOLVENCY,
      value: value.statusValue.SOLVENCY,
    },
    {
      label: value.statusValue.CONFIRM,
      value: value.statusValue.CONFIRM,
    },
    {
      label: value.statusValue.DISAPPROVAL,
      value: value.statusValue.DISAPPROVAL,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="وضعیت" name="status">
        <Select options={options}></Select>
      </Form.Item>
    </Col>
  );
};

const Insurance = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("status") === value.statusValue.SUBMIT_FORM && (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="حق بیمه ادعای سابقه "
                name={"debt"}
                rules={rules}
              >
                <Input />
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

const RegisterNumber = () => {
  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("status") === value.statusValue.SUBMIT_FORM && (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="شماره ثبت" name={"register_number"}>
                <Input />
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};
const RegisterDate = ({ useForm }) => {
  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("status") === value.statusValue.SUBMIT_FORM && (
            <CustomDatePicker
              form={useForm}
              label="تاریخ ثبت"
              name="register_date"
            />
          )
        );
      }}
    </Form.Item>
  );
};

const WorkshopCode = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="کد کارگاهی" name={"workshop_code"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const RowCode = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="ردیف پیمان" name={"row"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const Period = () => {
  return (
    <PeriodTime
      label="مدت سابقه"
      year="year"
      month="month"
      day="number_of_days"
    />
  );
};

const Salary = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="دستمزد و مزایا" name={"salar_bonus"} rules={rules}>
        <AppNumInput />
      </Form.Item>
    </Col>
  );
};

export {
  Person,
  WorkshopCode,
  Period,
  Salary,
  RowCode,
  Status,
  RegisterDate,
  RegisterNumber,
  Insurance,
  UserID,
  NationalID,
};
