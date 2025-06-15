import { Input, Checkbox } from "antd";
import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import colors from "utils/colors";
import { UserContext } from "contex/User-context";
import { randomBetween } from "_helpers";
import { useSelector } from "react-redux";

const { Search } = Input;

const ContractsModal = ({ visible, onSelectContract, onCancel, officeId }) => {
  const contractList = useSelector((state) => state.contractList);

  const [contractOptions, setContractOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  function setInitialContracts() {
    const contracts = contractList;
    if (contracts && contracts.length) {
      setContractOptions(
        contracts.map((i) => ({ title: i.subject, id: i.contract_id }))
      );
    }
  }

  useEffect(() => {
    setInitialContracts();
  }, [contractList]);

  let contractsList;

  if (contractOptions.length) {
    contractsList = contractOptions.map((contract) => {
      return (
        <p
          className="contract-item"
          key={randomBetween(1, 9999)}
          onClick={() => {
            onSelectContract(contract);
            onCancel();
          }}
          title="انتخاب"
        >
          {contract.title}
        </p>
      );
    });
  }

  const onContractSearch = (value) => {
    const contracts = contractList;
    if (contracts && contracts.length) {
      const filtered = contracts.filter(
        (i) => i.subject.includes(value) || i.subject === value
      );

      setContractOptions(
        filtered.map((i) => ({ title: i.subject, id: i.contract_id }))
      );
    }
  };

  return (
    <StyledModal className="accesses-modal">
      <Search
        placeholder="جستجوی پروژه ها"
        allowClear
        onSearch={onContractSearch}
        className="w-100"
        enterButton
      />
      <div className="mt-4 w-100">
        {contractsList && contractsList.length ? (
          contractsList
        ) : (
          <p className="text-center text-gray">هیچ پروژه ای یافت نشد</p>
        )}
      </div>
    </StyledModal>
  );
};

// css
const StyledModal = styled.div`
  .ant-checkbox-group-item {
    display: flex;
    margin-right: 0;
    margin-bottom: 12px;
    .ant-checkbox {
      transform: translateY(2px);
    }
  }

  .contract-item {
    width: 100%;
    font-size: 16px;
    margin-bottom: 16px !important;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${colors.primary};
    }
  }
`;

export default ContractsModal;
