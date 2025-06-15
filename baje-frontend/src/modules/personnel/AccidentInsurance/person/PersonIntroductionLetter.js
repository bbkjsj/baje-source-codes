import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button, notification } from "antd";
import * as FormItems from "./personIntroductionLetter/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { getLink } from "_helpers";
import { useHistory, withRouter } from "react-router-dom";
import { AccidentInsuranceContext } from "../util/AccidentInsuranceContext";
import { _POST_IntroLetter } from "./util/api";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const PersonAdd = ({ match, selectedRow, list, insurer }) => {
  const [form] = Form.useForm();
  const insuranceID = match.params.id;
  const insuranceContext = useContext(AccidentInsuranceContext);
  const [selectedPerson, setSelectedPerson] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);
  const history = useHistory();

  console.info(insurer);

  const handleOnFinish = async (values) => {
    setSubmitLoading(true);
    const userInfo = getPersonInfo();
    // convert date
    let subordinates = [];
    if (values.subordinates) {
      subordinates = values.subordinates;
    }
    if (userInfo.relation) {
      subordinates.push(userInfo.sub_id);
    }
    values.person = userInfo.main_id;
    values.insurance_id = insuranceID;

    values.company_id = insuranceContext.insurance.company_id_fk;
    // console.info(list);

    try {
      const res = await _POST_IntroLetter({ ...values, subordinates });
      console.log("introduce result:", res);
      setSubmitLoading(false);
      if (res.data.id) {
        notification.success({
          message: "با موفقیت ثبت شد",
        });
        const printLink = getLink(
          pageNames.personnel.insurance.accident.personnel.printIntro,
          res.data.id
        );
        window.open(printLink, "_blank");
      }
    } catch (err) {
      setSubmitLoading(false);
      console.log(err);
    }

    // submit(values);
  };

  const getPersonInfo = () => {
    const personId = selectedRow[0];
    const index = list.findIndex((element) => element.id === personId);
    return list[index];
  };

  // check main user
  const checkUserType = () => {
    const personId = selectedRow[0];
    const index = list.findIndex((element) => element.id === personId);
    // setSelectedPerson(list[index]);
    if (list[index].relation === "") return "main";
    else return "sub";
  };

  const findSubordinate = () => {
    let personInfo = getPersonInfo();

    const subordinate = [];
    for (let i = 0; i < list.length; i++) {
      if (
        list[i].main_id === personInfo.main_id &&
        list[i].sub_natinal_number
      ) {
        subordinate.push({
          label: list[i].sub_name,
          value: list[i].sub_id,
        });
      }
    }
    return subordinate;
  };

  if (selectedRow.length > 1) {
    return (
      <p style={{ textAlign: "center" }}>
        صدور معرفی نامه برای یک نفر امکان پذیر است
      </p>
    );
  }

  return (
    <>
      {checkUserType() === "main" ? <p>اصلی</p> : <p>تبعی</p>}
      <Form
        {...formItemLayout}
        form={form}
        name="PersonIntroductionLetter"
        onFinish={handleOnFinish}
      >
        <Row gutter={formRowGutter}>
          {/* <FormItems.InsuranceCompany /> */}
          <FormItems.IntroduceType />
          {checkUserType() === "main" && findSubordinate().length > 0 && (
            <FormItems.Subordinates options={findSubordinate()} />
          )}
        </Row>
        <SubmitBtn loading={submitLoading} />
      </Form>
    </>
  );
};

export default withRouter(PersonAdd);
