import React, { useEffect, useState, useContext } from "react";
import { Form, Row, notification, Modal } from "antd";
import * as FormItems from "./personAddGroup/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { withRouter } from "react-router-dom";
import { AccidentInsuranceContext } from "../util/AccidentInsuranceContext";
import { _POST_copyList, _POST_importExcel } from "./util/api";
import { formItemLayout, formRowGutter } from "../../../../constant";

const PersonAdd = ({ match, updateList, setModal, setList }) => {
  const [form] = Form.useForm();
  // const [mainPersonOption, setMainPersonOption] = useState([]);
  // const [personType, setPersonType] = useState(false);
  // const insuranceID = match.params.id;
  // const { submit, loading: submitLoading } = useAddPerson(form, updateList);
  const [loading, setLoading] = useState(false);

  const insuranceContext = useContext(AccidentInsuranceContext);

  const handleOnFinish = (values) => {
    if (values.type == 1) {
      copyFromList(values.insurance_id);
    } else {
      importExcel(
        values.ExcelFile[0]["originFileObj"],
        insuranceContext.insurance.id
      );
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
  async function copyFromList(insurance_id) {
    setLoading(true);
    try {
      const selected = insurance_id;
      const current = insuranceContext.insurance.id;
      const res = await _POST_copyList({
        from_id: selected,
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
        name="accidentInsurancePersonAddGroup"
        onFinish={handleOnFinish}
        initialValues={{
          type: "1",
        }}
      >
        <Row gutter={formRowGutter}>
          <FormItems.Type />
          <FormItems.InsuranceListID />
          <FormItems.ExcelFile />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(PersonAdd);
