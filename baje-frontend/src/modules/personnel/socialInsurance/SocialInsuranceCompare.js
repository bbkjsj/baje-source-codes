import React, { useState } from "react";
import { Form, Row, notification } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { _POST_COMPARE } from "./util/api";
import { downloadExcelFromRawData } from "_helpers";

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

const SocialInsuranceCompare = ({ closeModal }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();

  const handleOnFinish = (values) => {
    let data = { ...values };
    console.log("data in on finish", data);

    getExcelList(data);
  };

  async function getExcelList(value) {
    setLoading(true);
    try {
      const response = await _POST_COMPARE(value);
      setLoading(false);
      if (response) {
        console.log("excel:", response.data);
        downloadExcelFromRawData(response.data, "report");
        closeModal();
      } else {
        notification.warning({
          message: "عملیات ناموفق",
        });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      notification.warning({
        message: "عملیات ناموفق",
      });
    }
  }

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="SocialInsuranceCompare"
        scrollToFirstError
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.FirstInsuranceList label="لیست یک" name="list1_id" />
          <FormItems.LastInsuranceList label="لیست دو" name="list2_id" />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default SocialInsuranceCompare;
