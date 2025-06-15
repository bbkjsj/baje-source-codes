import React, { useState, useContext } from "react";
import { Form, Row, Spin, message, Modal } from "antd";
import * as FormItems from "./personAddGroup/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useParams, withRouter } from "react-router-dom";
import {
  _POST_copyList,
  _POST_importExcel,
  _POST_DBF_GROUP_PERSON,
} from "./utils/api";
import { useSelector } from "react-redux";

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

const PersonAdd = ({ match, updateList, setModal, setList }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();

  const handleOnFinish = async (values) => {
    setLoading(true);
    let res = null;

    if (values.type == 3) {
      try {
        res = await sendDbf(values.DBFFile[0]["originFileObj"], routeParams.id);
      } catch (error) {
        message.error("خطایی در ثبت داده ها رخ داده است");
      }
    } else if (values.type == 2) {
      try {
        res = await sendExcel(
          values.ExcelFile[0]["originFileObj"],
          routeParams.id
        );
      } catch (error) {
        message.error("خطایی در ثبت داده ها رخ داده است");
      }
    }
    if (res?.data?.success && res.data.success > 0) {
      message.success("لیست افراد با موفقیت ثبت شد!");
      updateList();
      setLoading(false);
    } else {
      message.error("رکوردی ثبت نشد!");
      setLoading(false);
    }
  };

  // upload dbf file
  async function sendDbf(file, id) {
    if (
      currentOffice &&
      currentOffice != -1 &&
      currentContract &&
      currentContract != -1
    ) {
      const formData = new FormData();
      formData.append("dbf_file", file);
      formData.append("insurance_id", id);
      formData.append("contract_id", currentContract);
      formData.append("company_id", currentOffice);
      return await _POST_DBF_GROUP_PERSON(formData);
    } else {
      Modal.error({
        content: "لطفا شرکت و قرارداد را انتخاب نمایید",
        title: "خطا",
      });
    }

    // return formData;
  }
  // upload excel file and
  async function sendExcel(file, id) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("insurance_id", id);
    formData.append("contract_id", currentContract);
    formData.append("company_id", currentOffice);
    return formData;
  }

  return (
    <>
      <Spin spinning={loading}>
        <Form
          {...formItemLayout}
          form={form}
          name="supplementaryInsurancePersonAddGroup"
          style={formStyle}
          onFinish={handleOnFinish}
          initialValues={{
            type: "1",
          }}
        >
          <Row gutter={formGutter}>
            <FormItems.Type />
            {/* <FormItems.InsuranceListID /> */}
            <FormItems.ExcelFile />
            <FormItems.DBFFile />
          </Row>
          <SubmitBtn />
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(PersonAdd);
