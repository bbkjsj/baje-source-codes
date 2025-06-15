import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Row } from "antd";
import * as FormItems from "./components/formItems";
import { nations } from "./utils/const";
import {
  handleSetIDNumber,
  checkDuplicateHandher,
  ValidateNationalNumberFormat,
  handleSetIssuePlace,
  AddUser,
} from "./utils/index";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import SubmitBtn from "components/general/SubmitBtn";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import { useEffect } from "react";
import { findPlaceName } from "../utils";

export default function AddPerson({
  hideBreadCrumb,
  onFinish,
  form,
  nationalNumber,
}) {
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [iranian, setIranian] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nationalNumberInfo, setNationalNumberInfo] = useState({
    lenght: 10,
    label: "کدملی",
  });

  useEffect(() => {
    if (form && form?.getFieldValue("nationalCode")) {
      const cityName = findPlaceName(
        String(form?.getFieldValue("nationalCode"))
      );
      mainForm.setFieldsValue({
        national_number: form.getFieldValue("nationalCode"),
        id_issue_place: cityName,
        birth_place: cityName,
      });
    } else if (nationalNumber) {
      const cityName = findPlaceName(String(nationalNumber));
      mainForm.setFieldsValue({
        national_number: nationalNumber,
        id_issue_place: cityName,
        birth_place: cityName,
      });
    }
  }, [form, nationalNumber, mainForm]);

  const validator = async (event) => {
    try {
      // check user is exist on DB
      //const res = await checkDuplicateHandher(event, mainForm);

      // find issue_place from national_number
      handleSetIssuePlace(event.target.value, mainForm);

      // set IdNumber for year > 1368
      handleSetIDNumber(mainForm);
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const onChangeNationalNumber = (event) => {
    event.persist();
    if (iranian && event.target.value.length > 8) {
      validator(event);
    }
  };

  const onChangeNation = (event) => {
    const val = event.target.value;

    if (val === nations.iranian) {
      setNationalNumberInfo({
        lenght: 10,
        label: "کدملی",
      });
      setIranian(true);
    } else {
      setNationalNumberInfo({
        lenght: 12,
        label: "فیداکد",
      });
      setIranian(false);
    }
  };

  const onChangeBirthDate = () => {
    handleSetIDNumber(mainForm);
  };

  const submitForm = (values) => {
    AddUser(values, setLoading, history, onFinish);
  };

  return (
    <>
      {!hideBreadCrumb ? (
        <>
          <GoBackBtn />
          <ContentTop
            title=" افرادحقیقی - جدید"
            breadcrumbItems={[
              {
                text: " افراد حقیقی",
                link: pageNames.personnel.realPerson.list,
              },
              { text: "اطلاعات هویتی" },
            ]}
          />
        </>
      ) : (
        ""
      )}
      <Form
        form={mainForm}
        {...formItemLayout}
        initialValues={{ nation: nations.iranian }}
        onFinish={submitForm}
      >
        <Row gutter={formRowGutter}>
          <FormItems.Nation onChange={onChangeNation} />
          <FormItems.NationalNumber
            onChange={onChangeNationalNumber}
            form={form}
            {...nationalNumberInfo}
          />
          <FormItems.BirthDate form={mainForm} onChange={onChangeBirthDate} />
          <FormItems.Sex />
          <FormItems.Name />
          <FormItems.LastName />
          <FormItems.FatherName />
          <FormItems.IDNumber />
          <FormItems.BirthPlace />
          {iranian && <FormItems.IDIssuePlace />}
          <SubmitBtn loading={loading} />
        </Row>
      </Form>
    </>
  );
}
