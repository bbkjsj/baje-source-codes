import React, { useEffect, useContext, useState } from "react";
import { Col, Form, Radio, Input, Select, Button, Row, message } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import {
  checkShamsi,
  countOfNumInp,
  covetFormatDateToFA,
  numberNormalize,
} from "_helpers";
import * as values from "../const";
import { useGetUserAndSubordinate, useGetPersonnel } from "../util/hooks";
import AppButton from "components/general/AppButton";
import { mobileNumberValidation } from "_helpers";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import BankList from "json/BankList";
import * as Api from "../../util/api";
import AppInput from "../../../../../components/general/AppInput";

// check for national id if checked show inputs
const checkUserId = (from) => {
  let data = from.getFieldValue("personnel_id");
  // console.log(from.getFieldsValue() , 'form!');
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

const CheckShowMainPersonID = ({ children }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          checkUserId(form) &&
          form.getFieldValue("user_status") ===
            values.PersonStatusValue.SUBORDINATE_WITH_MAINS &&
          children
        );
      }}
    </Form.Item>
  );
};
const BankAccount = ({ useForm, detail, edit }) => {
  const Rules = [
    {
      required: true,
    },
  ];

  return (
    <CheckShowPersonal>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 6}>
        <Form.Item label="شماره حساب " name="bank_account1" rules={Rules}>
          <Input type="text" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 6}>
        <Form.Item
          label="شماره شبا "
          name="sheba1"
          rules={[{ len: 24 }]}
          normalizer={{ numberNormalize }}
        >
          <Input type="number" maxLength={24} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 6}>
        <Form.Item label="نام بانک " name="bank_name1" rules={Rules}>
          <Select>
            {BankList.map((el) => {
              return (
                <Select.Option key={el.value} title={el.label} value={el.value}>
                  {el.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const MobileNumber = ({ useForm, detail, edit }) => {
  const Rules = [
    {
      required: true,
    },
  ];

  return (
    <CheckShowPersonal>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 6}>
        <Form.Item
          label="شماره موبایل"
          name={"mobile_number"}
          validateFirst
          normalize={(value) => mobileNumberValidation(value)}
          rules={Rules}
        >
          <Input placeholder="09XXXXXXXXX بصورت" />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const StartDateInsurance = ({
  useForm,
  detail,
  edit,
  span,
  insurance,
  mainPerson,
}) => {
  const checkTimePeriod = (value, startDate, endDate) => {
    return value < startDate || value > endDate;
  };

  const dateRules = [
    {
      required: true,
      message: "فیلد تاریخ شروع اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
          if (
            checkTimePeriod(
              value,
              mainPerson?.start_date
                ? mainPerson?.start_date
                : covetFormatDateToFA(insurance.contract_date_from_date),
              mainPerson?.end_date
                ? mainPerson?.end_date
                : covetFormatDateToFA(insurance.to_date)
            )
          ) {
            return Promise.reject("تاریخ وارد شده در بازه لیست بیمه نمی باشد");
          }
        }

        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    <CheckShowPersonal>
      <Col
        xs={span ? span : 24}
        sm={span ? span : 24}
        md={span ? span : 24}
        lg={span ? span : edit ? 24 : 12}
        xl={span ? span : edit ? 24 : 6}
      >
        <CustomDatePicker
          plain
          form={useForm}
          label="تاریخ شروع بیمه"
          name="start_date"
          rules={dateRules}
          disabled={detail}
        />
      </Col>
    </CheckShowPersonal>
  );
};

const EndDateInsurance = ({
  useForm,
  detail,
  edit,
  span,
  insurance,
  mainPerson,
}) => {
  const checkTimePeriod = (value, startDate, endDate) => {
    return value < startDate || value > endDate;
  };

  const finishDateRule = [
    {
      required: true,
      message: "فیلد تاریخ پایان اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("start_date") > value) {
          return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
        }
        if (checkShamsi(value, false)) {
          if (
            checkTimePeriod(
              value,
              mainPerson?.start_date
                ? mainPerson?.start_date
                : covetFormatDateToFA(insurance.contract_date_from_date),
              mainPerson?.end_date
                ? mainPerson?.end_date
                : covetFormatDateToFA(insurance.to_date)
            )
          ) {
            return Promise.reject("تاریخ وارد شده در بازه لیست بیمه نمی باشد");
          }
        }

        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    <CheckShowPersonal>
      <Col
        xs={span ? span : 24}
        sm={span ? span : 24}
        md={span ? span : 24}
        lg={span ? span : edit ? 24 : 12}
        xl={span ? span : edit ? 24 : 6}
      >
        <CustomDatePicker
          plain
          form={useForm}
          label="تاریخ پایان بیمه"
          name="end_date"
          rules={finishDateRule}
          disabled={detail}
        />
      </Col>
    </CheckShowPersonal>
  );
};

const PersonType = ({ detail, edit }) => {
  const rules = [{ required: true }];

  const option = [
    { label: values.PersonTypeValue.MAIN, value: values.PersonTypeValue.MAIN },
    {
      label: values.PersonTypeValue.SUBSEQUENT,
      value: values.PersonTypeValue.SUBSEQUENT,
    },
  ];
  return (
    <CheckShowPersonal>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 8}>
        <Form.Item label="نوع شخص" name="person_Type" rules={rules}>
          <Radio.Group options={option} disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const WitchMainPerson = ({ detail, option, edit }) => {
  const rules = [{ required: true }];
  return (
    <CheckShowMainPersonID>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 8}>
        <Form.Item
          label="بیمه کننده اصلی"
          name="main_insurer_personnel_id"
          rules={rules}
        >
          <Radio.Group options={option} disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowMainPersonID>
  );
};

const Description = ({ detail, edit, span }) => {
  return (
    <CheckShowPersonal>
      <Col
        xs={span ? span : 24}
        sm={span ? span : 24}
        md={span ? span : 24}
        lg={span ? span : edit ? 24 : 12}
        xl={span ? span : edit ? 24 : 12}
      >
        <Form.Item label="توضیحات" name="description">
          <Input.TextArea disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const subordinateSelect = ({ detail, edit, list, onChange }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label="فرد تبعی" name="sub_select">
        <Select disabled={detail} onChange={onChange}>
          {list.map((el) => (
            <Select.Option value={el.id}>
              {el.first_name + " " + el.last_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};
const relation = ({ subForm, disabled }) => {
  const list = [
    { value: "mother", name: "مادر" },
    { value: "father", name: "پدر" },
    { value: "son", name: "پسر" },
    { value: "daughter", name: "دختر" },
    { value: "wife", name: "همسر" },
  ];

  return (
    <CheckShowPersonal>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form.Item label="نسبت" name="relation">
          <Radio.Group disabled={disabled}>
            {list.map((el) => (
              <Radio value={el.value}>{el.name}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const AddSubordinate = ({ detail, edit, onClick, list }) => {
  return (
    list?.length > 0 && (
      <CheckShowPersonal>
        <Col span={24}>
          <Button onClick={onClick}>افزودن تبعی </Button>
        </Col>
      </CheckShowPersonal>
    )
  );
};

const UserID = ({}) => {
  return (
    <Form.Item hidden name={"personnel_id"}>
      <Input />
    </Form.Item>
  );
};

const UserStatus = ({}) => {
  return (
    <Form.Item hidden name={"user_status"}>
      <Input />
    </Form.Item>
  );
};

const MainUserID = ({}) => {
  return (
    <Form.Item hidden name={"main_insurer_personnel_id"}>
      <Input />
    </Form.Item>
  );
};

const UserFullName = ({ edit }) => {
  return (
    <CheckShowPersonal>
      <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 8}>
        <Form.Item name={"user_full_name"} label="نام">
          <Input disabled />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const submitSubordinate = ({ onClick }) => {
  return (
    <CheckShowPersonal>
      <Col span={24}>
        <div className="flex">
          <Button
            onClick={() => onClick(false)}
            type="primary"
            className="ml-1"
          >
            {" "}
            ثبت{" "}
          </Button>
          <Button onClick={() => onClick(true)}> ثبت و بعدی </Button>
        </div>
      </Col>
    </CheckShowPersonal>
  );
};

const NationalID = ({
  useForm,
  setMainPersonOption,
  edit,
  insuranceInfo,
  initialValue,
  detail,
  otherCompanyTrigger,
  onGetPerson,
}) => {
  const {
    get: getUserAndSubordinate,
    userInfo,
    loading,
    errorMsg,
    mainUserInfo,
  } = useGetUserAndSubordinate();

  const {
    getPersonnel: getPersonnelList,
    loading: loadingPersonnel,
    data,
  } = useGetPersonnel();

  useEffect(() => {
    if (initialValue) {
      console.log(useForm.getFieldsValue(), "!get");
      getUserAndSubordinate(initialValue, useForm, insuranceInfo);
      getPersonnelList();
    }
  }, [initialValue]);

  useEffect(() => {
    if (errorMsg) {
      useForm.setFields([
        {
          name: "national_id",
          value: "",
        },
      ]);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (userInfo) {
      if (data) {
        let findCompany = data.filter((item) => item.id === userInfo.id);
        // console.info(findCompany);
        // console.info(findCompany[0].company_name, insuranceInfo.insurer_company)
        if (
          findCompany.length > 0 &&
          findCompany[0].company_name === insuranceInfo.insurer_company
        ) {
          if (otherCompanyTrigger) otherCompanyTrigger(true);
        } else {
          if (otherCompanyTrigger) otherCompanyTrigger(false);
        }
      }

      if (userInfo.status === values.PersonStatusValue.MAIN) {
        let { id: personID, first_name, last_name, status } = userInfo;
        useForm.setFields([
          {
            name: "personnel_id",
            value: personID,
          },
          {
            name: "user_full_name",
            value: first_name + " " + last_name,
          },
          {
            name: "user_status",
            value: status,
          },
        ]);
      } else if (userInfo.status === values.PersonStatusValue.SUBORDINATE) {
        let {
          id: personID,
          first_name,
          last_name,
          personnel_id_fk: maniPersonID,
          status,
        } = userInfo;
        useForm.setFields([
          {
            name: "personnel_id",
            value: personID,
          },
          {
            name: "user_full_name",
            value: first_name + " " + last_name,
          },
          {
            name: "user_status",
            value: status,
          },
          { name: "main_insurer_personnel_id", value: maniPersonID },
        ]);
      } else if (
        userInfo.status === values.PersonStatusValue.SUBORDINATE_WITH_MAINS
      ) {
        setMainPersonOption(mainUserInfo);
        let {
          id: personID,
          first_name,
          last_name,

          status,
        } = userInfo;
        useForm.setFields([
          {
            name: "personnel_id",
            value: personID,
          },
          {
            name: "user_full_name",
            value: first_name + " " + last_name,
          },
          {
            name: "user_status",
            value: status,
          },
        ]);
      }
    }
  }, [userInfo]);

  const handleOnChange = () => {
    let value = useForm.getFieldValue("national_id");
    if (value.length === 10) {
      let error = useForm.getFieldError("national_id");
      if (error.length === 0) {
        // check machine code
        getUserAndSubordinate(value, useForm, insuranceInfo);
      }
    }
  };

  const handleOnClick = () => {
    let value = useForm.getFieldValue("national_id");
    if (value) {
      let error = useForm.getFieldError("national_id");
      if (error.length === 0) {
        // check machine code
        getUserAndSubordinate(value, useForm, insuranceInfo);
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
          <Col xs={24} sm={24} md={24} lg={edit ? 24 : 12} xl={edit ? 24 : 8}>
            <Form.Item style={{ marginBottom: "0" }} label="جستجو">
              <Row>
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
                <Col span={6}>
                  {form.getFieldValue("personnel_id") ? (
                    <AppButton
                      size="large"
                      block
                      onClick={handelChangePerson}
                      disabled={detail || edit}
                    >
                      تغییر
                    </AppButton>
                  ) : (
                    <AppButton
                      size="large"
                      block
                      onClick={handleOnClick}
                      loading={loading}
                      disabled={detail}
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

const Person = ({
  useForm,
  setPerson,
  edit = false,
  disabled,
  defaultValue = false,
  size = false,
  onReset = false,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="personnel_id"
      nameField="user_full_name"
      name="national_id"
      defaultValue={defaultValue}
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      disabled={disabled}
      size={size}
      onReset={onReset}
    />
  );
};

export {
  StartDateInsurance,
  PersonType,
  Description,
  EndDateInsurance,
  NationalID,
  MobileNumber,
  UserID,
  UserFullName,
  WitchMainPerson,
  UserStatus,
  MainUserID,
  Person,
  BankAccount,
  subordinateSelect,
  AddSubordinate,
  relation,
  submitSubordinate,
};
