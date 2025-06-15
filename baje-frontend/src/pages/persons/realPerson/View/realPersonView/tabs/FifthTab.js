import React from "react";
import Field from "../Field";
import Value from "./Value";
import { Divider } from "antd";

const FifthTab = (props) => {
  let info = [];
  for (let i = 1; i <= 5; i++) {
    info.push(
      <>
        <Divider orientation="right">{`حساب ${i}`}</Divider>
        <Field
          name="شماره حساب"
          value={<Value value={props.data[`bank_account${i}`]} />}
        />
        <Field
          name="شماره شبا"
          value={<Value value={props.data[`sheba${i}`]} />}
        />
        <Field
          name="نام بانک"
          value={<Value value={props.data[`bank_name${i}`]} />}
        />
      </>
    );
  }

  return <>{info}</>;
};

export default FifthTab;
