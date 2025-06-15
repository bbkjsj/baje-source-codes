import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Row } from "antd";
import * as FormItems from "./components/formItems";
import { nations } from "./utils/const";
import {
  handleSetIDNumber,
  checkDuplicateHandher,
  ValidateNationalNumberFormat,
  handleSetIssuePlace,
  UpdateUser,
  getUser,
} from "./utils/index";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import SubmitBtn from "components/general/SubmitBtn";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import LoadingLogo from "components/general/LoadingLogo";
import { convertDateToEN, covetFormatDateToFA } from "_helpers";
import AppButton from "components/general/AppButton";

export default function AddPerson() {
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [iranian, setIranian] = useState(true);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [nationalNumberInfo, setNationalNumberInfo] = useState({
    lenght: 10,
    label: "کدملی",
  });
  const [hasNationalNumber, setHasNationalNumber] = useState(false);

  const validator = async (event) => {
    try {
      // check valid number format
      await ValidateNationalNumberFormat(event, form);

      // check user is exist on DB
      const res = await checkDuplicateHandher(event, form);

      if (!res) {
        // find issue_place from national_number
        handleSetIssuePlace(event.target.value, form);

        // set IdNumber for year > 1368
        handleSetIDNumber(form);
      }
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
    handleSetIDNumber(form);
  };

  const submitForm = (values) => {
    const payload = {
      ...values,
      birth_date: convertDateToEN(values.birth_date),
    };
    UpdateUser(payload, params.id, setBtnLoading, history);
  };

  useEffect(() => {
    const id = params.id;
    setLoading(true);

    getUser(id)
      .then((data) => {
        console.log(data);
        data.birth_date = covetFormatDateToFA(data.birth_date);

        if (data?.national_number?.length) {
          setHasNationalNumber(true);
        }

        form.setFieldsValue(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title=" افرادحقیقی - ویرایش"
        breadcrumbItems={[
          {
            text: " افراد حقیقی",
            link: pageNames.personnel.realPerson.list,
          },
          { text: "اطلاعات هویتی" },
        ]}
      />
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{ nation: nations.iranian }}
        onFinish={submitForm}
      >
        <Row gutter={formRowGutter}>
          <FormItems.Nation onChange={onChangeNation} />
          <FormItems.NationalNumber
            onChange={onChangeNationalNumber}
            disabled={hasNationalNumber}
            {...nationalNumberInfo}
          />
          <FormItems.BirthDate form={form} onChange={onChangeBirthDate} />
          <FormItems.Sex />
          <FormItems.Name />
          <FormItems.LastName />
          <FormItems.FatherName />
          <FormItems.IDNumber />
          <FormItems.BirthPlace />
          {iranian && <FormItems.IDIssuePlace />}
        </Row>
        <div className="flex mt-4 justify-end">
          <AppButton
            className="big-btn"
            variant="primary"
            size="large"
            htmlType="submit"
          >
            تایید
          </AppButton>
          <AppButton
            className="big-btn mr-1"
            size="large"
            variant="text"
            onClick={() => history.goBack()}
          >
            انصراف
          </AppButton>
        </div>
      </Form>
    </>
  );
}
