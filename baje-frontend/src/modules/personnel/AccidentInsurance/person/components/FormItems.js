import React, { useEffect, useContext } from "react";
import { Col, Form, Radio, Input, Row } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { checkShamsi, countOfNumInp, covetFormatDateToFA } from "_helpers";
import * as values from "../const";
import { useGetUserAndSubordinate, useGetPersonnel } from "../util/hooks";
import { AccidentInsuranceContext } from "../../util/AccidentInsuranceContext";
import AppButton from "components/general/AppButton";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { formColSpan } from "../../../../../constant";

const customColSpan = {
  span: 24,
};
// check for national id if checked show inputs
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

const StartDateInsurance = ({ useForm, detail, edit }) => {
  const insuranceContext = useContext(AccidentInsuranceContext);

  const dateRules = [
    {
      required: true,
      message: "فیلد تاری شروع اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
          if (
            value <
              covetFormatDateToFA(
                insuranceContext.insurance.contract_date_from_date
              ) ||
            value > covetFormatDateToFA(insuranceContext.insurance.to_date)
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
      <CustomDatePicker
        plain={edit}
        form={useForm}
        label="تاریخ شروع بیمه"
        name="start_date"
        rules={dateRules}
        disabled={detail}
      />
    </CheckShowPersonal>
  );
};

const EndDateInsurance = ({ useForm, detail, edit }) => {
  const insuranceContext = useContext(AccidentInsuranceContext);

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
            value <
              covetFormatDateToFA(
                insuranceContext.insurance.contract_date_from_date
              ) ||
            value > covetFormatDateToFA(insuranceContext.insurance.to_date)
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
      <CustomDatePicker
        plain={edit}
        form={useForm}
        label="تاریخ پایان بیمه"
        name="end_date"
        rules={finishDateRule}
        disabled={detail}
      />
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
      <Col {...(edit ? customColSpan : formColSpan)}>
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
      <Col {...(edit ? customColSpan : formColSpan)}>
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

const Description = ({ detail, edit }) => {
  return (
    <CheckShowPersonal>
      <Col {...(edit ? customColSpan : formColSpan)} xl={edit ? 24 : 12}>
        <Form.Item label="توضیحات" name="description">
          <Input.TextArea disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
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
      <Col {...(edit ? customColSpan : formColSpan)}>
        <Form.Item name={"user_full_name"} label="نام">
          <Input disabled />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const NationalID = ({
  useForm,
  detail,
  setMainPersonOption,
  otherCompanyTrigger,
  insuranceInfo,
  initialValue,
  edit,
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
    />
  );
};

export {
  StartDateInsurance,
  PersonType,
  Description,
  EndDateInsurance,
  NationalID,
  UserID,
  UserFullName,
  WitchMainPerson,
  UserStatus,
  MainUserID,
  Person,
};
