import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import moment from "moment-jalaali";
import { useHistory, useLocation } from "react-router-dom";
import * as api from "./utils/api";
import * as committeeApi from "../committee/utils/api";
import { getLink } from "_helpers";
import { itemStatus } from "./const";
import useSaveRejectionCriteria from "./common/useSaveRejectionCriteria";
import AppCard from "components/general/AppCard";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function RejectionCriteriaForm(props) {
  const [mainForm] = Form.useForm();
  const [committeeList, setCommitteeList] = useState();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultCommitteeId = parseInt(query.get("committee_id"));
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [savePageLoading, savePage] = useSaveRejectionCriteria();
  const [pageData, setPageData] = useState();

  const handleOnFinish = async (params) => {
    const result = await savePage(params, pageId);

    if (result) {
      message.success("با موفقیت انجام شد");

      const newPath = getLink(
        pageNames.suggest.rejectionCriteria.list,
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
            ...res.data,
            workgroup_id: res.data["workgroup_id_fk"],
            is_enable: !!res.data.is_enable,
          });

          setPageData(res.data);
        }
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  const formInitialValues = {
    workgroup_id:
      isNew && defaultCommitteeId ? parseInt(defaultCommitteeId) : null,
    is_enable: itemStatus.ACTIVE,
  };

  const onClick = async function () {
    const id = parseInt(mainForm.getFieldValue("workgroup_id"));
    const members = (await committeeApi._GET_MEMBER(id)).data;
    return members.length;
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title={`${isNew ? "ایجاد" : "ویرایش"} ملاک رد پیشنهاد`}
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          { text: "معیار های رد پیشنهاد" },
        ]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="rejection"
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
              <fields.MinimumVote onClick={onClick} />
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

export default RejectionCriteriaForm;
