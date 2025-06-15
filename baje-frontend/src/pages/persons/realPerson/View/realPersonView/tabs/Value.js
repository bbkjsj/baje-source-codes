import React from "react";
import styled from "styled-components";

const StyledValue = styled.p`
  color: ${(props) => (props.value ? "rgba(0, 0, 0, 0.65)" : "#e74c3c")};
`;

const Value = (props) => {
  return (
    <StyledValue value={props.value}>
      {props.value ? props.value : `ثبت نشده است`}
    </StyledValue>
  );
};

export default Value;
