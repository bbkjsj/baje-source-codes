import { Col, Form, Input } from "antd";
import {
  JobCodeInput,
  NationalIdInput,
} from "modules/personnel/realPerson/service/formItems";
import React from "react";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import AppFormItem from "components/general/AppFormItem";
import AppNumInput from "components/general/AppNumInput";
import { checkShamsi, getMonthDaysByMonth } from "_helpers";

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
      nameField="person_name"
      name="person_national_code"
      defaultValue={defaultValue}
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={false}
      disabled={disabled}
    />
  );
};

const StartDate = ({ useForm, insurance, disabled }) => {
  const rules = [
    {
      required: true,
      message: "فیلد تاریخ شروع کار اجباریست",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && insurance) {
          if (
            value <
              `${insurance.year}/${("0" + insurance.month).slice(-2)}/01` ||
            value >
              `${insurance.year}/${("0" + insurance.month).slice(
                -2
              )}/${getMonthDaysByMonth(insurance.month)}`
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
    <CustomDatePicker
      form={useForm}
      label=" تاریخ شروع به کار"
      name="start_date"
      rules={rules}
      disabled={disabled}
    />
  );
};

const EndDate = ({ useForm, insurance, disabled }) => {
  const rules = [
    {
      required: true,
      message: "فیلد تاریخ پایان کار اجباریست",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("start_date") > value) {
          return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
        }
        if (checkShamsi(value, false) && insurance) {
          if (
            value <
              `${insurance.year}/${("0" + insurance.month).slice(-2)}/01` ||
            value >
              `${insurance.year}/${("0" + insurance.month).slice(
                -2
              )}/${getMonthDaysByMonth(insurance.month)}`
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
    <CustomDatePicker
      form={useForm}
      label="تاریخ پایان کار"
      name="end_date"
      rules={rules}
      disabled={disabled}
    />
  );
};

const TotalWorkDay = ({ disabled, initialValues, insurance }) => {
  const rules = [
    {
      required: true,
      message: "فیلد روز کارکرد اجباریست",
    },
    () => ({
      validator(rule, value) {
        if (
          parseFloat(value) > getMonthDaysByMonth(insurance.month) ||
          parseFloat(value) < 0
        ) {
          return Promise.reject(
            `حداکثر تعداد روز کارکرد مجاز ${getMonthDaysByMonth(
              insurance.month
            )} روز است`
          );
        } else {
          return Promise.resolve();
        }
      },
    }),
  ];

  return (
    <Col xs={6} sm={3} md={3} lg={3} xl={3}>
      <Form.Item
        // label="روز کارکرد"
        name="total_work_day"
        rules={rules}
        initialValue={initialValues}
      >
        <Input type="number" disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const DailySalary = ({ disabled, initialValue }) => {
  const rules = [
    {
      required: true,
      message: "فیلد دستمزد روزانه اجباریست",
    },
  ];

  return (
    <Col xs={12} sm={6} md={6} lg={6} xl={6}>
      <AppFormItem
        name="daily_salary"
        rules={rules}
        initialValue={initialValue}

        // label="دستمزد روزانه"
      >
        <AppNumInput disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const IncludeBenefit = ({ def, disabled, insurance }) => {
  return (
    <>
      <AppFormItem noStyle shouldUpdate>
        {(form) => {
          let rules = [
            {
              required: true,
              message: "فیلد مزایای مشمول اجباریست",
            },
          ];
          if (form.getFieldValue("total_work_day") !== null) {
            rules = [
              {
                required: true,
                message: "فیلد مزایای مشمول اجباریست",
              },
              () => ({
                validator(rule, value) {
                  let maxValue = (
                    (def * form.getFieldValue("total_work_day")) /
                    getMonthDaysByMonth(insurance.month)
                  ).toFixed(1);
                  if (parseFloat(value) > maxValue) {
                    return Promise.reject("حداکثر مقدار: " + maxValue);
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ];

            return (
              <Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <AppFormItem
                  // label="مزایای مشمول"
                  name="include_benefit"
                  rules={rules}
                >
                  <AppNumInput disabled={disabled} />
                </AppFormItem>
              </Col>
            );
          }
        }}
      </AppFormItem>
    </>
  );
};

const Job = ({
  useForm,
  defaultValue = false,
  onChange = () => null,
  disabled,
}) => {
  return (
    <JobCodeInput
      label={
        <span>
          شغل <span style={{ color: "red" }}>*</span>
        </span>
      }
      name="job_code"
      codeField="job"
      nameField="job_title"
      idField="job_id"
      useForm={useForm}
      onChange={onChange}
      defaultValue={defaultValue}
      fieldRules={[{ required: true, message: "شغل اجباری است" }]}
      disabled={disabled}
    />
  );
};

const SalaryIncludeNotInclude = ({ disabled }) => {
  const rules = [
    {
      required: true,
      message: "فیلد  دستمزدو مزایای مشمول وغیرمشمول اجباریست",
    },
  ];

  return (
    <Col xs={12} sm={6} md={6} lg={6} xl={6}>
      <AppFormItem
        // label="دستمزد و مزایای مشمول و غیر مشمول:"
        name="salary_benefit_include_notinclude"
        rules={rules}
      >
        <AppNumInput disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const Description = ({ disabled }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <AppFormItem label="توضیحات:" name="description">
        <Input.TextArea disabled={disabled} rows={8} />
      </AppFormItem>
    </Col>
  );
};

export {
  Person,
  TotalWorkDay,
  Description,
  StartDate,
  EndDate,
  DailySalary,
  IncludeBenefit,
  Job,
  SalaryIncludeNotInclude,
};
