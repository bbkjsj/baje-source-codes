import React, { useContext, useEffect } from "react";
import { Col, Form, Input, Radio, Checkbox, Button, Modal, Select } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { numberNormalize, countOfNumInp, checkShamsi } from "_helpers";
import { veteranPercentage } from "./formItems/json";
import PeriodTime from "components/PeriodTime";
import { formColSpan } from "../../../../../constant";
import { useSelector } from "react-redux";

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
      name={"birth_date/mainInfoTab"}
      maximumDate={utils("fa").getToday()}
      rules={rules}
      onChange={onChange}
    />
  );
};

const NationalNumber = ({ onChange, onBlur, edit }) => {
  const rules = [
    {
      required: true,
      len: 10,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="کد ملی"
        name="national_number/mainInfoTab"
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
        rules={rules}
      >
        <Input onChange={onChange} onBlur={onBlur} disabled={edit} />
      </Form.Item>
    </Col>
  );
};

const Name = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="نام" name={"first_name/mainInfoTab"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const LastName = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="نام خانوادگی"
        name={"last_name/mainInfoTab"}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const FatherName = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="نام پدر" name={"father_name/mainInfoTab"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const IDNumber = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره شناسنامه"
        name={"id_number/mainInfoTab"}
        rules={rules}
        validateFirst
        normalize={numberNormalize}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Sex = () => {
  const options = [
    { label: "مرد", value: "male" },
    { label: "زن", value: "female" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="جنسیت" name={"sex/mainInfoTab"}>
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const BirthPlace = () => {
  const rules = [
    {
      required: true,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="محل تولد"
        name={"birth_place/mainInfoTab"}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const IDIssuePlace = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="محل صدور شناسنامه" name={"id_issue_place/mainInfoTab"}>
        <Input disabled={true} />
      </Form.Item>
    </Col>
  );
};

const Nation = () => {
  const options = [
    { label: "ایرانی", value: "iranian" },
    { label: "غیر ایرانی", value: "non_iranian" },
  ];

  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="ملیت" name={"nation/mainInfoTab"} rules={rules}>
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const PublicDescription = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات عمومی" name={"public_description/mainInfoTab"}>
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

const PrivateDescription = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات خصوصی" name={"private_description/mainInfoTab"}>
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

const ContractID = ({ useForm }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const contractList = useSelector((state) => state.contractList);

  useEffect(() => {
    useForm.setFieldsValue({
      "contract_id/mainInfoTab": currentContract,
    });
  }, [currentOffice, currentContract]);

  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="ارتباط کارگاهی" name="contract_id/mainInfoTab">
        <Select disabled={true}>
          {contractList.map((el) => (
            <Select.Option
              key={el.contract_id}
              value={el.contract_id}
              title={el.subject}
            >
              {el.subject}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

const MaritalStatus = () => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "مجرد", value: "single" },
    { label: "متاهل", value: "married" },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="وضعیت تأهل"
        name={"marital_status/mainInfoTab"}
        rules={rules}
      >
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const ArmyService = () => {
  const rules = [
    {
      required: true,
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (value === "معافیت سنی") {
          let BD = getFieldValue("birth_date/mainInfoTab");
          if (BD && parseInt(BD.split("/")[0]) > 1350) {
            return Promise.reject(
              "معافیت سنی برای متولدین 1350 به قبل مربوط می شود."
            );
          }
        }
        return Promise.resolve();
      },
    }),
  ];
  const options = [
    { label: "نامشخص", value: "نامشخص" },
    { label: "پایان خدمت", value: "پایان خدمت" },
    { label: "معافیت پزشکی", value: "معافیت پزشکی" },
    { label: "معافیت کفالت", value: "معافیت کفالت" },
    { label: "معافیت تحصیلی", value: "معافیت تحصیلی" },
    { label: "خدمت نکرده", value: "خدمت نکرده" },
    { label: "خرید خدمت", value: "خرید خدمت" },
    { label: "معافیت مددجویان", value: "معافیت مددجویان" },
    { label: "معافیت سنی", value: "معافیت سنی" },
    { label: "معافیت متعهدین خدمت", value: "معافیت متعهدین خدمت" },
    { label: "معافیت ایثارگران", value: "معافیت ایثارگران" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="وضعیت خدمت"
        name="army_service/mainInfoTab"
        rules={rules}
      >
        <Select defaultValue={options[1].value} options={options}></Select>
      </Form.Item>
    </Col>
  );
};

const Education = () => {
  const options = [
    { label: "نامشخص", value: "unknown" },
    { label: "بیسواد", value: "illiterate" },
    { label: "تحصیلات ابتدایی", value: "school" },
    { label: "سیکل", value: "middle_school" },
    { label: "دیپلم", value: "high_school" },
    { label: "لیسانس", value: "bachelor" },
    { label: "فوق لیسانس", value: "master" },
    { label: "دکترا", value: "doctorate" },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item label="میزان تحصیلات" name="education/mainInfoTab">
        <Select options={options}></Select>
      </Form.Item>
    </Col>
  );
};

const StudyField = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="رشته تحصیلی"
        name={"study_field/mainInfoTab"}
        autoComplete="nope"
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Username = ({ edit }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام کاربری" name={"username/mainInfoTab"}>
        <Input disabled={edit} autoComplete="nope" />
      </Form.Item>
    </Col>
  );
};

const Password = ({ edit }) => {
  const rules = [
    // {
    //   pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //   message:
    //     "کلمه عبور باید حداقل دارای 8 کاراکتر و شامل حروف انگلیسی، اعداد و علائم باشد",
    // },
  ];
  if (!edit) {
    rules.push({
      required: true,
    });
  }

  return (
    <Col {...formColSpan}>
      <Form.Item label="رمز عبور" name={"password/mainInfoTab"} rules={rules}>
        <Input.Password
          defaultValue={null}
          autoComplete="new-password"
          name="password/mainInfoTab"
        />
      </Form.Item>
    </Col>
  );
};

const ConfirmPassword = ({ edit }) => {
  const rules = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue("password/mainInfoTab") === value) {
          return Promise.resolve();
        }
        return Promise.reject("رمز عبور مطابقت ندارد");
      },
    }),
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        dependencies={["password/mainInfoTab"]}
        label="تکرار رمز عبور"
        name={"repeat_password/mainInfoTab"}
        rules={rules}
        autoComplete="nope"
      >
        <Input.Password />
      </Form.Item>
    </Col>
  );
};

const Isargar = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        let armyService = getFieldValue("army_service/mainInfoTab");
        if (armyService === "معافیت ایثارگران" && value === "none") {
          return Promise.reject("نوع معافیت ایثارگران انتخاب شده است!");
        }
        return Promise.resolve();
      },
    }),
  ];

  const options = [
    { label: "نمی باشد", value: "none" },
    { label: "فرزند شهید", value: "child_of" },
    { label: "همسر شهید", value: "wife_of" },
    { label: "جانباز", value: "veteran" },
    { label: "رزمنده", value: "fighting" },
    { label: "آزاده", value: "noble" },
    { label: "فرزند جانباز", value: "فرزند جانباز" },
    { label: "همسر جانباز", value: "همسر جانباز" },
  ];

  const forMale = [
    { label: "پدر شهید", value: "پدر شهید" },
    { label: "برادر شهید", value: "برادر شهید" },
    { label: "پدر جانباز", value: "پدر جانباز" },
    { label: "برادر جانباز", value: "برادر جانباز" },
  ];

  const forFemale = [
    { label: "مادر شهید", value: "مادر شهید" },
    { label: "خواهر شهید", value: "خواهر شهید" },
    { label: "مادر جانباز", value: "مادر جانباز" },
    { label: "خواهر جانباز", value: "خواهر جانباز" },
  ];

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        let cases = [];
        if (form.getFieldValue("sex/mainInfoTab") === "male") {
          cases = [...options, ...forMale];
        } else {
          cases = [...options, ...forFemale];
        }
        return (
          <Col {...formColSpan}>
            <Form.Item label="ایثارگر" name="isargar/mainInfoTab" rules={rules}>
              <Select options={cases} onChange={onChange}></Select>
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

const ShahidWasColleague = () => {
  const rules = [
    {
      required: false,
    },
  ];
  const options = [
    { label: "همکار", value: 1 },
    { label: "غیر همکار", value: 0 },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شهید همکار"
        name={"shahid_was_colleague/mainInfoTab"}
        rules={rules}
      >
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const ShahidName = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="نام شهید"
        name={"shahid_name/mainInfoTab"}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const JanbazName = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="نام جانباز"
        name={"janbaz_name/mainInfoTab"}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const VeteranPercentage = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="درصد جانبازی"
        name="veteran_percentage/mainInfoTab"
        rules={rules}
      >
        <Select options={veteranPercentage}></Select>
      </Form.Item>
    </Col>
  );
};

const PeriodTimeFighting = () => {
  return (
    <PeriodTime
      label="مدت حضور در جبهه"
      year="frontline_year/mainInfoTab"
      month="frontline_month/mainInfoTab"
      day="frontline_day/mainInfoTab"
    />
  );
};

const PeriodTimeNoble = () => {
  return (
    <PeriodTime
      label="مدت زمان اسارت"
      year="captivity_year"
      month="captivity_month"
      day="captivity_day"
    />
  );
};

export {
  NationalNumber,
  BirthDate,
  Name,
  LastName,
  FatherName,
  IDNumber,
  Sex,
  BirthPlace,
  IDIssuePlace,
  Nation,
  PublicDescription,
  PrivateDescription,
  ContractID,
  MaritalStatus,
  ArmyService,
  Education,
  StudyField,
  Username,
  Password,
  ConfirmPassword,
  Isargar,
  ShahidWasColleague,
  ShahidName,
  JanbazName,
  VeteranPercentage,
  PeriodTimeFighting,
  PeriodTimeNoble,
};
