import { Input, Checkbox } from "antd";
import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import colors from "utils/colors";
import { UserContext } from "contex/User-context";
import { randomBetween } from "_helpers";
import { useSelector } from "react-redux";

const { Search } = Input;

const EnvironmentsModal = ({
  visible,
  onSelectEnvironment,
  onCancel,
  officeId,
  environmentList,
}) => {
  const [environmentOptions, setEnvironmentOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  function setInitialEnvironments() {
    const environments = environmentList;
    if (environments && environments.length) {
      setEnvironmentOptions(
        environments.map((i) => ({ title: i.title, id: i.id }))
      );
    }
  }

  useEffect(() => {
    setInitialEnvironments();
  }, [environmentList]);

  let environmentsList;

  if (environmentOptions.length) {
    environmentsList = environmentOptions.map((environment) => {
      return (
        <p
          className="environment-item"
          key={randomBetween(1, 9999)}
          onClick={() => {
            onSelectEnvironment(environment);
            onCancel();
          }}
          title="انتخاب"
        >
          {environment.title}
        </p>
      );
    });
  }

  const onEnvironmentSearch = (value) => {
    const environments = environmentList;
    if (environments && environments.length) {
      const filtered = environments.filter(
        (i) => i.title.includes(value) || i.title === value
      );

      setEnvironmentOptions(
        filtered.map((i) => ({ title: i.title, id: i.id }))
      );
    }
  };

  return (
    <StyledModal className="accesses-modal">
      <Search
        placeholder="جستجوی محیط ها"
        allowClear
        onSearch={onEnvironmentSearch}
        className="w-100"
        enterButton
      />
      <div className="mt-4 w-100">
        {environmentsList && environmentsList.length ? (
          environmentsList
        ) : (
          <p className="text-center text-gray">هیچ محیطی یافت نشد</p>
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

  .environment-item {
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

export default EnvironmentsModal;
