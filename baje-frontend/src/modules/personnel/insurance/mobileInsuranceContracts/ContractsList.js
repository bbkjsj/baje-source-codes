import React, { useContext, useEffect, useState } from "react";
import InsuranceItem from "./components/InsuranceItem";
import MobileInsuranceHeader from "components/layouts/mobileInsurance/MobileInsuranceHeader";
import { Modal, Spin } from "antd";
import { getUserInsurancesList } from "./common/api";
import { handleExceptions } from "./common/exceptions";
import ChooseInsuranceModal from "./components/ChooseInsuranceModal";
import { InsuranceWizardContext } from "./contexts/InsuranceWizardContext";

const InsuranceContractsList = () => {
  const [loading, setLoading] = useState(true);
  const [insurances, setInsurances] = useState([]);
  const [chooseContractModal, setChooseContractModal] = useState(false);
  const {
    setSelectedPeople,
    selectedPeople,
    selectedInsurance,
    setSelectedInsurance,
  } = useContext(InsuranceWizardContext);

  function hasApproved() {
    let anyApproved = false;
    if (insurances && insurances.length) {
      anyApproved = insurances.some((insurance) => insurance.is_approved == 1);
    }
    return anyApproved;
  }

  function getData() {
    setLoading(true);
    getUserInsurancesList()
      .then((response) => {
        setLoading(false);
        if (response) {
          setInsurances(response?.data?.response);
        } else {
          handleExceptions();
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }

  useEffect(() => {
    setSelectedPeople({ person: null, subordinates: [] });

    setSelectedInsurance(null);

    getData();
  }, []);

  let insuranceItems;

  if (insurances.length) {
    insuranceItems = insurances.map((item, idx) => (
      <InsuranceItem key={item.id} data={item} idx={idx} />
    ));
  }

  return (
    <>
      <div className="fade-in w-100">
        <MobileInsuranceHeader
          title="بیمه های تکمیلی من"
          showPlus={!loading}
          hasApproved={hasApproved()}
          onPlusOk={() => setChooseContractModal(true)}
        />
        <Spin spinning={loading}>
          {insurances.length ? (
            <div className="insurance-items">{insuranceItems}</div>
          ) : (
            !loading && <p className="text-center">هیچ لیست بیمه ای یافت نشد</p>
          )}
        </Spin>
      </div>

      <Modal
        visible={chooseContractModal}
        onCancel={() => setChooseContractModal(false)}
        footer={null}
        title="انتخاب قرارداد"
        width={720}
      >
        <ChooseInsuranceModal
          visible={chooseContractModal}
          onCancel={() => setChooseContractModal(false)}
          userInsurances={insurances}
        />
      </Modal>
    </>
  );
};

export default InsuranceContractsList;
