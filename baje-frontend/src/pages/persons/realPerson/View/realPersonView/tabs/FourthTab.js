import React from "react";
import Field from "../Field";
import Value from "./Value";
import { Divider } from "antd";

const faLabel = {
  name: "نام",
  national_id: "کد ملی",
  last_name: "نام خانوادگی",
  father_name: "نام پدر",
  birth_day: "تاریخ تولد",
  national_number: "شماره شناسنامه",
  birth_day_place: "محل صدور",
  mother: "مادر",
  father: "پدر",
  wife: "همسر",
  daughter: "فرزندان دختر",
  son: "فرزندان پسر",
};

const FourthTab = (props) => {
  let data = props.data;
  let info = [];
  if (!props.data) {
    info.push(<Value />);
  }

  for (let property in data) {
    info.push(
      <>
        <Divider orientation="right">{faLabel[property]}</Divider>
        {data[property].map((el) => {
          let subInfo = [];
          for (const property in el) {
            if (faLabel.hasOwnProperty(property)) {
              let renderDataFiled;
              renderDataFiled = <Value value={el[property]} />;
              subInfo.push(
                <Field name={faLabel[property]} value={renderDataFiled} />
              );
            }
          }
          return subInfo;
        })}
      </>
    );
  }

  return <>{info}</>;
};

export default FourthTab;
