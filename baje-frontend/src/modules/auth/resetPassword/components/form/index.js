import React, { useState } from "react";
import { Form as AntForm } from "antd";
import Styles from "../../auth.module.css";
import Inputs from "./Inputs";
import SubmitBtn from "./SubmitBtn";

/*******
 * creator SahsaDEv
 *
 */

const Form = (props) => {
  const { inputStatus } = props;
  return (
    <AntForm
      name="restPassword"
      className={Styles.loginForm}
      onFinish={props.onSubmit}
    >
      <Inputs inputStatus={inputStatus} />
      <SubmitBtn
        inputStatus={inputStatus}
        wrongPhoneNumber={props.handleWrongPhone}
      />
    </AntForm>
  );
};

export default Form;
