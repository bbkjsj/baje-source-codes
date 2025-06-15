import React, { useState } from "react";
import FormItem from "../formItem/FormItem";
import { Calendar } from "react-modern-calendar-datepicker";
import Styles from "./modernDataPicker.module.css";
import InputMask from "react-input-mask";
import { Button } from "antd";
import styled from "styled-components";

const WrapperInput = styled.div`
  display: flex;
  width: 100%;
`;

const ModernDatePicker = (props) => {
  const [type, setType] = useState("input"); //select
  const [inputValue, setInputValue] = useState("");
  let zIndex;
  if (props.zIndex && props.zIndex === "99") {
    zIndex = Styles.zIndex99;
  } else if (props.zIndex && props.zIndex === "98") {
    zIndex = Styles.zIndex98;
  }
  return (
    <>
      <FormItem {...props}>
        {type === "input" ? (
          <WrapperInput>
            <InputMask
              style={{ flexGrow: "1" }}
              mask="1999/99/99"
              formatChars={{
                9: "[0-9]",
                a: "[A-Za-z]",
                "*": "[A-Za-z0-9]",
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              onClick={() => {
                setInputValue();
                setType("select");
              }}
            >
              انتخاب
            </Button>
          </WrapperInput>
        ) : (
          // <DatePickerN isGregorian={false} timePicker={false} />
          // <DatePicker
          //   wrapperClassName={zIndex}
          //   locale="fa"
          //   onChange={props.onChange ? props.onChange : undefined}
          //   maximumDate={props.maximumDate ? props.maximumDate : undefined}
          // />
          <>
            {/* <InputMask
              style={{ flexGrow: "1" }}
              mask="1999/99/99"
              formatChars={{
                "9": "[0-9]",
                a: "[A-Za-z]",
                "*": "[A-Za-z0-9]",
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            /> */}
            <Calendar calendarClassName={Styles.calender} />
          </>
        )}
      </FormItem>
    </>
  );
};

export default ModernDatePicker;
