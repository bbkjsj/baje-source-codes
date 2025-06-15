import React, { useEffect, useContext } from "react";
import { Col, Form, Radio, Input, Select, Button, Upload } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import * as values from "../const";
import { checkShamsi, priceNormalizer } from "_helpers";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment-jalaali";
import { formColSpan } from "../../../../constant";
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
      label: insurancePolicyTypeValues.LIFE_ACCIDENT,
      value: insurancePolicyTypeValues.LIFE_ACCIDENT,
    },
  ];

  return (
    <Col {...formColSpan}>
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
    </Col>
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
    <Col {...formColSpan}>
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
    <Col x {...formColSpan}>
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
    <Col {...formColSpan}>
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

const Description = ({ detail }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const MainInsuranceShare = ({ useForm, detail }) => {
  return (
    <Col {...formColSpan}>
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
      <Col {...formColSpan}>
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
      <Col {...formColSpan}>
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
      <Col {...formColSpan}>
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
      <Col {...formColSpan}>
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
      <Col {...formColSpan}>
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
  return (
    <>
      <Col {...formColSpan}>
        <Form.Item
          name="file"
          label="تعهدات بیمه"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          // rules={[imageValidation]}
        >
          <Upload
            // onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
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
  Description,
  MainInsuranceShare,
  WifeInsuranceShare,
  DaughterInsuranceShare,
  SonInsuranceShare,
  FatherInsuranceShare,
  MotherInsuranceShare,
  InsuranceObligations,
};
