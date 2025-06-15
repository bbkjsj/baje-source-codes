import React, { useEffect, useContext } from "react";
import { Col, Form, Input, Select, Button, Upload } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import * as values from "../const";
import { convertToNumber } from "_helpers";
import { UploadOutlined } from "@ant-design/icons";
import { useGetSocialInsuranceList } from "../../util/hooks";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const PayFor = () => {
  const rules = [{ required: true }];

  const genOption = () => {
    let options = [];
    for (let key in values.payForValue) {
      options.push({
        label: values.payForValue[key],
        value: values.payForValue[key],
      });
    }
    return options;
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="پرداخت بابت" name="paid_for" rules={rules}>
        <Select options={genOption()} />
      </Form.Item>
    </Col>
  );
};

const ProjectPerson = ({ data }) => {
  const rules = [{ required: true }];

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("paid_for") ===
            values.payForValue.HISTORY_CLAIM && (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="افراد پروژه" name="person" rules={rules}>
                <Select>
                  {data.map((el) => (
                    <Select.Option
                      value={el.personnel_id_fk}
                    >{`${el.first_name} ${el.last_name}`}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

const SubmissionList = () => {
  const rules = [{ required: true }];
  const { data: insuranceList } = useGetSocialInsuranceList();

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("paid_for") ===
            values.payForValue.SUBMISSION_LIST && (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="لیست ارسالی" name="insurance_id" rules={rules}>
                <Select>
                  {insuranceList &&
                    insuranceList.map((el) => (
                      <Select.Option
                        key={el.id}
                        value={el.id}
                        title={el.list_number}
                      >
                        {el.list_number}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

const InstallmentNumber = () => {
  const rules = [{ required: true }];
  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("paid_for") ===
            values.payForValue.INSTALLMENTS && (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="شماره قسط"
                name="installment_number"
                normalize={convertToNumber}
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

const DebtStartDate = ({ useForm }) => {
  const rules = [{ required: true, message: "تاریخ اجباری است" }];

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("paid_for") === values.payForValue.DEBT && (
            <CustomDatePicker
              form={useForm}
              label="تاریخ شروع"
              name="periodic_debt_start_date"
              rules={rules}
            />
          )
        );
      }}
    </Form.Item>
  );
};

const DebtFinishDate = ({ useForm }) => {
  const rules = [{ required: true, message: "تاریخ اجباری است" }];

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("paid_for") === values.payForValue.DEBT && (
            <CustomDatePicker
              form={useForm}
              label="تاریخ پایان"
              name="periodic_debt_end_date"
              rules={rules}
            />
          )
        );
      }}
    </Form.Item>
  );
};

const Date = ({ useForm }) => {
  const rules = [{ required: true, message: "تاریخ اجباری است" }];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ پرداخت"
      name="pay_date"
      rules={rules}
    />
  );
};

const TotalShare = () => {
  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        const {
          insured_share,
          jobless_share,
          penalty_share,
          execution_share,
        } = form.getFieldsValue();

        let total = 0;
        if (insured_share) {
          total += +insured_share;
        }
        if (jobless_share) {
          total += +jobless_share;
        }
        if (penalty_share) {
          total += +penalty_share;
        }
        if (execution_share) {
          total += +execution_share;
        }

        return (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <p>جمع کل بیمه : {total}</p>
          </Col>
        );
      }}
    </Form.Item>
  );
};

const EstimatedDebt = () => {
  const rules = [{ required: true }];
  return (
    <Form.Item shouldUpdate noStyle>
      {(form) => {
        return (
          form.getFieldValue("paid_for") ===
            values.payForValue.ESTIMATED_DEBT && (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="بدهی"
                name="estimated_debt"
                normalize={convertToNumber}
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

const Insurance = () => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="حق بیمه"
        name="insured_share"
        normalize={convertToNumber}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const UnemploymentInsurance = () => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="بیمه بیکاری"
        name="jobless_share"
        normalize={convertToNumber}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Penalty = () => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="جرائم"
        name="penalty_share"
        normalize={convertToNumber}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Execution = () => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="حق الاجراء"
        name="execution_share"
        normalize={convertToNumber}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Document = () => {
  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          name="file"
          label="اسناد پرداخت"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          // rules={[imageValidation]}
        >
          <Upload
            // onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".pdf,.JPEG,.JPG,.zip,.rar"
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
  PayFor,
  SubmissionList,
  InstallmentNumber,
  DebtStartDate,
  DebtFinishDate,
  EstimatedDebt,
  UnemploymentInsurance,
  Insurance,
  Penalty,
  Execution,
  TotalShare,
  Date,
  Document,
  ProjectPerson,
};
