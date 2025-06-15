import React, { useState, useEffect } from "react";
import AppFormItem from "components/general/AppFormItem";
import { Input, Modal, Spin } from "antd";
import AppButton from "components/general/AppButton";
import EnvironmentModal from "./EnvironmentsModal";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { _GET } from "modules/environment/enviromentDefinition/utils/api";

const EnvironmentSelector = ({
  form,
  name,
  officeId,
  environmentId,
  disabled,
  hideInput,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [environmentList, setEnvironmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    getEnvironmentList();
  }, []);

  useEffect(() => {
    function getEnvironmentName(id) {
      const environments = environmentList.filter((c) => c.id === id);
      return environments && environments[0] ? environments[0] : "";
    }
    if (environmentList) {
      if (environmentId) {
        const environments = getEnvironmentName(environmentId);
        if (environments) {
          setEnvironment({ title: environments.title, id: environments.id });
        }
      }
    }
  }, [environmentId, environmentList]);

  const getEnvironmentList = () => {
    setLoading(true);

    _GET()
      .then((res) => {
        setLoading(false);
        let filtered = res.data;

        if (filtered?.length) {
          filtered = filtered.filter((i) => i.independentChart == 1);

          if (currentOffice != "-1") {
            filtered = filtered.filter((i) => i.companyId == currentOffice);
          }
        }

        setEnvironmentList(filtered);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <Spin spinning={loading}>
      <StyledSelector>
        <AppFormItem
          {...props}
          name={name}
          className="w-100"
          disabled={disabled}
        >
          <Input
            className={`w-100 ${hideInput ? "d-none" : ""}`}
            disabled={disabled}
          />
        </AppFormItem>

        <div className="flex">
          {hideInput && (
            <p>
              {environment?.title
                ? environment.title
                : "لطفا محیط را انتخاب نمایید"}
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
          title="محیط ها"
          width={720}
        >
          <EnvironmentModal
            visible={showModal}
            environmentList={environmentList}
            onSelectEnvironment={(environment) => {
              setEnvironment(environment);
              form.setFieldsValue({
                [name]: environment.id,
              });
            }}
            onCancel={() => setShowModal(false)}
            officeId={officeId}
          />
        </Modal>
      </StyledSelector>
    </Spin>
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

export default EnvironmentSelector;
