import React from "react";
import styled from "styled-components";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import AppButton from "components/general/AppButton";
import { Modal } from "antd";

const GoBackBtn = (props) => {
  const history = useHistory();

  const handleClick = () => {
    if (props.customUrl) {
      history.push(props.customUrl);
    } else if (props.onClick) {
      props.onClick();
    } else {
      history.goBack();
    }
  };

  function handleAsk() {
    Modal.confirm({
      content: "آیا مطمئنید که میخواهید از این فرم خارج شوید؟",
      onOk: handleClick,
    });
  }

  return (
    <StyledGoBack
      shape="circle"
      icon={<ArrowRightOutlined />}
      block={props.block || false}
      transparent={props.transparent || false}
      title="بازگشت"
      onClick={props.ask ? handleAsk : handleClick}
      className={props.className}
      {...props}
    />
  );
};

// css
const StyledGoBack = styled(AppButton)`
  cursor: pointer;
  position: ${(props) => (props.block ? "relative" : "absolute")};
  right: ${(props) => (props.block ? "0" : "12px")};
  top: ${(props) => (props.block ? "0" : "-4px")};
  max-width: fit-content;
  background-color: ${(props) =>
    props.transparent ? "rgba(0, 0, 0, 0.25)" : "auto"};
  border: ${(props) => (props.transparent ? "none" : "auto")};
  color: ${(props) => (props.transparent ? "#ffffff" : "auto")};
`;

export default GoBackBtn;
