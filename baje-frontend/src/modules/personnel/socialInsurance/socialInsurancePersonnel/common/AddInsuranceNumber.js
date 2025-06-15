import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import AppFormItem from "components/general/AppFormItem";
import { countOfNumInp } from "_helpers";
import AppInput from "components/general/AppInput";

import { _PUT_INSURANCE_NUMBER } from "../utils/api";

function AddInsuranceNumber(props) {
  const [addNumberForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    addNumberForm.resetFields();
    props.setVisible(false);
  };

  const onOk = () => {
    addNumberForm.submit();
  };

  const onFinish = (values) => {
    setLoading(true);

    _PUT_INSURANCE_NUMBER({ id: props.id, payload: values })
      .then((res) => {
        message.success("ثبت با موفقیت انجام شد");
        setLoading(false);
        props.setVisible(false);
        addNumberForm.resetFields();
      })
      .catch((error) => {
        console.log(error);
        message.error("خطایی رخ داده است. دوباره تلاش کنید");
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        title="توجه"
        okText="ثبت"
        cancelText="انصراف"
        visible={props.visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
      >
        <p>
          شماره بیمه این شخص وارد نشده است، لطفا نسبت به وارد نمودن شماره بیمه
          اقدام فرمایید
        </p>
        <Form form={addNumberForm} onFinish={onFinish}>
          <AppFormItem
            label="شماره بیمه"
            name="insurance_number"
            normalize={(value, prevValue) => countOfNumInp(value, prevValue, 8)}
            rules={[
              {
                len: 8,
                message: "شماره بیمه باید شامل 8 رقم باشد",
              },
              { required: true, message: "وارد نمودن شماره اجباری است" },
            ]}
          >
            <AppInput type="number" />
          </AppFormItem>
        </Form>
      </Modal>
    </>
  );
}

export default AddInsuranceNumber;
