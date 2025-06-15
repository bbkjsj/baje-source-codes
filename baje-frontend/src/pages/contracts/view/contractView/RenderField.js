import React from "react";
import Field from "../../../../components/Field";
import Value from "../../../../components/Value";
import { covetFormatDateToFA } from "../../../../_helpers";

const faLabel = {
  employer: "کارفرما",
  name: "پیمان کار",
  subject: "موضوع قرارداد",
  type: "نوع قرارداد",
  initial_amount: "مبلغ اولیه",
  workshop_code: "کد کارگاهی",
  supervision: "دستگاه نظارت",
  row: "ردیف پیمان",
  number: "شماره قرارداد",
  boss: "رئیس کارگاه",
  manager: "مدیر پروژه",
  contract_date: "تاریخ قرارداد",
  finish_date: "زمان پایان قرارداد",
  start_date: "زمان شروع قرارداد",
  id: "شناسه یکتا",
  activity: "نوع فعالیت",
};

const handleTypeValue = (value) => {
  if (value.substr(5) === "civil" || value.substr(4) === "civil") {
    return "قرارداد عمرانی";
  } else {
    return "قرارداد غیر عمرانی";
  }
};

const handlePriceValue = (value) =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const RenderField = (props) => {
  const info = [];

  for (const property in props.data) {
    if (faLabel.hasOwnProperty(property)) {
      let renderDataFiled;

      if (property === "type") {
        let typeData = handleTypeValue(props.data[property]);
        renderDataFiled = <Value value={typeData} />;
      } else if (property === "activity") {
        const activityData =
          props.data[property] === "mineral" ? "معدنی" : "غیرمعدنی";
        renderDataFiled = <Value value={activityData} />;
      } else if (property === "initial_amount" && props.data[property]) {
        renderDataFiled = (
          <Value value={handlePriceValue(props.data[property])} />
        );
      } else if (
        property === "contract_date" ||
        property === "finish_date" ||
        property === "start_date"
      ) {
        renderDataFiled = <Value value={props.data[property]} />;
      } else if (property === "employer" && !props.data[property]) {
        renderDataFiled = <Value value={props.data["employer1"]} />;
      } else {
        renderDataFiled = <Value value={props.data[property]} />;
      }

      info.push(
        <Field
          key={faLabel[property]}
          name={faLabel[property]}
          value={renderDataFiled}
        />
      );
    }
  }

  return <>{info}</>;
};

export default RenderField;
