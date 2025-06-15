import React from "react";
import { useHistory } from "react-router-dom";
import qs from "query-string";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

const FullscreenModal = ({ visible, handleCancel, title, children }) => {
  const history = useHistory();

  return (
    <StyledModal visible={visible}>
      <div className="header">
        <div className="title">{title}</div>
        <CloseOutlined
          className="close"
          onClick={() => {
            history.replace({ search: qs.stringify({}) });
            handleCancel();
          }}
        />
      </div>
      <div className="container">{children}</div>
    </StyledModal>
  );
};

// css
const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 10;
  padding: 16px;
  display: ${(props) => (props.visible ? "block" : "none")};
  overflow-y: auto;

  .container {
    width: 100%;
    max-width: 1280px;
    margin: 16px auto;
    padding-top: 50px;
  }
  .close {
    z-index: 4;
    font-size: 26px;
  }
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 4;
    background: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;

    .title {
      flex-grow: 1;
      font-size: 1.2em;
    }
  }
`;

export default FullscreenModal;
