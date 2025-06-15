import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Form, Row, Col, Divider, Descriptions, message } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { priceNormalizer, convertDateToENProper } from "_helpers";
import LoadingLogo from "components/general/LoadingLogo";
import AppButton from "components/general/AppButton";
import AddInsuranceNumber from "./AddInsuranceNumber";
import OtherCompany from "./OtherCompany";
import FormHeader from "./FormHeader";
import * as FormItem from "./newFormItems";
import { useGetPersonFormData } from "../utils/hooks";
import { getSingleRealPerson } from "modules/personnel/realPerson/utils/API";
import {
  updateMonthlySalary,
  updateSalaryBenefitInclude,
} from "../utils/index";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

function NewForm({
  mode,
  pageTitle,
  mainForm,
  submitForm,
  //
  modalVisible,
  setModalVisible,
  mainId,
  initialData,
}) {
  const {
    loading,
    insuranceGeneral,
    annual,
    companyPersonnel,
    insuredList,
    monthlySalary,
    setMonthlySalary,
    salaryBenefitInclude,
    setSalaryBenefitInclude,
    firstRender,
    setFirstRender,
    defaultPerson,
    defaultJob,
    selectedJob,
    setSelectedJob,
    insuredShare,
    employerShare,
    joblessShare,
    hardJobShare,
    totalShare,
    setInsuredShare,
    setEmployerShare,
    setJoblessShare,
    setHardJobShare,
    setTotalShare,
    member,
    setMember,
  } = useGetPersonFormData(mainForm, mode, initialData, modalVisible);
  const routeParams = useParams();
  const history = useHistory();
  const disableForm = mode == "detail";
  const disablePerson = mode != "add";

  const [shouldExit, setShouldExit] = useState(true);
  const [nextBtnLoading, setNextBtnLoading] = useState(false);
  const [exitBtnLoading, setExitBtnLoading] = useState(false);

  const [personEdit, setPersonEdit] = useState(false);

  const [otherCompanyVisible, setOtherCompanyVisible] = useState(false);
  const [insuranceNumberVisible, setInsuranceNumberVisible] = useState(false);

  const changeFieldHandler = (changed, allValues) => {
    const vals = {};
    changed.forEach((i) => {
      vals[i.name[0]] = i.value;
    });

    if (!firstRender) {
      if (
        vals.hasOwnProperty("total_work_day") ||
        vals.hasOwnProperty("daily_salary")
      ) {
        updateMonthlySalary(mainForm, setMonthlySalary);
      } else if (vals.hasOwnProperty("include_benefit")) {
        updateSalaryBenefitInclude(
          mainForm,
          monthlySalary,
          setSalaryBenefitInclude
        );
      }
    }
  };

  const PersonIsnotInsured = (data) => {
    return insuredList.indexOf(data.id) === -1;
  };

  const changePersonHandler = (data) => {
    if (mode != "add" && firstRender) {
      setFirstRender(false);
      return;
    }
    if (PersonIsnotInsured(data)) {
      //newMember :
      setMember(data);
      if (data?.job_code && data?.job_id) {
        mainForm.setFieldsValue({
          job: data.job_code,
          job_code: data.job_code,
        });

        if (window.checkJobCode) {
          setTimeout(() => window.checkJobCode(), 100);
        }
      } else {
        mainForm.setFieldsValue({
          job: null,
          job_code: null,
        });
      }

      if (companyPersonnel.indexOf(data.id) == -1) {
        setOtherCompanyVisible(true);
      } else if (!data.insurance_number) {
        setInsuranceNumberVisible(true);
      }
    } else {
      message.error("این کاربر قبلا در لیست بیمه ثبت شده است");
      resetPerson();
    }
  };

  const resetPerson = () => {
    mainForm.setFieldsValue({
      personnel_id: null,
      person_name: null,
      personnel_national_code: null,
    });
    setMember(null);
    setPersonEdit(true);
  };

  const onCancle = () => {
    resetPerson();
    setOtherCompanyVisible(false);
  };
  const onOk = () => {
    if (!member.insurance_number) {
      setInsuranceNumberVisible(true);
    }
    setOtherCompanyVisible(false);
  };

  const changeJobHandler = (data) => {
    if (data?.id) {
      setSelectedJob(data.id);
    } else setSelectedJob(null);
  };

  const preparePayload = (params) => {
    // const body = {};

    const body = {
      insurance_id: routeParams.id,
      personnel_id: params.personnel_id,
      total_work_day: params.total_work_day,
      daily_salary: params.daily_salary,
      monthly_salary: monthlySalary,
      include_benefit: params.include_benefit,
      salary_benefit_include: salaryBenefitInclude,
      salary_benefit_include_notinclude:
        params.salary_benefit_include_notinclude,
      insured_share: insuredShare,
      employer_share: employerShare,
      jobless_share: joblessShare,
      hard_job_share: hardJobShare,
      total_share: totalShare,
      job_id_fk: selectedJob,
      description: params.description,
    };
    if (params.start_date) {
      body.start_date = convertDateToENProper(params.start_date);
    }
    if (params.end_date) {
      body.end_date = convertDateToENProper(params.end_date);
    }
    return body;
  };

  const submitAndNext = () => {
    setShouldExit(false);
    mainForm.submit();
  };

  const submitAndExit = () => {
    setShouldExit(true);
    mainForm.submit();
  };

  const OnFinishHandler = (values) => {
    console.log(values, "!values");
    const body = preparePayload(values);
    submitForm(
      body,
      member,
      selectedJob,
      shouldExit,
      setExitBtnLoading,
      setNextBtnLoading,
      history,
      setModalVisible,
      mainId
    );
  };

  const calculateStates = (factor) => {
    const insuredCutValue = Math.ceil(
      salaryBenefitInclude * 0.07 * (factor.employee ? factor.employee : 0)
    );
    const employerCutValue = Math.ceil(
      salaryBenefitInclude * 0.2 * (factor.employer ? factor.employer : 0)
    );
    const unemploymentCutValue = Math.ceil(
      salaryBenefitInclude *
        0.03 *
        (factor.unemployment ? factor.unemployment : 0)
    );
    const hardCutValue = Math.ceil(
      salaryBenefitInclude * 0 * (factor.harmful ? factor.harmful : 0)
    );

    setInsuredShare(insuredCutValue);
    setEmployerShare(employerCutValue);
    setJoblessShare(unemploymentCutValue);
    setHardJobShare(hardCutValue);
    setTotalShare(
      parseFloat(
        insuredCutValue + employerCutValue + unemploymentCutValue + hardCutValue
      )
    );
  };
  const updateInsuranceShare = () => {
    // console.log("!up-share");
    if (member?.id) {
      getSingleRealPerson(member.id)
        .then((res) => {
          const {
            insurance_share_employee,
            insurance_share_employer,
            insurance_share_harmful,
            insurance_share_unemployment,
          } = res.data;

          const newFactors = {
            employee: insurance_share_employee,
            employer: insurance_share_employer,
            harmful: insurance_share_harmful,
            unemployment: insurance_share_unemployment,
          };

          calculateStates(newFactors);
        })
        .catch((error) => {
          message.error("دریافت اطلاعات کاربر با مشکل مواجه شده است!");
        });
    } else {
      calculateStates({
        employee: 0,
        employer: 0,
        harmful: 0,
        unemployment: 0,
      });
    }
  };

  useEffect(() => {
    // console.log(mainForm.getFieldsValue(), "!main");

    if (!firstRender) {
      updateSalaryBenefitInclude(
        mainForm,
        monthlySalary,
        setSalaryBenefitInclude
      );
    }
  }, [monthlySalary]);

  useEffect(() => {
    if (!firstRender) {
      updateInsuranceShare();
    }
  }, [member, salaryBenefitInclude]);

  if (loading) {
    return <LoadingLogo />;
  }
  return (
    <>
      <FormHeader
        information={insuranceGeneral}
        mode={mode}
        pageTitle={pageTitle}
      />
      <Form
        {...formItemLayout}
        form={mainForm}
        onFinish={OnFinishHandler}
        onFieldsChange={changeFieldHandler}
      >
        <Row>
          <FormItem.Person
            useForm={mainForm}
            setPerson={changePersonHandler}
            edit={personEdit}
            defaultValue={defaultPerson}
            disabled={disablePerson}
          />
          <FormItem.StartDate
            useForm={mainForm}
            insurance={insuranceGeneral}
            disabled={disableForm}
          />
          <FormItem.EndDate
            useForm={mainForm}
            insurance={insuranceGeneral}
            disabled={disableForm}
          />
          <FormItem.Job
            useForm={mainForm}
            onChange={changeJobHandler}
            defaultValue={defaultJob}
            disabled={disableForm}
          />
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Row>
              <Col xs={12} sm={4} md={4} lg={4} xl={4}>
                روز کارکرد:
              </Col>
              <FormItem.TotalWorkDay
                insurance={insuranceGeneral}
                disabled={disableForm}
              />
            </Row>
            <Row>
              <Col
                xs={24}
                sm={10}
                md={10}
                lg={10}
                xl={10}
                className="flex justify-end mb-3 "
              >
                <CloseOutlined />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={4} md={4} lg={4} xl={4}>
                <span> دستمزد روزانه:</span>
              </Col>
              <FormItem.DailySalary disabled={disableForm} />
            </Row>

            <Divider />
            <Row style={{ color: "green" }}>
              <Col xs={12} sm={8} md={8} lg={8} xl={8}>
                <span>دستمزد ماهانه:</span>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={16}>
                {priceNormalizer(monthlySalary.toString())}
              </Col>
            </Row>
            <Row>
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className="flex justify-end mb-3 "
              >
                <PlusOutlined />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <span> مزایای مشمول :</span>
              </Col>

              <FormItem.IncludeBenefit
                insurance={insuranceGeneral}
                disabled={disableForm}
              />
            </Row>

            <Divider />
            <Row>
              <Col xs={12} sm={8} md={8} lg={8} xl={8}>
                <span> دستمزد و مزایای مشمول:</span>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={16}>
                {priceNormalizer(salaryBenefitInclude.toString())}
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                <span> دستمزد و مزایای مشمول و غیر مشمول:</span>
              </Col>

              <FormItem.SalaryIncludeNotInclude disabled={disableForm} />
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Descriptions
              column={1}
              style={{
                backgroundColor: "rgb(243,243,244)",
                borderRadius: "2px",
              }}
            >
              <Descriptions.Item label="سهم بیمه شده">
                {priceNormalizer(insuredShare.toString())}
              </Descriptions.Item>
              <Descriptions.Item label="سهم کارفرما">
                {priceNormalizer(employerShare.toString())}
              </Descriptions.Item>
              <Descriptions.Item label="سهم بیمه بیکاری">
                {priceNormalizer(joblessShare.toString())}
              </Descriptions.Item>
              <Descriptions.Item label="سهم مشاغل سخت">
                {priceNormalizer(hardJobShare.toString())}
              </Descriptions.Item>
              <Divider />
              <Descriptions.Item
                labelStyle={{ color: "red" }}
                contentStyle={{ color: "red" }}
                label="جمع حق بیمه"
              >
                {priceNormalizer(totalShare.toString())}
              </Descriptions.Item>
            </Descriptions>
            <FormItem.Description />
          </Col>
        </Row>

        <Col
          span={24}
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <AppButton
            variant="primary"
            style={{ margin: " 0 10px" }}
            size="large"
            id="submit"
            onClick={submitAndNext}
            loading={nextBtnLoading}
            hidden={mode != "add"}
          >
            ثبت و بعدی
          </AppButton>
          <AppButton
            variant="success"
            size="large"
            onClick={submitAndExit}
            loading={exitBtnLoading}
            hidden={disableForm}
          >
            ثبت و خروج
          </AppButton>
        </Col>
      </Form>

      {/*modals here:  */}

      <OtherCompany
        visible={otherCompanyVisible}
        onCancle={onCancle}
        onOk={onOk}
      />
      <AddInsuranceNumber
        visible={insuranceNumberVisible}
        setVisible={setInsuranceNumberVisible}
        id={member?.id}
      />
    </>
  );
}

export default NewForm;
