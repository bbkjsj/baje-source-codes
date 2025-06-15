import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import AppCard from "components/general/AppCard";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation } from "react-router-dom";
import * as api from "./utils/api";
import useSaveConfiguration from "./common/useSaveConfiguration";
import ContentTop from "../../../components/general/ContentTop";
import { config, formItemLayout, formRowGutter } from "../../../constant";

function ConfigurationForm(props) {
  const [mainForm] = Form.useForm();
  const [committeeList, setCommitteeList] = useState();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultCommitteeId = parseInt(query.get("committee_id"));
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [savePageLoading, savePage] = useSaveConfiguration();
  const [person, setPerson] = useState();
  const [initialPersonnelId, setInitialPersonnelId] = useState(null);

  const handleOnFinish = (params) => {
    const toDeleteParams = ["person_name", "person_national_code"];
    if (person && person.id) params.manager_id = person.id;
    toDeleteParams.map((key) => delete params[key]);

    const result = savePage(params, pageId);

    if (result) {
      message.success("با موفقیت انجام شد");
    }
  };

  useEffect(() => {
    try {
      (async () => {
        const pageData = await api._GET();
        mainForm.setFieldsValue({
          ...pageData.data,
        });
        setInitialPersonnelId(pageData.data?.manager_id_fk);

        if (pageData.data?.background_image) {
          const initialFile = [
            {
              name: "پس زمینه فعلی",
              status: "done",
              url: config.url.API_URL + pageData.data.background_image,
            },
          ];

          mainForm.setFieldsValue({
            bck_file: initialFile,
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
      <ContentTop
        noBack
        title="تنظیمات نظام پیشنهادات"
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="configuration"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={savePageLoading}>
            <Row gutter={formRowGutter}>
              <fields.Person
                useForm={mainForm}
                setPerson={setPerson}
                defaultValue={initialPersonnelId}
              />
              <fields.MaxDayFirstAssessment />
              <fields.MaxDayExpertWorkgroup />
              <fields.MaxDayExcellentWorkgroup />
              <fields.MaxDayEdit />
              <fields.MaxDayReviewRequest />
              <fields.MaxDayPlanningExecution />
              <fields.MaxDayExecutionReview />
              <fields.RialRatePerYear />
              <fields.MinRewardRial />
              <fields.MaxPercentParticipate />
              <fields.MinPassPoint />
              <fields.UploadLoginBackground />
              <SubmitBtn loading={savePageLoading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default ConfigurationForm;
