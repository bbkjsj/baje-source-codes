import React, { useContext, useEffect, useState } from "react";
import { Form, message, Modal, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory } from "react-router-dom";
import * as api from "./utils/api";
import * as committeeApi from "../committee/utils/api";
import useSaveCall from "./common/useSaveCall";
import AppCard from "components/general/AppCard";
import moment from "moment-jalaali";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function CallForm(props) {
  const [mainForm] = Form.useForm();
  const [committeeList, setCommitteeList] = useState();
  const history = useHistory();
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [savePageLoading, savePage] = useSaveCall();

  const handleOnFinish = async (params) => {
    const startDate = moment(params.start_date, "jYYYY/jM/jD");
    const endDate = moment(params.end_date, "jYYYY/jM/jD");

    if (startDate.isAfter(endDate)) {
      Modal.warn({
        title: "تاریخ شروع و پایان",
        content: "تاریخ شروع باید پیش از تاریخ پایان باشد.",
      });

      return;
    }

    params.start_date = startDate.format("YYYY/M/D HH:mm:ss");

    params.end_date = endDate.format("YYYY/M/D HH:mm:ss");

    const result = await savePage(params, pageId);

    if (result) {
      message.success("با موفقیت انجام شد");

      const newPath = pageNames.suggest.call.list;
      history.push(newPath);
    }
  };

  useEffect(() => {
    try {
      (async () => {
        const committeeList = await committeeApi._GET();
        setCommitteeList(committeeList.data);
        mainForm.setFieldsValue({ workgroup_id: committeeList.data[0]?.id });

        if (!isNew) {
          const pageData = await api._GET_ITEM(pageId);

          mainForm.setFieldsValue({
            ...pageData.data,
            start_date: moment(pageData.data.start_date).format(
              "jYYYY/jMM/jDD"
            ),
            end_date: moment(pageData.data.end_date).format("jYYYY/jMM/jDD"),
            workgroup_id: pageData.data["workgroup_id_fk"],
          });
        }
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  const formInitialValues = {};

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title={`${isNew ? "ایجاد" : "ویرایش"} فراخوان پیشنهاد`}
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="call"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={savePageLoading}>
            <Row gutter={formRowGutter}>
              <fields.Subject />
              <fields.StartDate useForm={mainForm} />
              <fields.EndDate useForm={mainForm} />
              <fields.Committee items={committeeList} />
              <SubmitBtn loading={savePageLoading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default CallForm;
