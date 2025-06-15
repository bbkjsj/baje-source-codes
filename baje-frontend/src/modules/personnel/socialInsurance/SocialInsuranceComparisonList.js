import React from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";

import { usePostSocialInsurance } from "./util/hooks";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SocialInsuranceComparisonList = () => {
  const [form] = Form.useForm();
  const { submit, loading } = usePostSocialInsurance(form);

  const handleOnFinish = (values) => {
    let data = { ...values };
    console.log("data in on finish", data);

    // submit(data);
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="SocialInsuranceComparisonList"
        scrollToFirstError
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.FirstInsuranceList />
          <FormItems.LastInsuranceList />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default SocialInsuranceComparisonList;
