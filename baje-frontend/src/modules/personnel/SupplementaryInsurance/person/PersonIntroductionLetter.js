import React, { useEffect, useState, useContext } from "react";
import { Form, Row, notification, message } from "antd";
import * as FormItems from "./personIntroductionLetter/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { getLink } from "_helpers";
import { useHistory, withRouter } from "react-router-dom";
import { _POST_IntroLetter } from "././util/api";
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

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const PersonIntroductionLetter = ({
  match,
  selectedRow,
  list,
  displayMessage,
  setDisplayMessage,
  insurance,
}) => {
  const [form] = Form.useForm();
  const insuranceID = match.params.id;
  const [selectedPerson, setSelectedPerson] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);

  const history = useHistory();

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

    values.company_id = insurance.company_id_fk;

    const requiredData = {
      mobile: userInfo.mobile_number,
      sheba: userInfo.sheba,
      user_tamin_insurance_number: userInfo.insurance_number,
      ceo_name: insurance.manager_firstname + " " + insurance.manager_lastname,
      ceo_signature: insurance.sign_url,
      insurer_company_log: insurance.logo_url,
    };

    let permited = true;
    for (const prop in requiredData) {
      if (!requiredData[prop]) {
        console.log(prop, "!prop");
        permited = false;
        setDisplayMessage(true);
        setSubmitLoading(false);
        return;
      }
    }

    if (permited) {
      try {
        const res = await _POST_IntroLetter({ ...values, subordinates });
        console.log("introduce result:", res);
        setSubmitLoading(false);
        if (res.data.id) {
          notification.success({
            message: "با موفقیت ثبت شد",
          });
          const printLink = getLink(
            pageNames.personnel.insurance.supplymentary.personnel.printIntro,
            res.data.id
          );
          window.open(printLink, "_blank");
        }
      } catch (err) {
        setSubmitLoading(false);
        console.log(err);
      }
    }
  };

  const getPersonInfo = () => {
    const rowID = selectedRow[0];
    const index = list.findIndex((element) => element.id === rowID);
    return list[index];
  };

  // check main user
  const checkUserType = () => {
    const rowID = selectedRow[0];
    const index = list.findIndex((element) => element.id === rowID);
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
        onFieldsChange={() => setDisplayMessage(false)}
      >
        <Row gutter={formGutter}>
          <FormItems.IntroduceType />
          {checkUserType() === "main" && findSubordinate().length > 0 && (
            <FormItems.Subordinates options={findSubordinate()} />
          )}
        </Row>
        {displayMessage && (
          <div>
            <div>
              لطفا ابتد اطلاعات ذیل را تکمیل و سپس نسبت به صدور معرفی نامه اقدام
              نمایید
            </div>
            <ul>
              <li>نام مدیرعامل شرکت بیمه گذار</li>
              <li>امضا مدیرعامل شرکت بیمه گذار</li>
              <li>لوگوی شرکت بیمه گذار</li>
              <li>شماره بیمه تامین اجتماعی فرد</li>
              <li>شماره موبایل فرد</li>
              <li>شماره شبای فرد</li>
            </ul>
          </div>
        )}
        <SubmitBtn loading={submitLoading} />
      </Form>
    </>
  );
};

export default withRouter(PersonIntroductionLetter);
