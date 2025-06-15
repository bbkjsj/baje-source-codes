import React, { useState } from "react";
import { Form, Row, Button, message, Modal } from "antd";
import { addGroupRightFullFiled } from "./inputList";
import { RenderInputs } from "../../../../components/renderInput/RenderInputs";
import FormItem from "../../../../components/renderInput/formItem/FormItem";
import axios from "api/appAxios";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const AddGroupRightFull = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectFileType, setSelectFileType] = useState("dbf");

  const onFinish = (values) => {
    setLoading(true);

    if (values.select_file === "dbf") {
      const formData = new FormData();
      formData.append("dbf_file", values.dbf_file[0]["originFileObj"]);
      axios
        .post("/api/admin/personnel/dbf", formData)
        .then((res) => {
          setLoading(false);
          form.resetFields();
          Modal.success({
            content: `از تعداد : ${res.data.total} ردیف ، ${res.data.success} ردیف وارد سیستم شد.`,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (values.select_file === "excel") {
      const formData = new FormData();
      formData.append("excel_file", values.excel_file[0]["originFileObj"]);
      axios
        .post("/api/admin/personnel/excel", formData)
        .then((res) => {
          setLoading(false);
          form.resetFields();
          Modal.success({
            content: `از تعداد : ${res.data.total} ردیف ، ${res.data.success} ردیف وارد سیستم شد.`,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onChangeFormValue = (values) => {
    if (values.select_file && values.select_file === "excel")
      setSelectFileType("excel");
    if (values.select_file && values.select_file === "dbf")
      setSelectFileType("dbf");
  };

  return (
    <>
      <h2>ثبت اطلاعات گروهی افراد حقوقی</h2>
      <Button
        href="/addRealPerson.xlsx"
        style={{ marginBottom: "10px", width: "200px" }}
      >
        فایل نمونه
      </Button>
      <Form
        {...formItemLayout}
        name="AddGroupRealPerson"
        onFinish={onFinish}
        style={{ backgroundColor: "#fff", padding: "20px" }}
        form={form}
        initialValues={{ select_file: "dbf" }}
        onValuesChange={onChangeFormValue}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <RenderInputs
            inputsFiled={addGroupRightFullFiled}
            additionalData={{
              excel_file: {
                hidden: selectFileType === "excel" ? true : false,
              },
              dbf_file: {
                hidden: selectFileType === "dbf" ? true : false,
              },
            }}
          />

          <FormItem>
            <Button type="primary" htmlType="submit" loading={loading}>
              ثبت
            </Button>
          </FormItem>
        </Row>
      </Form>
    </>
  );
};

export default AddGroupRightFull;
