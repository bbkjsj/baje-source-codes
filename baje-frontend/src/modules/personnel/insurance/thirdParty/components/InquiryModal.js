import { Form, Modal, notification, Row, Spin } from "antd";
import FullscreenModal from "components/FullscreenModalModal/FullscreenModal";
import AppButton from "components/general/AppButton";
import React, { useEffect, useState } from "react";
import {
  CaptchaCode,
  InquirerNationalCode,
  InsuranceUniqueNumber,
  InsurerNationalNumber,
} from "../common/formItems";
import { formItemLayout } from "../ThirdPartyInsForm";
import { _GET_CAPTCHA, _POST_INQUIRY } from "../utils/api";
//import response from "./response.js";
import { useSelector } from "react-redux";
import CheckingModal from "./CheckingModal";
import { arePlaquesEqual, matchCompanyIds } from "../utils/helpers";
import { _GET_PERSON } from "modules/personnel/socialInsurance/socialInsurancePersonnel/utils/api";
import { GET_COMPANY_INFO } from "modules/machinery/utils/api";
import useWhoAmI from "hooks/useWhoAmI";

function InquiryModal({
  title,
  visible,
  handleCancel,
  form,
  machine,
  setInsurerMode,
  setDefaultInsurer,
  setDefaultCompanyInsurer,
  setDefaultInsuranceIdentification,
}) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkingModal, setCheckingModal] = useState({
    visible: false,
    plk: null,
    MtrNum: null,
    ShsNum: null,
    vin: null,
  });
  const [saved, setSaved] = useState({
    data: null,
    machineData: null,
  });
  const [captchaResponse, setCaptchaResponse] = useState({
    Result: "",
    Siqniture: "",
  });
  const user = useWhoAmI();

  // set default values
  useEffect(() => {
    getCaptcha();
  }, []);
  useEffect(() => {
    if (visible && form && machine) {
      const vals = form.getFieldsValue();

      mainForm.setFieldsValue({
        UniqPolicyNo: vals?.insuranceIdentification,

        InquirarNationalId: user?.nationalCode,
      });

      // get personnel or company data
      if (machine?.owner_type && machine?.owner_id_fk) {
        setLoading(true);
        const requestInfo =
          machine.owner_type === "personnel" ? _GET_PERSON : GET_COMPANY_INFO;
        requestInfo(machine?.owner_id_fk)
          .then((res) => {
            setLoading(false);
            const data = res?.data;
            if (data?.person?.national_number) {
              mainForm.setFieldsValue({
                NationalCode: data?.person?.national_number,
              });
            } else if (data?.company?.national_id) {
              mainForm.setFieldsValue({
                NationalCode: data?.company?.national_id,
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            console.error(err);
          });
      }
    }
  }, [visible]);

  // submit form
  async function handleOnFinish(params) {
    const formData = new FormData();
    for (let key in params) {
      formData.append(key, params[key]);
    }
    formData.append("ip", null);
    formData.append("hash", captchaResponse.Siqniture);
    try {
      setLoading(true);
      const response = await _POST_INQUIRY(formData);
      const data = response?.data?.[0];
      setLoading(false);
      //const data = response;
      const machineData = JSON.parse(data.Thrname)?.[0];
      console.log("GOT INSURANCE DATA:", { data, machineData });
      setSaved({
        data,
        machineData,
      });

      const plk = machineData?.plk;
      const mtrNum = machineData?.MtrNum;
      const shsNum = machineData?.ShsNum;
      const vin = machineData?.vin;

      // check if our machine data matches received data, otherwise show modal to update machine
      if (
        arePlaquesEqual(plk, machine) &&
        mtrNum == machine?.engine_number &&
        shsNum == machine?.chassis_number &&
        vin == machine?.vin_number
      ) {
        replaceThirdInsFormValues(data, machineData);
      } else {
        setCheckingModal({
          visible: true,
          plk: plk,
          MtrNum: mtrNum,
          ShsNum: shsNum,
          vin: vin,
        });
      }
    } catch (err) {
      setLoading(false);
      console.error("inq error:", err);
      if (err?.response?.data?.ErrorMessage) {
        Modal.error({
          content: err?.response?.data?.ErrorMessage,
        });
      } else {
        Modal.error({
          content:
            "عملیات ناموفق لطفا ورودی های خود را چک کنید و مجدد تلاش کنید",
        });
      }
    }
  }

  async function getCaptcha() {
    const res = await _GET_CAPTCHA();

    setCaptchaResponse(res.data);
  }

  function replaceThirdInsFormValues(data, machineData) {
    form.setFieldsValue({
      insuranceNumber: machineData?.PrntPlcyCmpDocNo,
      fromDate: machineData?.HBgnDte,
      toDate: machineData?.HEndDte,
      noDamageHistory: machineData?.DisPrsnYrNum,
      maxCommitmentDriver: machineData?.PrsnCvrCptl,
      maxCommitmentInjury: machineData?.LfCvrCptl,
      maxCommitmentFinancialDamages: machineData?.FnCvrCptl,
      insurerPersonnelId: data?.NtnlId,
      insuranceIdentification: data?.UnqCod,
      insuranceCompanyId: data.CmpCod
        ? matchCompanyIds(Number(data.CmpCod))
        : "",
    });

    if (data.UnqCod) {
      setDefaultInsuranceIdentification(data.UnqCod);
    }

    if (data?.NtnlId) {
      if (data?.NtnlId.trim().length === 10) {
        setInsurerMode("person");
        setDefaultInsurer(data?.NtnlId.trim());
      } else {
        setInsurerMode("company");
        setDefaultCompanyInsurer(data?.NtnlId.trim());
      }
    }

    mainForm.resetFields();
    handleCancel();
    notification.success({
      message: "اطلاعات دریافت شده در فرم جایگزین شد",
    });
  }

  return (
    <FullscreenModal
      title={title}
      visible={visible}
      handleCancel={handleCancel}
    >
      <Form
        {...formItemLayout}
        form={mainForm}
        name="inquiry"
        onFinish={handleOnFinish}
        validateTrigger={"onChange"}
        style={{}}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <InsuranceUniqueNumber />
            <InsurerNationalNumber />
            <InquirerNationalCode />
            <CaptchaCode />
          </Row>

          <img
            src={`data:image;base64,${captchaResponse.Result}`}
            alt="captcha"
            width={200}
            className="mr-1 d-block"
          />

          <AppButton onClick={getCaptcha} className="my-2" size="small">
            کد امنیتی جدید
          </AppButton>

          <div className="flex mt-4 justify-end">
            <AppButton
              className="big-btn"
              variant="primary"
              size="large"
              htmlType="submit"
            >
              استعلام
            </AppButton>
            <AppButton
              className="big-btn mr-1"
              size="large"
              variant="text"
              onClick={() => handleCancel()}
            >
              انصراف
            </AppButton>
          </div>
        </Spin>
      </Form>

      {checkingModal.visible ? (
        <Modal
          visible={checkingModal.visible}
          title="مغایرت های اطلاعات دریافتی با اطلاعات فعلی ماشین"
          okText="ثبت و ادامه"
          closable
          footer={null}
          width={720}
          onCancel={() => setCheckingModal((s) => ({ ...s, visible: false }))}
        >
          <CheckingModal
            {...checkingModal}
            machine={machine}
            onFinish={() =>
              replaceThirdInsFormValues(saved.data, saved.machineData)
            }
            onCancel={() => setCheckingModal((s) => ({ ...s, visible: false }))}
          />
        </Modal>
      ) : (
        ""
      )}
    </FullscreenModal>
  );
}

export default InquiryModal;
