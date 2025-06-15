import React, { useState } from "react";
import { DateRange } from "react-date-range";
import Styles from "./customDatePicker.module.css";
import InputMask from "react-input-mask";
import { Button, Col, Row, Form, Modal } from "antd";
import styled from "styled-components";

const StyledMaskInput = styled(InputMask)`
  padding: 4px 11px;
  width: 100%;

  border: 1px solid #d9d9d9;
  border-top-color: rgb(217, 217, 217);
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: rgb(217, 217, 217);
  border-right-style: solid;
  border-right-width: 1px;
  border-bottom-color: rgb(217, 217, 217);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: rgb(217, 217, 217);
  border-left-style: solid;
  border-left-width: 1px;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-radius: 2px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const OpenCalenderBtn = styled.p`
  padding: 8px 15px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  color: #2f75b5;
  transition: all 0.5s;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  &:hover {
    background-color: #eee;
  }
`;

const RangeDatePicker = (props) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modal, setModal] = useState(false);

  return (
    <>
      <DateRange
        lang="fa"
        // wrapperClassName={zIndex}
        className={Styles.calender}
      />
    </>
  );
};

export default RangeDatePicker;
