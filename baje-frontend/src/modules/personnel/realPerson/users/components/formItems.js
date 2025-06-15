import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { Select, Form, Col, Input, Radio, Button, Upload, Modal } from "antd";
import { utils } from "react-modern-calendar-datepicker";
import usePreviewImage from "hooks/usePreviewImage";
import { formColSpan } from "constant";
import {
  countOfNumInp,
  checkShamsi,
  numberNormalize,
  mobileNumberValidation,
  handleValidateNationalNumber,
} from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { nations } from "../utils/const";
import bankList from "json/BankList";
import AppPasteInput from "components/general/AppPasteInput";
import PeriodTime from "components/PeriodTime";
import useWhoAmI from "hooks/useWhoAmI";
import ImgCrop from "antd-img-crop";

const Nation = ({ onChange }) => {
  const options = [
    { label: "ایرانی", value: nations.iranian },
    { label: "غیر ایرانی", value: nations.non_iranian },
  ];

  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="ملیت" name={"nation"} rules={rules}>
        <Radio.Group options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

const NationalNumber = ({
  onChange,
  disabled = false,
  lenght,
  label,
  form,
}) => {
  const rules = [
    {
      required: true,
      len: lenght,
    },
    () => ({
      validator(rule, value) {
        if (handleValidateNationalNumber(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject("کد ملی وارد شده معتبر نیست");
        }
      },
    }),
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label={label}
        name="national_number"
        normalize={(value, prevValue) =>
          countOfNumInp(value, prevValue, lenght)
        }
        rules={rules}
      >
        <Input
          onChange={onChange}
          disabled={disabled}
          defaultValue={form ? form.getFieldValue("nationalCode") : ""}
        />
      </Form.Item>
    </Col>
  );
};

const BirthDate = ({ form, onChange }) => {
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
      form={form}
      label="تاریخ تولد"
      name={"birth_date"}
      maximumDate={utils("fa").getToday()}
      rules={rules}
      onChange={onChange}
    />
  );
};

const Sex = () => {
  const options = [
    { label: "مرد", value: "m" },
    { label: "زن", value: "f" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="جنسیت" name={"sex"} rules={[{ required: true }]}>
        <Radio.Group options={options} />
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
      <Form.Item label="نام" name={"first_name"} rules={rules}>
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
      <Form.Item label="نام خانوادگی" name={"last_name"} rules={rules}>
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
      <Form.Item label="نام پدر" name={"father_name"} rules={rules}>
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
        name={"id_number"}
        rules={rules}
        normalize={numberNormalize}
      >
        <Input inputMode="numeric" />
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
      <Form.Item label="محل تولد" name={"birth_place"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const IDIssuePlace = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="محل صدور شناسنامه" name={"id_issue_place"}>
        <Input disabled={true} />
      </Form.Item>
    </Col>
  );
};

const MobileOne = ({}) => {
  const rules = [
    {
      len: 11,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره موبایل 1"
        name={"mobile1"}
        validateFirst
        normalize={(value) => mobileNumberValidation(value)}
        rules={rules}
      >
        <Input
          placeholder="09XXXXXXXXX بصورت"
          style={{ textAlign: "end", direction: "ltr" }}
          inputMode="numeric"
        />
      </Form.Item>
    </Col>
  );
};

const MobileTwo = () => {
  const rules = [
    {
      len: 11,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره موبایل 2"
        name={"mobile2"}
        validateFirst
        normalize={(value) => mobileNumberValidation(value)}
        rules={rules}
      >
        <Input
          placeholder="09XXXXXXXXX بصورت"
          style={{ textAlign: "end", direction: "ltr" }}
          inputMode="numeric"
        />
      </Form.Item>
    </Col>
  );
};

const Phone = () => {
  const rules = [
    {
      len: 11,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره تلفن"
        name={"phone"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 11)}
        rules={rules}
      >
        <Input inputMode="numeric" />
      </Form.Item>
    </Col>
  );
};

const Email = () => {
  const rules = [
    {
      type: "email",
      message: "فرمت ایمیل نادرست است",
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item label="آدرس ایمیل" name="email" rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const PostalCode = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="کد پستی"
        name="postal_code"
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
        rules={[{ len: 10 }]}
      >
        <Input inputMode="numeric" />
      </Form.Item>
    </Col>
  );
};

const Address = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="آدرس " name="address">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

const BankAccount = ({ name }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره حساب" name={name} normalize={numberNormalize}>
        <Input inputMode="numeric" />
      </Form.Item>
    </Col>
  );
};

const Sheba = ({ name }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره شبا" name={name}>
        <Input inputMode="numeric" />
      </Form.Item>
    </Col>
  );
};

const BankName = ({ name }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام بانک" name={name}>
        <Select showSearch options={bankList}></Select>
      </Form.Item>
    </Col>
  );
};

const ImageUploader = ({
  name,
  label,
  rules,
  accept,
  extra = null,
  defaultFileList = [],
  aspect = 4 / 3,
}) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    if (e.fileList.length > 1) {
      e.fileList.shift();
    }

    return e && e.fileList;
  };

  const [
    imageUrl,
    onPreview,
    modalVisible,
    setModalVisible,
    cancelModal,
  ] = usePreviewImage();
  return (
    <>
      <Modal
        title="نمایش تصویر"
        visible={modalVisible}
        onCancel={cancelModal}
        footer={null}
      >
        <img src={imageUrl} style={{ width: "100%" }} />
      </Modal>
      <Col {...formColSpan}>
        <Form.Item
          extra={extra}
          name={name}
          label={label}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={rules}
        >
          {/* <ImgCrop rotate quality={1} modalTitle="ویرایش تصویر" aspect={aspect}> */}
          <Upload
            // onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept={accept}
            defaultFileList={defaultFileList ? defaultFileList : []}
          >
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
          {/* </ImgCrop> */}
        </Form.Item>
      </Col>
    </>
  );
};

const Username = ({ disabled }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام کاربری" name={"username"}>
        <Input disabled={disabled} autoComplete="nope" />
      </Form.Item>
    </Col>
  );
};

const Password = ({ disabled }) => {
  const rules = [];
  // if (!disabled) {
  //   rules.push({
  //     required: true,
  //   });
  // }

  return (
    <Col {...formColSpan}>
      <Form.Item label="رمز عبور" name={"password"} rules={rules}>
        <Input.Password
          defaultValue={null}
          autoComplete="new-password"
          name="password"
        />
      </Form.Item>
    </Col>
  );
};

const ConfirmPassword = ({ disabled }) => {
  const rules = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject("رمز عبور مطابقت ندارد");
      },
    }),
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        dependencies={["password"]}
        label="تکرار رمز عبور"
        name={"repeat_password"}
        rules={rules}
        autoComplete="nope"
      >
        <Input.Password />
      </Form.Item>
    </Col>
  );
};

const HomePage = ({ disabled, form }) => {
  const rules = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (
          !value ||
          value.startsWith("https://test.baje724.ir/") ||
          value.startsWith("https://baje724.ir/")
        ) {
          return Promise.resolve();
        }
        return Promise.reject("آدرس وارد شده  مربوط به این سامانه نیست ");
      },
    }),
  ];

  function validator(text) {
    if (
      !text ||
      text.startsWith("https://test.baje724.ir/") ||
      text.startsWith("https://baje724.ir/")
    ) {
      return;
    }
    form.setFields([
      {
        name: "defaultHomePage",
        errors: ["آدرس وارد شده  مربوط به این سامانه نیست "],
      },
    ]);
  }

  return (
    <AppPasteInput
      form={form}
      field_name="defaultHomePage"
      label="صفحه خانه"
      rules={rules}
      validator={validator}
      disabled={disabled}
      tooltip="کاربر گرامی، شما می توانید با کپی کردن
    آدرس هر یک از صفحات سامانه، به هنگام لاگین، مستقیماً به همان صفحه هدایت شوید"
    />
  );
};

const DefaultCompany = () => {
  const user = useWhoAmI();
  const listLegal = user?.companies;

  return (
    <Col {...formColSpan}>
      <Form.Item name="defaultCompanyId" label="شرکت پیش فرض">
        {/* <Select defaultValue={listLegal.lenght === 1 ? listLegal[0].id : null}> */}
        <Select>
          {listLegal.map((el) => (
            <Select.Option key={el.id} value={el.id} title={el.name}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
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
        name={"insurance_number"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 8)}
        rules={rules}
      >
        <Input onBlur={onBlur} />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareEmployee = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="حق بیمه کارمند" name="insurance_share_employee">
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareEmployer = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="حق بیمه کارفرما" name="insurance_share_employer">
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareUnemployment = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="حق بیمه بیکاری" name={"insurance_share_unemployment"}>
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

const InsuranceShareHarmful = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="حق بیمه سهم مشاغل
سخت و زیان آور"
        name={"insurance_share_harmful"}
      >
        <Input type="number" />
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
      <Form.Item label="وضعیت تأهل" name={"marital_status"} rules={rules}>
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
          let BD = getFieldValue("birth_date");
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
    { label: "در حال خدمت", value: "در حال خدمت" },
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
      <Form.Item label="وضعیت خدمت" name="army_service" rules={rules}>
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
      <Form.Item label="میزان تحصیلات" name="education">
        <Select options={options}></Select>
      </Form.Item>
    </Col>
  );
};

const StudyField = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="رشته تحصیلی" name={"study_field"} autoComplete="nope">
        <Input />
      </Form.Item>
    </Col>
  );
};

const PublicDescription = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات عمومی" name={"public_description"}>
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

const PrivateDescription = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات خصوصی" name={"private_description"}>
        <Input.TextArea />
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
        let armyService = getFieldValue("army_service");
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
        if (form.getFieldValue("sex") === "male") {
          cases = [...options, ...forMale];
        } else {
          cases = [...options, ...forFemale];
        }
        return (
          <Col {...formColSpan}>
            <Form.Item label="ایثارگر" name="isargar" rules={rules}>
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
      <Form.Item label="شهید همکار" name={"shahid_was_colleague"} rules={rules}>
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
      <Form.Item label="نام شهید" name={"shahid_name"} rules={rules}>
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
      <Form.Item label="نام جانباز" name={"janbaz_name"} rules={rules}>
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

  const veteranPercentage = [];
  for (let i = 0; i < 99; i++) {
    veteranPercentage.push({ label: `${i}درصد`, value: i });
  }

  return (
    <Col {...formColSpan}>
      <Form.Item label="درصد جانبازی" name="veteran_percentage" rules={rules}>
        <Select options={veteranPercentage}></Select>
      </Form.Item>
    </Col>
  );
};

const PeriodTimeFighting = () => {
  return (
    <PeriodTime
      label="مدت حضور در جبهه"
      year="frontline_year"
      month="frontline_month"
      day="frontline_day"
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

const SelectOffice = ({ option, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="انتخاب شرکت" name="selectOffice">
        <Select onChange={onChange}>
          {option.map((el) => (
            <Select.Option key={el.id} value={el.id} title={el.name}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

const SelectContract = ({ option, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="انتخاب قرارداد" name="selectContract">
        <Select onChange={onChange}>
          {option.map((el) => (
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

export {
  Nation,
  NationalNumber,
  BirthDate,
  Sex,
  Name,
  LastName,
  FatherName,
  IDNumber,
  BirthPlace,
  IDIssuePlace,
  MobileOne,
  MobileTwo,
  Phone,
  Email,
  PostalCode,
  Address,
  BankAccount,
  Sheba,
  BankName,
  ImageUploader,
  Username,
  Password,
  ConfirmPassword,
  HomePage,
  DefaultCompany,
  InsuranceNumber,
  InsuranceShareEmployee,
  InsuranceShareEmployer,
  InsuranceShareUnemployment,
  InsuranceShareHarmful,
  MaritalStatus,
  ArmyService,
  StudyField,
  Education,
  PublicDescription,
  PrivateDescription,
  Isargar,
  ShahidWasColleague,
  ShahidName,
  JanbazName,
  VeteranPercentage,
  PeriodTimeFighting,
  PeriodTimeNoble,
  SelectOffice,
  SelectContract,
};
