import React, { useState, useContext } from "react";
import { Form, Row, notification, Modal } from "antd";
import * as FormItems from "./personAddGroup/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { withRouter } from "react-router-dom";
import { _POST_copyList, _POST_importExcel } from "./util/api";

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

const PersonAdd = ({ match, updateList, setModal, setList }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const insuranceID = match.params.id;

  const handleOnFinish = (values) => {
    if (values.type == 1) {
      copyFromList(values.insurance_id);
    } else {
      importExcel(values.ExcelFile[0]["originFileObj"], insuranceID);
    }
  };

  // upload excel file and
  async function importExcel(file, id) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("insurance_id", id);
    try {
      const res = await _POST_importExcel(formData);
      setLoading(false);
      if (res) {
        console.log(res);
        if (res.data.length) {
          notification.success({
            message: "عملیات موفق",
          });
          setList(res.data);
          setModal(true);
        } else {
          Modal.error({
            content: "لطفا یک فایل اکسل و با فرمت درست انخاب کنید",
            title: "عملیات ناموفق",
          });
        }
      } else {
        Modal.error({
          content: "لطفا یک فایل اکسل و با فرمت درست انخاب کنید",
          title: "عملیات ناموفق",
        });
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      Modal.error({
        content: "لطفا یک فایل اکسل و با فرمت درست انخاب کنید",
        title: "عملیات ناموفق",
      });
    }
  }

  // copy members from another list
  async function copyFromList(selectedId) {
    setLoading(true);
    try {
      const current = insuranceID;
      const res = await _POST_copyList({
        from_id: selectedId,
        to_id: current,
      });
      setLoading(false);
      if (res) {
        console.log("res:", res);
        notification.success({
          message: "با موفقیت انجام شد",
        });
        setTimeout(() => window.location.reload(false), 1500);
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "عملیات ناموفق",
      });
      setLoading(false);
    }
  }

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="supplementaryInsurancePersonAddGroup"
        onFinish={handleOnFinish}
        initialValues={{
          type: "1",
        }}
      >
        <Row gutter={formGutter}>
          <FormItems.Type />
          <FormItems.InsuranceListID insuranceID={insuranceID} />
          <FormItems.ExcelFile />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(PersonAdd);
