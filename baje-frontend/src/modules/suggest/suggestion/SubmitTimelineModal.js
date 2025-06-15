import React, { useEffect, useState } from "react";
import AppModal from "components/general/AppModal";
import { Button, Col, Form, Input, message, Row, Spin, Upload } from "antd";
import * as api from "./utils/api";
import { statusChangeTypes, statusTypes } from "./const";
import { createFormData, numberNormalize } from "../../../_helpers";
import PeriodTime from "../../../components/PeriodTime";
import { UploadOutlined } from "@ant-design/icons";
import { formRowGutter } from "../../../constant";

const SubmitTimelineModal = ({
  onCancel,
  onSave,
  pageData,
  isVisible,
  ...props
}) => {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (params) => {
    setLoading(true);

    try {
      const data = {
        ...params,
        from_status: pageData.status,
        to_status: statusTypes.COMMITTEE_HEAD_TIMELINE_REVIEW,
        type: statusChangeTypes.FORWARD,
        description: params.description,
        personnel_ids: [],
      };

      console.log(data, "!data");

      const formData = createFormData(data);
      await api._CHANGE_STATUS(pageData.s_id, formData);

      message.success("با موفقیت انجام شد");
      setLoading(false);

      onSave && onSave();
    } catch (error) {
      if (error.response) {
        setLoading(false);
        message.error(error?.response?.data);
      }
    }
  };

  const handleOnModalOk = () => {
    mainForm.submit();
  };

  const formInitialValues = {};

  const requiredRule = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (getFieldValue("due_day") && getFieldValue("due_day") > 0) {
          return Promise.resolve();
        } else {
          return Promise.reject("تعیین مدت ضروری است");
        }
      },
    }),
  ];

  const requiredRule1 = [
    {
      required: true,
    },
  ];

  const Duration = () => {
    useEffect(() => {
      (async () => {
        mainForm.setFieldsValue({
          d_year: 0,
          d_month: 0,
          d_day: 0,
        });
      })();
    }, []);

    const handleDurationChange = (i) => {
      const values = mainForm.getFieldsValue();
      const days =
        Number((values.d_year ?? 0) * 365) +
        Number((values.d_month ?? 0) * 30) +
        Number(values.d_day ?? 0);

      mainForm.setFieldsValue({
        due_day: days,
      });
    };

    return (
      <Form.Item
        label="مدت اجرا"
        name={"duration"}
        rules={requiredRule}
        normalize={numberNormalize}
      >
        <PeriodTime
          year="d_year"
          month="d_month"
          day="d_day"
          onChange={handleDurationChange}
          required={false}
          useForm={mainForm}
          plain={true}
        />
      </Form.Item>
    );
  };

  const UploadTimelineFile = () => {
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
      <Form.Item
        label="فایل زمانبندی"
        name={"file"}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="یک فایل با فرمت مناسب انتخاب نمایید"
        rules={requiredRule1}
      >
        <Upload beforeUpload={(file) => false}>
          <Button icon={<UploadOutlined />} block={false}>
            انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    );
  };

  return (
    <AppModal
      visible={isVisible}
      width={600}
      title={"ارسال برنامه زمانبندی - " + pageData?.title}
      onOk={handleOnModalOk}
      onCancel={onCancel}
    >
      <Form
        layout="vertical"
        form={mainForm}
        name="submit_timeline"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
      >
        <Spin spinning={loading}>
          <Row gutter={formRowGutter}>
            <Col span={24}>
              <p style={{ color: "gray" }}>
                این پیشنهاد بر اساس بررسی کارگروه تخصصی مربوطه حائز شرایط اجرا
                بوده و جهت تعیین زمانبندی اجرا در انتظار ارسال فایل مربوطه از
                جانب شما میباشد
              </p>
              <div style={{ height: "24px" }} />
            </Col>
            <Col xs={24} lg={12}>
              <Duration />
            </Col>
            <Col xs={24} lg={12}>
              <UploadTimelineFile />
            </Col>
            <Col span={24}>
              <Form.Item
                label="توضیحات"
                name="description"
                extra="توضیحات در خصوص فایل ارسالی"
              >
                <Input.TextArea style={{ minHeight: "120px", width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Spin>
        <Form.Item name="due_day" hidden={true}>
          <Input />
        </Form.Item>
      </Form>
    </AppModal>
  );
};

export default SubmitTimelineModal;
