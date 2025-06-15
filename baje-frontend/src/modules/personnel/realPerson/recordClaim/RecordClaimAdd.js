import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import securedAxios from "api/appAxios";
import * as fields from "./formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation } from "react-router-dom";
import { convertDateToEN } from "_helpers";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { pageNames } from "constant";
import { postRecordClaim } from "./api";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

function RecordClaimAdd(props) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultPersonId = query.get("person_id");
  const user = useWhoAmI();
  const [defaultCode] = useState(user.nationalCode);
  const superAdminCheck = useSuperAdminCheck();

  console.info(defaultCode);

  const formInitialValues = {
    national_id: defaultCode,
  };

  const handleOnFinish = (params) => {
    console.log(params);
    setLoading(true);
    const toDeleteParams = ["fullName"];

    // if (person && person.id) params.personnel_id = person.id;
    // if (!params.debt) params.debt = 5000;
    if (params.register_date)
      params.register_date = convertDateToEN(params.register_date);

    toDeleteParams.map((key) => delete params[key]);

    postRecordClaim(params)
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setLoading(false);

        setTimeout(() => {
          history.goBack();
        }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);
          message.error(error?.response?.data);
        }
      });
  };

  const handleOnPersonChange = () => {};

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="درخواست ادعای جدید"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "درخواست های ادعای سابقه",
            link: pageNames.personnel.realPerson.recordClaim.list,
          },
          { text: "جدید" },
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
            <fields.Person
              useForm={mainForm}
              setPerson={setPerson}
              defaultValue={defaultCode}
              disabled={!user.isSuper}
              button={superAdminCheck()}
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

export default RecordClaimAdd;
