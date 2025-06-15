import React from "react";
import Field from "../Field";
import Value from "./Value";

const faLabel = {
  mobile1: "شماره موبایل",
  mobile2: "شماره موبایل 2",
  phone: "تلفن",
  email: "ایمیل",
  postal_code: "کد پستی",
  address: "آدرس",
};

const FirstTab = (props) => {
  const info = [];
  for (const property in props.data) {
    if (faLabel.hasOwnProperty(property)) {
      let renderDataFiled;
      renderDataFiled = <Value value={props.data[property]} />;
      info.push(<Field name={faLabel[property]} value={renderDataFiled} />);
    }
  }

  return <>{info}</>;
};

export default FirstTab;
