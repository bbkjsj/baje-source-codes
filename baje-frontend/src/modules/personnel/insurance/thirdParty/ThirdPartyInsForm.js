import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, message, Row, Spin, Input, notification, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT, _GET } from "./utils/api";
import { convertDateToISO8601, covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { pageNames } from "constant";
import { useSelector } from "react-redux";

import qs from "query-string";
import AppButton from "components/general/AppButton";
import InquiryModal from "./components/InquiryModal";
import useWhoAmI from "hooks/useWhoAmI";

export const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

function ThirdPartyInsForm({ updating }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("ایجاد بیمه شخص ثالث");
  const [person, setPerson] = useState();
  const [receiverPerson, setReceiverPerson] = useState();
  const user = useWhoAmI();
  const [defaultCode, setDefaultCode] = useState(
    !updating ? user.nationalCode : null
  );
  const [defaultInsurer, setDefaultInsurer] = useState();
  const [defaultCompanyInsurer, setDefaultCompanyInsurer] = useState();
  const [machine, setMachine] = useState();
  const [insurerMode, setInsurerMode] = useState("person");
  const [
    defaultInsuranceIdentification,
    setDefaultInsuranceIdentification,
  ] = useState("");
  const [externalModal, setExternalModal] = useState(false);
  const [machineSpecificCode, setMachineSpecificCode] = useState();
  const [list, setList] = useState([]);
  const superAdminCheck = useSuperAdminCheck();
  const toDateRef = useRef();
  const location = useLocation();

  const listLegal = user?.companies;

  // post data
  const handleOnFinish = (params) => {
    const body = {
      deliverToPersonnelId: params?.deliverToPersonnelId,
      description: params?.description || " ",
      fromDate: convertDateToISO8601(params.fromDate),
      toDate: convertDateToISO8601(params.toDate),
      insurance: params?.insurance,
      insuranceIdentification: params?.insuranceIdentification,
      insuranceCompanyId: params?.insuranceCompanyId,
      insuranceNumber: params?.insuranceNumber,
      noDamageHistory: params?.noDamageHistory,
    };

    // optional info
    if (params.maxCommitmentDriver) {
      body.maxCommitmentDriver = params.maxCommitmentDriver;
    }
    if (params.maxCommitmentFinancialDamages) {
      body.maxCommitmentFinancialDamanges =
        params.maxCommitmentFinancialDamages;
    }
    if (params.maxCommitmentInjury) {
      body.maxCommitmentInjury = params.maxCommitmentInjury;
    }
    if (params.insurerCompanyId && insurerMode === "company") {
      body.insurerCompanyId = params.insurerCompanyId;
    } else if (params.insurerPersonnelId && insurerMode === "person") {
      body.insurerPersonnelId = params.insurerPersonnelId;
    } else {
      Modal.error({
        content: "لطفا بیمه گذار را انتخاب و بررسی نمایید",
      });
      return;
    }

    if (params.file && params?.file[0]) {
      body.file = params?.file[0]?.originFileObj;
    }

    // Machine
    if (machine?.id && machine?.organization_code) {
      body.machineOrganizationCode = machine.organization_code;
      body.vehicleId = machine.id;
    } else {
      Modal.error({
        content: "لطفا یک کد سازمانی ماشین معتبر وارد کنید و آن را بررسی کنید",
      });
      return;
    }

    // Insurance Company Validation

    if (body.insuranceCompanyId) {
      const findInsuranceCompany = listLegal.find(
        (i) => i.id == body.insuranceCompanyId
      );
      if (!findInsuranceCompany) {
        Modal.error({
          content: "شرکت بیمه گر وارد شده در سامانه موجود نیست",
        });
        return;
      }
    }

    const formData = new FormData();

    for (let key in body) {
      formData.append(key, body[key]);
    }

    // send request
    let request;
    if (updating) {
      request = () => _PUT(routeParams.id, formData);
    } else {
      request = () => _POST(formData);
    }

    setBtnLoading(true);
    request()
      .then((res) => {
        setBtnLoading(false);
        if (res) {
          notification.success({
            message: "با موفقیت ثبت شد",
          });

          setTimeout(
            () =>
              history.push(pageNames.personnel.insurance.thirdPartyIns.list),
            1000
          );
        } else {
          notification.error({
            message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
          });
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
        });
        setBtnLoading(false);
      });
  };

  useEffect(() => {
    if (!updating) {
      handleListBasedInitialValues(machine);
    }
  }, [machine]);

  // get initial values if is updating
  useEffect(() => {
    if (updating) {
      setPageTitle("ویرایش بیمه شخص ثالث");

      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          if (res) {
            const data = res?.data;
            setDefaultCode(data?.deliverToPersonnelId);
            const defaultData = {
              deliverToPersonnelId: data?.deliverToPersonnelId,
              description: data?.description,
              fromDate: covetFormatDateToFA(data.fromDate),
              toDate: covetFormatDateToFA(data.toDate),
              insurance: data?.insurance,
              insuranceIdentification: data?.insuranceIdentification,
              insuranceCompanyId: data?.insuranceCompanyId,
              insuranceNumber: data?.insuranceNumber,
              noDamageHistory: data?.noDamageHistory,
              maxCommitmentDriver: data?.maxCommitmentDriver,
              maxCommitmentFinancialDamages:
                data?.maxCommitmentFinancialDamages,
              maxCommitmentInjury: data?.maxCommitmentInjury,
              machineOrganizationCode: data?.machineOrganizationCode,
            };

            // machine
            setMachine({
              organization_code: data?.machineOrganizationCode,
              id: data?.vehicleId,
              type: data?.typeTitle,
              system: data?.systemTitle,
              style: data?.styleTitle,
            });

            // other info
            if (data.insurerCompanyId) {
              setInsurerMode("company");
              defaultData.insurerCompanyId = data.insurerCompanyId;
              setDefaultCompanyInsurer(data.insurerCompanyId);
            } else if (data.insurerPersonnelId) {
              setInsurerMode("person");
              defaultData.insurerPersonnelId = data.insurerPersonnelId;
              setDefaultInsurer(data.insurerPersonnelId);
            }
            mainForm.setFieldsValue(defaultData);
            setDefaultInsuranceIdentification(data?.insuranceIdentification);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          notification.error({
            message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
          });
        });
    } else {
      // set default machine if code qs is available and not updating
      const queryParams = qs.parse(location.search);
      if (queryParams.machineOrganizationCode) {
        mainForm.setFieldsValue({
          machineOrganizationCode: queryParams.machineOrganizationCode,
        });
        setMachineSpecificCode(queryParams.machineOrganizationCode);
      }
      getList();
    }
  }, []);

  // set end date on start date change
  function handleStartDateChange(date) {
    if (typeof date === "string") {
      const toArr = date.split("/");
      if (toArr.length === 3) {
        const oneYearLater = `${Number(toArr[0]) + 1}/${toArr[1]}/${toArr[2]}`;
        mainForm.setFieldsValue({ toDate: oneYearLater });
        toDateRef.current.focus();
      }
    }
  }

  function handleFormChange(val) {
    if (val && val.fromDate) {
      if (val.fromDate.length === 10 && !val.fromDate.includes("_")) {
        handleStartDateChange(val.fromDate);
      }
    }
  }

  // get list and set list based default values
  function getList() {
    setLoading(true);

    _GET()
      .then((res) => {
        setLoading(false);
        setList(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  function handleListBasedInitialValues(mach) {
    // set no damage and from date to no damage and to date of the most recent record for this machine
    if (mach && mach?.organization_code && list && list?.length) {
      // find
      let sortedList = list.filter(
        (i) => i.machineOrganizationCode == mach?.organization_code
      );

      if (sortedList?.length) {
        sortedList = sortedList.sort(function (a, b) {
          return new Date(b.toDate) - new Date(a.toDate);
        });

        // set dates based on previous insurance
        const found = sortedList[0];

        if (found) {
          const newFromDate = covetFormatDateToFA(found.toDate);
          const toArr = newFromDate.split("/");
          if (toArr.length === 3) {
            const oneYearLater = `${Number(toArr[0]) + 1}/${toArr[1]}/${
              toArr[2]
            }`;
            mainForm.setFieldsValue({
              fromDate: newFromDate,
              toDate: oneYearLater,
            });
          }

          // get and set nodamagehistory of prev
          _GET_ITEM(found.id)
            .then((res) => {
              const noDamage = res?.data?.noDamageHistory;
              if (noDamage) {
                mainForm.setFieldsValue({
                  noDamageHistory: Number(noDamage) + 1,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={pageTitle}
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه های شخص ثالث",
            link: pageNames.personnel.insurance.thirdPartyIns.list,
          },
          { text: pageTitle },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        onValuesChange={handleFormChange}
        validateTrigger={"onChange"}
        style={{}}
      >
        <Spin spinning={loading}>
          {loading ? (
            ""
          ) : (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <fields.MachineSelector
                machine={machine}
                setMachine={setMachine}
                form={mainForm}
                setInsurerMode={setInsurerMode}
                setDefaultInsurer={setDefaultInsurer}
                updating={updating}
                machineSpecificCode={machineSpecificCode}
              />
              <fields.InsuranceNumber
                defaultValue={defaultInsuranceIdentification}
                onInquiryButton={() => setExternalModal(true)}
                machine={machine}
              />
              <fields.InsuranceLetterNumber />
              <fields.InsurerCompanyID />
              <fields.Insurer
                useForm={mainForm}
                setPerson={setPerson}
                defaultValue={defaultInsurer}
                defaultCompanyValue={defaultCompanyInsurer}
                button={superAdminCheck()}
                insurerMode={insurerMode}
                setInsurerMode={setInsurerMode}
              />
              <fields.StartDate
                useForm={mainForm}
                onChange={handleStartDateChange}
              />
              <fields.EndDate useForm={mainForm} ref={toDateRef} />
              <fields.DamageHistory />
              <fields.InsuranceRight />
              <fields.MaxInsPerAccident />
              <fields.MaxInsPerCasualty />
              <fields.MaxInsDriver />
              <fields.InsuranceReceiver
                useForm={mainForm}
                setPerson={setReceiverPerson}
                defaultValue={defaultCode}
                button={superAdminCheck()}
              />
              <fields.InsuranceLetterScan />
              <fields.Description />
              <SubmitBtn loading={btnLoading} />
            </Row>
          )}
        </Spin>
      </Form>

      {externalModal && (
        <InquiryModal
          title="استعلام بیمه شخص ثالث"
          visible={externalModal}
          handleCancel={() => setExternalModal(false)}
          form={mainForm}
          machine={machine}
          setInsurerMode={setInsurerMode}
          setDefaultInsurer={setDefaultInsurer}
          setDefaultCompanyInsurer={setDefaultCompanyInsurer}
          setDefaultInsuranceIdentification={setDefaultInsuranceIdentification}
        />
      )}
    </>
  );
}

export default ThirdPartyInsForm;
