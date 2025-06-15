import React from "react";
import Field from "../Field";
import Value from "./Value";
import { handleValue } from "../_helpers";

const faLabel = {
  jobName: "عنوان شغلی",
  insurance_number: "شماره بیمه",
  personnel_id: "شماره پرسنلی فعال",
  job_type: "نوع شغل",
  job_status: "وضعیت شغلی",
  expire_time: "زمان غیر فعالی",
  job_disable_description: "علت غیر فعالی",
};

const SecondTab = (props) => {
  const info = [];
  for (const property in props.data) {
    if (faLabel.hasOwnProperty(property)) {
      let renderDataFiled;

      renderDataFiled = <Value value={handleValue(props.data[property])} />;

      info.push(<Field name={faLabel[property]} value={renderDataFiled} />);
    }
  }

  return <>{info}</>;
};

export default SecondTab;
