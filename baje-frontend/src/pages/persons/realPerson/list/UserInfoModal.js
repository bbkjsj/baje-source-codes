import React from "react";
import { Modal } from "antd";
import ContactForm from "modules/personnel/realPerson/users/components/ContactForm";
import BankAccountInfo from "modules/personnel/realPerson/users/components/BankAccountInfo";
import DocumentForm from "modules/personnel/realPerson/users/components/DocumentForm";
import UserAccountForm from "modules/personnel/realPerson/users/components/UserAccountForm";
import InsuranceInfoForm from "modules/personnel/realPerson/users/components/InsuranceInfoForm";
import OtherInfoForm from "modules/personnel/realPerson/users/components/OtherInfoForm";
import AccessLevelsForm from "modules/personnel/realPerson/users/components/AccessLevelsForm/AccessLevelsForm";
import { additionalTypes } from "../constant";

export default function UserInfoModal({
  additionalInfoModal,
  setAdditionalInfoModal,
  userID,
}) {
  const Modaltitle = () => {
    switch (additionalInfoModal) {
      case additionalTypes.CONTACT:
        return "اطلاعات تماس";

      case additionalTypes.DOCUMENTS:
        return "اسناد";

      case additionalTypes.INSURANCE_INFO:
        return "بیمه";

      case additionalTypes.OTHER_INFO:
        return "متفرقه";

      case additionalTypes.USER_ACCOUNT:
        return "اطلاعات کاربری";

      case additionalTypes.BANK_ACCOUNTS:
        return "اطلاعات بانکی";

      case additionalTypes.ACCESS_LEVEL:
        return "سطوح دسترسی ";

      default:
        break;
    }
  };
  return (
    <>
      {additionalInfoModal ? (
        <Modal
          visible={additionalInfoModal}
          title={Modaltitle()}
          onCancel={() => setAdditionalInfoModal(0)}
          footer={null}
          width={"80%"}
        >
          {additionalInfoModal == additionalTypes.CONTACT ? (
            <ContactForm
              onCancel={() => setAdditionalInfoModal(0)}
              ID={userID}
            />
          ) : additionalInfoModal == additionalTypes.BANK_ACCOUNTS ? (
            <BankAccountInfo
              ID={userID}
              onCancel={() => setAdditionalInfoModal(0)}
            />
          ) : additionalInfoModal == additionalTypes.DOCUMENTS ? (
            <DocumentForm
              ID={userID}
              onDone={() => {
                setAdditionalInfoModal(false);
              }}
              onCancel={() => setAdditionalInfoModal(0)}
            />
          ) : additionalInfoModal == additionalTypes.ACCESS_LEVEL ? (
            <AccessLevelsForm
              visible={additionalInfoModal}
              ID={userID}
              setVisible={setAdditionalInfoModal}
              onCancel={() => setAdditionalInfoModal(0)}
            />
          ) : additionalInfoModal == additionalTypes.USER_ACCOUNT ? (
            <UserAccountForm
              ID={userID}
              onCancel={() => setAdditionalInfoModal(0)}
            />
          ) : additionalInfoModal == additionalTypes.INSURANCE_INFO ? (
            <InsuranceInfoForm
              ID={userID}
              onCancel={() => setAdditionalInfoModal(0)}
            />
          ) : additionalInfoModal == additionalTypes.OTHER_INFO ? (
            <OtherInfoForm
              ID={userID}
              onCancel={() => setAdditionalInfoModal(0)}
            />
          ) : null}
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
