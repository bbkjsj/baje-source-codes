import React from "react";
import { Select, message, Popconfirm, Modal } from "antd";
import styled from "styled-components";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

/**
 * TableChangeStatus a Selectbox for change a sigle record's status
 * @param {object} props all component's props
 * @param props.value selcted item's value . it is common to use 1 as approave value
 * @param {object} props.options list of selectBox options to choose
 * @param {number} props.id the selcted record's id
 * @param {function} props.requestApi an api is called for changing record's status
 * @param {function} props.afterChange  a function is called right after requestApi is called and got response.it usually use for updating list after change status
 * @param {function} props.setLoadingList a fuction to display loading during the status is changing
 * @param {function} props.onChange a function is used to handle all the change status process. if you are useing onChange you don't need to any of this props: id,requestApi, afterChange, setLoadingList

 * @returns
 */

const TableChangeStatus = (props) => {
  // const { value, options, onChange, record } = props;
  const {
    value,
    options,
    id,
    requestApi,
    afterChange,
    setLoadingList,
    onChange,
    disabled,
  } = props;

  const { confirm } = Modal;

  const handleOnOK = async (id, value) => {
    if (setLoadingList) setLoadingList(true);
    if (requestApi) {
      try {
        const res = await requestApi(id, value);
        afterChange();
        if (setLoadingList) setLoadingList(false);
        message.success("ثبت با موفقیت انجام شد");
      } catch (err) {
        message.error("مشکلی پیش آمده است دوباره تلاش کنید.", err);
        console.log(err);
        if (setLoadingList) setLoadingList(false);
      }
    }
  };

  function showPromiseConfirm(id, value) {
    confirm({
      title: "آیا مطمئن هستید؟",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleOnOK(id, value);
        if (onChange) onChange(value);
      },
      onCancel() {},
    });
  }

  return (
    <Container>
      <Select
        value={value}
        options={options}
        onChange={(value) => showPromiseConfirm(id, value)}
        disabled={disabled}
        maxTagTextLength={15}
        style={{ maxWidth: "100%", minWidth: "100%" }}
      ></Select>
    </Container>
  );
};

TableChangeStatus.propTypes = {
  value: PropTypes.string,
  options: PropTypes.object.isRequired,
  id: PropTypes.number,
  requestApi: PropTypes.func,
  afterChange: PropTypes.func,
  setLoadingList: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  .ant-select {
    width: 100%;
  }

  .ant-select-selection-item {
    text-align: center !important;
    font-size: 12px !important;
  }
`;

export default TableChangeStatus;
