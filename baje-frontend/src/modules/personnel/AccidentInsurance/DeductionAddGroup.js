import React, { useEffect, useState, useContext } from "react";
import { Form, Row, notification, Modal } from "antd";
import * as FormItems from "./DeductionAddGroup/FormItems";

import SubmitBtn from "components/general/SubmitBtn";

import { withRouter } from "react-router-dom";

import { useAddPerson } from "./util/hooks";
import { AccidentInsuranceContext } from "./util/AccidentInsuranceContext";
import { _POST_importDeductionExcel } from "./util/api";
import { formItemLayout, formRowGutter } from "../../../constant";

const DeductionAddGroup = ({ match, updateList, setModal, setList }) => {
  const [form] = Form.useForm();
  // const [mainPersonOption, setMainPersonOption] = useState([]);
  // const [personType, setPersonType] = useState(false);
  // const insuranceID = match.params.id;
  // const { submit, loading: submitLoading } = useAddPerson(form, updateList);
  const [loading, setLoading] = useState(false);

  const insuranceContext = useContext(AccidentInsuranceContext);

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
        name="accidentInsuranceDeductionAddGroup"
        onFinish={handleOnFinish}
      >
        <Row gutter={formRowGutter}>
          <FormItems.ExcelFile />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(DeductionAddGroup);
