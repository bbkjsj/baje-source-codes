import React, { useContext, useEffect, useState } from "react";
import { Col, Form, Input, Radio, message, Select } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { numberNormalize, countOfNumInp, checkShamsi } from "_helpers";
import CheckCode from "components/renderInput/checkCode/CheckCode";
import { handleCheckJobCode } from "../../utils/formUtils";
import { formColSpan } from "../../../../../constant";

const JobTitleID = ({ useForm, initialValue }) => {
  const [checkCodeStatus, setCheckCodeStatus] = useState(
    initialValue ? "edit" : "check"
  );
  const [checkCodeLoading, setCheckLoading] = useState(false);
  const edit = () => {
    setCheckCodeStatus("check");
  };

  const getError = (err) => {
    message.error(err);
  };

  return (
    <CheckCode
      job_Code={initialValue && initialValue.code}
      job_Title={initialValue && initialValue.title}
      label="عنوان شغل"
      name="job_title_id/jobInfoTab"
      status={checkCodeStatus}
      resultNameFiled="job_title_name/jobInfoTab"
      edit={edit}
      filedName="job_title_id/jobInfoTab"
      loading={checkCodeLoading}
      checkCode={() =>
        handleCheckJobCode(
          useForm,
          setCheckLoading,
          getError,
          setCheckCodeStatus
        )
      }
      filedRules={[]}
    >
      <Input
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 6)}
        onChange={(e) => {
          if (e.target.value.length === 6) {
            handleCheckJobCode(
              useForm,
              setCheckLoading,
              getError,
              setCheckCodeStatus
            );
          }
        }}
      />
    </CheckCode>
  );
};

const InsuranceNumber = ({ onBlur }) => {
  const rules = [
    {
      len: 8,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره بیمه"
        name={"insurance_number/jobInfoTab"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 8)}
        rules={rules}
      >
        <Input onBlur={onBlur} />
      </Form.Item>
    </Col>
  );
};

const PersonnelId = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره پرسنلی فعال"
        name={"personnel_id/jobInfoTab"}
        normalize={numberNormalize}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

//
const HistoryTotalDay = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="سوابق گذشته"
        name={"history_total_day/jobInfoTab"}
        normalize={numberNormalize}
      >
        <Input placeholder="تعداد روز" />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareEmployee = () => {
  const options = [
    { label: "دارد", value: 1 },
    { label: "ندارد", value: 0 },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="حق بیمه کارمند"
        name={"insurance_share_employee/jobInfoTab"}
      >
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareEmployer = () => {
  const options = [
    { label: "دارد", value: 1 },
    { label: "ندارد", value: 0 },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="حق بیمه کارفرما"
        name={"insurance_share_employer/jobInfoTab"}
      >
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareUnemployment = () => {
  const options = [
    { label: "دارد", value: 1 },
    { label: "ندارد", value: 0 },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="حق بیمه بیکاری"
        name={"insurance_share_unemployment/jobInfoTab"}
      >
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareHarmful = () => {
  const options = [
    { label: "دارد", value: 1 },
    { label: "ندارد", value: 0 },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="حق بیمه سهم مشاغل
سخت و زیان آور"
        name={"insurance_share_harmful/jobInfoTab"}
      >
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const EmploymentDate = ({ useForm }) => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (!value || checkShamsi(value)) {
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
      label="تاریخ استخدام"
      name={"employeement_date/jobInfoTab"}
      maximumDate={utils("fa").getToday()}
      rules={rules}
    />
  );
};

const EmploymentType = ({ onChange }) => {
  const options = [
    { label: "نامشخص", value: "none" },
    { label: "قراداد موقت", value: "temporary_contract" },
    { label: "قرارداد دایم", value: "Permanent_contract" },
    { label: "روزمزد", value: "daily_worker" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="نوع استخدادم" name="employeement_type/jobInfoTab">
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const StartContractDate = ({ useForm }) => {
  const rules = [
    { required: true, message: "تاریخ شروع قراداد اجباری است" },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value)) {
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
      label="تاریخ شروع قراداد"
      name={"contract_start_date/jobInfoTab"}
      maximumDate={utils("fa").getToday()}
      rules={rules}
    />
  );
};

const FinishContractDate = ({ useForm }) => {
  const rules = [
    { required: true, message: "تاریخ پایان قراداد اجباری است" },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
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
      label="تاریخ پایان قراداد"
      name={"contract_end_date/jobInfoTab"}
      rules={rules}
    />
  );
};

const JobType = () => {
  const options = [
    { label: "عملیاتی", value: "operational" },
    { label: "ستادی", value: "nonoperational" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="نوع شغل" name={"job_type/jobInfoTab"}>
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const JobStatus = ({ onChange }) => {
  const options = [
    { label: "فعال", value: "active" },
    { label: "غیر فعال", value: "inactive" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="وضعیت شغل" name={"job_status/jobInfoTab"}>
        <Radio.Group options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

const ExpireTime = ({ useForm }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ ثبت اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value)) {
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
      label="زمان غیر فعالی"
      name={"expire_time/jobInfoTab"}
      maximumDate={utils("fa").getToday()}
      rules={rules}
    />
  );
};

const ExpireReason = () => {
  const options = [
    { label: "بازنشستگی", value: "retire" },
    { label: "ترک کار", value: "quit" },
    { label: "تعلیق", value: "redundant" },
    { label: "اخراج", value: "dismiss" },
    { label: "فوت", value: "dead" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="علت غیر فعالی" name="expire_reason/jobInfoTab">
        <Select options={options}></Select>
      </Form.Item>
    </Col>
  );
};

export {
  InsuranceNumber,
  PersonnelId,
  JobType,
  JobStatus,
  ExpireTime,
  ExpireReason,
  JobTitleID,
  HistoryTotalDay,
  InsuranceShareEmployee,
  InsuranceShareEmployer,
  InsuranceShareUnemployment,
  InsuranceShareHarmful,
  EmploymentDate,
  EmploymentType,
  StartContractDate,
  FinishContractDate,
};
