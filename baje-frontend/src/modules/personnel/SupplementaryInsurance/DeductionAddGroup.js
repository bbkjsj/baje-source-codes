import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button, notification, Modal } from "antd";
import * as FormItems from "./DeductionAddGroup/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import {
  getTodayDate,
  convertDateToEN,
  convertTime,
  covetFormatDateToFA,
} from "_helpers";
import { withRouter } from "react-router-dom";
import FormItem from "antd/lib/form/FormItem";
import { useAddPerson } from "./util/hooks";
import { _POST_importDeductionExcel } from "./util/api";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formStyle = {
  //   backgroundColor: "#fff",
  //   padding: "3px",
  //   boxShadow: "0 4px 8px 0 rgba(19, 37, 71, 0.1)",
};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const DeductionAddGroup = ({ match, updateList, setModal, setList }) => {
  const [form] = Form.useForm();
  // const [mainPersonOption, setMainPersonOption] = useState([]);
  // const [personType, setPersonType] = useState(false);
  // const insuranceID = match.params.id;
  // const { submit, loading: submitLoading } = useAddPerson(form, updateList);
  const [loading, setLoading] = useState(false);

  const handleOnFinish = (values) => {
    importExcel(values.ExcelFile[0]["originFileObj"]);
  };

  // upload excel file and
  async function importExcel(file, id) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("insurance_id", id);
    try {
      const res = await _POST_importDeductionExcel(formData);
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

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="supplementaryInsuranceDeductionAddGroup"
        style={formStyle}
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.ExcelFile />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(DeductionAddGroup);
