import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import MobileInsuranceHeader from "components/layouts/mobileInsurance/MobileInsuranceHeader";
import { Steps, Form, Modal, Spin, message } from "antd";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import colors from "utils/colors";
import { setBirthPlace } from "pages/persons/realPerson/common/_helpers";
import { convertDateToENProper } from "_helpers";
import BottomButtons from "modules/personnel/insurance/mobileInsuranceContracts/components/BottomButtons";
import * as fields from "modules/personnel/insurance/mobileInsuranceContracts/common/formItems";
import UploadDocuments from "./UploadDocuments";

import { uploadSubordinateFiles } from "modules/personnel/insurance/mobileInsuranceContracts/common/api";
import { handleExceptions } from "modules/personnel/insurance/mobileInsuranceContracts/common/exceptions";
import { ADD_SUBORDINATE, GET_PERSON, UPDATE_SUBORDINATE } from "../utils/api";
const { Step } = Steps;

const SubordinateAdd = (props) => {
  // get files from the context

  const history = useHistory();
  const params = useParams();
  const [form] = useForm();
  const [step, setStep] = useState(0);
  const [allFilled, setAllFilled] = useState(true);
  const [showInsuranceNumField, setShowInsuranceNumField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [subordinateForm, setSubordinateForm] = useState({
    values: {},
    files: [],
  });

  const getData = async () => {
    setLoading(true);
    try {
      const res = await GET_PERSON(params.id);
      console.log(res);
      setUser(res.data);
    } catch (error) {}

    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleChange = (values, allValues) => {
    if (allValues.sponsorship_status !== "non_dependent") {
      delete allValues.insurance_number;
      setShowInsuranceNumField(false);
    } else {
      setShowInsuranceNumField(true);
    }
    if (allValues.national_code) {
      if (setBirthPlace(allValues.national_code)) {
        form.setFieldsValue({
          issue_place: setBirthPlace(allValues.national_code),
        });
      }
    } else if (allValues.national_code === "") {
      form.setFieldsValue({
        issue_place: "",
      });
    }

    if (values.birth_date || values.national_code) {
      let year;
      if (allValues.birth_date) {
        year = allValues.birth_date.split("/")[0];
      }
      if (
        year &&
        allValues.national_code &&
        allValues.national_code.length === 10
      ) {
        if (parseFloat(year) >= 1368) {
          form.setFieldsValue({
            id_number: allValues.national_code,
          });
        }
      }
    }

    if (values.relation) {
      if (values.relation === "daughter" || values.relation === "son") {
        form.setFieldsValue({
          last_name: user.last_name,
          father_name: user.first_name,
          first_name: "",
        });
      } else if (values.relation === "father") {
        form.setFieldsValue({
          last_name: user.last_name,
          father_name: "",
          first_name: user.father_name,
        });
      } else {
        form.setFieldsValue({
          last_name: "",
          father_name: "",
          first_name: "",
        });
      }
    }
  };

  const handleOnFinish = () => {
    setSubordinateForm({ files: [], values: form.getFieldsValue() });
    setStep(1);
  };

  const goBack = () => {
    setSubordinateForm({ ...subordinateForm, files: [] });
    setStep(0);
  };

  const handleSecondStep = () => {
    const formValues = subordinateForm.values;

    if (formValues.birth_date) {
      formValues.birth_date = convertDateToENProper(formValues.birth_date);
    }

    console.log("form values:", formValues);

    if (formValues) {
      let action = ADD_SUBORDINATE;
      // if (props.edit) {
      //   action = UPDATE_SUBORDINATE;
      // }
      setLoading(true);

      action(params.id, formValues)
        .then((res) => {
          if (subordinateForm.files.length) {
            uploadImages(res.data.identifiers[0].id, subordinateForm.files);
          } else {
            setLoading(false);
            Modal.success({
              title: "تبعی جدید با موفقیت ساخته شد",
              content: "بعد از بررسی و تایید توسط ادمین ثبت نهایی خواهد شد",
              onOk: () => history.goBack(),
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          handleExceptions(err);
        });
    }
  };

  // upload images if any image, called only in the above function
  async function uploadImages(personId, files) {
    if (personId) {
      try {
        for (let file of files) {
          const formData = new FormData();
          formData.append("subordinateId", personId);
          formData.append("file", file.originFileObj);

          await uploadSubordinateFiles(formData);
        }

        setLoading(false);
        Modal.success({
          title: "تبعی جدید با موفقیت ساخته شد",
          content: "بعد از بررسی و تایید توسط ادمین ثبت نهایی خواهد شد",
          onOk: () => history.goBack(),
        });
      } catch (err) {
        setLoading(false);
        notifyUploadFailure();
      }
    } else {
      notifyUploadFailure();
    }
  }

  function notifyUploadFailure() {
    Modal.warn({
      title: "آپلود تصاویر ناموفق بود",
      content:
        "فرد تبعی ساخته شد اما آپلود تصاویر ناموفق بود، لطفا با پشتیبانی تماس بگیرید",
      onOk: () => history.goBack(),
    });
  }

  function handleBack() {
    if (step === 1) {
      setStep(0);
    } else {
      history.goBack();
    }
  }

  return (
    <Spin spinning={loading}>
      <StyledSubForm className="fade-in w-100">
        <MobileInsuranceHeader title="تعریف تبعی جدید" onBack={handleBack} />

        <div className="px-1 mt-1">
          <Steps current={step} className="custom-steps">
            <Step key={0} title="اطلاعات اولیه" />
            <Step key={1} title="بارگذاری مدارک" />
          </Steps>
        </div>
      </StyledSubForm>

      {step === 0 ? (
        <Form
          form={form}
          name="signup"
          onFinish={handleOnFinish}
          onValuesChange={handleChange}
          className="my-3 px-3"
          style={{ paddingBottom: "56px" }}
        >
          <fields.Relation />
          <fields.Name />
          <fields.LastName />
          <fields.FatherName />
          <fields.BirthDate useForm={form} />
          <fields.NID />
          <fields.IdentityNum />
          <fields.IssuePlace />
          <fields.SupportStatus />
          {showInsuranceNumField && <fields.InsuranceNum />}
        </Form>
      ) : (
        <UploadDocuments
          subordinateForm={subordinateForm}
          setSubordinateForm={setSubordinateForm}
        />
      )}

      <BottomButtons
        disabled={!allFilled}
        verifyText={step === 0 ? "مرحله بعد" : "ثبت"}
        onSave={step === 0 ? form.submit : handleSecondStep}
        onCancel={step === 1 && goBack}
        variant="successFilled"
      />
    </Spin>
  );
};

// css
const StyledSubForm = styled.div`
  .custom-steps {
    .ant-steps-item-title {
      font-size: 14px;
    }
    .ant-steps-icon {
      display: block;
      margin-top: 9px;
    }
  }

  .ant-form-item {
    margin-bottom: 14px;
  }

  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background-color: ${colors.success};
      border-color: ${colors.success};
      .ant-steps-icon {
        color: white;
      }
    }
  }

  .ant-steps-item-title::after {
    background-color: ${colors.success} !important;
  }
`;

export default SubordinateAdd;
