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
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import * as values from "../const";
import {
  checkShamsi,
  convertToNumber,
  priceNormalizer,
  convertDateToEN,
} from "_helpers";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment-jalaali";
import momentEn from "moment";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const CheckInsurancePolicyType = ({ children }) => (
  <Form.Item noStyle shouldUpdate>
    {(form) => {
      return (
        form.getFieldValue("type") ===
          values.insurancePolicyTypeValues.SUPPLEMENTARY && children
      );
    }}
  </Form.Item>
);

const InsurancePolicyType = ({ detail }) => {
  const rules = [{ required: true }];
  const { insurancePolicyTypeValues } = values;

  const option = [
    {
      label: insurancePolicyTypeValues.SUPPLEMENTARY,
      value: insurancePolicyTypeValues.SUPPLEMENTARY,
    },
  ];

  return (
    <Form.Item
      hidden={true}
      initialValue={option[0].value}
      label="نوع بیمه نامه"
      name="type"
      rules={rules}
    >
      <Radio.Group
        defaultValue={option[0].value}
        options={option}
        disabled={detail}
      />
    </Form.Item>
  );
};

// const Insurer = ({ detail }) => {
//   const rules = [{ required: true }];

//   return (
//     <Col xs={24} sm={24} md={24} lg={12} xl={8}>
//       <Form.Item label="بیمه گر" name="insurer_main" rules={rules}>
//         <Input disabled={detail} />
//       </Form.Item>
//     </Col>
//   );
// };
const Insurer = ({ detail }) => {
  const rules = [{ required: true }];
  const user = useWhoAmI();
  const listLegal = user?.companies;

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="بیمه گر" name="insurer_main_company_id" rules={rules}>
        <Select disabled={detail}>
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

const CompanyID = ({ detail }) => {
  const rules = [{ required: true }];
  const user = useWhoAmI();
  const listLegal = user?.companies;

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="بیمه گذار" name="company_id" rules={rules}>
        <Select disabled={detail}>
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

const CompanyName = ({}) => {
  return (
    <Form.Item hidden name={"insurer_company"}>
      <Input />
    </Form.Item>
  );
};

const ContractNumber = ({ detail }) => {
  const rules = [{ required: true }];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="شماره قرارداد" name="contract_number" rules={rules}>
        <Input disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const ContractDate = ({ useForm, detail }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ انعقاد قراداد اجباری است",
    },
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
      label="تاریخ انعقاد قراداد"
      name="contract_issue_date"
      rules={rules}
      disabled={detail}
    />
  );
};

const ContractStartDate = ({ useForm, detail }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ شروع قراداد اجباری است",
    },
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

  const onChange = () => {
    let startDate = useForm.getFieldValue("contract_date_from_date");
    const newDate = moment(startDate, "jYYYY/jM/jD")
      .add(1, "jYear")
      .format("L");

    useForm.setFieldsValue({ to_date: newDate });
  };

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ شروع قراداد"
      name="contract_date_from_date"
      rules={rules}
      disabled={detail}
      onChange={onChange}
    />
  );
};

const ContractEndDate = ({ useForm, detail }) => {
  const checkDateFinishDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (
        checkShamsi(value, false) &&
        getFieldValue("contract_date_from_date") > value
      ) {
        return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
      }

      if (!value || checkShamsi(value, false)) {
        return Promise.resolve();
      } else {
        return Promise.reject("فرمت تاریخ صحیح نیست");
      }
    },
  });

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ پایان قراداد"
      name="to_date"
      rules={[checkDateFinishDate]}
      disabled={detail}
    />
  );
};

const MaximumChangeDate = ({ useForm, detail }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ مهلت حذف/اضافه اجباری است",
    },
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
      label="حداكثر مهلت حذف و اضافه"
      name="change_deadline_date"
      rules={rules}
      disabled={detail}
    />
  );
};

const Description = ({ detail }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const MainInsuranceShare = ({ useForm, detail }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="حق بیمه شده اصلی"
        name="main_insured"
        normalize={priceNormalizer}
      >
        <Input disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const WifeInsuranceShare = ({ detail }) => {
  return (
    <CheckInsurancePolicyType>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="حق بیمه همسر"
          name="spouse_insured"
          normalize={priceNormalizer}
        >
          <Input disabled={detail} />
        </Form.Item>
      </Col>
    </CheckInsurancePolicyType>
  );
};

const DaughterInsuranceShare = ({ detail }) => {
  return (
    <CheckInsurancePolicyType>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="حق بیمه فرزند دختر"
          name="doughter_insured"
          normalize={priceNormalizer}
        >
          <Input disabled={detail} />
        </Form.Item>
      </Col>
    </CheckInsurancePolicyType>
  );
};

const SonInsuranceShare = ({ detail }) => {
  return (
    <CheckInsurancePolicyType>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="حق بیمه فرزند پسر"
          name="son_insured"
          normalize={priceNormalizer}
        >
          <Input disabled={detail} />
        </Form.Item>
      </Col>
    </CheckInsurancePolicyType>
  );
};

const FatherInsuranceShare = ({ detail }) => {
  return (
    <CheckInsurancePolicyType>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="حق بیمه پدر"
          name="father_insured"
          normalize={priceNormalizer}
        >
          <Input disabled={detail} />
        </Form.Item>
      </Col>
    </CheckInsurancePolicyType>
  );
};

const MotherInsuranceShare = ({ detail }) => {
  return (
    <CheckInsurancePolicyType>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="حق بیمه مادر"
          name="mother_insured"
          normalize={priceNormalizer}
        >
          <Input disabled={detail} />
        </Form.Item>
      </Col>
    </CheckInsurancePolicyType>
  );
};

const InsuranceObligations = () => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    if (e.fileList.length > 1) {
      e.fileList.shift();
    }

    return e && e.fileList;
  };

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          name="file"
          label="تعهدات بیمه"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          // rules={[imageValidation]}
        >
          <Upload
            // onPreview={onPreview}
            beforeUpload={(file) => false}
            accept=".pdf"
          >
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    </>
  );
};

export {
  InsurancePolicyType,
  Insurer,
  CompanyID,
  ContractNumber,
  ContractDate,
  ContractStartDate,
  ContractEndDate,
  MaximumChangeDate,
  Description,
  MainInsuranceShare,
  WifeInsuranceShare,
  DaughterInsuranceShare,
  SonInsuranceShare,
  FatherInsuranceShare,
  MotherInsuranceShare,
  InsuranceObligations,
};
