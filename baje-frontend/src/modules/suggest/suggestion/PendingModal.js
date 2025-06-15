import React, { useEffect, useState } from "react";
import AppModal from "components/general/AppModal";
import { Col, Form, Input, message, Row, Spin } from "antd";
import axios from "api/appAxios";
import * as api from "./utils/api";
import { statusChangeTypes, statusTypes } from "./const";
import CustomDatePicker from "../../../components/renderInput/customDatePicker/CustomDatePicker";
import { checkShamsi } from "../../../_helpers";
import moment from "moment-jalaali";
import { utils } from "react-modern-calendar-datepicker";
import styled from "styled-components";
import { formItemLayout, formRowGutter } from "../../../constant";

const PendingModal = ({ onCancel, onSave, pageData, isVisible, ...props }) => {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (params) => {
    setLoading(true);

    try {
      const restartDate = moment(params["restart_date"], "jYYYY/jM/jD").format(
        "YYYY/M/D HH:mm:ss"
      );

      const data = {
        date: restartDate,
      };

      await api._SET_AS_PENDING(pageData.id || pageData.s_id, data);

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

  const RestartDate = ({ useForm, onChange }) => {
    const rules = [
      {
        required: true,
        message: "تاریخ شروع مجدد اجباری است",
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
        form={mainForm}
        label="تاریخ شروع مجدد"
        name="restart_date"
        rules={rules}
        minimumDate={utils("fa").getToday()}
        onChange={onChange}
      />
    );
  };

  return (
    <AppModal
      {...props}
      visible={isVisible}
      width={600}
      title={"تعویق پیشنهاد - " + pageData?.title}
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
          <p style={{ color: "gray" }}>
            با توجه به رد پیشنهاد توسط مجری، میتوانید این پیشنهاد را تا تاریخ
            مشخص به صورت معلق در آورید. پیشنهاد در تاریخ مربوطه در کارتابل شما
            نمایش داده خواهد شد.
          </p>
          <div style={{ height: "24px" }} />
          <Row>
            <Col span={24}>
              <ColWide>
                <RestartDate />
              </ColWide>
            </Col>
          </Row>
        </Spin>
      </Form>
    </AppModal>
  );
};

const ColWide = styled.div`
  .ant-col {
    position: relative;
    max-width: 100% !important;
    min-height: 1px;
  }
`;

export default PendingModal;
