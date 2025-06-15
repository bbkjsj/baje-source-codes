import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation } from "react-router-dom";
import * as committeeApi from "../committee/utils/api";
import { getLink, removeNullFromObject } from "_helpers";
import { itemStatus, assessmentMethod } from "./const";
import * as api from "./utils/api";
import useSaveAssessmentCriteria from "./common/useSaveAssessmentCriteria";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function AssessmentCriteriaForm(props) {
  const [mainForm] = Form.useForm();
  const [committeeList, setCommitteeList] = useState();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultCommitteeId = parseInt(query.get("committee_id"));
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [savePageLoading, savePage] = useSaveAssessmentCriteria();
  const [pageData, setPageData] = useState();

  const handleOnFinish = async (params) => {
    const result = await savePage(params, pageId);

    if (result) {
      message.success("با موفقیت انجام شد");

      const newPath = getLink(
        pageNames.suggest.assessmentCriteria.list,
        defaultCommitteeId ?? pageData?.["workgroup_id_fk"]
      );
      history.push(newPath);
    }
  };

  useEffect(() => {
    try {
      (async () => {
        const committeeList = await committeeApi._GET();
        setCommitteeList([
          // { id: -1, name: "همه کارگروه ها" },
          ...committeeList.data,
        ]);
        mainForm.setFieldsValue({
          workgroup_id: defaultCommitteeId || committeeList.data[0]?.id,
        });

        if (!isNew) {
          const res = await api._GET_ITEM(pageId);
          mainForm.setFieldsValue({
            ...removeNullFromObject(res.data),
            workgroup_id: res.data["workgroup_id_fk"],
            is_enabled: !!res.data.is_enabled,
            max_point: parseInt(res.data.max_point),
          });

          setPageData(res.data);
        }
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  const formInitialValues = {
    is_enabled: itemStatus.ACTIVE,
    rate_type: assessmentMethod.SCORE,
    max_point: 4,
    weight_factor: 1,
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={(isNew ? "ایجاد" : "ویرایش") + " ملاک ارزیابی پیشنهاد"}
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          {
            text: "ملاک‌های ارزیابی پیشنهاد",
            link: getLink(pageNames.suggest.assessmentCriteria.list, false),
          },
        ]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="assessment"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={savePageLoading}>
            <Row gutter={formRowGutter}>
              <fields.Committee
                items={committeeList}
                disabled={defaultCommitteeId && isNew}
              />
              <fields.Name />
              <fields.Method />
              <fields.WeightFactor />
              <fields.Status />
              <fields.Description />
              <SubmitBtn loading={savePageLoading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default AssessmentCriteriaForm;
