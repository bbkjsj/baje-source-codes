import { Button, Col, Form, Input, Upload } from "antd";

import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import AppNumInput from "../../../../components/general/AppNumInput";
import { UploadOutlined } from "@ant-design/icons";

export const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
}) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <NationalIdInput
        type={edit ? "edit" : "send"}
        codeField="person_personnel_id"
        nameField="person_name"
        name="person_national_code"
        label="مدیر نظام پیشنهادات"
        url="/api/admin/personnel/lookup"
        form={useForm}
        setData={setPerson}
        isRequired={true}
        defaultValue={defaultValue}
        plain={true}
      />
    </Col>
  );
};

export const MaxDayFirstAssessment = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت ارزیابی اولیه"
        name={"max_day_first_assessment"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const MaxDayExpertWorkgroup = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت کارگروه تخصصی"
        name={"max_day_expert_workgroup"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const MaxDayExcellentWorkgroup = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت کارگروه عالی"
        name={"max_day_excellent_workgroup"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const MaxDayEdit = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت ویرایش طرح"
        name={"max_day_edit"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const MaxDayReviewRequest = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت درخواست تجدید نظر"
        name={"max_day_review_request"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const MaxDayPlanningExecution = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت برنامه زمان بندی اجرا"
        name={"max_day_planning_execution"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const MaxDayExecutionReview = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر مهلت واحد مجری جهت اعلام نظر"
        name={"max_day_execution_review"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="روز" />
      </Form.Item>
    </Col>
  );
};

export const RialRatePerYear = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="ضریب ریالی هر سال"
        name={"rial_rate_per_year"}
        rules={rules}
      >
        <AppNumInput suffix="ریال" />
      </Form.Item>
    </Col>
  );
};

export const MinRewardRial = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداقل پاداش ریالی"
        name={"min_reward_rial"}
        rules={rules}
      >
        <AppNumInput suffix="ریال" />
      </Form.Item>
    </Col>
  );
};

export const MaxPercentParticipate = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداکثر درصد مشارکت در منافع"
        name={"max_percent_participate"}
        rules={rules}
      >
        <Input normalize={numberNormalize} suffix="%" />
      </Form.Item>
    </Col>
  );
};

export const MinPassPoint = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="حداقل نمره قبولی پیشنهاد"
        name={"min_pass_point"}
        rules={rules}
      >
        <Input normalize={numberNormalize} />
      </Form.Item>
    </Col>
  );
};

export const UploadLoginBackground = () => {
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
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="پس زمینه صفحه ورود"
        name={"bck_file"}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="یک تصویر با رزولوشن بالا انتخاب نمایید"
      >
        <Upload beforeUpload={(file) => false}>
          <Button icon={<UploadOutlined />} block={false}>
            انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};
