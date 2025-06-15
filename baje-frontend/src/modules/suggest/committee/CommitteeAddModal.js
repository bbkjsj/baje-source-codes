import React, { useEffect, useState } from "react";
import AppModal from "components/general/AppModal";
import { Form, message, Row, Spin } from "antd";
import * as fields from "./common/committeeFormItems";
import * as api from "./utils/api";
import { formItemLayout } from "../../../constant";

const CommitteeAddModal = ({ onCancel, onSave, dataId, ...props }) => {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (params) => {
    setLoading(true);

    if (dataId) params.id = dataId;

    try {
      if (dataId) await api._PUT(dataId, params);
      else await api._POST(params);

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

  useEffect(() => {
    if (dataId) {
      (async function () {
        try {
          let item = await api._GET_ITEM(dataId);
          mainForm.setFieldsValue(item.data);
          setLoading(false);
        } catch (error) {
          if (error.response) {
            message.error(error?.response?.data);
            setLoading(false);
            onCancel();
          }
        }
      })();
    } else mainForm.resetFields();
  }, [dataId]);

  const formInitialValues = {};

  return (
    <AppModal
      {...props}
      title={dataId ? "ویرایش کارگروه" : "ثبت کارگروه جدید"}
      onOk={handleOnModalOk}
      onCancel={onCancel}
    >
      <Form
        {...formItemLayout}
        form={mainForm}
        name="committee"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
      >
        <Spin spinning={loading}>
          <Row>
            <fields.Name />
          </Row>
        </Spin>
      </Form>
    </AppModal>
  );
};

export default CommitteeAddModal;
