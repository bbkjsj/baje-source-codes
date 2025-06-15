import React, { useContext, useEffect, useState } from "react";
import { Form, message, Modal, notification, Row, Spin } from "antd";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory } from "react-router-dom";
import { reportTypes, scoringFactor, suggestionTypes } from "./const";
import AppCard from "components/general/AppCard";
import * as api from "./utils/api";
import {
  convertDateToENProper,
  getLink,
  handleClickExportExl,
} from "../../../_helpers";
import ContentTop from "../../../components/general/ContentTop";
import { formItemLayout, formRowGutter } from "../../../constant";

function ReportIndex(props) {
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (params) => {
    const body = {
      workgroup_id: params.workgroup_id,
      from_date: convertDateToENProper(params.from_date),
      to_date: convertDateToENProper(params.to_date),
    };

    if (params.report_type === reportTypes.BEST_WORKSHOP) {
      body.workgroup_id = "all";
    }

    console.log(body);

    setLoading(true);
    try {
      const res = await api._GET_REPORT(params.report_type, body);
      setLoading(false);
      if (!res?.data?.list || res?.data?.list.length > 0) {
        if (res?.data?.hash || res?.data?.json) {
          notification.success({
            message: "گزارش با موفقیت ایجاد شد",
          });
          handleClickExportExl(
            res.data.hash ? res.data.hash : res.data.json,
            res.data.json ? true : false
          );
        } else {
          notification.error({
            message: "امکان ساخت گزارش وجود ندارد",
          });
        }
      } else {
        Modal.error({
          content: "در حال حاظر داده ای جهت گزارش گیری وجود ندارد",
        });
      }
    } catch (err) {
      setLoading(false);
      notification.error({
        message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    (async function () {})();
  }, []);

  const formInitialValues = {
    report_type: reportTypes.TOTAL,
    scoring_factor: scoringFactor.INDIVIDUAL,
    related_call: 0,
    workgroup: 0,
    suggestion_status: 0,
    suggestion_type: 0,
  };

  return (
    <>
      <ContentTop
        noBack
        title="گزارشات"
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="report"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={pageLoading}>
            <Row gutter={formRowGutter}>
              <fields.ReportType />
              {/* <fields.ScoringFactor /> */}
              {/* <fields.RelatedCall /> */}
              <fields.Committee />
              <fields.FromDate useForm={mainForm} />
              <fields.ToDate useForm={mainForm} />
              {/* <fields.Individual />
              <fields.Status />
              <fields.SuggestionType /> */}
              <SubmitBtn loading={loading} text="تهیه گزارش" />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default ReportIndex;
