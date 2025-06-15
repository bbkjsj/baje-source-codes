import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import * as fields from "./formItems";
import SubmitBtn from "components/general/SubmitBtn";
import moment from "moment-jalaali";
import { useHistory } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import endpoints from "../../endpoints";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";
import { convertDateToENProper } from "_helpers";
const api = endpoints.realPerson.service;

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

function ServiceAdd() {
  const [serviceForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [person, setPerson] = useState();
  const [rewardTypes, setRewardTypes] = useState();
  const [rewardAmountFields, setRewardAmountFields] = useState([]);
  const history = useHistory();
  const user = useWhoAmI();
  const [defaultCode, setDefaultCode] = useState(user.nationalCode);

  let editButton = true;
  if (!user?.isSuper) {
    editButton = false;
  }
  // if (!checkAccess(EDIT_CONTRACT)) {
  //   console.info("Not a super admin");
  //   editButton = false;
  // }

  const handleOnFinish = (values) => {
    let params = serviceForm.getFieldsValue();
    const personFields = [
      "person_personnel_id",
      "person_national_id",
      "person_name",
    ];

    if (person && person.id) params.personnel_id = person.id;

    params.date = convertDateToENProper(params.date);
    [...rewardAmountFields, ...personFields].map((key) => delete params[key]);

    setLoading(true);
    axios({
      method: "post",
      url: api.post,
      data: params,
    })
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

  const handleOnTypeChange = (value) => {
    setType(value);
    setRewardTypes(null);
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="جدید"
        breadcrumbItems={[
          {
            text: "خدمات و خسارات",
            link: pageNames.personnel.realPerson.service.list,
          },
          { text: "جدید" },
        ]}
      />

      <h2>خدمت / خسارت جدید</h2>

      <Form
        {...formItemLayout}
        form={serviceForm}
        name="service"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.Person
              useForm={serviceForm}
              setPerson={setPerson}
              defaultValue={defaultCode}
              button={!editButton}
            />
            <fields.Type onChange={handleOnTypeChange} />
            <fields.ItemDate useForm={serviceForm} />
            <fields.Description />
            <fields.TypeServiceDamage />
            <fields.TypeRewardPenalty
              type={type}
              onChange={(value) => setRewardTypes(value)}
            />
            <fields.AmountRewardPenalty
              useForm={serviceForm}
              type={rewardTypes}
              isReward={type === "خدمت"}
              onChange={(values, fields) => setRewardAmountFields(fields)}
            />
            <SubmitBtn loading={loading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default ServiceAdd;
