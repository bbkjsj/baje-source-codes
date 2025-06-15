import AppButton from "components/general/AppButton";
import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const BottomButtons = ({
  loading,
  disabled,
  onSave,
  onCancel,
  noShadow,
  variant,
  verifyText,
}) => {
  const history = useHistory();

  return (
    <StyledBottomButtons className="flex" noShadow={noShadow}>
      <AppButton
        className="big-btn ml-4"
        size="large"
        variant="text"
        onClick={() => (onCancel ? onCancel() : history.goBack())}
      >
        انصراف
      </AppButton>
      <AppButton
        className="big-btn mr-4"
        variant={variant || "primary"}
        size="large"
        disabled={disabled}
        loading={loading}
        onClick={onSave && onSave}
      >
        {verifyText || "ثبت"}
      </AppButton>
    </StyledBottomButtons>
  );
};

// css
const StyledBottomButtons = styled.div`
  justify-content: center;
  padding: 16px 26px;
  position: fixed;
  width: 100%;
  bottom: 56px;
  left: 0;
  background: white;
  box-shadow: ${(params) =>
    params.noShadow ? "none" : "0px -2px 4px rgba(22, 25, 49, 0.1)"};
`;

export default BottomButtons;
