import React, { useEffect } from "react";
import { Form, Row, Modal } from "antd";
import * as FormItems from "../components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { usePutSocialInsurance } from "../util/hooks";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};
const formStyle = {};
const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SocialInsuranceEdit = ({ insurance, visible, setVisible, getList }) => {
  const [form] = Form.useForm();
  const { submit, loading } = usePutSocialInsurance(getList, setVisible);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...insurance,
        contract_id: insurance.contract_id_fk,
      });
    }
  }, [visible]);

  const handleOnFinish = (values) => {
    let data = { ...values };
    submit(insurance.id, data);
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      maskClosable={true}
      footer={null}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="SocialInsuranceAdd"
        style={formStyle}
        scrollToFirstError
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.ContractID />
          <FormItems.Year />
          <FormItems.Month useForm={form} />
          <FormItems.ListNumber useForm={form} />
          <FormItems.Description />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </Modal>
  );
};

export default SocialInsuranceEdit;
