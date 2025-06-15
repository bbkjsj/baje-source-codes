import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import securedAxios from "api/appAxios";
import * as fields from "./formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import { convertDateToEN, covetFormatDateToFA } from "_helpers";
import { getRecordClaim } from "./api";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { pageNames } from "constant";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formInitialValues = {};

function RecordClaimEdit({ match }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const claimID = match.params.id;
  const [getLoading, setGetLoading] = useState(true);
  const superAdminCheck = useSuperAdminCheck();

  const handleOnFinish = (params) => {
    const toDeleteParams = ["fullName"];
    if (params.register_date)
      params.register_date = convertDateToEN(params.register_date);
    toDeleteParams.map((key) => delete params[key]);

    securedAxios({
      method: "put",
      url: `/api/hclaim/${claimID}`,
      data: params,
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setLoading(false);
        history.goBack();
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);
          message.error(error?.response?.data);
        }
      });
  };

  const handleGetRecordClaim = async () => {
    try {
      const { data } = await getRecordClaim(claimID);
      setGetLoading(false);
      console.info(data);
      mainForm.setFieldsValue({
        ...data,
        fullName: data.first_name + " " + data.last_name,
        register_date: covetFormatDateToFA(data.register_date),
        salar_bonus: data.salary_bonus,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetRecordClaim();
  }, []);

  if (getLoading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ویرایش ادعای سابقه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "درخواست های ادعای سابقه",
            link: pageNames.personnel.realPerson.recordClaim.list,
          },
          { text: "ویرایش" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
        style={{}}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.NationalID
              useForm={mainForm}
              disabled={superAdminCheck()}
            />
            <fields.UserID />
            <fields.Status />
            <fields.RegisterDate useForm={mainForm} />
            <fields.RegisterNumber />
            <fields.WorkshopCode />
            <fields.RowCode />
            <fields.Period />
            <fields.Salary />
            <SubmitBtn loading={loading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default withRouter(RecordClaimEdit);
