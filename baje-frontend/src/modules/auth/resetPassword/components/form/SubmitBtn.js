import React from "react";
import { Button } from "antd";
import Styles from "../../auth.module.css";

const wrongPhoneStyle = { marginRight: "3px" };

const SubmitBtn = (props) => {
  const buttonsClass =
    props.inputStatus === 2 ? Styles.restPassBtnContainer : null;

  return (
    <div className={buttonsClass}>
      <Button block type="primary" htmlType="submit">
        تایید
      </Button>
      {props.inputStatus === 2 && (
        <Button
          block
          type="primary"
          style={wrongPhoneStyle}
          onClick={props.wrongPhoneNumber}
        >
          شماره تلفن اشتباه است
        </Button>
      )}
    </div>
  );
};

export default SubmitBtn;
