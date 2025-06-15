import { Form, Input } from "antd";
import React, { useContext } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import AppInput from "components/general/AppInput";
import AppSelect from "components/general/AppSelect";
import { handleValidateNationalNumber } from "./../../../../../_helpers";
import { InsuranceWizardContext } from "../contexts/InsuranceWizardContext";

const Name = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Form.Item
      name="first_name"
      label="نام"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput />
    </Form.Item>
  );
};

const LastName = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Form.Item
      name="last_name"
      label="نام خانوادگی"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput />
    </Form.Item>
  );
};

const NID = ({ className, disabled }) => {
  const rules = [
    {
      required: true,
    },

    () => ({
      validator(rule, value) {
        if (handleValidateNationalNumber(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject("کد ملی وارد شده صحیح نیست");
        }
      },
    }),
  ];

  return (
    <Form.Item
      name="national_code"
      label="کد ملی"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
      normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
    >
      <AppInput type="number" disabled={disabled} />
    </Form.Item>
  );
};

const IdentityNum = () => {
  const rules = [
    {
      required: true,
      max: 10,
    },
  ];

  return (
    <Form.Item
      name="id_number"
      label="شماره شناسنامه"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput type="number" />
    </Form.Item>
  );
};

const FatherName = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Form.Item
      name="father_name"
      label="نام پدر"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput />
    </Form.Item>
  );
};

const BirthDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ تولد اجباری است",
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
      label="تاریخ تولد"
      name="birth_date"
      maximumDate={utils("fa").getToday()}
      rules={rules}
      xlCol={12}
      onChange={onChange}
    />
  );
};

const IssuePlace = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Form.Item
      label="محل صدور شناسنامه"
      disabled
      name="issue_place"
      rules={rules}
    >
      <Input disabled />
    </Form.Item>
  );
};

const Relation = () => {
  const { hasParents } = useContext(InsuranceWizardContext);
  const rules = [
    {
      required: true,
    },
  ];

  console.log(hasParents);

  const options = [
    { label: "همسر", value: "wife" },
    { label: "دختر", value: "daughter" },
    { label: "پسر", value: "son" },
  ];

  if (!hasParents.father) {
    options.push({ label: "پدر", value: "father" });
  }
  if (!hasParents.mother) {
    options.push({ label: "مادر", value: "mother" });
  }

  return (
    <Form.Item
      label="نسبت"
      name="relation"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppSelect options={options} />
    </Form.Item>
  );
};

const SupportStatus = () => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "تحت تکفل", value: "under_the_tutelage" },
    { label: "غیر تحت تکفل", value: "non_dependent" },
  ];

  return (
    <Form.Item
      label="وضعیت تکفل"
      name="sponsorship_status"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppSelect options={options} />
    </Form.Item>
  );
};

const InsuranceNum = () => {
  const rules = [
    {
      required: true,
    },
    {
      min: 8,
      max: 10,
      message: "شماره بیمه وارد شده معتبر نیست",
    },
  ];

  return (
    <Form.Item
      name="insurance_number"
      label="شماره بیمه"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput type="number" />
    </Form.Item>
  );
};

export {
  Name,
  LastName,
  NID,
  IdentityNum,
  FatherName,
  BirthDate,
  IssuePlace,
  Relation,
  SupportStatus,
  InsuranceNum,
};
