import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Col,
  Divider,
  Form,
  message,
  Row,
  Spin,
  Modal,
  Descriptions,
  Space,
} from "antd";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { Link, useHistory, useLocation } from "react-router-dom";
import { assessmentMethod, itemStatus } from "../assessmentCriteria/const";
import { keyMap } from "./const";
import { keyMap as suggestionKeyMap } from "../suggestion/const";
import * as suggestionApi from "../suggestion/utils/api";
import * as assessmentApi from "../assessmentCriteria/utils/api";
import * as rejectionApi from "../rejectionCriteria/utils/api";
import * as api from "./utils/api";
import { convertDataKeys, getLink } from "_helpers";
import useSaveEvaluation from "./common/useSaveEvaluation";
import { ScoreAssessment } from "./common/formItems";
import ContentTop from "../../../components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

function EvaluationForm(props) {
  const [mainForm] = Form.useForm();
  const user = useWhoAmI();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const suggestionId = props.match.params.suggestion;
  const personnelId = props.match.params.personnel || user?.id;
  const isNew = false;
  const [loading, setLoading] = useState(false);
  const [suggestionInfo, setSuggestionInfo] = useState({});
  const [assessmentCriteriaList, setAssessmentCriteriaList] = useState([]);
  const [rejectCriteriaList, setRejectCriteriaList] = useState([]);
  const [savePageLoading, savePage] = useSaveEvaluation();

  const handleOnFinish = async (params) => {
    const assessList = [];
    const rejectList = [];

    Object.entries(params).forEach(([key, value]) => {
      // console.log(value, key, "!value");
      if (value === undefined || value === null) return;

      const [type, id] = key.split("_");
      const dataItem = { id, value };

      if (type === "assess") assessList.push(dataItem);
      else if (type === "reject") rejectList.push(id);
    });

    const requestData = {
      survey_id: suggestionId,
      evaluations: assessList,
      rejects: rejectList,
    };
    console.log(requestData, "!requestData");

    const result = await savePage(requestData);

    if (result) {
      message.success("با موفقیت انجام شد");

      //set suggestion as seen
      await suggestionApi._SET_AS_SEEN(suggestionId);

      const newPath = pageNames.suggest.suggestion.list;
      window.location = newPath;
    }
  };

  useEffect(() => {
    try {
      (async () => {
        setLoading(true);

        const suggestion = (await suggestionApi._GET_ITEM(suggestionId))
          ?.data?.["survey"];
        const assessments = (
          await assessmentApi._GET_BY_COMMITTEE(suggestion["workgroup_id_fk"])
        )?.data;
        const rejections = (
          await rejectionApi._GET_BY_COMMITTEE(suggestion["workgroup_id_fk"])
        )?.data;

        setSuggestionInfo(
          convertDataKeys(suggestionKeyMap(true), suggestion, true)
        );
        setAssessmentCriteriaList(assessments);
        setRejectCriteriaList(rejections);

        setLoading(false);
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
        title="ارزیابی پیشنهاد"
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          {
            text: "پیشنهادات",
            link: getLink(pageNames.suggest.suggestion.list, false),
          },
        ]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="evaluation"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={loading || savePageLoading}>
            <Row gutter={formRowGutter}>
              <Col span={24}>
                <Descriptions title="اطلاعات پیشنهاد" bordered={true}>
                  <Descriptions.Item label="عنوان پیشنهاد">
                    {suggestionInfo.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="نوع مشارکت">
                    {suggestionInfo.participation_type}
                  </Descriptions.Item>
                  <Descriptions.Item label="نوع پیشنهاد">
                    {suggestionInfo.suggestion_type}
                  </Descriptions.Item>
                  <Descriptions.Item label="حوزه پیشنهاد">
                    {suggestionInfo.category
                      ? suggestionInfo["category_name"]
                      : suggestionInfo.custom_category || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="در حال اجرا">
                    {suggestionInfo.is_in_process ? "بلی" : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <Link
                      to={getLink(
                        pageNames.suggest.suggestion.view,
                        suggestionId
                      )}
                    >
                      مشاهده جزئیات پیشنهاد
                    </Link>
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ height: 24 }} />
              </Col>
              <Col span={24}>
                <Divider orientation="right">معیارهای ارزیابی</Divider>
              </Col>
              {assessmentCriteriaList
                .filter((item) => item.is_enabled)
                .map((item) => {
                  if (item.rate_type === assessmentMethod.SCORE)
                    return (
                      <fields.ScoreAssessment
                        title={item.name}
                        description={item.description?.replace("null", "")}
                        //maxValue={item.max_point}
                        maxValue={4}
                        criteriaId={item.id}
                      />
                    );
                  else if (item.rate_type === assessmentMethod.QUALITY)
                    return (
                      <fields.QualityAssessment
                        title={item.name}
                        description={item.description?.replace("null", "")}
                        criteriaId={item.id}
                      />
                    );
                  else if (
                    item.rate_type === assessmentMethod.QUALITY_OBJECTIVE
                  )
                    return (
                      <fields.QualityObjectiveAssessment
                        title={item.name}
                        description={item.description?.replace("null", "")}
                        criteriaId={item.id}
                      />
                    );
                  else if (item.rate_type === assessmentMethod.QUESTION)
                    return (
                      <fields.QuestionAssessment
                        title={item.name}
                        description={item.description?.replace("null", "")}
                        criteriaId={item.id}
                      />
                    );
                })}
              <Col span={24}>
                <Divider orientation="right">معیارهای رد</Divider>
              </Col>
              {rejectCriteriaList
                .filter((item) => item.is_enable)
                .map((item) => {
                  return (
                    <fields.RejectionCriteria
                      title={item.name}
                      description={item.description?.replace("null", "")}
                      criteriaId={item.id}
                    />
                  );
                })}
              <SubmitBtn loading={loading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default EvaluationForm;
