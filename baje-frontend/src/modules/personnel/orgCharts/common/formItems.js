import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Button,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import AppFormItem from "components/general/AppFormItem";
import EnvironmentSelector from "components/environmentSelector/EnvironmentSelector";
import AppInput from "components/general/AppInput";
import { useParams } from "react-router-dom";
import {
  getJobsList,
  handleExceptions,
  getJobInsuranceCodes,
  getInsuranceJobCode,
} from "modules/personnel/jobs/common/api";

// first step

const Title = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="عنوان چارت"
        name="title"
        rules={rules}
        disabled={disabled}
      >
        <Input className="d-block" disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const Environment = ({ form, disabled, environmentId }) => {
  const params = useParams();
  const rules = [
    {
      required: true,
      message: "کد محیط اجباری است",
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <EnvironmentSelector
        form={form}
        required
        label="انتخاب محیط"
        name="environment_id_fk"
        rules={rules}
        disabled={disabled}
        officeId={params.id}
        environmentId={environmentId}
        hideInput
      />
    </Col>
  );
};

const ApplyDate = ({ useForm, disabled }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ اعمال اجباری است",
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
      required
      form={useForm}
      label="تاریخ اعمال"
      name="apply_date"
      rules={rules}
      disabled={disabled}
    />
  );
};

const Description = ({ disabled }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="توضیحات" name="description">
        <Input.TextArea disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

// second step

const Job = ({ jobsList }) => {
  const rules = [
    {
      required: true,
      message: "شغل الزامی است",
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem required label="شغل" name="job" rules={rules}>
        <Select
          showSearch
          options={jobsList}
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </AppFormItem>
    </Col>
  );
};

const PeopleCount = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
      <AppFormItem
        required
        name="people_count"
        label="تعداد افراد"
        rules={rules}
      >
        <AppInput type="number" />
      </AppFormItem>
    </Col>
  );
};

const InsuranceJobCode = ({ jobCode }) => {
  const rules = [
    {
      required: true,
    },
  ];
  const [codesList, setCodesLIst] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobCode) {
      setLoading(true);
      getJobInsuranceCodes(jobCode)
        .then((res) => {
          if (res?.data && res?.data?.length) {
            let options = res?.data?.map((i) => ({
              label: i.code,
              value: i.id,
            }));

            // get code names
            const queue = res?.data?.map((code) =>
              getInsuranceJobCode(code.code)
            );
            Promise.all(queue)
              .then((response) => {
                setLoading(false);
                if (response?.length) {
                  const codes = response.map((r) => ({
                    code: r?.config.url ? r?.config.url.split("/")[2] : null,
                    title: r.data.title,
                  }));

                  options = options.map((option) => {
                    const findName = codes.find(
                      (code) => code.code == option.label
                    );
                    return {
                      ...option,
                      label: option.label + " - " + findName.title,
                    };
                  });
                  setCodesLIst(options);
                }
              })
              .catch((err) => {
                setLoading(false);
                console.error(err);
                handleExceptions(err);
              });
          } else {
            setCodesLIst([]);
          }
        })
        .catch((err) => {
          setLoading(false);
          handleExceptions(err);
          setCodesLIst([]);
        });
    }
  }, [jobCode]);

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem
          required
          label="کد شغل های پیش فرض بیمه تامین اجتماعی"
          name="job_code"
          rules={rules}
        >
          <Select
            showSearch
            options={codesList}
            filterOption={(input, option) =>
              input
                ? option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                : null
            }
          />
        </AppFormItem>
      </Spin>
    </Col>
  );
};

export {
  Description,
  ApplyDate,
  Environment,
  Job,
  PeopleCount,
  InsuranceJobCode,
  Title,
};
