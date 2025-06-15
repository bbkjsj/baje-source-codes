import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Col, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import moment from "moment-jalaali";
import { useHistory, useLocation, useParams } from "react-router-dom";
import * as api from "./utils/api";
import { convertDateToENProper, covetFormatDateToFA, getLink } from "_helpers";
import { problemReportType, problemResultType } from "./const";
import useSaveProblemReport from "./common/useSaveProblemReport";
import AppCard from "components/general/AppCard";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function ProblemReportForm(props) {
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const pageParams = useParams();
  const [savePageLoading, savePage] = useSaveProblemReport();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (params) => {
    const body = {
      ...params,
      survey_id: pageParams.id,
      problem_date: convertDateToENProper(params.problem_date),
    };

    const result = (await props.update)
      ? await savePage(body, pageParams.itemId)
      : await savePage(body);

    if (result) {
      message.success("با موفقیت انجام شد");

      const newPath = getLink(pageNames.suggest.problem.list, pageParams.id);
      history.push(newPath);
    }
  };

  useEffect(() => {
    if (pageParams.itemId) {
      setLoading(true);
      api
        ._GET_ITEM(pageParams.itemId)
        .then((res) => {
          setLoading(false);
          const { data } = res;
          if (data) {
            console.log("EDIT RESULT:", data);
          }
          mainForm.setFieldsValue({
            ...data,
            problem_date: covetFormatDateToFA(data.problem_date),
          });
        })
        .catch((err) => {
          setLoading(false);
          message.error("مشکلی در نمایش صفحه پیش آمده است");
          console.error(err);
        });
    }
  }, []);

  const formInitialValues = {
    type: problemReportType.FINANCIAL,
    result: problemResultType.DISRUPTION,
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="گزارش مشکل"
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          { text: "گزارش مشکلات اجرای پیشنهاد" },
        ]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="problemReport"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={savePageLoading || loading}>
            <Row gutter={formRowGutter}>
              <fields.ProblemType />
              <fields.CustomProblemType />
              <fields.Title />
              <fields.ProblemDate useForm={mainForm} />
              <fields.ProblemResult />
              <fields.CustomProblemResult />
              <Col span={24}>
                <Row gutter={formRowGutter}>
                  <fields.Description />
                  <fields.Solution />
                </Row>
              </Col>
              <SubmitBtn loading={savePageLoading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default ProblemReportForm;
