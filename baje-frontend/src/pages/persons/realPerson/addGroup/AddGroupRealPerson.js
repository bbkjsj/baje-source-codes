import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Row, Button, Spin } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import * as FormItem from "./formItems";
import { useSubmitPresonsFile } from "./utils/hooks";
import { formItemLayout, pageNames } from "constant";

const AddGroupRealPerson = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const personType = query.get("type");
  //
  const { loading, submit } = useSubmitPresonsFile(form);
  const [selectFileType, setSelectFileType] = useState("excel");

  const onChangeFormValue = (values) => {
    if (values.select_file && values.select_file === "excel")
      setSelectFileType("excel");
    if (values.select_file && values.select_file === "dbf")
      setSelectFileType("dbf");
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ثبت گروهی"
        breadcrumbItems={[
          { text: "منابع انسانی", link: pageNames.home.web },
          { text: "حقیقی", link: pageNames.personnel.realPerson.list },
          { text: "ثبت گروهی" },
          { text: `${personType === "mainTab" ? "اصلی" : "تبعی"}` },
        ]}
      />

      <Button
        href={
          personType === "mainTab"
            ? "/addRealPerson.xlsm"
            : "/addSubordinatePerson.xlsm"
        }
        style={{ marginBottom: "10px", width: "200px" }}
      >
        فایل نمونه
      </Button>
      <Form
        {...formItemLayout}
        name="AddGroupRealPerson"
        onFinish={submit}
        style={{}}
        form={form}
        initialValues={{
          select_file: "excel",
        }}
        onValuesChange={onChangeFormValue}
      >
        <Spin spinning={loading}>
          <Row>
            <FormItem.FileType personType={personType} />
            <FormItem.uploadDBF
              hidden={
                personType !== "mainTab" || selectFileType === "excel"
                  ? true
                  : false
              }
            />
            <FormItem.uploadExcel
              hidden={selectFileType === "dbf" ? true : false}
            />
            <SubmitBtn />
          </Row>
        </Spin>
      </Form>
    </>
  );
};

export default AddGroupRealPerson;
