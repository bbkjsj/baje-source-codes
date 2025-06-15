import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory } from "react-router-dom";
import useSaveCategory from "./common/useSaveCategory";
import AppCard from "components/general/AppCard";
import * as api from "./utils/api";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function CategoryForm(props) {
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [savePageLoading, savePage] = useSaveCategory();

  const handleOnFinish = async (params) => {
    const result = await savePage(params, pageId);

    if (result) {
      message.success("با موفقیت انجام شد");

      const newPath = pageNames.suggest.category.list;
      history.push(newPath);
    }
  };

  useEffect(() => {
    (async function () {
      if (!isNew) {
        const pageData = await api._GET_ITEM(pageId);

        mainForm.setFieldsValue({
          ...pageData.data,
        });
      }
    })();
  }, []);

  const formInitialValues = {};

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title={`${isNew ? "ایجاد" : "ویرایش"} حوزه پیشنهاد`}
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          { text: "حوزه های پیشنهاد" },
        ]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="examination"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={savePageLoading}>
            <Row gutter={formRowGutter}>
              <fields.Name />
              <fields.Description />
              <SubmitBtn loading={savePageLoading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default CategoryForm;
