import React, { useState, useEffect } from "react";
import AppFormItem from "components/general/AppFormItem";
import { Input, Modal } from "antd";
import AppButton from "components/general/AppButton";
import ContractModal from "./ContractsModal";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ContractSelector = ({
  form,
  name,
  officeId,
  contractId,
  disabled,
  hideInput,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  const [contract, setContract] = useState(null);
  const contractList = useSelector((state) => state.contractList);

  useEffect(() => {
    function getContractName(id) {
      const contract = contractList.filter((c) => c.contract_id === id);
      return contract && contract[0] ? contract[0] : "";
    }
    if (contractId) {
      const contract = getContractName(contractId);
      if (contract) {
        setContract({ title: contract.subject, id: contract.contract_id });
      }
    }
  }, [contractId, contractList]);

  return (
    <StyledSelector>
      <AppFormItem
        {...props}
        name={name}
        className="w-100"
        disabled={disabled}
        // help={
        //   props.help ||
        //   "کد پروژه را وارد کنید یا با جستجو یک پروژه انتخاب کنید"
        // }
      >
        <Input
          className={`w-100 ${hideInput ? "d-none" : ""}`}
          disabled={disabled}
        />
      </AppFormItem>

      <div className="flex">
        {hideInput && (
          <p>
            {contract?.title ? contract.title : "لطفا پروژه را انتخاب نمایید"}
          </p>
        )}

        <AppButton
          //variant="primary"
          size="large"
          onClick={() => setShowModal(true)}
          disabled={disabled}
        >
          جستجو و انتخاب
        </AppButton>
      </div>

      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title="پروژه/قرارداد ها"
        width={720}
      >
        <ContractModal
          visible={showModal}
          onSelectContract={(contract) => {
            setContract(contract);
            form.setFieldsValue({
              [name]: contract.id,
            });
          }}
          onCancel={() => setShowModal(false)}
          officeId={officeId}
        />
      </Modal>
    </StyledSelector>
  );
};

// css
const StyledSelector = styled.strong`
  p {
    flex: 1;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

export default ContractSelector;
