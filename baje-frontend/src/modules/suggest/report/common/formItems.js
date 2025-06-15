import { Col, Form, Input, Radio, Checkbox, Select } from "antd";
import React, { useEffect, useState } from "react";
import { reportTypes, scoringFactor, suggestionTypes } from "../const";
import * as callApi from "../../call/utils/api";
import { checkShamsi } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import * as committeeApi from "../../committee/utils/api";
import { statusTypes } from "../../suggestion/const";

export const ReportType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    {
      label: "پیشنهاد دهندگان برتر براساس جمع امتیازات",
      value: reportTypes.TOTAL,
    },
    {
      label: "پیشنهاد دهندگان برتر براساس تعداد پیشنهادات",
      value: reportTypes.COUNT,
    },
    {
      label: "پیشنهاد دهندگان برتر براساس کیفیت پیشنهاد",
      value: reportTypes.QUALITY,
    },
    { label: "پیشنهادات برتر براساس امتیاز کسب شده", value: reportTypes.SCORE },
    { label: "کارگروه برتر", value: reportTypes.BEST_WORKSHOP },
    // { label: "مجری برتر", value: reportTypes.BEST_EXECUTE },
    { label: "گزارش آماری وضعیت ها", value: reportTypes.STATUS },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نوع گزارش" name="report_type" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const ScoringFactor = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "امتیاز تفکیکی", value: scoringFactor.INDIVIDUAL },
    { label: "امتیاز تجمیعی", value: scoringFactor.SUMMARIZED },
    { label: "کیفیت پیشنهاد", value: scoringFactor.QUALITY },
    { label: "تعداد", value: scoringFactor.COUNT },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="ملاک رتبه بندی" name="scoring_factor" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const RelatedCall = ({ onChange }) => {
  const [items, setItems] = useState([]);
  const rules = [];

  useEffect(() => {
    (async () => {
      const res = await callApi._GET();

      if (res.data.length) setItems(res.data);
    })();
  }, []);

  const options = [{ label: "هیچکدام", value: 0 }];
  items.forEach((item) => {
    options.push({ label: item.subject, value: item.id });
  });

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="فراخوان" name="related_call" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const FromDate = ({ useForm, onChange }) => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
    {
      required: true,
      message: "تاریخ اجباری است",
    },
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="از تاریخ"
      name="from_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

export const ToDate = ({ useForm, onChange }) => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
    {
      required: true,
      message: "تاریخ اجباری است",
    },
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تا تاریخ"
      name="to_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

export const Committee = ({ onChange }) => {
  const [items, setItems] = useState([]);
  const rules = [];

  useEffect(() => {
    (async () => {
      const res = await committeeApi._GET();

      if (res.data.length) setItems(res.data);
    })();
  }, []);

  const options = [{ label: "همه کارگروه ها", value: "all" }];
  items.forEach((item) => {
    options.push({ label: item.name, value: item.id });
  });

  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("report_type") !== reportTypes.BEST_WORKSHOP && (
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item
                  label="کارگروه تخصصی"
                  name="workgroup_id"
                  rules={rules}
                >
                  <Select options={options} onChange={onChange} />
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    </>
  );
};

export const Individual = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="تفکیکی"
        name={"individual"}
        valuePropName="checked"
        extra="گزارش به تفکیک هر کارگروه"
      >
        <Checkbox />
      </Form.Item>
    </Col>
  );
};

export const Status = ({ onChange }) => {
  const rules = [];

  const options = [{ label: "همه", value: 0 }];
  Object.entries(statusTypes).forEach(([key, val]) => {
    options.push({ label: val, value: val });
  });

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="وضعیت پیشنهاد" name="suggestion_status" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const SuggestionType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "همه", value: 0 },
    { label: "ویژه", value: suggestionTypes.SPECIAL },
    { label: "عادی", value: suggestionTypes.NORMAL },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نوع پیشنهاد" name="suggestion_type" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};
