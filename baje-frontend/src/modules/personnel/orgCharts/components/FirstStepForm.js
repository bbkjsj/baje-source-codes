import React from "react";
import { Form, Row, Spin } from "antd";
import * as fields from "../common/formItems";
import { useHistory } from "react-router-dom";

import AppButton from "components/general/AppButton";

const FirstStepForm = ({
  onFinish,
  initialData,
  updating,
  mainForm,
  environmentId,
  isFirstChart,
  data,
}) => {
  const formItemLayout = {
    labelCol: { span: 24 },
    colon: false,
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 22 },
    },
  };

  const history = useHistory();

  const handleOnFinish = (params) => {
    console.log(params);
    onFinish(params);
  };
  return (
    <Form
      {...formItemLayout}
      form={mainForm}
      name="examination"
      onFinish={handleOnFinish}
      initialValues={initialData && initialData}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <fields.Title
          disabled={isFirstChart || data?.title === "چارت بدو تاسیس"}
        />
        <fields.Environment
          form={mainForm}
          disabled={updating || (isFirstChart && environmentId)}
          environmentId={environmentId}
        />
        <fields.ApplyDate
          useForm={mainForm}
          disabled={isFirstChart || data?.title === "چارت بدو تاسیس"}
        />
        <fields.Description />
      </Row>
      <div className="flex justify-end">
        <AppButton
          className="big-btn"
          variant="primary"
          size="large"
          onClick={() => mainForm.submit()}
        >
          {updating ? "ثبت و ادامه" : "ادامه"}
        </AppButton>
        <AppButton
          className="big-btn mr-2"
          size="large"
          onClick={() => history.goBack()}
        >
          انصراف
        </AppButton>
      </div>
    </Form>
  );
};

export default FirstStepForm;
