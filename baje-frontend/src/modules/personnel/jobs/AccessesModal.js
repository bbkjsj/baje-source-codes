import { Input, Checkbox, Spin } from "antd";
import AppButton from "components/general/AppButton";
import {
  baseLevels,
  PermissionsFarsiLabels,
  PermissionsSectionsFarsiLabels,
} from "json/Permission";
import { getPermissionsList } from "modules/permissions/utils/api";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getJobPermissions,
  handleExceptions,
  handleSuccess,
  submitJobPermissions,
} from "./common/api";

const { Search } = Input;

const AccessesModal = ({ visible, jobId, onCancel }) => {
  const [accessOptions, setAccessOptions] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [selected, setSelected] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(false);

  const onAccessSearch = (value) => {
    const filteredOptions = accessOptions.filter((item) =>
      item.label.includes(value)
    );
    setCurrentOptions(filteredOptions);
  };
  const onAccessesChange = (vals) => {
    setSelected(vals);
  };

  // get job permissions
  useEffect(() => {
    setLoading(true);

    getJobPermissions(jobId)
      .then((res) => {
        if (accessOptions.length) {
          setLoading(false);
        }
        if (res?.data) {
          // won't work if set the state here
          return res.data;
        }
      })
      .then((res1) => {
        // then get all permissions if we haven't already
        if (!accessOptions.length) {
          getPermissionsList().then((res) => {
            setLoading(false);

            if (res && res.data) {
              const permissions = res.data.map((i) => {
                const module = i.name.split("/")[0];
                const moduleFa = PermissionsSectionsFarsiLabels[module] || "-";

                return {
                  label:
                    moduleFa +
                      " - " +
                      PermissionsFarsiLabels[
                        i.name.replaceAll("/", "_").replaceAll("-", "_")
                      ]?.label ||
                    i.name.replaceAll("/", "_").replaceAll("-", "_"), // fallback string for finding untranslated ones
                  value: i.id,
                };
              });

              setAccessOptions(permissions);
              setCurrentOptions(permissions);

              if (res1 && res1.length) {
                const jobPermissions = res1.map((i) => i.accessId);
                setSelected(jobPermissions);
              }
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        handleExceptions(err);
      });
  }, [jobId]);

  // save new permissions
  const submitAccesses = () => {
    const body = { jobId, accessIds: selected };
    setBtnLoading(true);

    submitJobPermissions(body)
      .then((res) => {
        setBtnLoading(false);
        handleSuccess(res);
        onCancel();
      })
      .catch((err) => {
        setBtnLoading(false);
        handleExceptions(err);
      });
  };

  // reset permissions if job id changed
  useEffect(() => {
    setCurrentOptions(accessOptions);
    setSelected([]);
  }, [visible, jobId]);

  return (
    <StyledModal className="accesses-modal">
      <Spin spinning={loading}>
        <Search
          placeholder="جستجوی دسترسی های مشاغل"
          allowClear
          onSearch={onAccessSearch}
          className="w-100"
          enterButton
        />
        <Checkbox.Group
          options={currentOptions}
          onChange={onAccessesChange}
          className="mt-4"
          disabled={btnLoading}
          value={selected}
          defaultValue={selected}
        />
        <div className="flex mt-4">
          <AppButton
            className="big-btn"
            variant="primary"
            size="large"
            loading={btnLoading}
            onClick={submitAccesses}
            disabled={btnLoading}
          >
            تایید
          </AppButton>
          <AppButton
            className="big-btn mr-1"
            size="large"
            variant="text"
            onClick={() => onCancel()}
            disabled={btnLoading}
          >
            انصراف
          </AppButton>
        </div>
      </Spin>
    </StyledModal>
  );
};

const StyledModal = styled.div`
  .ant-checkbox-group-item {
    display: flex;
    margin-right: 0;
    margin-bottom: 12px;
    .ant-checkbox {
      transform: translateY(2px);
    }
  }
`;

export default AccessesModal;
