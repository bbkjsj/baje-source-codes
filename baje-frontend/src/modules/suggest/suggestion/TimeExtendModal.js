import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spin, Input } from "antd";
import AppModal from "components/general/AppModal";
import { numberNormalize } from "_helpers";
import { formRowGutter } from "../../../constant";

const TimeExtendModal = (props) => {
  const {
    onSubmit,
    title = "درخواست زمان اضافه",
    isVisible = false,
    onCancel = () => null,
  } = props;

  const [mainForm] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const requiredRule = [{ required: true }];

  const handleOnFinish = (params) => {
    onSubmit && onSubmit(params);
  };

  const onModalOk = () => {
    mainForm.submit();
  };

  const onModalCancel = () => {
    onCancel && onCancel();
  };

  useEffect(() => {
    mainForm.resetFields();
  }, [isVisible]);

  const formInitialValues = {};

  return (
    <AppModal
      title={title}
      width={600}
      visible={isVisible}
      onOk={onModalOk}
      onCancel={onModalCancel}
    >
      <Form
        form={mainForm}
        name="time_extend"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
        layout="vertical"
      >
        <Spin spinning={formLoading}>
          <Row gutter={formRowGutter}>
            <Col span={24}>
              <div>
                چنانچه جهت رسیدگی و بررسی پیشنهاد، نیاز به زمان اضافه ای دارید،
                لازم است درخواست خود را از طریق این فرم ثبت نمایید.
              </div>
              <div style={{ height: "24px" }} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="زمان مورد نیاز"
                name="days"
                rules={requiredRule}
                normalize={numberNormalize}
              >
                <Input suffix="روز" />
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </Form>
    </AppModal>
  );
};

export default TimeExtendModal;
