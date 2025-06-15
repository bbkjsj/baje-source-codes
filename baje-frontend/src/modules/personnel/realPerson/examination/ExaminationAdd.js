import React, { useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import * as fields from "./formItems";
import SubmitBtn from "components/general/SubmitBtn";
import moment from "moment-jalaali";
import { useHistory, useLocation } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import endpoints from "../../endpoints";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";
const api = endpoints.realPerson;

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formInitialValues = {
  result: fields.resultTypes.CONTINUE,
  visit_date: moment().format("jYYYY/jMM/jDD"),
  next_visit_date: moment().add(6, "jMonth").format("jYYYY/jMM/jDD"),
};

function ExaminationAdd(props) {
  const [examinationForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(fields.resultTypes.CONTINUE);
  const [person, setPerson] = useState();
  const [jobCode, setJobCode] = useState();
  const [defaultJobCode, setDefaultJobCode] = useState();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultPersonId = query.get("person_id");
  const user = useWhoAmI();
  const [defaultCode] = useState(user.nationalCode);

  let editButton = true;
  if (!user?.isSuper) {
    editButton = false;
  }

  const handleOnVisitDateChange = () => {
    let nextDate = moment(
      examinationForm.getFieldValue("visit_date"),
      "jYYYY/jMM/jDD"
    )
      .add(2, "jMonth")
      .format("jYYYY/jMM/jDD");
    examinationForm.setFieldsValue({ next_visit_date: nextDate });
  };

  const handleOnPersonChange = (data) => {
    setPerson(data);

    axios.get(api.getSingleRealPerson(data.id)).then((res) => {
      const jobCode = res?.data?.job?.code;

      if (jobCode) setDefaultJobCode(jobCode);
    });
  };

  const handleOnJobChange = (data) => {
    if (data?.id) setJobCode(data.id);
  };

  const handleOnFinish = (params) => {
    const toDeleteParams = [
      "person_name",
      "person_national_code",
      "approved_position",
      "approved_position_name",
    ];

    if (person && person.id) params.personnel_id = person.id;

    params.visit_date = moment(params.visit_date, "jYYYY/jM/jD").format(
      "YYYY/M/D HH:mm:ss"
    );
    params.next_visit_date = moment(
      params.next_visit_date,
      "jYYYY/jM/jD"
    ).format("YYYY/M/D HH:mm:ss");
    params.approved_position_code = jobCode ? jobCode : 0;

    toDeleteParams.map((key) => delete params[key]);
    console.log(params);

    axios({
      method: "post",
      url: api.examination.post,
      data: params,
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setLoading(false);

        setTimeout(() => {
          history.go();
        }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);
          message.error(error?.response?.data);
        }
      });
  };

  const handleOnResultChange = (res) => {
    setResult(res);
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ثبت معاینه جدید"
        breadcrumbItems={[
          {
            text: "معاینات پزشکی",
            link: pageNames.personnel.realPerson.examination.personList,
          },
          { text: "ثبت معاینه جدید" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={examinationForm}
        name="examination"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.Person
              useForm={examinationForm}
              setPerson={handleOnPersonChange}
              defaultValue={defaultCode}
              button={!editButton}
            />
            <fields.VisitDate
              useForm={examinationForm}
              onChange={handleOnVisitDateChange}
            />
            <fields.Result onChange={handleOnResultChange} />
            {result !== fields.resultTypes.TERMINATE && (
              <fields.Job
                useForm={examinationForm}
                onChange={handleOnJobChange}
                defaultValue={defaultJobCode}
              />
            )}
            <fields.NextVisitDate useForm={examinationForm} />
            <fields.SpecialDescription />
            <SubmitBtn loading={loading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default ExaminationAdd;
