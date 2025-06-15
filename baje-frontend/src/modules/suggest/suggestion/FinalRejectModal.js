import React, { useEffect, useState } from "react";
import AppModal from "components/general/AppModal";
import { Col, Form, Input, message, Row, Spin } from "antd";
import axios from "api/appAxios";
import * as api from "./utils/api";
import { statusChangeTypes, statusTypes } from "./const";
import AppNumInput from "../../../components/general/AppNumInput";
import { formItemLayout, formRowGutter } from "../../../constant";

const FinalRejectModal = ({
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

    let forwardMessage;

    if (pageData.status === statusTypes.COMMITTEE_REJECTION)
      forwardMessage =
        "پیشنهاد پس از ۲ بار بررسی در کارگروه تخصصی، رد نهایی شد";
    else if (pageData.status === statusTypes.EXCELLENT_COMMITTEE_REJECTION)
      forwardMessage =
        "پیشنهاد پس از بررسی در کارگروه عالی رد شده و به منزله رد نهایی می باشد";

    try {
      const rejectData = {
        from_status: pageData.status,
        to_status: statusTypes.FINAL_REJECTION,
        type: statusChangeTypes.FORWARD,
        description: forwardMessage,
        personnel_ids: [],
        reward: params.reward,
      };

      await api._CHANGE_STATUS(pageData.id || pageData.s_id, rejectData);

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

  const rules = [
    {
      required: true,
    },
  ];

  return (
    <AppModal
      {...props}
      visible={isVisible}
      width={600}
      title={"رد نهایی پیشنهاد - " + pageData?.title}
      onOk={handleOnModalOk}
      onCancel={onCancel}
    >
      <Form
        {...formItemLayout}
        form={mainForm}
        name="final_reject"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
      >
        <Spin spinning={loading}>
          <Row>
            <Col span={24}>
              <p style={{ color: "gray" }}>
                این پیشنهاد بر اساس سابقه ی بررسی، حائز شرایط رد نهایی است. پیش
                از ثبت وضعیت نهایی، لازم است پاداش پیشنهاد را مشخص نمایید.
              </p>
              <div style={{ height: "24px" }} />
              <Form.Item label="میزان پاداش" name={"reward"} rules={rules}>
                <AppNumInput suffix="ریال" />
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </Form>
    </AppModal>
  );
};

export default FinalRejectModal;
