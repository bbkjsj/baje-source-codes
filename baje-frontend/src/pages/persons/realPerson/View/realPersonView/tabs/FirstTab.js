import React from "react";
import Field from "../Field";
import Value from "./Value";
import { handleValue } from "../_helpers";

const faLabel = {
  birth_date: "تاریخ تولد",
  national_number: "کد ملی",
  first_name: "نام",
  last_name: "نام خانوادگی",
  father_name: "نام پدر",
  id_number: "شماره شناسنامه",
  sex: "جنسیت",
  birth_place: "محل تولد",
  id_issue_place: "محل صدور شناسنامه",
  nation: "ملیت",
  public_description: "توضیحات عمومی",
  private_description: "توضیحات خصوصی",
  marital_status: "وضعیت تأهل",
  army_service: "وضعیت خدمت",
  education: "وضعیت تحصیلات",
  study_field: "رشته تحصیلی",
  subject: "ارتباط کارگاهی",
  isargar: "وضعیت ایثارگری",
  veteran_percentage: "درصد جانبازی",
  shahid_was_colleague: "شهید همکار",
  shahid_name: "نام شهید",
  companyName: "نام شرکت",
};

const checkNull = (value) => {
  if (value === null) return 0;
  else return value;
};

const FirstTab = (props) => {
  const data = props.data;
  const info = [];
  for (const property in props.data) {
    // if (
    //   (property == "veteran_percentage" &&
    //     props.data["isargar"] !== "veteran") ||
    //   (property == "shahid_was_colleague" &&
    //     props.data["isargar"] !== "child_of") ||
    //   props.data["isargar"] !== "wife_of"
    // ) {
    //   continue;
    // } else {
    if (faLabel.hasOwnProperty(property)) {
      let renderDataFiled;
      if (property === "shahid_was_colleague" && props.data[property] === 1) {
        renderDataFiled = <Value value="شهید همکار" />;
      } else {
        renderDataFiled = <Value value={handleValue(props.data[property])} />;
      }
      info.push(<Field name={faLabel[property]} value={renderDataFiled} />);
    }
    // }
  }
  info.push(
    <Field
      name="مدت زمان اسارت"
      value={
        <Value
          value={handleValue(
            `روز : ${checkNull(data.captivity_day)} ماه : ${checkNull(
              data.captivity_month
            )} سال : ${checkNull(data.captivity_year)}`
          )}
        />
      }
    />
  );
  info.push(
    <Field
      name="مدت زمان حضور در جبهه"
      value={
        <Value
          value={handleValue(
            `روز : ${checkNull(data.frontline_day)} ماه : ${checkNull(
              data.frontline_month
            )} سال : ${checkNull(data.frontline_year)}`
          )}
        />
      }
    />
  );

  return <>{info}</>;
};

export default FirstTab;
